import { getTranslations } from 'next-intl/server';

/**
 * プライバシー・利用規約の共通レンダラー。
 * 本文は messages の legal namespace から取得する。
 */
export async function LegalPage({
  locale,
  kind
}: {
  locale: string;
  kind: 'privacy' | 'terms';
}) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const title = kind === 'privacy' ? t('privacyTitle') : t('termsTitle');
  const body = kind === 'privacy' ? t('privacyBody') : t('termsBody');

  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <h1 className="font-display text-3xl text-ivory md:text-5xl">{title}</h1>
      <p className="mt-3 text-[0.65rem] tracking-[0.2em] text-soft/70 uppercase">
        {t('lastUpdated')}: 2026-07-18
      </p>
      <hr className="gold-hairline mt-8" />
      <p className="mt-8 text-sm leading-loose text-ivory/85">{body}</p>
    </div>
  );
}
