'use client';

import { useTranslations } from 'next-intl';

/**
 * S10 Venus Seal(簡易版): CSSリング+ロゴタイポの静かな結び。
 * 粒子結像版はP2として今後拡張(docs/19)。
 */
export function EndingSection() {
  const t = useTranslations('ending');

  return (
    <section
      className="relative flex min-h-[70svh] items-center justify-center overflow-hidden py-24"
      data-section="ending"
    >
      <div
        className="css-halo absolute h-[46vmin] w-[46vmin]"
        aria-hidden="true"
      />
      <div
        className="css-halo absolute h-[60vmin] w-[60vmin] opacity-50"
        aria-hidden="true"
      />
      <div className="relative z-10 text-center">
        <p className="font-display text-5xl tracking-[0.2em] text-ivory md:text-7xl">
          VENUS
        </p>
        <p className="mt-2 text-[0.6rem] tracking-[0.5em] text-gold uppercase">
          Model Studio
        </p>
        <p className="mt-8 text-[0.65rem] tracking-[0.3em] text-soft uppercase">
          {t('tagline')}
        </p>
      </div>
    </section>
  );
}
