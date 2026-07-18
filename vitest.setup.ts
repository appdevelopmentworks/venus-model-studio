import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdomに存在しないブラウザAPIのスタブ
if (typeof window !== 'undefined') {
  window.matchMedia =
    window.matchMedia ||
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false
    }));

  window.IntersectionObserver =
    window.IntersectionObserver ||
    (class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = '';
      thresholds = [];
    } as unknown as typeof IntersectionObserver);
}

vi.stubGlobal('scrollTo', () => {});
