import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// reduced-motion を強制するためモジュールをモック
vi.mock('@/lib/performance', () => ({
  prefersReducedMotion: () => true,
  detectQualityTier: () => 0
}));

import { AutoPlayVideo } from '@/components/media/AutoPlayVideo';

describe('AutoPlayVideo (reduced motion)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders a poster image instead of a video when reduced motion is on', () => {
    render(
      <AutoPlayVideo
        src="/assets/video/x.mp4"
        poster="/assets/image/x.webp"
        alt="A test clip"
        className="test"
      />
    );
    const img = screen.getByAltText('A test clip');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/assets/image/x.webp');
  });
});
