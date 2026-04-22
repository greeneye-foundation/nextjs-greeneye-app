import { useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api/apiClient';
import Seo from '@/components/common/Seo';

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`)
    }
  };
}

const THEME = {
  RESET_EMAIL_SENT:           { bg: '#e8f5e9', border: '#c8e6c9', accent: '#2e7d32', icon: 'fas fa-check-circle' },
  GOOGLE_AUTH_ONLY:           { bg: '#e3f2fd', border: '#bbdefb', accent: '#1565c0', icon: 'fab fa-google' },
  USER_NOT_FOUND:             { bg: '#fff3e0', border: '#ffe0b2', accent: '#e65100', icon: 'fas fa-user-slash' },
  NOTIFICATION_PUBLISH_FAILED:{ bg: '#fdecea', border: '#f5c6c2', accent: '#c62828', icon: 'fas fa-exclamation-triangle' },
};

function Card({ code, title, children, actions }) {
  const t = THEME[code] || THEME.NOTIFICATION_PUBLISH_FAILED;
  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        padding: '24px 20px',
        margin: '20px 0',
        textAlign: 'center',
      }}
    >
      <i
        className={t.icon}
        style={{ color: t.accent, fontSize: 36, marginBottom: 12, display: 'block' }}
      />
      <h3 style={{ color: t.accent, margin: '0 0 10px', fontSize: 18, fontWeight: 600 }}>
        {title}
      </h3>
      <div style={{ color: '#444', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
        {children}
      </div>
      {actions && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
            marginTop: 18,
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
}

function btnStyle({ variant = 'primary', color = '#2e7d32' } = {}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 18px',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.2,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'opacity 0.15s ease, transform 0.15s ease',
  };
  if (variant === 'primary') {
    return { ...base, background: color, color: '#fff', border: `1px solid ${color}` };
  }
  if (variant === 'outline') {
    return { ...base, background: 'transparent', color, border: `1px solid ${color}` };
  }
  return {
    ...base,
    background: 'transparent',
    color,
    border: 'none',
    textDecoration: 'underline',
    padding: '6px 10px',
  };
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const { data } = await apiClient.post('/api/users/forgot-password', { email });
      setResult({ code: data?.code || 'RESET_EMAIL_SENT', message: data?.message });
    } catch (err) {
      const data = err.response?.data;
      setError({
        code: data?.code || 'UNKNOWN',
        message: data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError(null);
    setResult(null);
  };

  const state = result?.code || error?.code || 'FORM';

  return (
    <>
      <Seo noindex title="Forgot Password | GREENEYE" />
      <div className="auth-container">
        <div className="auth-wrapper" style={{ maxWidth: 480 }}>
          <div className="auth-section">
            <div className="auth-form-container">
              <div className="auth-form-header">
                <h2>
                  <i className="fas fa-lock"></i> Forgot Password
                </h2>
                <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {state === 'RESET_EMAIL_SENT' && (
                <Card
                  code="RESET_EMAIL_SENT"
                  title="Check your email"
                  actions={
                    <Link href="/login" style={btnStyle({ variant: 'primary', color: '#2e7d32' })}>
                      <i className="fas fa-arrow-left"></i> Back to Login
                    </Link>
                  }
                >
                  A password reset link has been sent to <strong>{email}</strong>.
                  <br />
                  Please check your inbox and spam folder. The link expires in 1 hour.
                </Card>
              )}

              {state === 'GOOGLE_AUTH_ONLY' && (
                <Card
                  code="GOOGLE_AUTH_ONLY"
                  title="Use Google Sign-In"
                  actions={
                    <>
                      <Link href="/login" style={btnStyle({ variant: 'primary', color: '#1565c0' })}>
                        <i className="fab fa-google"></i> Continue with Google
                      </Link>
                      <button type="button" onClick={resetForm} style={btnStyle({ variant: 'text', color: '#1565c0' })}>
                        Try a different email
                      </button>
                    </>
                  }
                >
                  This account (<strong>{email}</strong>) was created with Google sign-in.
                  <br />
                  There is no password to reset — please continue with Google to log in.
                </Card>
              )}

              {state === 'USER_NOT_FOUND' && (
                <Card
                  code="USER_NOT_FOUND"
                  title="No Account Found"
                  actions={
                    <>
                      <Link href="/register" style={btnStyle({ variant: 'primary', color: '#e65100' })}>
                        <i className="fas fa-user-plus"></i> Sign Up
                      </Link>
                      <button type="button" onClick={resetForm} style={btnStyle({ variant: 'outline', color: '#e65100' })}>
                        <i className="fas fa-redo"></i> Try Again
                      </button>
                    </>
                  }
                >
                  No account is registered with <strong>{email}</strong>.
                  <br />
                  Please check the email address or create a new account.
                </Card>
              )}

              {state === 'NOTIFICATION_PUBLISH_FAILED' && (
                <Card
                  code="NOTIFICATION_PUBLISH_FAILED"
                  title="Email Service Unavailable"
                  actions={
                    <button type="button" onClick={resetForm} style={btnStyle({ variant: 'primary', color: '#c62828' })}>
                      <i className="fas fa-redo"></i> Try Again
                    </button>
                  }
                >
                  We couldn't send the reset email right now. Please try again in a moment.
                </Card>
              )}

              {state === 'FORM' && (
                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                    <i className="fas fa-envelope"></i>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={loading || !email}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '12px 18px',
                      marginTop: 8,
                      background: loading || !email ? '#a5d6a7' : '#2e7d32',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 15,
                      fontWeight: 600,
                      lineHeight: 1.2,
                      cursor: loading || !email ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s ease, transform 0.15s ease',
                      boxShadow: loading || !email ? 'none' : '0 2px 6px rgba(46,125,50,0.25)',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && email) e.currentTarget.style.background = '#256628';
                    }}
                    onMouseLeave={(e) => {
                      if (!loading && email) e.currentTarget.style.background = '#2e7d32';
                    }}
                  >
                    {loading ? (
                      <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                    ) : (
                      <><i className="fas fa-paper-plane"></i> Send Reset Link</>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Link href="/login" style={{ color: '#2e7d32', fontSize: 14 }}>
                      <i className="fas fa-arrow-left"></i> Back to Login
                    </Link>
                  </div>
                </form>
              )}

              {state === 'UNKNOWN' && (
                <Card
                  code="NOTIFICATION_PUBLISH_FAILED"
                  title="Something went wrong"
                  actions={
                    <button type="button" onClick={resetForm} style={btnStyle({ variant: 'primary', color: '#c62828' })}>
                      <i className="fas fa-redo"></i> Try Again
                    </button>
                  }
                >
                  {error?.message || 'Please try again in a moment.'}
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
