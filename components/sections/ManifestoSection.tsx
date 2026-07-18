'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/performance';

/**
 * S4 Kinetic Manifesto(docs/19)
 * 巨大タイポの行マスクリビール+REAL/HYBRID/AIスクラブ帯。
 * reduced-motion: 全行を最終状態で静的表示。
 */
export function ManifestoSection() {
  const t = useTranslations('manifesto');
  const sectionRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  const lines = [
    { text: t('l1'), display: true, gold: false },
    { text: t('l2'), display: true, gold: true },
    { text: t('l3'), display: false, gold: false },
    { text: t('l4'), display: false, gold: false }
  ];

  const bandWords = ['REAL', 'HYBRID', 'AI'];

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;

      gsap.utils
        .toArray<HTMLElement>('.manifesto-line > span')
        .forEach((span) => {
          gsap.fromTo(
            span,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.9,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: span.parentElement,
                start: 'top 85%',
                once: true
              }
            }
          );
        });

      if (bandRef.current) {
        gsap.fromTo(
          bandRef.current,
          { xPercent: 4 },
          {
            xPercent: -24,
            ease: 'none',
            scrollTrigger: {
              trigger: bandRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-44"
      data-section="manifesto"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="section-kicker">{t('kicker')}</p>
        <div className="mt-10 space-y-2">
          {lines.map((line, i) => (
            <h2
              key={i}
              className={
                line.display
                  ? 'manifesto-line line-mask font-display text-[clamp(2.6rem,8vw,7.5rem)] leading-[1.05] tracking-tight'
                  : 'manifesto-line line-mask mt-6 max-w-2xl text-lg leading-relaxed text-soft md:text-xl'
              }
            >
              <span className={line.gold ? 'text-gold' : 'text-ivory'}>
                {line.text}
              </span>
            </h2>
          ))}
        </div>
      </div>

      {/* REAL → HYBRID → AI スクラブ帯 */}
      <div className="pointer-events-none mt-24 overflow-hidden" aria-hidden="true">
        <div
          ref={bandRef}
          className="flex items-baseline gap-12 whitespace-nowrap will-change-transform"
        >
          {[...bandWords, ...bandWords, ...bandWords].map((w, i) => (
            <span
              key={i}
              className={
                w === 'HYBRID'
                  ? 'font-display text-[clamp(4rem,12vw,11rem)] leading-none text-gold'
                  : 'font-display text-[clamp(4rem,12vw,11rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(244,240,232,0.25)]'
              }
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <hr className="gold-hairline mx-auto mt-24 max-w-6xl" />
    </section>
  );
}
