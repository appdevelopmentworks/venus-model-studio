'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/performance';
import { AutoPlayVideo } from '@/components/media/AutoPlayVideo';

type WallItem = {
  src: string;
  poster: string;
  alt: string;
  caption: string;
};

/**
 * S5 Atelier Wall(簡易版)
 * 撮影現場の動画壁。セクション進入時にストロボの微弱な白フラッシュ(最大4%)。
 * reduced-motion: フラッシュなし・ポスター表示(AutoPlayVideo側で対応)。
 */
export function RealTalentSection({ items }: { items: WallItem[] }) {
  const t = useTranslations('realTalent');
  const tCommon = useTranslations('common');
  const sectionRef = useRef<HTMLElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !flashRef.current || !sectionRef.current) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          once: true
        }
      })
        .to(flashRef.current, { opacity: 0.04, duration: 0.06 })
        .to(flashRef.current, { opacity: 0, duration: 0.22 })
        .to(flashRef.current, { opacity: 0.03, duration: 0.05 }, '+=0.12')
        .to(flashRef.current, { opacity: 0, duration: 0.3 });
    },
    { scope: sectionRef }
  );

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36"
      data-section="real-talent"
    >
      {/* ストロボフラッシュ層 */}
      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-30 bg-white opacity-0"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6">
        <p className="section-kicker">{t('kicker')}</p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl text-ivory md:text-5xl">
          {t('title')}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-soft">{t('body')}</p>

        {/* 全タイルを等幅16:9で揃える(素材は横長。縦クロップしない) */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <figure key={i} className="group relative overflow-hidden">
              <div
                data-cursor="view"
                className="aspect-video overflow-hidden bg-panel"
              >
                <AutoPlayVideo
                  src={item.src}
                  poster={item.poster}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between">
                <span className="text-[0.65rem] tracking-[0.2em] text-soft uppercase">
                  {item.caption}
                </span>
                <span className="border border-ivory/40 px-2 py-0.5 text-[0.55rem] tracking-[0.2em] text-ivory">
                  {tCommon('realModel')}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
