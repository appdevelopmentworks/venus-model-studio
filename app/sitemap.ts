import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/metadata';
import { getPublishedModels, getPublishedProjects } from '@/lib/content';

/**
 * ロケール別URLを出力。published のモデル・プロジェクトのみ含める。
 * pending / placeholder / 権利未承認は getPublished* の時点で除外済み。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/models',
    '/services',
    '/projects',
    '/for-talents',
    '/about',
    '/contact',
    '/privacy',
    '/terms'
  ];

  const models = getPublishedModels();
  const projects = getPublishedProjects();

  const entries: MetadataRoute.Sitemap = [];

  const push = (path: string, priority: number) => {
    for (const locale of routing.locales) {
      const languages: Record<string, string> = {};
      for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${path}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority,
        alternates: { languages }
      });
    }
  };

  for (const p of staticPaths) push(p, p === '' ? 1 : 0.7);
  for (const m of models) push(`/models/${m.slug}`, 0.6);
  for (const p of projects) push(`/projects/${p.slug}`, 0.6);

  return entries;
}
