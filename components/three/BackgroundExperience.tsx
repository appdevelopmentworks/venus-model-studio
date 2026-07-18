'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { threeConfig } from '@/config/three';
import { useQuality } from '@/components/providers/QualityProvider';
import { useSceneStore } from '@/lib/scene-store';
import { CameraRig } from './CameraRig';
import { HaloRings } from './HaloRings';
import { ParticleField } from './ParticleField';

/** プリローダー完了からこの時間だけ待ってFPS計測を開始する(初期ロードの負荷スパイクを無視) */
const MONITOR_WARMUP_MS = 3000;

/**
 * 背景の常駐Canvas(リング+粒子+カメラ)。
 * 軽量に保ち、重い演出はセクションローカルCanvasに分離する。
 * pointer-events: none — 操作は常にDOM側が受ける。
 */
export default function BackgroundExperience() {
  const { tier, demote } = useQuality();
  const preloaderDone = useSceneStore((s) => s.preloaderDone);
  const [monitorOn, setMonitorOn] = useState(false);

  // シェーダーコンパイル・動画デコード等が集中する起動直後はFPSが一時的に
  // 落ちるため、その間の計測は降格判定に使わない。
  useEffect(() => {
    if (!preloaderDone || monitorOn) return;
    const id = window.setTimeout(() => setMonitorOn(true), MONITOR_WARMUP_MS);
    return () => window.clearTimeout(id);
  }, [preloaderDone, monitorOn]);

  if (tier === null || tier === 0) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={threeConfig.dpr}
        camera={{
          fov: threeConfig.camera.fov,
          position: threeConfig.camera.position
        }}
        gl={{
          alpha: true,
          antialias: tier >= 2,
          powerPreference: 'default'
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        {monitorOn && <PerformanceMonitor onDecline={demote} />}
        <CameraRig />
        <HaloRings />
        <ParticleField tier={tier} />
      </Canvas>
    </div>
  );
}
