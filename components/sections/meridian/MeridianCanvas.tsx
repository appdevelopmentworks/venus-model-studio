'use client';

import { useMemo, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { threeConfig } from '@/config/three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexReal;
  uniform sampler2D uTexDigital;
  uniform float uProgress;
  uniform float uTime;
  uniform float uPlaneAspect;
  uniform float uAspectReal;
  uniform float uAspectDigital;
  uniform float uNoiseScale;
  uniform float uNoiseAmp;
  uniform float uSoft;
  uniform float uGlowWidth;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(17.0, 9.0);
      a *= 0.5;
    }
    return v;
  }

  vec2 coverUv(vec2 uv, float planeAspect, float texAspect) {
    vec2 ratio = vec2(
      min(planeAspect / texAspect, 1.0),
      min(texAspect / planeAspect, 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    vec3 gold = vec3(0.839, 0.702, 0.416);

    float n = fbm(vec2(vUv.y * uNoiseScale, vUv.y * uNoiseScale * 0.7 + uTime * 0.05));
    float edge = mix(-0.1, 1.1, uProgress) + (n - 0.5) * uNoiseAmp;

    float m = smoothstep(edge - uSoft, edge + uSoft, vUv.x);

    vec3 real = texture2D(uTexReal, coverUv(vUv, uPlaneAspect, uAspectReal)).rgb;
    vec3 digital = texture2D(uTexDigital, coverUv(vUv, uPlaneAspect, uAspectDigital)).rgb;
    vec3 c = mix(real, digital, m);

    // 境界の金の光芒
    float g = exp(-abs(vUv.x - edge) / uGlowWidth);
    c += gold * g * 0.45;

    // 境界付近の金の微粒子(スパークル)
    float sparkleZone = exp(-abs(vUv.x - edge) / (uGlowWidth * 2.5));
    float sparkle = step(0.995, hash(floor(vUv * vec2(220.0, 380.0)) + floor(uTime * 8.0)));
    c += gold * sparkle * sparkleZone * 0.8;

    // ごく弱いフィルムグレイン
    c += (hash(vUv * 913.0 + uTime) - 0.5) * 0.035;

    gl_FragColor = vec4(c, 1.0);
  }
`;

function textureAspect(tex: THREE.Texture): number {
  const img = tex.image as { width?: number; height?: number } | undefined;
  return img?.width && img?.height ? img.width / img.height : 16 / 9;
}

function MeridianPlane({
  realUrl,
  digitalUrl,
  progressRef
}: {
  realUrl: string;
  digitalUrl: string;
  progressRef: MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const [texReal, texDigital] = useTexture([realUrl, digitalUrl]);

  const material = useMemo(() => {
    for (const t of [texReal, texDigital]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    }
    const cfg = threeConfig.meridian;
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexReal: { value: texReal },
        uTexDigital: { value: texDigital },
        uProgress: { value: 0.15 },
        uTime: { value: 0 },
        uPlaneAspect: { value: 1 },
        uAspectReal: { value: textureAspect(texReal) },
        uAspectDigital: { value: textureAspect(texDigital) },
        uNoiseScale: { value: cfg.noiseScale },
        uNoiseAmp: { value: cfg.noiseAmplitude },
        uSoft: { value: cfg.edgeSoftness },
        uGlowWidth: { value: cfg.glowWidth }
      }
    });
  }, [texReal, texDigital]);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPlaneAspect.value = viewport.width / viewport.height;
    const u = material.uniforms.uProgress;
    u.value += (progressRef.current - u.value) * Math.min(1, delta * 6);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export default function MeridianCanvas({
  realUrl,
  digitalUrl,
  progressRef
}: {
  realUrl: string;
  digitalUrl: string;
  progressRef: MutableRefObject<number>;
}) {
  return (
    <Canvas
      dpr={threeConfig.dpr}
      gl={{ antialias: false, alpha: false, powerPreference: 'default' }}
      camera={{ position: [0, 0, 1], fov: 50 }}
      className="!absolute inset-0"
    >
      <MeridianPlane realUrl={realUrl} digitalUrl={digitalUrl} progressRef={progressRef} />
    </Canvas>
  );
}
