'use client';

import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { threeConfig } from '@/config/three';
import { useLazyTexture } from '@/lib/use-lazy-texture';
import type { QualityTier } from '@/lib/performance';

export type OrbitModelItem = {
  slug: string;
  name: string;
  posterUrl: string;
  videoUrl?: string;
  /** 横長素材の人物の水平位置 0..1(cover-fitクロップの基準) */
  focalX?: number;
};

type OrbitState = {
  /** スクロール由来の基準角 */
  base: number;
  /** ドラッグによる追加角 */
  drag: number;
};

/**
 * cover-fit: テクスチャをパネル比率でトリミング。
 * focalX(人物の水平位置 0..1)を基準にクロップ窓を寄せ、端ではみ出さないようクランプ。
 */
function applyCover(
  texture: THREE.Texture,
  panelAspect: number,
  texAspect: number,
  focalX = 0.5
) {
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  if (texAspect > panelAspect) {
    const r = panelAspect / texAspect;
    const offset = Math.min(1 - r, Math.max(0, focalX - r / 2));
    texture.repeat.set(r, 1);
    texture.offset.set(offset, 0);
  } else {
    const r = texAspect / panelAspect;
    texture.repeat.set(1, r);
    texture.offset.set(0, (1 - r) / 2);
  }
}

/** X方向にゆるく湾曲したパネルジオメトリ */
function makeCurvedPlane(w: number, h: number, curvature: number) {
  const geo = new THREE.PlaneGeometry(w, h, 24, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const t = x / (w / 2);
    pos.setZ(i, -curvature * t * t * w * 0.5 + curvature * w * 0.25);
  }
  geo.computeVertexNormals();
  return geo;
}

function wrapAngle(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

function Panel({
  item,
  angle,
  geometry,
  activeStrengthRef,
  index,
  tier,
  activeIndexRef
}: {
  item: OrbitModelItem;
  angle: number;
  geometry: THREE.BufferGeometry;
  activeStrengthRef: MutableRefObject<number[]>;
  index: number;
  tier: QualityTier;
  activeIndexRef: MutableRefObject<number>;
}) {
  const cfg = threeConfig.orbit;
  const mesh = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  // Suspense非依存のローダー(未ロード中はnull → パネルはopacity 0で待機)
  const poster = useLazyTexture(item.posterUrl);
  const videoRef = useRef<{ el: HTMLVideoElement; tex: THREE.VideoTexture } | null>(null);
  const panelAspect = cfg.panelWidth / cfg.panelHeight;

  // マテリアルは1度だけ生成し、テクスチャ到着時にmapを差し込む
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        toneMapped: false,
        transparent: true,
        opacity: 0
      }),
    []
  );

  useEffect(() => {
    if (!poster) return;
    const img = poster.image as { width?: number; height?: number } | undefined;
    const texAspect =
      img?.width && img?.height ? img.width / img.height : panelAspect;
    applyCover(poster, panelAspect, texAspect, item.focalX);
    // アクティブパネルがVideoTextureを保持中なら上書きしない
    if (!videoRef.current) {
      material.map = poster;
      material.needsUpdate = true;
    }
  }, [poster, panelAspect, item.focalX, material]);

  // T3のみ: アクティブ時にVideoTextureへ切替(常に同時1本)
  useEffect(() => {
    if (tier < 3 || !item.videoUrl) return;
    let disposed = false;
    let raf = 0;

    const check = () => {
      const isActive = activeIndexRef.current === index;
      const hasVideo = videoRef.current !== null;
      if (isActive && !hasVideo) {
        const el = document.createElement('video');
        el.src = item.videoUrl as string;
        el.muted = true;
        el.loop = true;
        el.playsInline = true;
        el.preload = 'auto';
        el.play().catch(() => {});
        const tex = new THREE.VideoTexture(el);
        tex.colorSpace = THREE.SRGBColorSpace;
        videoRef.current = { el, tex };
        el.addEventListener('loadedmetadata', () => {
          if (disposed || !videoRef.current) return;
          const t = videoRef.current.tex;
          const va = el.videoWidth / el.videoHeight;
          applyCover(t, panelAspect, va, item.focalX);
          material.map = t;
          material.needsUpdate = true;
        });
      } else if (!isActive && hasVideo) {
        const v = videoRef.current;
        videoRef.current = null;
        if (v) {
          v.el.pause();
          v.el.removeAttribute('src');
          v.el.load();
          v.tex.dispose();
        }
        material.map = poster;
        material.needsUpdate = true;
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      const v = videoRef.current;
      videoRef.current = null;
      if (v) {
        v.el.pause();
        v.el.removeAttribute('src');
        v.el.load();
        v.tex.dispose();
      }
      material.map = poster;
    };
  }, [tier, item.videoUrl, item.focalX, index, material, poster, panelAspect, activeIndexRef]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const strength = activeStrengthRef.current[index] ?? 0;
    // アクティブ: 明るく・わずかに拡大・前へ / 非アクティブ: 沈める
    const brightness = 0.45 + strength * 0.55;
    material.color.setScalar(brightness);
    // テクスチャ到着までopacity 0で待機し、到着後フェードイン
    const targetOpacity = material.map ? 1 : 0;
    material.opacity += (targetOpacity - material.opacity) * Math.min(1, delta * 4);
    const scale = 1 + strength * 0.06;
    mesh.current.scale.setScalar(scale);
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = strength * 0.35;
    }
  });

  const x = Math.sin(angle) * cfg.radius;
  const z = Math.cos(angle) * cfg.radius;

  return (
    <group position={[x, 0, z]} rotation={[0, angle, 0]}>
      {/* 金の縁光(アクティブ時のみ) */}
      <mesh ref={glowRef} position={[0, 0, -0.02]}>
        <planeGeometry args={[cfg.panelWidth + 0.08, cfg.panelHeight + 0.08]} />
        <meshBasicMaterial
          color="#d6b36a"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={mesh} geometry={geometry} material={material} />
    </group>
  );
}

