import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.isReady) {
      setToken(router.query.token || '');
      setEmail(router.query.email || '');
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token || !email) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/api/users/reset-password', { token, email, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo noindex title="Reset Password | GREENEYE" />
      <div className="auth-container">
        <div className="auth-wrapper" style={{ maxWidth: 480 }}>
          <div className="auth-section">
            <div className="auth-form-container">
              <div className="auth-form-header">
                <h2>
                  <i className="fas fa-key"></i> Reset Password
                </h2>
                <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                  Enter your new password below.
                </p>
              </div>

              {success ? (
                <div style={{
                  background: '#e8f5e9',
                  borderRadius: '8px',
                  padding: '20px',
                  margin: '20px 0',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-check-circle" style={{ color: '#2e7d32', fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
                  <h3 style={{ color: '#2e7d32', margin: '0 0 8px' }}>Password Reset Successful!</h3>
                  <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>
                    Your password has been updated. You can now log in with your new password.
                  </p>
                  <Link href="/login" style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    background: '#2e7d32',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    Go to Login
                  </Link>
                </div>
              ) : !token || !email ? (
                <div style={{
                  background: '#fff3e0',
                  borderRadius: '8px',
                  padding: '20px',
                  margin: '20px 0',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-exclamation-triangle" style={{ color: '#e65100', fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
                  <h3 style={{ color: '#e65100', margin: '0 0 8px' }}>Invalid Reset Link</h3>
                  <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>
                    This link is invalid or has expired. Please request a new password reset.
                  </p>
                  <Link href="/forgot-password" style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    color: '#2e7d32',
                    textDecoration: 'underline',
                    fontSize: '14px'
                  }}>
                    Request New Reset Link
                  </Link>
                </div>
              ) : (
                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email-display">Email</label>
                    <input
                      id="email-display"
                      type="email"
                      value={email}
                      disabled
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                    <i className="fas fa-envelope"></i>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      id="password"
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                    />
                    <i className="fas fa-lock"></i>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPwd(!showPwd)}
                      tabIndex={-1}
                    >
                      <i className={`fas ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      type={showPwd ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                      minLength={6}
                    />
                    <i className="fas fa-lock"></i>
                  </div>

                  {error && (
                    <p style={{ color: '#d32f2f', fontSize: '13px', margin: '8px 0' }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    className="auth-btn"
                    disabled={loading || !password || !confirmPassword}
                  >
                    {loading ? (
                      <><i className="fas fa-spinner fa-spin"></i> Resetting...</>
                    ) : (
                      <><i className="fas fa-check"></i> Reset Password</>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Link href="/login" style={{ color: '#2e7d32', fontSize: '14px' }}>
                      <i className="fas fa-arrow-left"></i> Back to Login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
