import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getProject, getPublishedProjects, pickLocale } from '@/lib/content';
import { assetUrl } from '@/lib/assets';
import { buildMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return getPublishedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    locale,
    path: `/projects/${slug}`,
    title: pickLocale(project.title, locale),
    description: pickLocale(project.summary, locale),
    images: [assetUrl(project.cover)]
  });
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: 'projectsPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const tContact = await getTranslations({ locale, namespace: 'contact' });

  const sections = [
    { key: 'challenge', body: project.challenge },
    { key: 'approach', body: project.approach },
    { key: 'human', body: project.humanContribution },
    { key: 'ai', body: project.aiContribution }
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-24">
      <Link
        href={`/${locale}/projects`}
        className="link-venus text-[0.65rem] tracking-[0.25em] text-soft uppercase"
      >
        ← {tCommon('backTo')}
      </Link>

      <span className="mt-8 inline-block border border-gold/60 px-2 py-0.5 text-[0.55rem] tracking-[0.2em] text-gold">
        {project.status === 'concept'
          ? tCommon('conceptProject')
          : tCommon('clientWork')}
      </span>
      <h1 className="font-display mt-5 text-4xl text-ivory md:text-6xl">
        {pickLocale(project.title, locale)}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-soft">
        {pickLocale(project.summary, locale)}
      </p>

      <div className="relative mt-12 aspect-video overflow-hidden bg-panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetUrl(project.cover)}
          alt={pickLocale(project.title, locale)}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        {sections.map(
          ({ key, body }) =>
            body && (
              <div key={key}>
                <h2 className="section-kicker">{t(key)}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ivory/85">
                  {pickLocale(body, locale)}
                </p>
              </div>
            )
        )}
      </div>

      <Link href={`/${locale}/contact`} className="btn-venus mt-16">
        {tContact('cta')}
      </Link>
    </div>
  );
}
