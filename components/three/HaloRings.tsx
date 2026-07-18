'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { threeConfig, GOLD } from '@/config/three';
import { useSceneStore } from '@/lib/scene-store';

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 1.4);
    vec3 c = uColor * (0.45 + 1.1 * fresnel);
    float a = uOpacity * (0.35 + 0.65 * fresnel);
    gl_FragColor = vec4(c, a);
  }
`;

function Ring({
  radius,
  tube,
  tiltX,
  tiltZ,
  speed,
  opacity
}: (typeof threeConfig.rings)[number]) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(GOLD) },
          uOpacity: { value: 0 }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
    []
  );

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const { preloaderDone, progress } = useSceneStore.getState();
    mesh.current.rotation.y += speed * delta * 10;
    mesh.current.rotation.x = tiltX + Math.sin(progress * Math.PI) * 0.12;
    // プリローダー完了後にフェードイン
    const target = preloaderDone ? opacity : 0;
    const u = material.uniforms.uOpacity;
    u.value += (target - u.value) * Math.min(1, delta * 2.5);
  });

  return (
    <mesh ref={mesh} rotation={[tiltX, 0, tiltZ]} material={material}>
      <torusGeometry args={[radius, tube, 16, 160]} />
    </mesh>
  );
}

export function HaloRings() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const { progress } = useSceneStore.getState();
    // スクロールで環がわずかに開く(スケールと奥行き)
    const s = 1 + progress * 0.35;
    group.current.scale.setScalar(
      group.current.scale.x + (s - group.current.scale.x) * Math.min(1, delta * 3)
    );
    group.current.position.z = -1 - progress * 1.5;
  });

  return (
    <group ref={group}>
      {threeConfig.rings.map((ring, i) => (
        <Ring key={i} {...ring} />
      ))}
    </group>
  );
}
