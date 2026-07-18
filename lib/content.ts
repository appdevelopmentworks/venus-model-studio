import { z } from 'zod';
import modelsJson from '@/data/models.json';
import servicesJson from '@/data/services.json';
import projectsJson from '@/data/projects.json';
import homeSectionsJson from '@/data/home-sections.json';

const localeMap = z.record(z.string(), z.string());

export const modelSchema = z.object({
  slug: z.string(),
  type: z.enum(['ai', 'real', 'ai-enhanced-real']),
  displayName: z.string(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  rightsStatus: z.enum(['approved', 'pending', 'restricted']),
  portrait: z.string(),
  fullbody: z.string().optional(),
  editorial: z.string().optional(),
  video: z.string().optional(),
  videoPoster: z.string().optional(),
  /** 横長素材を縦にクロップする際の人物の水平位置 0..1(既定0.5=中央) */
  focalX: z.number().min(0).max(1).optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  categories: z.array(z.string()),
  heightCm: z.number().optional(),
  bio: localeMap,
  capabilities: z.record(z.string(), z.array(z.string())),
  isPlaceholder: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  sortWeight: z.number().optional()
});

export type ModelProfile = z.infer<typeof modelSchema>;

export const serviceSchema = z.object({
  id: z.string(),
  order: z.number(),
  title: localeMap,
  short: localeMap,
  detail: localeMap.optional(),
  media: z.string().optional(),
  poster: z.string().optional()
});

export type Service = z.infer<typeof serviceSchema>;

export const projectSchema = z.object({
  slug: z.string(),
  status: z.enum(['concept', 'client']),
  published: z.boolean().default(false),
  isPlaceholder: z.boolean().optional(),
  title: localeMap,
  summary: localeMap,
  category: z.array(z.string()),
  cover: z.string(),
  video: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  relatedModels: z.array(z.string()).default([]),
  challenge: localeMap.optional(),
  approach: localeMap.optional(),
  humanContribution: localeMap.optional(),
  aiContribution: localeMap.optional(),
  credits: z.array(z.object({ role: z.string(), name: z.string() })).optional(),
  publishedAt: z.string().optional(),
  externalUrl: z.string().optional()
});

export type Project = z.infer<typeof projectSchema>;

export const sectionEntrySchema = z.object({
  id: z.string(),
  component: z.string(),
  enabled: z.boolean(),
  order: z.number(),
  variant: z.string().optional(),
  dataSource: z.string().optional(),
  minItems: z.number().optional()
});

export type SectionEntry = z.infer<typeof sectionEntrySchema>;

/** 公開ルール: real は rightsStatus=approved のみ。破損エントリーは除外して継続 */
function safeParseAll<T>(items: unknown[], schema: z.ZodType<T>): T[] {
  const out: T[] = [];
  for (const item of items) {
    const parsed = schema.safeParse(item);
    if (parsed.success) out.push(parsed.data);
    else if (process.env.NODE_ENV !== 'production') {
      console.warn('[content] invalid entry skipped:', parsed.error.message);
    }
  }
  return out;
}

const allModels = safeParseAll(modelsJson.models, modelSchema);

export function getPublishedModels(): ModelProfile[] {
  return allModels.filter(
    (m) => m.published && (m.type !== 'real' || m.rightsStatus === 'approved')
  );
}

export function getFeaturedAiModels(): ModelProfile[] {
  return getPublishedModels().filter((m) => m.type === 'ai' && m.featured);
}

export function getModel(slug: string): ModelProfile | undefined {
  return getPublishedModels().find((m) => m.slug === slug);
}

export function getServices(): Service[] {
  return safeParseAll(servicesJson.services, serviceSchema).sort(
    (a, b) => a.order - b.order
  );
}

const allProjects = safeParseAll(projectsJson.projects, projectSchema);

export function getPublishedProjects(): Project[] {
  return allProjects.filter((p) => p.published && !p.isPlaceholder);
}

export function getProject(slug: string): Project | undefined {
  return getPublishedProjects().find((p) => p.slug === slug);
}

export function getHomeSections(): SectionEntry[] {
  return safeParseAll(homeSectionsJson.sections, sectionEntrySchema)
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);
}

/** locale map から未翻訳フォールバック(en → ja)付きで取り出す */
export function pickLocale(map: Record<string, string>, locale: string): string {
  return map[locale] ?? map.en ?? map.ja ?? Object.values(map)[0] ?? '';
}
