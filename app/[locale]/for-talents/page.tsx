import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'forTalentsPage' });
  return buildMetadata({
    locale,
    path: '/for-talents',
    title: t('title'),
    description: t('intro')
  });
}

export default async function ForTalentsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'forTalentsPage' });

  const benefits = t.raw('benefits') as string[];
  const flow = t.raw('flow') as string[];

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-24">
      <p className="section-kicker">{t('kicker')}</p>
      <h1 className="font-display mt-4 text-4xl text-ivory md:text-6xl">{t('title')}</h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-soft">{t('intro')}</p>
      <hr className="gold-hairline mt-10" />

      <section className="mt-14">
        <h2 className="section-kicker">{t('benefitsTitle')}</h2>
        <ul className="mt-6 space-y-4">
          {benefits.map((b, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-display text-gold/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm leading-relaxed text-ivory/85">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass-panel mt-12 p-8">
        <h2 className="section-kicker">{t('rightsTitle')}</h2>
        <p className="mt-4 text-sm leading-relaxed text-ivory/85">{t('rights')}</p>
      </section>

      <section className="mt-12">
        <h2 className="section-kicker">{t('flowTitle')}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flow.map((step, i) => (
            <li key={i} className="border-t border-gold/30 pt-4">
              <span className="font-display text-2xl text-gold/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-ivory/85">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <Link href={`/${locale}/contact`} className="btn-venus mt-14">
        {t('cta')}
      </Link>
    </div>
  );
}
