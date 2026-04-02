// pages/register.js
//'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Login from '@/components/Auth/Login';
import Register from '@/components/Auth/Register';
import { useTranslations } from 'next-intl';
import { IntlProvider } from 'next-intl';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Seo from '@/components/common/Seo';
import { useAuth } from '@/context/AuthContext';

// ✅ This receives messages and locale
export default function RegisterPage({ messages, locale }) {
  const [showLogin, setShowLogin] = useState(false);
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setShowLogin(params.get('action') === 'login');
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace('/profile');
    }
  }, [isLoggedIn, isLoading, router]);

  const t = useTranslations('auth');

  if (isLoading || isLoggedIn) return null;

  return (
    <>
    <Seo noindex title="Register | GREENEYE" />
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
      scriptProps={{ async: true, defer: true, appendTo: "head" }}
    >
      <IntlProvider locale={locale} messages={messages}>
        <div className="auth-container">
          <div className="auth-wrapper">
            <div
              className="auth-section"
              id="registerSection"
              style={{ display: showLogin ? 'none' : 'block' }}
            >
              <Register onSwitch={() => setShowLogin(true)} />
            </div>
            <div
              className="auth-section"
              id="loginSection"
              style={{ display: showLogin ? 'block' : 'none' }}
            >
              <Login />
              <div className="auth-switch">
                <p>
                  {t('noAccount')}{" "}
                  <button className="link-btn" onClick={() => setShowLogin(false)}>
                    {t('signUp')}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </IntlProvider>
    </GoogleReCaptchaProvider>
    </>
  );
}

// ✅ Correctly fetch messages and locale from getStaticProps
export async function getStaticProps({ locale }) {
  return {
    props: {
      locale,
      messages: require(`../locales/${locale}.json`)
    }
  };
}
