'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/performance';

/**
 * S8 Signature Cursor(docs/19)
 * 金の点+遅延追従リング。メディア/リンク上でラベル表示・拡大。
 * fine pointer かつ reduced-motion でない環境でのみ有効。タッチでは何も描画しない。
 */
export function SignatureCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;
    // クライアント専用の入力デバイス判定に基づく意図的なsetState
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

      // インタラクティブ要素の判定
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        '[data-cursor], a, button, input, textarea, [role="button"]'
      );
      const mode = el?.getAttribute('data-cursor');
      if (mode) {
        ring.dataset.state = 'label';
        label.textContent = mode.toUpperCase();
      } else if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.getAttribute('role') === 'button')) {
        ring.dataset.state = 'link';
        label.textContent = '';
      } else if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
        ring.dataset.state = 'text';
        label.textContent = '';
      } else {
        ring.dataset.state = 'default';
        label.textContent = '';
      }
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(loop);
    };

    const onDown = () => (ring.dataset.pressed = 'true');
    const onUp = () => (ring.dataset.pressed = 'false');
    const onLeave = () => (dot.style.opacity = ring.style.opacity = '0');
    const onEnter = () => (dot.style.opacity = ring.style.opacity = '1');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    raf = requestAnimationFrame(loop);

    document.documentElement.classList.add('has-signature-cursor');

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      document.documentElement.classList.remove('has-signature-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" data-state="default">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
