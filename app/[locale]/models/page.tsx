import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPublishedModels } from '@/lib/content';
import { assetUrl } from '@/lib/assets';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });
  return buildMetadata({
    locale,
    path: '/models',
    title: tNav('models'),
    description: tMeta('description')
  });
}

export default async function ModelsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const models = getPublishedModels();

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <h1 className="font-display text-4xl text-ivory md:text-6xl">{t('models')}</h1>
      <hr className="gold-hairline mt-8" />
      <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
        {models.map((m) => (
          <Link
            key={m.slug}
            href={`/${locale}/models/${m.slug}`}
            className="group"
          >
            <div className="relative aspect-[3/5] overflow-hidden bg-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetUrl(m.videoPoster ?? m.portrait)}
                alt={m.displayName}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: `${(m.focalX ?? 0.5) * 100}% 50%` }}
                loading="lazy"
              />
              <span className="absolute top-3 left-3 border border-gold/60 bg-bg/60 px-2 py-0.5 text-[0.5rem] tracking-[0.2em] text-gold backdrop-blur-sm">
                {m.type === 'ai'
                  ? tCommon('aiModel')
                  : m.type === 'real'
                    ? tCommon('realModel')
                    : tCommon('aiEnhanced')}
              </span>
            </div>
            <div className="mt-3">
              <p className="font-display text-lg text-ivory">{m.displayName}</p>
              <p className="text-[0.6rem] tracking-[0.2em] text-soft uppercase">
                {m.categories.join(' / ')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
