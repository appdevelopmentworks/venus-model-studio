'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { useSceneStore } from '@/lib/scene-store';
import { prefersReducedMotion } from '@/lib/performance';

type HeroMedia = {
  src: string;
  poster: string;
};

type Props = {
  desktop?: HeroMedia;
  mobile?: HeroMedia;
  alt: string;
};

/**
 * Hero: HTML videoを基本レイヤーにし、背面の透明Canvas(リング)と重ねる。
 * autoplay失敗時はposterのまま。プリローダー完了後にタイポが行マスクで入場。
 */
export function HeroSection({ desktop, mobile, alt }: Props) {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const preloaderDone = useSceneStore((s) => s.preloaderDone);
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [media, setMedia] = useState<HeroMedia | undefined>(desktop);

  // モバイル縦動画への切替(単純クロップを避ける。docs/04)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const pick = () => setMedia(mq.matches && mobile ? mobile : desktop);
    pick();
    mq.addEventListener('change', pick);
    return () => mq.removeEventListener('change', pick);
  }, [desktop, mobile]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || prefersReducedMotion()) return;
    el.play().catch(() => {
      /* autoplay失敗時はposter表示のまま(仕様どおり) */
    });
  }, [media]);

  useGSAP(
    () => {
      if (!preloaderDone || !rootRef.current) return;
      if (prefersReducedMotion()) {
        gsap.set('.hero-reveal > span, .hero-fade', { opacity: 1, yPercent: 0 });
        return;
      }
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        '.hero-reveal > span',
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12 }
      ).fromTo(
        '.hero-fade',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 },
        '-=0.5'
      );
    },
    { scope: rootRef, dependencies: [preloaderDone] }
  );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
      data-section="hero"
    >
      {/* 背景動画レイヤー */}
      <div className="absolute inset-0" aria-hidden="true">
        {media ? (
          <video
            key={media.src}
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.poster}
            aria-label={alt}
          >
            <source src={media.src} type="video/mp4" />
          </video>
        ) : (
          <div className="h-full w-full bg-elevated" />
        )}
        {/* 可読性のためのシネマティックグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-bg/40" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* DOMコンテンツ */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-40 pb-24">
        <p className="hero-fade text-[0.65rem] tracking-[0.35em] text-gold uppercase opacity-0">
          {tCommon('aiModel')} × {tCommon('realModel')}
        </p>
        <h1 className="mt-6">
          <span className="hero-reveal line-mask font-display block text-[clamp(2.4rem,7vw,6.5rem)] leading-[1.04] text-ivory">
            <span>{t('taglinePrimary')}</span>
          </span>
        </h1>
        <p className="hero-fade mt-6 max-w-lg text-sm tracking-wide text-soft opacity-0 md:text-base">
          {t('taglineSecondary')}
        </p>
        <div className="hero-fade mt-10 flex flex-wrap gap-4 opacity-0">
          <Link href={`/${locale}/models`} className="btn-venus">
            {t('viewModels')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="btn-venus border-white/25"
          >
            {t('startProject')}
          </Link>
        </div>
      </div>

      {/* スクロールヒント */}
      <div className="hero-fade absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-0">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.55rem] tracking-[0.3em] text-soft uppercase">
            {tCommon('scrollDown')}
          </span>
          <span className="block h-10 w-px bg-gradient-to-b from-gold/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
