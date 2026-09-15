import { defineMiddleware } from 'astro:middleware';

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' https://api.trustedform.com https://cdn.trustedform.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: https://api.trustedform.com https://cdn.trustedform.com",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://api.trustedform.com https://cdn.trustedform.com",
  "style-src 'self' 'unsafe-inline'",
  "upgrade-insecure-requests",
].join('; ');

export const onRequest = defineMiddleware(async ({ url }, next) => {
  const response = await next();
  const headers = new Headers(response.headers);
  headers.set('content-security-policy', contentSecurityPolicy);
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('x-frame-options', 'DENY');
  headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains');
  if (/^\/sitemap(?:-index|-\d+)\.xml$/.test(url.pathname)) {
    headers.set('content-type', 'application/xml; charset=utf-8');
  }
  if (url.pathname.startsWith('/api/')) {
    headers.set('cache-control', 'no-store, max-age=0');
    headers.set('pragma', 'no-cache');
    headers.set('x-robots-tag', 'noindex, nofollow, noarchive');
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
});
