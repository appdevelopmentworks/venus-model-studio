import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getServices, pickLocale } from '@/lib/content';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'servicesPage' });
  return buildMetadata({
    locale,
    path: '/services',
    title: t('title'),
    description: t('intro')
  });
}

export default async function ServicesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'servicesPage' });
  const services = getServices();

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="section-kicker">{t('kicker')}</p>
      <h1 className="font-display mt-4 text-4xl text-ivory md:text-6xl">{t('title')}</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-soft">{t('intro')}</p>
      <hr className="gold-hairline mt-10" />

      <div className="mt-14 space-y-px">
        {services.map((s, i) => (
          <article
            key={s.id}
            className="group grid gap-4 border-b border-white/10 py-10 md:grid-cols-[auto_1fr_2fr] md:gap-10"
          >
            <span className="font-display text-2xl text-gold/70">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 className="font-display text-2xl text-ivory">
              {pickLocale(s.title, locale)}
            </h2>
            <div>
              <p className="text-sm leading-relaxed text-ivory/85">
                {pickLocale(s.short, locale)}
              </p>
              {s.detail && (
                <p className="mt-4 text-sm leading-relaxed text-soft">
                  {pickLocale(s.detail, locale)}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <Link href={`/${locale}/contact`} className="btn-venus mt-14">
        {t('cta')}
      </Link>
    </div>
  );
}
