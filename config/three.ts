/**
 * 3D設定の集約(docs/20 8章)。シーン内にマジックナンバーを書かない。
 */
export const GOLD = '#d6b36a';
export const ROSE = '#c98e7b';

export const threeConfig = {
  dpr: [1, 1.5] as [number, number],
  camera: { fov: 38, position: [0, 0, 8] as [number, number, number] },

  particles: {
    countByTier: { 0: 0, 1: 150, 2: 600, 3: 1200 } as Record<number, number>,
    spread: 14,
    baseSize: 26,
    drift: 0.12
  },

  rings: [
    { radius: 2.6, tube: 0.012, tiltX: 0.5, tiltZ: 0.12, speed: 0.028, opacity: 0.85 },
    { radius: 3.3, tube: 0.008, tiltX: 0.62, tiltZ: -0.2, speed: -0.02, opacity: 0.5 },
    { radius: 4.2, tube: 0.005, tiltX: 0.42, tiltZ: 0.32, speed: 0.012, opacity: 0.3 }
  ],

  cameraRig: {
    lerp: 0.06,
    pointerInfluence: 0.18,
    /** progress 0..1 に対するカメラの旅程 */
    path: {
      zStart: 8,
      zEnd: 6.2,
      yDrift: -0.6,
      xSway: 0.35
    }
  },

  orbit: {
    radius: 3.1,
    panelWidth: 1.5,
    panelHeight: 2.5,
    curvature: 0.16,
    rotateLerp: 0.075,
    dragSensitivity: 0.006,
    /** 正面パネルが表示領域の約66%高に収まる距離(fov 42・panelHeight 2.5前提) */
    cameraZ: 8
  },

  meridian: {
    noiseScale: 3.0,
    edgeSoftness: 0.025,
    noiseAmplitude: 0.16,
    glowWidth: 0.07,
    snapPoints: [0, 0.5, 1],
    snapThreshold: 0.08,
    idleSweep: { min: 0.15, max: 0.85 }
  }
};
