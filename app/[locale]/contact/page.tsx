import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/forms/ContactForm';
import siteJson from '@/data/site.json';
import { buildMetadata } from '@/lib/metadata';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  return buildMetadata({
    locale,
    path: '/contact',
    title: t('title'),
    description: t('intro')
  });
}

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const contactEmail = siteJson.contactEmail;

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-24">
      <p className="section-kicker">{t('kicker')}</p>
      <h1 className="font-display mt-4 text-4xl text-ivory md:text-6xl">{t('title')}</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-soft">{t('intro')}</p>
      <hr className="gold-hairline mt-10" />

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-[0.7rem] tracking-[0.15em] text-soft uppercase">Email</p>
          <a
            href={`mailto:${contactEmail}`}
            className="link-venus mt-2 inline-block text-sm text-ivory"
          >
            {contactEmail}
          </a>
        </div>
        <ContactForm contactEmail={contactEmail} />
      </div>
    </div>
  );
}
