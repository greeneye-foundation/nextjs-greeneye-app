// pages/register.js
//'use client';
import { useState, useEffect } from 'react';
import Login from '@/components/Auth/Login';
import Register from '@/components/Auth/Register';
import { useTranslations } from 'next-intl';
import { IntlProvider } from 'next-intl';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// ✅ This receives messages and locale
export default function RegisterPage({ messages, locale }) {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setShowLogin(params.get('action') === 'login');
    }
  }, []);

  const t = useTranslations('auth'); // Optional: For switching text

  return (
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
