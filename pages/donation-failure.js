"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Seo from '@/components/common/Seo';
import { showNotification } from '@/components/Notification';

export default function DonationFailure() {
  const router = useRouter();
  const [donationInfo, setDonationInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const params = router.query;
      
      setDonationInfo(params);
      showNotification('Donation payment failed. Please try again.', 'error');
      setLoading(false);
    }
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <>
        <Seo noindex title="Processing..." />
        <section className="donation-loading" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div className="container">
            <div className="loading-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <i className="fas fa-spinner fa-spin" style={{ 
                fontSize: '4rem', 
                color: '#f44336',
                marginBottom: '1rem'
              }}></i>
              <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>
                Processing...
              </h2>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo noindex title="Donation Failed | GreenEye Foundation" />
      <section className="donation-failure" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        padding: '2rem 1rem'
      }}>
        <div className="container">
          <motion.div
            className="failure-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '3rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <div className="failure-icon" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <motion.i
                className="fas fa-times-circle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{ 
                  fontSize: '5rem', 
                  color: '#f44336'
                }}
              ></motion.i>
            </div>
            
            <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#333' }}>
              Donation Payment Failed
            </h1>
            <p className="failure-message" style={{ 
              textAlign: 'center', 
              color: '#666',
              marginBottom: '2rem',
              fontSize: '1.1rem'
            }}>
              Unfortunately, your donation payment could not be processed
            </p>

            {donationInfo && (
              <div className="donation-info" style={{
                background: '#ffebee',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                {donationInfo.donationId && (
                  <div className="info-row" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #ffcdd2'
                  }}>
                    <span className="label" style={{ color: '#666', fontWeight: '500' }}>
                      Donation ID:
                    </span>
                    <span className="value" style={{ 
                      color: '#333', 
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      {donationInfo.donationId}
                    </span>
                  </div>
                )}
                {donationInfo.txnid && (
                  <div className="info-row" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #ffcdd2'
                  }}>
                    <span className="label" style={{ color: '#666', fontWeight: '500' }}>
                      Transaction ID:
                    </span>
                    <span className="value" style={{ 
                      color: '#333', 
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textAlign: 'right',
                      wordBreak: 'break-all'
                    }}>
                      {donationInfo.txnid}
                    </span>
                  </div>
                )}
                {donationInfo.error_Message && (
                  <div className="error-message" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #f44336',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-info-circle" style={{ 
                      color: '#f44336',
                      marginTop: '2px'
                    }}></i>
                    <span style={{ color: '#333', flex: 1 }}>{donationInfo.error_Message}</span>
                  </div>
                )}
              </div>
            )}

            <div className="failure-reasons" style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                marginBottom: '1rem',
                color: '#333'
              }}>
                Common reasons for payment failure:
              </h3>
              <ul style={{
                margin: 0,
                paddingLeft: '1.5rem',
                color: '#666',
                lineHeight: '1.8'
              }}>
                <li>Insufficient funds in your account</li>
                <li>Incorrect card details or OTP</li>
                <li>Transaction timeout</li>
                <li>Bank server issues</li>
                <li>Payment gateway error</li>
              </ul>
            </div>

            <div className="failure-actions" style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}>
              <button
                className="btn btn-primary"
                onClick={() => router.push('/#donate')}
                style={{
                  padding: '12px 30px',
                  fontSize: '1rem',
                  borderRadius: '50px',
                  border: 'none',
                  background: '#4CAF50',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-redo"></i>
                Try Again
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => router.push('/')}
                style={{
                  padding: '12px 30px',
                  fontSize: '1rem',
                  borderRadius: '50px',
                  border: '2px solid #667eea',
                  background: 'white',
                  color: '#667eea',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-home"></i>
                Back to Home
              </button>
            </div>

            <div className="help-section" style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: '#e3f2fd',
              borderRadius: '12px'
            }}>
              <p style={{ marginBottom: '0.75rem', color: '#1976d2', fontWeight: '500' }}>
                Need help? Contact our support team
              </p>
              <a 
                href="mailto:support@greeneye.foundation" 
                className="support-link"
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.05rem',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-envelope"></i>
                support@greeneye.foundation
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}