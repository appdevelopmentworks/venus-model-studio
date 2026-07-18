import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPublishedProjects, pickLocale } from '@/lib/content';
import { assetUrl } from '@/lib/assets';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projectsPage' });
  return buildMetadata({
    locale,
    path: '/projects',
    title: t('title'),
    description: t('intro')
  });
}

export default async function ProjectsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projectsPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const projects = getPublishedProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="section-kicker">{t('kicker')}</p>
      <h1 className="font-display mt-4 text-4xl text-ivory md:text-6xl">{t('title')}</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-soft">{t('intro')}</p>
      <hr className="gold-hairline mt-10" />

      {projects.length === 0 ? (
        <p className="mt-16 text-[0.7rem] tracking-[0.3em] text-gold uppercase">
          {t('empty')}
        </p>
      ) : (
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/projects/${p.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-panel">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetUrl(p.cover)}
                  alt={pickLocale(p.title, locale)}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 border border-gold/60 bg-bg/60 px-2 py-0.5 text-[0.5rem] tracking-[0.2em] text-gold backdrop-blur-sm">
                  {p.status === 'concept'
                    ? tCommon('conceptProject')
                    : tCommon('clientWork')}
                </span>
              </div>
              <h2 className="font-display mt-4 text-2xl text-ivory">
                {pickLocale(p.title, locale)}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-soft">
                {pickLocale(p.summary, locale)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
