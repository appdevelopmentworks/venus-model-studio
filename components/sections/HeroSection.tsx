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
      {/* 全画面背景動画(デスクトップ・モバイル共通)。
          モバイルは縦動画。モデルを上寄せに配置し、顔が上部に来て文字と被らないようにする */}
      <div className="absolute inset-0" aria-hidden="true">
        {media ? (
          <video
            key={media.src}
            ref={videoRef}
            className="h-full w-full object-cover object-[50%_18%] md:object-center"
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
        {/* 透過グラデーション: モデルは透けて見え、下部の文字は読める。
            上部(モデルの顔)は透明に近く、下部(文字)へ向けて黒を強める */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-bg/25 md:via-bg/30 md:to-bg/40" />
        {/* 下部の可読性scrim: モバイルは高め(2/3)かつ中間も少し暗くして文字を読ませつつ、
            モデルの腰あたりは透けて見える程度に留める。デスクトップは従来どおり */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg via-bg/55 to-transparent md:h-1/2 md:via-transparent" />
      </div>

      {/* DOMコンテンツ(下部に配置。デスクトップ・モバイル共通で動画に重ねる) */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-40 pb-20 md:pb-24">
        <p className="hero-fade text-[0.6rem] tracking-[0.35em] text-gold uppercase opacity-0 md:text-[0.65rem]">
          {tCommon('aiModel')} × {tCommon('realModel')}
        </p>
        <h1 className="mt-3 md:mt-6">
          <span className="hero-reveal line-mask font-display block text-[clamp(1.85rem,6.5vw,6.5rem)] leading-[1.1] text-ivory md:leading-[1.04]">
            <span>{t('taglinePrimary')}</span>
          </span>
        </h1>
        <p className="hero-fade mt-3 max-w-lg text-xs tracking-wide text-soft opacity-0 md:mt-6 md:text-base">
          {t('taglineSecondary')}
        </p>
        <div className="hero-fade mt-6 flex flex-col gap-3 opacity-0 sm:flex-row sm:flex-wrap sm:gap-4 md:mt-10">
          <Link href={`/${locale}/models`} className="btn-venus justify-center sm:justify-start">
            {t('viewModels')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="btn-venus justify-center border-white/25 sm:justify-start"
          >
            {t('startProject')}
          </Link>
        </div>
      </div>

      {/* スクロールヒント(デスクトップのみ) */}
      <div className="hero-fade absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 opacity-0 md:block">
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
