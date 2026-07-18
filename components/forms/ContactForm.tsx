'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { contactSchema } from '@/lib/validation';

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldErrors = Partial<Record<'name' | 'email' | 'message' | 'consent', string>>;

export function ContactForm({ contactEmail }: { contactEmail: string }) {
  const t = useTranslations('contactPage');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState({
    name: '',
    organization: '',
    email: '',
    type: 'corporate' as 'corporate' | 'talent' | 'other',
    message: '',
    consent: false,
    company_website: ''
  });

  const set = <K extends keyof typeof values>(key: K, v: (typeof values)[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const openMailto = () => {
    const subject = `[Venus] ${values.type} enquiry from ${values.name}`;
    const bodyLines = [
      `Type: ${values.type}`,
      `Name: ${values.name}`,
      `Organization: ${values.organization || '-'}`,
      `Email: ${values.email}`,
      '',
      values.message
    ];
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
  };

  const validate = (): boolean => {
    const parsed = contactSchema.safeParse(values);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const next: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === 'name') next.name = t('errors.name');
      else if (field === 'email') next.email = t('errors.email');
      else if (field === 'message') next.message = t('errors.message');
      else if (field === 'consent') next.consent = t('errors.consent');
    }
    setErrors(next);
    return false;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus('error');
        return;
      }
      if (data.mode === 'mailto') openMailto();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="glass-panel p-8" role="status" aria-live="polite">
        <h2 className="font-display text-2xl text-ivory">{t('successTitle')}</h2>
        <p className="mt-3 text-sm leading-relaxed text-soft">{t('success')}</p>
      </div>
    );
  }

  const fieldClass =
    'mt-2 w-full border-b border-white/20 bg-transparent py-2 text-sm text-ivory outline-none transition-colors focus:border-gold';
  const labelClass = 'block text-[0.7rem] tracking-[0.15em] text-soft uppercase';

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl">
      {/* honeypot: 視覚・支援技術から隠す */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company_website}
            onChange={(e) => set('company_website', e.target.value)}
          />
        </label>
      </div>

      <fieldset className="mb-8">
        <legend className={labelClass}>{t('typeLabel')}</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {(['corporate', 'talent', 'other'] as const).map((type) => (
            <label
              key={type}
              className={`cursor-pointer border px-4 py-2 text-[0.7rem] tracking-[0.1em] transition-colors ${
                values.type === type
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-white/20 text-soft hover:border-white/40'
              }`}
            >
              <input
                type="radio"
                name="type"
                value={type}
                checked={values.type === type}
                onChange={() => set('type', type)}
                className="sr-only"
              />
              {t(
                type === 'corporate'
                  ? 'typeCorporate'
                  : type === 'talent'
                    ? 'typeTalent'
                    : 'typeOther'
              )}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClass}>
            {t('nameLabel')}
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'err-name' : undefined}
            className={fieldClass}
          />
          {errors.name && (
            <p id="err-name" className="mt-1 text-xs text-rose">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="org" className={labelClass}>
            {t('orgLabel')}
          </label>
          <input
            id="org"
            type="text"
            value={values.organization}
            onChange={(e) => set('organization', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            {t('emailLabel')}
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'err-email' : undefined}
            className={fieldClass}
          />
          {errors.email && (
            <p id="err-email" className="mt-1 text-xs text-rose">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            {t('messageLabel')}
          </label>
          <textarea
            id="message"
            rows={5}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'err-message' : undefined}
            className={`${fieldClass} resize-y`}
          />
          {errors.message && (
            <p id="err-message" className="mt-1 text-xs text-rose">
              {errors.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-ivory/85">
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(e) => set('consent', e.target.checked)}
              aria-invalid={!!errors.consent}
              className="mt-1 accent-[#d6b36a]"
            />
            <span>{t('consentLabel')}</span>
          </label>
          {errors.consent && (
            <p className="mt-1 text-xs text-rose">{errors.consent}</p>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-soft/70">{t('mailtoNote')}</p>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-venus mt-6 disabled:opacity-50"
      >
        {status === 'sending' ? t('sending') : t('submit')}
      </button>

      <div aria-live="polite" className="mt-4">
        {status === 'error' && (
          <div role="alert">
            <p className="text-sm text-rose">{t('errorTitle')}</p>
            <p className="text-xs text-soft">{t('error')}</p>
          </div>
        )}
      </div>
    </form>
  );
}
