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
      className="relative flex min-h-[100svh] flex-col overflow-hidden md:block md:items-end"
      data-section="hero"
    >
      {/* 動画レイヤー
          モバイル: 上部の専用ゾーン(縦動画をしっかり見せる/テキストと重ねない)
          デスクトップ: 全面背景 */}
      <div
        className="relative h-[50svh] w-full shrink-0 md:absolute md:inset-0 md:h-full"
        aria-hidden="true"
      >
        {media ? (
          <video
            key={media.src}
            ref={videoRef}
            className="h-full w-full object-cover object-[50%_28%] md:object-center"
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
        {/* デスクトップ: 可読性のためのシネマティックグラデーション */}
        <div className="absolute inset-0 hidden bg-gradient-to-t from-bg via-bg/30 to-bg/40 md:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-bg to-transparent md:block" />
        {/* モバイル: 動画下端を黒へ溶かして下のテキストブロックへ自然に繋ぐ */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-bg to-transparent md:hidden" />
      </div>

      {/* DOMコンテンツ
          モバイル: 動画の下(黒地)に配置しテキストを重ねない
          デスクトップ: 動画に重ねて左下に配置 */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pt-3 pb-8 md:absolute md:inset-0 md:mx-auto md:h-full md:max-w-6xl md:justify-end md:pt-40 md:pb-24">
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

      {/* スクロールヒント(デスクトップのみ。モバイルは縦積みで重なるため非表示) */}
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
