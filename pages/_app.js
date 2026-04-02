// pages/_app.js
import '@/styles/design-system.css';
import '@/styles/navbar.css';
import '@/styles/footer.css';
import '@/styles/globals.css';
import '@/styles/auth-styles.css';
import '@/styles/admin.css';
import '@/styles/legal-styles.css';
import '@/styles/aqi-widget.css';
import '@/styles/plant-gifting-hero.css';
import '@/styles/hero-carousel.css';
import '@/styles/gift-tree.css';
import '@/styles/occasion-selector.css';
import '@/styles/shop-submenu.css';
import '@/styles/shop-collections.css';
import '@/styles/modal.css';
import '@/styles/loading-bar.css';
import '@/styles/relocate-tree-hero.css';
import '@/styles/relocate-tree-page.css';
import '@/styles/checkout.css';
import '@/styles/tree-tracking.css';
import '@/styles/forest.css';
import '@/styles/certificate-verify.css';
import '@/styles/home.css';
import '@/styles/plantshop.css';
import '@/styles/cart.css';
import '@/styles/profile.css';
import '@/styles/contact.css';
import '@/styles/not-found.css';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { IntlProvider } from 'next-intl';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from '@/components/Layout';
import Notification from '@/components/Notification';
import BackToTop from '@/components/BackToTop';
import LoadingBar from '@/components/LoadingBar';
import Script from 'next/script';
import { AuthProvider } from '@/context/AuthContext';

// Supported locales:
const SUPPORTED = ['en', 'fr', 'es', 'ar', 'zh', 'ja', 'hi'];

function getPathLocale(asPath) {
  // "/ar/..." -> "ar"
  const first = asPath?.split('?')[0]?.split('#')[0]?.split('/')?.[1] || '';
  return SUPPORTED.includes(first) ? first : null;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname?.startsWith('/admin');

  // 1) initial messages/locale from pageProps
  const initialMessages = useMemo(
    () => (pageProps.messages ?? null),
    [pageProps.messages]
  );
  const initialLocale =
    pageProps.locale ||
    router.locale || // Next i18n locale (if use)
    getPathLocale(router.asPath) || // URL prefix
    'en';

  const [messages, setMessages] = useState(initialMessages);
  const [locale, setLocale] = useState(initialLocale);

  // 2) Route/locale change detect then load messages reload trigger
  useEffect(() => {
    const nextLocale = router.locale || getPathLocale(router.asPath) || 'en';
    if (nextLocale !== locale) {
      setLocale(nextLocale);
      setMessages(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, router.locale]);

  // Meta Pixel Init + PageView
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.fbq) {
        // INIT PIXEL
        window.fbq('init', '1115975143739370');
        window.fbq('track', 'PageView');

        clearInterval(interval);
      }
    }, 200);

    // Track route changes
    const handleRouteChange = () => {
      if (window.fbq) window.fbq('track', 'PageView');
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      clearInterval(interval);
    };
  }, [router.events]);


  // 3)If message missing then load dynamic (According to local)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (messages == null) {
        try {
          const mod = await import(`../locales/${locale}.json`);
          if (!cancelled) setMessages(mod.default ?? mod);
        } catch (e) {
          // fallback to English if missing
          try {
            const mod = await import(`../locales/en.json`);
            if (!cancelled) {
              setMessages(mod.default ?? mod);
              setLocale('en');
            }
          } catch {
            if (!cancelled) setMessages({}); // last resort
          }
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [messages, locale]);

  if (messages == null) return null;

  return (
    <>
      {/* Loading Bar for route transitions */}
      <LoadingBar />

      {/* ✅ Google Analytics (gtag.js) */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* ✅ Google OAuth Provider */}
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
        <AuthProvider>
          {/* ✅ Internationalization + Layout */}
          <IntlProvider
            messages={messages}
            locale={locale}
            defaultLocale="en"
            getMessageFallback={({ key /*, namespace*/ }) => key}
            onError={(err) => {
              if (
                err.code === 'MISSING_MESSAGE' ||
                err.code === 'ENVIRONMENT_FALLBACK'
              ) {
                if (process.env.NODE_ENV === 'development') return;
              }
            }}
          >
            {isAdminRoute ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <Notification />
                <Component {...pageProps} />
                <BackToTop />
              </Layout>
            )}
          </IntlProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}