function OrbitScene({
  models,
  stateRef,
  tier,
  onActiveChange
}: {
  models: OrbitModelItem[];
  stateRef: MutableRefObject<OrbitState>;
  tier: QualityTier;
  onActiveChange: (index: number) => void;
}) {
  const cfg = threeConfig.orbit;
  const group = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);
  const activeIndexRef = useRef(0);
  const activeStrengthRef = useRef<number[]>(models.map(() => 0));
  const lastReported = useRef(-1);

  const geometry = useMemo(
    () => makeCurvedPlane(cfg.panelWidth, cfg.panelHeight, cfg.curvature),
    [cfg.panelWidth, cfg.panelHeight, cfg.curvature]
  );

  const step = (Math.PI * 2) / models.length;

  useFrame(() => {
    if (!group.current) return;
    const target = stateRef.current.base + stateRef.current.drag;
    rotationRef.current += (target - rotationRef.current) * cfg.rotateLerp;
    group.current.rotation.y = rotationRef.current;

    // 正面(カメラ側 z+)に最も近いパネルを算出
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < models.length; i++) {
      const a = wrapAngle(rotationRef.current + i * step);
      const d = Math.abs(a);
      activeStrengthRef.current[i] = Math.max(0, 1 - d / (step * 0.6));
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    activeIndexRef.current = best;
    if (best !== lastReported.current) {
      lastReported.current = best;
      onActiveChange(best);
    }
  });

  return (
    <group ref={group}>
      {models.map((m, i) => (
        <Panel
          key={m.slug}
          item={m}
          index={i}
          angle={i * step}
          geometry={geometry}
          activeStrengthRef={activeStrengthRef}
          activeIndexRef={activeIndexRef}
          tier={tier}
        />
      ))}
    </group>
  );
}

export default function OrbitCanvas({
  models,
  stateRef,
  tier,
  onActiveChange
}: {
  models: OrbitModelItem[];
  stateRef: MutableRefObject<OrbitState>;
  tier: QualityTier;
  onActiveChange: (index: number) => void;
}) {
  return (
    <Canvas
      dpr={threeConfig.dpr}
      gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
      camera={{ position: [0, 0, threeConfig.orbit.cameraZ], fov: 42 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      className="!absolute inset-0"
    >
      <OrbitScene
        models={models}
        stateRef={stateRef}
        tier={tier}
        onActiveChange={onActiveChange}
      />
    </Canvas>
  );
}

export type { OrbitState };
