//'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Login from '@/components/Auth/Login';
import { useTranslations } from 'next-intl';
import { IntlProvider } from 'next-intl';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Seo from '@/components/common/Seo';
import { useAuth } from '@/context/AuthContext';

// Export getStaticProps to fetch translation messages
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`)
    }
  };
}

// Accept messages as props and pass them to IntlProvider
export default function LoginPage({ messages, locale }) {
  const t = useTranslations('auth');
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace('/profile');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading || isLoggedIn) return null;

  return (
    <>
    <Seo noindex title="Login | GREENEYE" />
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
      scriptProps={{ async: true, defer: true, appendTo: "head" }}
    >
      <IntlProvider messages={messages} locale={locale}>
        <div className="auth-container">
          <div className="auth-wrapper">
            <div className="auth-section" id="loginSection">
              {/* Optional: Pass translations if needed */}
              {/* <Login
              emailLabel={t('email')}
              passwordLabel={t('password')}
              loginButton={t('login')}
              forgotPassword={t('forgotPassword')}
            /> */}
              <Login />
            </div>
          </div>
        </div>
      </IntlProvider>
    </GoogleReCaptchaProvider>
    </>
  );
}
