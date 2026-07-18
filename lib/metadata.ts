import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

// 本番は NEXT_PUBLIC_SITE_URL を設定する。
// 未設定時、Vercelのプレビュー等では VERCEL_URL を暫定利用し、最後にlocalhostへ。
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000'
).replace(/\/$/, '');

/** 既定OG画像(リンクプレビュー)。1200×630 */
export const DEFAULT_OG_IMAGE = '/assets/image/seo/og-default.jpg';

/** OGロケール表記(hreflang/og:locale用) */
const ogLocaleMap: Record<string, string> = {
  ja: 'ja_JP',
  en: 'en_US',
  ru: 'ru_RU',
  'zh-CN': 'zh_CN',
  ko: 'ko_KR'
};

/**
 * 全ページ共通のcanonical + hreflang alternates を生成する。
 * pathは locale を除いたサイト内パス(先頭スラッシュ付き、例 '/models')。ホームは ''。
 */
export function buildAlternates(locale: string, path = '') {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${path}`;
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`;
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages
  };
}

/** ページ用メタデータの共通生成 */
export function buildMetadata(opts: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  images?: string[];
}): Metadata {
  const { locale, path = '', title, description, images } = opts;
  const url = `${SITE_URL}/${locale}${path}`;
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE];
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      siteName: 'Venus Model Studio',
      locale: ogLocaleMap[locale] ?? 'ja_JP',
      type: 'website',
      images: ogImages.map((i) => ({ url: i }))
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages
    }
  };
}
