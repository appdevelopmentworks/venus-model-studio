'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useSceneStore } from '@/lib/scene-store';
import { prefersReducedMotion } from '@/lib/performance';

/**
 * Lenis慣性スクロール + ScrollTrigger同期 + シーン進行度の配信。
 * reduced-motion時はLenisを起動せず、素のスクロールで進行度のみ配信する。
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const setProgress = useSceneStore.getState().setProgress;
    const setPointer = useSceneStore.getState().setPointer;

    const updateProgressFromWindow = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    const onPointer = (e: PointerEvent) => {
      setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    if (prefersReducedMotion()) {
      window.addEventListener('scroll', updateProgressFromWindow, { passive: true });
      updateProgressFromWindow();
      return () => {
        window.removeEventListener('scroll', updateProgressFromWindow);
        window.removeEventListener('pointermove', onPointer);
      };
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.11,
      wheelMultiplier: 1
    });

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      const limit = lenis.limit || 1;
      setProgress(Math.min(1, Math.max(0, lenis.scroll / limit)));
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return <>{children}</>;
}
