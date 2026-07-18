'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from '@/lib/gsap';
import { useSceneStore } from '@/lib/scene-store';
import { prefersReducedMotion } from '@/lib/performance';

const RING_R = 54;
const CIRC = 2 * Math.PI * RING_R;
const SESSION_KEY = 'venus-awakened';

/**
 * S1 The Awakening(docs/19)
 * 金の弧が進捗を描き、完了でリングが発光し円形マスクが中央から開く。
 * - 実ロード信号(フォント+Heroポスター)+時間で擬似進捗
 * - 最短1.2s / 最長3.5s、再訪問は0.6s短縮版
 * - reduced-motion: 静かなフェードのみ
 */
export function Awakening({ heroPosterUrl }: { heroPosterUrl?: string }) {
  const t = useTranslations('preloader');
  const [phase, setPhase] = useState<'loading' | 'opening' | 'done'>('loading');
  const [display, setDisplay] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== 'loading') return;

    const reduced = prefersReducedMotion();
    const revisit =
      typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY);
    const minMs = revisit ? 600 : 1200;
    const maxMs = revisit ? 600 : 3500;

    document.documentElement.style.overflow = 'hidden';

    let signals = 0;
    const totalSignals = heroPosterUrl ? 2 : 1;
    const onSignal = () => {
      signals = Math.min(totalSignals, signals + 1);
    };

    document.fonts?.ready.then(onSignal).catch(onSignal);
    if (heroPosterUrl) {
      const img = new Image();
      img.onload = onSignal;
      img.onerror = onSignal;
      img.src = heroPosterUrl;
    }

    const start = performance.now();
    let raf = 0;
    let done = false;
    let last = 0;
    const tick = () => {
      if (done) return;
      const elapsed = performance.now() - start;
      const s = signals / totalSignals;
      const p = Math.min(
        1,
        Math.max(elapsed / maxMs, Math.min(elapsed / minMs, 1) * (0.3 + 0.7 * s))
      );
      if (p > last) {
        last = p;
        setDisplay(p);
      }
      if (p >= 1) {
        done = true;
        setPhase('opening');
      }
    };
    const loop = () => {
      tick();
      if (!done) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    // バックグラウンドタブではrAFが止まるため、intervalとhard timeoutでも駆動する
    const interval = window.setInterval(tick, 200);
    const hardStop = window.setTimeout(tick, maxMs + 150);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
      clearInterval(interval);
      clearTimeout(hardStop);
      if (reduced) document.documentElement.style.overflow = '';
    };
  }, [phase, heroPosterUrl]);

  useEffect(() => {
    if (phase !== 'opening') return;

    sessionStorage.setItem(SESSION_KEY, '1');
    // 背後でリング・Hero入場を開始させ、マスクの向こうに世界がある状態を作る
    useSceneStore.getState().setPreloaderDone();

    const finish = () => {
      document.documentElement.style.overflow = '';
      setPhase('done');
    };

    const root = rootRef.current;
    if (!root) {
      finish();
      return;
    }

    // タブ非表示中はアニメーションせず即時完了(rAF停止でtimelineが進まないため)
    if (document.hidden) {
      finish();
      return;
    }

    if (prefersReducedMotion()) {
      gsap.to(root, { opacity: 0, duration: 0.4, ease: 'power1.out', onComplete: finish });
      return;
    }

    const setMask = (r: number) => {
      const m = `radial-gradient(circle at 50% 50%, transparent ${r}vmax, black ${r + 0.02}vmax)`;
      root.style.webkitMaskImage = m;
      root.style.maskImage = m;
    };

    const state = { r: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(labelRef.current, { opacity: 0, duration: 0.3, ease: 'power1.out' })
      .to(
        ringRef.current,
        { scale: 1.06, opacity: 1, duration: 0.35, ease: 'power2.out' },
        '<'
      )
      .to(ringRef.current, {
        scale: 2.4,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.inOut'
      })
      .to(
        state,
        {
          r: 80,
          duration: 1.1,
          ease: 'expo.inOut',
          onUpdate: () => setMask(state.r)
        },
        '<'
      );

    return () => {
      tl.kill();
    };
  }, [phase]);

  if (phase === 'done') return null;

  const pct = Math.round(display * 100);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-bg"
      role="status"
      aria-label={t('loading')}
    >
      <div className="relative flex flex-col items-center">
        <svg
          ref={ringRef}
          width="180"
          height="180"
          viewBox="0 0 120 120"
          className="opacity-90"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r={RING_R}
            fill="none"
            stroke="rgba(214,179,106,0.15)"
            strokeWidth="0.75"
          />
          <circle
            cx="60"
            cy="60"
            r={RING_R}
            fill="none"
            stroke="#d6b36a"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - display)}
            transform="rotate(-90 60 60)"
            style={{ filter: 'drop-shadow(0 0 6px rgba(214,179,106,0.5))' }}
          />
        </svg>
        <div
          ref={labelRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <span className="text-[0.6rem] tracking-[0.3em] text-soft">
            {t('loading')}
          </span>
          <span className="font-display mt-1 text-3xl text-ivory tabular-nums">
            {pct}
          </span>
        </div>
        <p className="mt-6 text-[0.65rem] tracking-[0.4em] text-gold">
          {t('studio')}
        </p>
      </div>
    </div>
  );
}
