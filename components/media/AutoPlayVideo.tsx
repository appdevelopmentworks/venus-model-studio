'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { prefersReducedMotion } from '@/lib/performance';

/** 同時再生1本ルールのためのシングルトン管理 */
let currentPlaying: HTMLVideoElement | null = null;

function requestPlay(el: HTMLVideoElement) {
  if (currentPlaying && currentPlaying !== el) {
    currentPlaying.pause();
  }
  currentPlaying = el;
  el.play().catch(() => {});
}

function releasePlay(el: HTMLVideoElement) {
  el.pause();
  if (currentPlaying === el) currentPlaying = null;
}

type Props = {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * ビューポート接近時のみ読み込み・再生する無音ループ動画。
 * - preload=none、画面外でpause、同時再生は常に1本
 * - reduced-motion: ポスター画像のみ
 */
export function AutoPlayVideo({ src, poster, alt, className, style }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = typeof window !== 'undefined' && prefersReducedMotion();

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          if (!el.src) el.src = src;
          requestPlay(el);
        } else {
          releasePlay(el);
        }
      },
      { threshold: [0, 0.4, 1] }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      releasePlay(el);
    };
  }, [src, reduced]);

  if (reduced) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={poster} alt={alt} className={className} style={style} loading="lazy" />
    );
  }

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={alt}
      className={className}
      style={style}
    />
  );
}
