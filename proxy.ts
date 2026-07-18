import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16: middleware.ts → proxy.ts。next-intlのハンドラをdefault exportする。
// proxyはnodejsランタイムで動作する(edgeは非対応)。
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|assets|.*\\..*).*)'
};
