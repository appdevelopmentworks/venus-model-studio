import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getModel, getPublishedModels, pickLocale } from '@/lib/content';
import { assetUrl } from '@/lib/assets';
import { buildMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return getPublishedModels().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const model = getModel(slug);
  if (!model) return {};
  return buildMetadata({
    locale,
    path: `/models/${slug}`,
    title: model.displayName,
    description: pickLocale(model.bio, locale),
    images: [assetUrl(model.videoPoster ?? model.portrait)]
  });
}

export default async function ModelDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const model = getModel(slug);
  if (!model) notFound();

  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const tContact = await getTranslations({ locale, namespace: 'contact' });
  const capabilities =
    model.capabilities[locale] ?? model.capabilities.en ?? model.capabilities.ja ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden bg-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetUrl(model.videoPoster ?? model.portrait)}
            alt={model.displayName}
            className="h-full w-full object-cover"
            style={{ objectPosition: `${(model.focalX ?? 0.5) * 100}% 50%` }}
          />
        </div>
        <div>
          <span className="border border-gold/60 px-2 py-0.5 text-[0.55rem] tracking-[0.2em] text-gold">
            {model.type === 'ai'
              ? tCommon('aiModel')
              : model.type === 'real'
                ? tCommon('realModel')
                : tCommon('aiEnhanced')}
          </span>
          <h1 className="font-display mt-5 text-5xl text-ivory md:text-7xl">
            {model.displayName}
          </h1>
          <p className="mt-2 text-[0.65rem] tracking-[0.25em] text-soft uppercase">
            {model.categories.join(' / ')}
          </p>
          <hr className="gold-hairline mt-8" />
          <p className="mt-8 max-w-md text-sm leading-relaxed text-soft">
            {pickLocale(model.bio, locale)}
          </p>
          {capabilities.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {capabilities.map((c) => (
                <li
                  key={c}
                  className="border border-white/15 px-3 py-1 text-[0.65rem] tracking-[0.15em] text-ivory/85"
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
          <Link href={`/${locale}/contact`} className="btn-venus mt-12">
            {tContact('cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
