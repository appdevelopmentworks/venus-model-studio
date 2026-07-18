'use client';

import { useFrame } from '@react-three/fiber';
import { threeConfig } from '@/config/three';
import { useSceneStore } from '@/lib/scene-store';

/**
 * スクロール進行に連動するカメラの旅程+微小なポインター追従。
 * 常に慣性補間し、急停止しない(docs/03 モーション言語)。
 */
export function CameraRig() {
  const { lerp, pointerInfluence, path } = threeConfig.cameraRig;

  useFrame(({ camera }) => {
    const { progress, pointerX, pointerY } = useSceneStore.getState();

    const targetX =
      Math.sin(progress * Math.PI * 2) * path.xSway + pointerX * pointerInfluence;
    const targetY = progress * path.yDrift - pointerY * pointerInfluence * 0.5;
    const targetZ = path.zStart + (path.zEnd - path.zStart) * progress;

    camera.position.x += (targetX - camera.position.x) * lerp;
    camera.position.y += (targetY - camera.position.y) * lerp;
    camera.position.z += (targetZ - camera.position.z) * lerp;
    camera.lookAt(0, progress * path.yDrift * 0.5, 0);
  });

  return null;
}
