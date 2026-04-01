import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/i18n/translations';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Keep admin namespace outside locale routing.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.next();
  }

  // Check if locale is in pathname
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Redirect non-locale paths to default locale
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, _vercel, api, static files, images)
    '/((?!_next|_vercel|api|.*\\..*|public).*)',
  ],
};
