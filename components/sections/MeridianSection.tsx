'use client';

import dynamic from 'next/dynamic';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent
} from 'react';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { threeConfig } from '@/config/three';
import { useQuality } from '@/components/providers/QualityProvider';

const MeridianCanvas = dynamic(() => import('./meridian/MeridianCanvas'), {
  ssr: false
});

type Props = {
  realUrl: string;
  digitalUrl: string;
  realAlt: string;
  digitalAlt: string;
};

/**
 * S2 The Meridian(docs/19)— サイトの中心体験。
 * 金の境界線をドラッグすると実在⇄デジタルがシェーダーで転換する。
 * T2+: WebGLシェーダー / T1以下: CSS clip-path比較スライダー(機能等価)
 * キーボード: 常設のrange inputで操作可能。
 */
export function MeridianSection({ realUrl, digitalUrl, realAlt, digitalAlt }: Props) {
  const t = useTranslations('meridian');
  const { tier } = useQuality();
  const cfg = threeConfig.meridian;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef(cfg.idleSweep.min);
  const interactedRef = useRef(false);
  const draggingRef = useRef(false);

  const [inView, setInView] = useState(false);
  // CSSフォールバック用(T1以下でのみ再レンダー駆動)
  const [cssProgress, setCssProgress] = useState(cfg.idleSweep.min);

  const useCanvas = tier !== null && tier >= 2;

  const applyProgress = useCallback(
    (v: number, fromUser: boolean) => {
      const clamped = Math.min(1, Math.max(0, v));
      if (fromUser) interactedRef.current = true;
      progressRef.current = clamped;
      if (!useCanvas) setCssProgress(clamped);
    },
    [useCanvas]
  );

  // Canvasのマウント管理(接近時のみ。遠ざかると解放)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '100% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ハンドル位置とスライダー値をrAFで同期(再レンダーなし)
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = progressRef.current;
      if (handleRef.current) {
        handleRef.current.style.left = `${p * 100}%`;
      }
      if (rangeRef.current && document.activeElement !== rangeRef.current) {
        rangeRef.current.value = String(Math.round(p * 100));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 放置時: スクロール進行に連動して1往復のデモ
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (interactedRef.current) return;
          const sweep =
            cfg.idleSweep.min +
            (cfg.idleSweep.max - cfg.idleSweep.min) * Math.sin(self.progress * Math.PI);
          applyProgress(sweep, false);
        }
      });
    },
    { scope: sectionRef }
  );

  const posFromEvent = (e: ReactPointerEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return progressRef.current;
    return (e.clientX - rect.left) / rect.width;
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    draggingRef.current = true;
    stageRef.current?.setPointerCapture(e.pointerId);
    applyProgress(posFromEvent(e), true);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    applyProgress(posFromEvent(e), true);
  };

  const onPointerUp = () => {
    draggingRef.current = false;
    // 磁気スナップ
    const p = progressRef.current;
    for (const snap of cfg.snapPoints) {
      if (Math.abs(p - snap) < cfg.snapThreshold) {
        gsap.to(progressRef, {
          current: snap,
          duration: 0.5,
          ease: 'power3.out',
          onUpdate: () => {
            if (!useCanvas) setCssProgress(progressRef.current);
          }
        });
        break;
      }
    }
  };

  const pct = Math.round(cssProgress * 100);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-bg py-24 md:py-32"
      data-section="hybrid"
    >
      {/* 見出し(ステージの上に重ねず、素材を隠さない) */}
      <div className="mx-auto max-w-6xl px-6">
        <p className="section-kicker">{t('kicker')}</p>
        <h2 className="font-display mt-4 max-w-xl text-4xl leading-tight text-ivory md:text-6xl">
          {t('title')}
        </h2>
      </div>

      {/* ステージ: 元素材(3:2)を切り抜かず全体を表示する。
          素材と同じ3:2にすることで頭〜足元まで全身が収まる。
          高さが90svhを超えないよう幅側を制限する */}
      <div
        ref={stageRef}
        data-cursor="drag"
        className="relative mx-auto mt-10 aspect-[3/2] cursor-ew-resize touch-pan-y select-none overflow-hidden bg-panel"
        style={{ width: 'min(100%, calc(90svh * 3 / 2))' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label={`${realAlt} / ${digitalAlt}`}
      >
        {useCanvas && inView ? (
          <MeridianCanvas
            realUrl={realUrl}
            digitalUrl={digitalUrl}
            progressRef={progressRef}
          />
        ) : (
          /* CSSフォールバック: clip-path比較スライダー(枠が16:9なので全体が見える) */
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={digitalUrl}
              alt={digitalAlt}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={realUrl}
              alt={realAlt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
              draggable={false}
            />
          </div>
        )}

        {/* Meridian ハンドル(金の光軸) */}
        <div
          ref={handleRef}
          className="pointer-events-none absolute top-0 bottom-0 z-10 w-px -translate-x-1/2"
          style={{
            left: '15%',
            background:
              'linear-gradient(to bottom, transparent, rgba(214,179,106,0.9) 20%, rgba(214,179,106,0.9) 80%, transparent)',
            boxShadow: '0 0 24px rgba(214,179,106,0.5)'
          }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-bg/60 backdrop-blur-sm">
            <span className="text-[0.5rem] tracking-[0.2em] text-gold">
              {t('drag')}
            </span>
          </div>
        </div>

        {/* 世界ラベル */}
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[0.65rem] tracking-[0.4em] text-ivory/80 [writing-mode:vertical-rl]">
          {t('real')}
        </span>
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[0.65rem] tracking-[0.4em] text-gold [writing-mode:vertical-rl]">
          {t('digital')}
        </span>
      </div>

      {/* 本文+スライダー(ステージの下) */}
      <div className="mx-auto mt-10 max-w-6xl px-6">
        <div className="max-w-md">
          <p className="text-sm leading-relaxed text-soft">{t('body')}</p>
          <span className="mt-4 inline-block border border-gold/40 px-3 py-1 text-[0.6rem] tracking-[0.25em] text-gold">
            AI-ENHANCED REAL TALENT
          </span>
          {/* キーボード・支援技術用の常設スライダー */}
          <input
            ref={rangeRef}
            type="range"
            min={0}
            max={100}
            defaultValue={Math.round(cfg.idleSweep.min * 100)}
            onChange={(e) => applyProgress(Number(e.target.value) / 100, true)}
            aria-label={`${t('real')} / ${t('digital')}`}
            className="mt-6 block w-full accent-[#d6b36a]"
          />
        </div>
      </div>
    </section>
  );
}
