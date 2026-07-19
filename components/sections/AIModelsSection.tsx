'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent
} from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { threeConfig } from '@/config/three';
import { useQuality } from '@/components/providers/QualityProvider';
import { AutoPlayVideo } from '@/components/media/AutoPlayVideo';
import type { OrbitModelItem, OrbitState } from './orbit/OrbitCanvas';

const OrbitCanvas = dynamic(() => import('./orbit/OrbitCanvas'), { ssr: false });

export type AiModelCard = OrbitModelItem & {
  categories: string[];
};

/**
 * S3 Orbit Gallery(docs/19)
 * T2+: 縦長パネルの軌道回転(スクロール+ドラッグ)
 * T1以下/未判定: 横スワイプのスナップカルーセル(機能等価)
 */
export function AIModelsSection({ models }: { models: AiModelCard[] }) {
  const t = useTranslations('aiModels');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { tier } = useQuality();

  const sectionRef = useRef<HTMLElement>(null);
  const orbitState = useRef<OrbitState>({ base: 0, drag: 0 });
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const useOrbit = tier !== null && tier >= 2 && models.length >= 3;
  const active = models[activeIndex] ?? models[0];

  // スクロールで軌道が1周する(sticky+scrub)
  useGSAP(
    () => {
      if (!useOrbit || !sectionRef.current) return;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          orbitState.current.base = -self.progress * Math.PI * 2;
        }
      });
    },
    { scope: sectionRef, dependencies: [useOrbit] }
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    orbitState.current.drag += dx * threeConfig.orbit.dragSensitivity;
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    // 最寄りパネルへスナップ
    const step = (Math.PI * 2) / models.length;
    const total = orbitState.current.base + orbitState.current.drag;
    const snapped = Math.round(total / step) * step;
    gsap.to(orbitState.current, {
      drag: snapped - orbitState.current.base,
      duration: 0.6,
      ease: 'power3.out'
    });
  };

  if (!useOrbit) {
    /* モバイル/低ティア: スナップカルーセル */
    return (
      <section className="relative py-24" data-section="ai-models">
        <div className="mx-auto max-w-6xl px-6">
          <p className="section-kicker">{t('kicker')}</p>
          <h2 className="font-display mt-4 text-3xl text-ivory md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-soft">{t('body')}</p>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6">
          {models.map((m) => (
            <Link
              key={m.slug}
              href={`/${locale}/models/${m.slug}`}
              className="group relative w-[70vw] max-w-[300px] shrink-0 snap-center overflow-hidden"
            >
              <div className="relative aspect-[3/5] overflow-hidden bg-panel">
                {m.videoUrl ? (
                  /* モバイルでも動画を再生(画面内カードのみ・同時1本) */
                  <AutoPlayVideo
                    src={m.videoUrl}
                    poster={m.posterUrl}
                    alt={m.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: `${(m.focalX ?? 0.5) * 100}% 50%` }}
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={m.posterUrl}
                    alt={m.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: `${(m.focalX ?? 0.5) * 100}% 50%` }}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-xl text-ivory">{m.name}</span>
                <span className="border border-gold/50 px-2 py-0.5 text-[0.55rem] tracking-[0.2em] text-gold">
                  {tCommon('aiModel')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[280vh]"
      data-section="ai-models"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 pt-24">
          <p className="section-kicker">{t('kicker')}</p>
          <h2 className="font-display mt-4 text-3xl text-ivory md:text-5xl">
            {t('title')}
          </h2>
        </div>

        {/* 軌道Canvas+ドラッグ層 */}
        <div
          data-cursor="drag"
          className="relative flex-1 cursor-grab touch-pan-y active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <OrbitCanvas
            models={models}
            stateRef={orbitState}
            tier={tier}
            onActiveChange={setActiveIndex}
          />

          {/* アクティブモデル情報(DOM) */}
          {active && (
            <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 w-full max-w-md -translate-x-1/2 px-6 text-center">
              <p className="font-display text-4xl tracking-wide text-ivory md:text-5xl">
                {active.name}
              </p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="border border-gold/50 px-2 py-0.5 text-[0.55rem] tracking-[0.2em] text-gold">
                  {tCommon('aiModel')}
                </span>
                <span className="text-[0.65rem] tracking-[0.2em] text-soft uppercase">
                  {active.categories.join(' / ')}
                </span>
              </div>
              <Link
                href={`/${locale}/models/${active.slug}`}
                className="link-venus pointer-events-auto mt-4 inline-block text-[0.7rem] tracking-[0.25em] text-ivory uppercase"
              >
                {tCommon('viewProfile')}
              </Link>
            </div>
          )}

          <p className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.3em] text-soft/70 uppercase">
            {t('drag')}
          </p>
        </div>
      </div>
    </section>
  );
}
