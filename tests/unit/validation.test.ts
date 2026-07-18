import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/validation';

const base = {
  name: 'Test User',
  email: 'test@example.com',
  type: 'corporate' as const,
  message: 'This is a valid message of enough length.',
  consent: true as const
};

describe('contactSchema', () => {
  it('accepts a valid submission', () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });

  it('rejects an empty name', () => {
    expect(contactSchema.safeParse({ ...base, name: '' }).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(contactSchema.safeParse({ ...base, email: 'nope' }).success).toBe(false);
  });

  it('rejects a short message', () => {
    expect(contactSchema.safeParse({ ...base, message: 'short' }).success).toBe(false);
  });

  it('requires consent to be true', () => {
    expect(
      contactSchema.safeParse({ ...base, consent: false }).success
    ).toBe(false);
  });

  it('passes validation with honeypot filled (API drops it separately)', () => {
    const parsed = contactSchema.safeParse({
      ...base,
      company_website: 'http://spam'
    });
    expect(parsed.success).toBe(true);
  });
});
