import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import siteJson from '@/data/site.json';
import { pickLocale } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  return buildMetadata({
    locale,
    path: '/about',
    title: t('title'),
    description: t('lead')
  });
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'aboutPage' });

  const principles = t.raw('principles') as string[];
  const locationScope = pickLocale(
    siteJson.locationScope as Record<string, string>,
    locale
  );

  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
      <p className="section-kicker">{t('kicker')}</p>
      <h1 className="font-display mt-4 text-4xl leading-tight text-ivory md:text-6xl">
        {t('title')}
      </h1>
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-ivory/90">
        {t('lead')}
      </p>
      <hr className="gold-hairline mt-12" />

      <section className="mt-12">
        <h2 className="section-kicker">{t('positionTitle')}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-soft">
          {t('position')}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="section-kicker">{t('principleTitle')}</h2>
        <ul className="mt-6 space-y-4">
          {principles.map((p, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span className="text-sm leading-relaxed text-ivory/85">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-16 text-[0.7rem] tracking-[0.25em] text-soft uppercase">
        {locationScope}
      </p>
    </div>
  );
}
