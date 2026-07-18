import { describe, it, expect } from 'vitest';
import { assetUrl, getAsset, getAssetAlt } from '@/lib/assets';

describe('assetUrl', () => {
  it('prefixes with /assets/', () => {
    expect(assetUrl('video/hero/x.mp4')).toBe('/assets/video/hero/x.mp4');
  });
});

describe('getAsset (slot resolution)', () => {
  it('resolves a known slot', () => {
    const hero = getAsset('hero.desktop');
    expect(hero?.src).toContain('hero-hybrid-desktop.mp4');
  });

  it('returns undefined for an unknown slot (triggers fallback)', () => {
    expect(getAsset('does.not.exist')).toBeUndefined();
  });
});

describe('getAssetAlt (locale-aware)', () => {
  it('picks ja or en alt text', () => {
    const hero = getAsset('hero.desktop');
    expect(getAssetAlt(hero, 'ja')).toContain('スタジオ');
    expect(getAssetAlt(hero, 'en').length).toBeGreaterThan(0);
  });

  it('returns empty string for undefined asset', () => {
    expect(getAssetAlt(undefined, 'ja')).toBe('');
  });
});
