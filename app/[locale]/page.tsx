import { setRequestLocale } from 'next-intl/server';
import { getHomeSections } from '@/lib/content';
import { getAsset, assetUrl } from '@/lib/assets';
import { renderSection } from '@/components/sections/registry';
import { HomeExperience } from '@/components/home/HomeExperience';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sections = getHomeSections();
  const heroPoster = getAsset('hero.desktop')?.poster;

  return (
    <>
      <HomeExperience
        heroPosterUrl={heroPoster ? assetUrl(heroPoster) : undefined}
      />
      {sections.map((entry) => renderSection(entry, locale))}
    </>
  );
}
