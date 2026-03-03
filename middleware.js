import { NextResponse } from 'next/server';

const countryToLocale = {
  // English-speaking countries
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IN: 'en', SG: 'en',
  IE: 'en', ZA: 'en', NG: 'en', PH: 'en', KE: 'en',
  // French-speaking countries
  FR: 'fr', BE: 'fr', CH: 'fr', CM: 'fr', CI: 'fr', SN: 'fr',
  MA: 'fr', TN: 'fr', DZ: 'fr', HT: 'fr',
  // Spanish-speaking countries
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es',
  CL: 'es', EC: 'es', GT: 'es', CU: 'es', DO: 'es', BO: 'es',
  HN: 'es', PY: 'es', SV: 'es', NI: 'es', PA: 'es', UY: 'es',
  // Arabic-speaking countries
  AE: 'ar', SA: 'ar', EG: 'ar', IQ: 'ar', JO: 'ar', KW: 'ar',
  LB: 'ar', LY: 'ar', MA: 'ar', OM: 'ar', QA: 'ar', SY: 'ar',
  TN: 'ar', YE: 'ar', BH: 'ar', SD: 'ar', DZ: 'ar',
  // Chinese-speaking regions
  CN: 'zh', HK: 'zh', MO: 'zh', TW: 'zh', SG: 'zh',
  // Japanese-speaking country
  JP: 'ja'
};

const supportedLocales = ['en', 'fr', 'es', 'ar', 'zh', 'ja'];

function getLocaleFromCountryCode(code) {
  return countryToLocale[code] || 'en';
}

export async function middleware(request) {
  const { pathname, locale } = request.nextUrl;

  // ✅ Admin route protection — redirect to /login if no auth cookie
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ✅ Ignore static assets & API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  // ✅ Already has supported locale like /en, /ar etc — skip redirect
  if (supportedLocales.some(locale => pathname.startsWith(`/${locale}`))) {
    return NextResponse.next();
  }
   // ✅ Redirect only on first visit to `/`, and if not redirected before
  const geoCookie = request.cookies.get('geoRedirectDone');

  // ✅ Only run on root `/`
  if (pathname === '/' && !geoCookie) {
    try {
      const geoRes = await fetch(`${request.nextUrl.origin}/api/geo`);
      const geo = await geoRes.json();
      const userLocale = getLocaleFromCountryCode(geo.countryCode);

      const redirectUrl = new URL(`/${userLocale}`, request.url);
      const response = NextResponse.redirect(redirectUrl);
      // ✅ Set cookie so that next time we don't redirect again
      response.cookies.set('geoRedirectDone', 'true', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    } catch (err) {
      // Geo redirect failed - fallback to English
      return NextResponse.redirect(new URL('/en', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/((?!_next|api|.*\\..*).*)',
  ],
};
