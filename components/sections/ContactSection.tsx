'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function ContactSection() {
  const t = useTranslations('contact');
  const locale = useLocale();

  return (
    <section className="relative py-24 md:py-36" data-section="contact">
      <div className="mx-auto max-w-6xl px-6">
        <p className="section-kicker">{t('kicker')}</p>
        <h2 className="font-display mt-4 max-w-2xl text-4xl leading-tight text-ivory md:text-6xl">
          {t('title')}
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Link
            href={`/${locale}/contact`}
            className="glass-panel group flex items-center justify-between p-8 transition-colors duration-500 hover:border-gold/60"
          >
            <span className="font-display text-xl text-ivory">{t('corporate')}</span>
            <span className="text-gold transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="glass-panel group flex items-center justify-between p-8 transition-colors duration-500 hover:border-gold/60"
          >
            <span className="font-display text-xl text-ivory">{t('talent')}</span>
            <span className="text-gold transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
