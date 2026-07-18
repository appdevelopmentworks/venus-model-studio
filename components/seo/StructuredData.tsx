import { SITE_URL } from '@/lib/metadata';
import siteJson from '@/data/site.json';

/**
 * Organization と WebSite の構造化データ。
 * 架空AIモデルをPersonとして実在人物のように示すことはしない(docs/12 3章)。
 */
export function StructuredData({ locale }: { locale: string }) {
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: siteJson.brand,
      url: SITE_URL,
      email: siteJson.contactEmail,
      description:
        'Hybrid model studio integrating AI models, real models and cinematic production.'
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/${locale}`,
      name: siteJson.brand,
      inLanguage: locale,
      publisher: { '@id': `${SITE_URL}/#organization` }
    }
  ];

  const json = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <script
      type="application/ld+json"
      // 静的な自前データのみ。外部入力を含まない
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
