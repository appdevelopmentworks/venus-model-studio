/**
 * 品質ティア判定(docs/07 3.5章)
 * T3 cinema / T2 balanced / T1 lite / T0 static
 * 起動時判定+実行中降格のみ(昇格しない)
 */
export type QualityTier = 0 | 1 | 2 | 3;

export function detectQualityTier(): QualityTier {
  if (typeof window === 'undefined') return 0;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    if (!gl) return 0;
  } catch {
    return 0;
  }

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 1024;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 4;

  if (coarse || small) return 1;
  if (mem !== undefined && mem <= 4) return 1;
  if ((mem !== undefined && mem >= 8) || cores >= 10) return 3;
  return 2;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
