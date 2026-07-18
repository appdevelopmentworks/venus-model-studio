'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { threeConfig } from '@/config/three';
import { useSceneStore } from '@/lib/scene-store';
import type { QualityTier } from '@/lib/performance';

const vertexShader = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uDrift;
  varying float vSeed;
  varying float vFade;
  void main() {
    vSeed = aSeed;
    vec3 p = position;
    float t = uTime * 0.12 + aSeed * 6.2831;
    p.x += sin(t + aSeed * 13.0) * uDrift;
    p.y += cos(t * 0.8 + aSeed * 7.0) * uDrift + uProgress * -1.2;
    p.z += sin(t * 0.6 + aSeed * 3.0) * uDrift;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    gl_PointSize = uSize * (1.0 / dist);
    vFade = smoothstep(16.0, 4.0, dist);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vSeed;
  varying float vFade;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.05, d) * uOpacity * vFade;
    // 個体ごとにシャンパン⇄ローズを揺らす
    vec3 c = mix(uColorA, uColorB, fract(vSeed * 7.31));
    gl_FragColor = vec4(c, alpha);
  }
`;

export function ParticleField({ tier }: { tier: QualityTier }) {
  const points = useRef<THREE.Points>(null);
  const count = threeConfig.particles.countByTier[tier] ?? 0;

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const spread = threeConfig.particles.spread;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.6 - 1;
      seeds[i] = Math.random();
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uSize: { value: threeConfig.particles.baseSize },
        uDrift: { value: threeConfig.particles.drift },
        uColorA: { value: new THREE.Color('#d6b36a') },
        uColorB: { value: new THREE.Color('#c98e7b') },
        uOpacity: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useFrame((state, delta) => {
    const { preloaderDone, progress } = useSceneStore.getState();
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uProgress.value = progress;
    const target = preloaderDone ? 0.5 : 0;
    const u = material.uniforms.uOpacity;
    u.value += (target - u.value) * Math.min(1, delta * 1.5);
  });

  if (count === 0) return null;
  return <points ref={points} geometry={geometry} material={material} />;
}
