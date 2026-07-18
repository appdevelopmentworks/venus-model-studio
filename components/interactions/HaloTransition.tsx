'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';
import { prefersReducedMotion } from '@/lib/performance';

/**
 * S7 Halo Transition(docs/19)
 * ページ遷移ごとに、金のリングが収縮しながら開いてコンテンツが現れる場面転換。
 * template.tsx 経由でナビゲーションごとに再マウントされる。
 * reduced-motion: 短いクロスフェードのみ。
 */
export function HaloTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!content) return;

    const reduced = prefersReducedMotion();

    if (reduced) {
      content.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 200, easing: 'ease-out', fill: 'backwards' }
      );
      return;
    }

    // コンテンツの入場
    content.animate(
      [
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 700, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'backwards' }
    );

    // 金のリングが収縮しながら消える(扉が開く)
    if (overlay) {
      overlay.animate(
        [
          { opacity: 0.9, transform: 'scale(0.2)' },
          { opacity: 0, transform: 'scale(2.4)' }
        ],
        { duration: 650, easing: 'cubic-bezier(0.83,0,0.17,1)', fill: 'forwards' }
      );
    }
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[65] flex items-center justify-center opacity-0"
      >
        <div className="css-halo h-[40vmin] w-[40vmin]" />
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  );
}
