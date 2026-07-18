'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { ConstellationBackdrop } from './ConstellationBackdrop';

const NAV_ITEMS = [
  { key: 'models', href: '/models' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'forTalents', href: '/for-talents' },
  { key: 'about', href: '/about' }
] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // メニュー展開中は背面スクロールを止める
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || menuOpen
          ? 'bg-bg/75 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-baseline gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <span className="font-display text-lg tracking-[0.25em] text-ivory">
            VENUS
          </span>
          <span className="hidden text-[0.55rem] tracking-[0.35em] text-gold uppercase sm:inline">
            Model Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`link-venus text-[0.7rem] tracking-[0.2em] uppercase ${
                pathname.startsWith(item.href) ? 'text-gold' : 'text-ivory/85'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="/contact"
            className="border border-gold/50 px-4 py-2 text-[0.65rem] tracking-[0.2em] text-gold uppercase transition-colors hover:bg-gold/10"
          >
            {t('contact')}
          </Link>

          {/* Locale switcher */}
          <div className="flex items-center gap-2" aria-label="Language">
            {routing.locales.map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                className={`text-[0.6rem] tracking-widest uppercase ${
                  l === locale ? 'text-gold' : 'text-soft/70 hover:text-ivory'
                }`}
              >
                {l === 'zh-CN' ? 'ZH' : l.toUpperCase()}
              </Link>
            ))}
          </div>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t('close') : t('menu')}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`block h-px w-6 bg-ivory transition-transform ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`}
          />
          <span
            className={`block h-px w-6 bg-ivory transition-transform ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`}
          />
        </button>
      </div>
    </header>

    {/* モバイルメニュー(S6 Constellation Index)。headerの外に出し、独立した重なり順にする */}
    {menuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-lg md:hidden">
          <ConstellationBackdrop />
          <nav
            className="relative flex flex-col gap-6 px-8 py-10"
            aria-label="Mobile"
          >
            {[...NAV_ITEMS, { key: 'contact', href: '/contact' } as const].map(
              (item, i) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-baseline gap-4 font-display text-2xl text-ivory"
                >
                  <span aria-hidden="true" className="text-xs text-gold/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t(item.key)}
                </Link>
              )
            )}
            <div className="mt-6 flex gap-4">
              {routing.locales.map((l) => (
                <Link
                  key={l}
                  href={pathname}
                  locale={l}
                  onClick={() => setMenuOpen(false)}
                  className={`text-xs tracking-widest uppercase ${
                    l === locale ? 'text-gold' : 'text-soft'
                  }`}
                >
                  {l === 'zh-CN' ? 'ZH' : l.toUpperCase()}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
