'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/performance';

export type ServiceCard = {
  id: string;
  title: string;
  short: string;
};

export function ServicesSection({ services }: { services: ServiceCard[] }) {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;
      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true
          }
        }
      );
    },
    { scope: sectionRef }
  );

  if (services.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative py-24 md:py-36" data-section="services">
      <div className="mx-auto max-w-6xl px-6">
        <p className="section-kicker">{t('kicker')}</p>
        <h2 className="font-display mt-4 text-3xl text-ivory md:text-5xl">{t('title')}</h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="service-card glass-panel group p-7 transition-colors duration-500 hover:border-gold/50"
            >
              <span className="font-display text-sm text-gold/80">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display mt-4 text-xl text-ivory">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-soft">{s.short}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
