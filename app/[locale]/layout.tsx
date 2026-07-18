import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import {
  Cormorant_Garamond,
  Instrument_Sans,
  Noto_Sans_JP,
  Shippori_Mincho_B1
} from 'next/font/google';
import { routing } from '@/i18n/routing';
import { SITE_URL, buildAlternates, DEFAULT_OG_IMAGE } from '@/lib/metadata';
import { StructuredData } from '@/components/seo/StructuredData';
import { SignatureCursor } from '@/components/interactions/SignatureCursor';
import { QualityProvider } from '@/components/providers/QualityProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import '../globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap'
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap'
});

const notoJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-jp',
  display: 'swap'
});

const shippori = Shippori_Mincho_B1({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-shippori',
  display: 'swap',
  preload: false
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: '%s — Venus Model Studio'
    },
    description: t('description'),
    alternates: buildAlternates(locale, ''),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}`,
      siteName: 'Venus Model Studio',
      type: 'website',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }]
    },
    twitter: { card: 'summary_large_image', images: [DEFAULT_OG_IMAGE] },
    robots: { index: true, follow: true }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${instrument.variable} ${notoJp.variable} ${shippori.variable}`}
    >
      <body className="grain">
        <StructuredData locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <QualityProvider>
            <SmoothScrollProvider>
              <SignatureCursor />
              <SiteHeader />
              <main className="relative z-10">{children}</main>
              <SiteFooter />
            </SmoothScrollProvider>
          </QualityProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
