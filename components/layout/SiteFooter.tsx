import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function SiteFooter() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="relative border-t border-white/10 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg tracking-[0.25em] text-ivory">VENUS</p>
          <p className="mt-1 text-[0.55rem] tracking-[0.35em] text-gold uppercase">
            Model Studio
          </p>
          <p className="mt-6 max-w-xs text-xs leading-relaxed text-soft">
            {t('note')}
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-12 gap-y-3" aria-label="Footer">
          {(
            [
              ['models', '/models'],
              ['services', '/services'],
              ['projects', '/projects'],
              ['forTalents', '/for-talents'],
              ['about', '/about'],
              ['contact', '/contact']
            ] as const
          ).map(([key, href]) => (
            <Link
              key={key}
              href={href}
              className="link-venus text-xs tracking-[0.15em] text-soft uppercase hover:text-ivory"
            >
              {tNav(key)}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-12 max-w-6xl px-6">
        <hr className="gold-hairline" />
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.6rem] tracking-[0.2em] text-soft/70">
            {t('rights', { year: new Date().getFullYear() })}
          </p>
          <nav className="flex gap-6" aria-label="Legal">
            <Link
              href="/privacy"
              className="link-venus text-[0.6rem] tracking-[0.15em] text-soft/70 uppercase hover:text-ivory"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/terms"
              className="link-venus text-[0.6rem] tracking-[0.15em] text-soft/70 uppercase hover:text-ivory"
            >
              {t('terms')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
