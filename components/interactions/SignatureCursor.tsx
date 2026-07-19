'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/performance';

/**
 * S8 Signature Cursor(docs/19)
 * 金の点+遅延追従リング+流れ星のようなスモーク残像トレイル。
 * fine pointer かつ reduced-motion でない環境でのみ有効。タッチでは何も描画しない。
 */

type TrailParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 → 0
  size: number;
  rose: boolean; // シャンパン⇄ローズの揺らぎ
};

export function SignatureCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1) 入力デバイス判定のみ(この時点ではカーソル要素は未レンダー)
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;
    // クライアント専用の入力デバイス判定に基づく意図的なsetState
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
  }, []);

  // 2) enabled=true の再レンダー後に要素が存在してから配線する
  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !label || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let lastX = mouseX;
    let lastY = mouseY;
    let visible = true;
    let raf = 0;

    // --- 残像トレイル ---
    const particles: TrailParticle[] = [];
    const MAX = 220;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /** 移動量に応じて粒子を生成(速いほど尾が長く濃くなる=流れ星) */
    const spawn = (x: number, y: number, dx: number, dy: number) => {
      const speed = Math.hypot(dx, dy);
      if (speed < 0.3) return;
      const count = Math.min(6, 1 + Math.floor(speed / 6));
      // 進行方向と逆向きに尾を伸ばす
      const dirX = -dx / (speed || 1);
      const dirY = -dy / (speed || 1);
      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX) particles.shift();
        const spread = 0.6;
        particles.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: dirX * (0.4 + Math.random() * 0.9) + (Math.random() - 0.5) * spread,
          vy: dirY * (0.4 + Math.random() * 0.9) + (Math.random() - 0.5) * spread - 0.15,
          life: 1,
          size: 3 + Math.random() * 5 + Math.min(speed * 0.15, 6),
          rose: Math.random() < 0.35
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = mouseX = e.clientX;
      lastY = mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      if (visible) spawn(mouseX, mouseY, dx, dy);

      // インタラクティブ要素の判定
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        '[data-cursor], a, button, input, textarea, [role="button"]'
      );
      const mode = el?.getAttribute('data-cursor');
      if (mode) {
        ring.dataset.state = 'label';
        label.textContent = mode.toUpperCase();
      } else if (
        el &&
        (el.tagName === 'A' ||
          el.tagName === 'BUTTON' ||
          el.getAttribute('role') === 'button')
      ) {
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
      // リング追従
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

      // トレイル描画(加算合成でスモーク状の発光)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.028;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vy -= 0.02; // ごくわずかに上へ立ち上る煙

        const r = p.size * (0.5 + p.life * 0.9);
        const alpha = p.life * p.life * 0.5;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        if (p.rose) {
          g.addColorStop(0, `rgba(201,142,123,${alpha})`);
          g.addColorStop(0.4, `rgba(201,142,123,${alpha * 0.4})`);
        } else {
          g.addColorStop(0, `rgba(214,179,106,${alpha})`);
          g.addColorStop(0.4, `rgba(214,179,106,${alpha * 0.4})`);
        }
        g.addColorStop(1, 'rgba(214,179,106,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(loop);
    };

    const onDown = () => (ring.dataset.pressed = 'true');
    const onUp = () => (ring.dataset.pressed = 'false');
    const onLeave = () => {
      visible = false;
      dot.style.opacity = ring.style.opacity = '0';
      canvas.style.opacity = '0';
    };
    const onEnter = () => {
      visible = true;
      lastX = mouseX;
      lastY = mouseY;
      dot.style.opacity = ring.style.opacity = '1';
      canvas.style.opacity = '1';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', resize);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    raf = requestAnimationFrame(loop);

    document.documentElement.classList.add('has-signature-cursor');

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', resize);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      document.documentElement.classList.remove('has-signature-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <canvas ref={canvasRef} className="cursor-trail" />
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" data-state="default">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
