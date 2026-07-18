import { describe, it, expect } from 'vitest';
import {
  pickLocale,
  getPublishedModels,
  getFeaturedAiModels,
  getModel,
  getPublishedProjects,
  modelSchema,
  projectSchema
} from '@/lib/content';

describe('pickLocale', () => {
  const map = { ja: 'こんにちは', en: 'hello' };

  it('returns the requested locale when present', () => {
    expect(pickLocale(map, 'ja')).toBe('こんにちは');
    expect(pickLocale(map, 'en')).toBe('hello');
  });

  it('falls back to en, then ja, then any', () => {
    expect(pickLocale(map, 'ru')).toBe('hello'); // en fallback
    expect(pickLocale({ ja: 'のみ' }, 'ru')).toBe('のみ'); // ja fallback
    expect(pickLocale({ ko: '한국어' }, 'ru')).toBe('한국어'); // any fallback
  });

  it('returns empty string for empty map', () => {
    expect(pickLocale({}, 'ja')).toBe('');
  });
});

describe('rights filtering', () => {
  it('only returns published models', () => {
    const models = getPublishedModels();
    expect(models.length).toBeGreaterThan(0);
    expect(models.every((m) => m.published)).toBe(true);
  });

  it('never exposes real models without approved rights', () => {
    const models = getPublishedModels();
    for (const m of models) {
      if (m.type === 'real') {
        expect(m.rightsStatus).toBe('approved');
      }
    }
  });

  it('featured AI models are all ai type and featured', () => {
    const featured = getFeaturedAiModels();
    expect(featured.every((m) => m.type === 'ai' && m.featured)).toBe(true);
  });

  it('getModel resolves a known slug and rejects unknown', () => {
    expect(getModel('ai-elena-west')?.displayName).toBe('ELENA');
    expect(getModel('does-not-exist')).toBeUndefined();
  });
});

describe('projects', () => {
  it('published projects exclude placeholders', () => {
    const projects = getPublishedProjects();
    expect(projects.every((p) => p.published && !p.isPlaceholder)).toBe(true);
  });
});

describe('schemas', () => {
  it('modelSchema rejects invalid type', () => {
    const bad = modelSchema.safeParse({
      slug: 'x',
      type: 'alien',
      displayName: 'X',
      rightsStatus: 'approved',
      portrait: 'p.webp',
      categories: [],
      bio: {},
      capabilities: {}
    });
    expect(bad.success).toBe(false);
  });

  it('projectSchema requires cover and valid status', () => {
    const bad = projectSchema.safeParse({
      slug: 'x',
      status: 'invalid',
      title: {},
      summary: {},
      category: [],
      cover: 'c.webp'
    });
    expect(bad.success).toBe(false);
  });
});
