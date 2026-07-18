import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ja', 'en', 'ru', 'zh-CN', 'ko'],
  defaultLocale: 'ja'
});

export type Locale = (typeof routing.locales)[number];
