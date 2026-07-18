import type { ReactNode } from 'react';
import { getAsset, getAssetAlt, assetUrl } from '@/lib/assets';
import {
  getFeaturedAiModels,
  getServices,
  pickLocale,
  type SectionEntry
} from '@/lib/content';
import { HeroSection } from './HeroSection';
import { ManifestoSection } from './ManifestoSection';
import { AIModelsSection } from './AIModelsSection';
import { RealTalentSection } from './RealTalentSection';
import { MeridianSection } from './MeridianSection';
import { ServicesSection } from './ServicesSection';
import { ContactSection } from './ContactSection';
import { EndingSection } from './EndingSection';

/**
 * セクションレジストリ(docs/20 2章)
 * data/home-sections.json の component キー → 実装のマッピング。
 * データやスロットが空のセクションはnullを返し、自動で非表示になる。
 */
export function renderSection(entry: SectionEntry, locale: string): ReactNode {
  switch (entry.component) {
    case 'hero': {
      const desktop = getAsset('hero.desktop');
      const mobile = getAsset('hero.mobile');
      return (
        <HeroSection
          key={entry.id}
          desktop={
            desktop
              ? { src: assetUrl(desktop.src), poster: assetUrl(desktop.poster ?? '') }
              : undefined
          }
          mobile={
            mobile
              ? { src: assetUrl(mobile.src), poster: assetUrl(mobile.poster ?? '') }
              : undefined
          }
          alt={getAssetAlt(desktop, locale)}
        />
      );
    }

    case 'manifesto':
      return <ManifestoSection key={entry.id} />;

    case 'aiModels': {
      const models = getFeaturedAiModels().map((m) => ({
        slug: m.slug,
        name: m.displayName,
        posterUrl: assetUrl(m.videoPoster ?? m.portrait),
        videoUrl: m.video ? assetUrl(m.video) : undefined,
        categories: m.categories,
        focalX: m.focalX ?? 0.5
      }));
      if (models.length < (entry.minItems ?? 1)) return null;
      return <AIModelsSection key={entry.id} models={models} />;
    }

    case 'realTalent': {
      const studio = getAsset('realTalent.studio');
      const backstage = getAsset('realTalent.backstage');
      const items = [studio, backstage]
        .filter((a): a is NonNullable<typeof a> => Boolean(a))
        .map((a, i) => ({
          src: assetUrl(a.src),
          poster: assetUrl(a.poster ?? ''),
          alt: getAssetAlt(a, locale),
          caption: i === 0 ? 'ON SET' : 'BACKSTAGE'
        }));
      if (items.length === 0) return null;
      return <RealTalentSection key={entry.id} items={items} />;
    }

    case 'hybridMeridian': {
      const real = getAsset('meridian.real');
      const digital = getAsset('meridian.digital');
      if (!real || !digital) return null;
      return (
        <MeridianSection
          key={entry.id}
          realUrl={assetUrl(real.src)}
          digitalUrl={assetUrl(digital.src)}
          realAlt={getAssetAlt(real, locale)}
          digitalAlt={getAssetAlt(digital, locale)}
        />
      );
    }

    case 'services': {
      const services = getServices().map((s) => ({
        id: s.id,
        title: pickLocale(s.title, locale),
        short: pickLocale(s.short, locale)
      }));
      if (services.length === 0) return null;
      return <ServicesSection key={entry.id} services={services} />;
    }

    case 'contact':
      return <ContactSection key={entry.id} />;

    case 'endingSeal':
      return <EndingSection key={entry.id} />;

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[registry] unknown section component: ${entry.component}`);
      }
      return null;
  }
}
