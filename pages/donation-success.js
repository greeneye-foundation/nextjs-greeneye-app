"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import Seo from '@/components/common/Seo';
import { showNotification } from '@/components/Notification';

export default function DonationSuccess() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [donationDetails, setDonationDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDonationDetails = async () => {
      if (!router.isReady) return;
      
      try {
        const { donationId, txnid, amount, status } = router.query;
        
        if (!donationId) {
          setError('No donation ID found');
          setLoading(false);
          return;
        }

        // Fetch donation details from backend
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/ref/${donationId}`
        );
        
        if (response.data.success) {
          setDonationDetails(response.data.data);
          
          if (response.data.data.paymentStatus === 'COMPLETED') {
            showNotification('Donation completed successfully!', 'success');
             // Fire Meta Pixel Purchase event
                if (typeof window.fbq === "function") {
                    window.fbq("track", "Purchase", {
                    value: amount,
                    currency: "INR",
                    donation_id: donationId,
                    });
                }
          } else {
            showNotification('Donation received', 'info');
          }
        } else {
          setError('Failed to load donation details');
        }
      } catch (err) {
        console.error('Error loading donation:', err);
        setError(err.response?.data?.message || 'Failed to load donation details');
        showNotification('Failed to load donation details', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadDonationDetails();
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <>
        <Seo title="Processing Donation..." />
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
                color: '#4CAF50',
                marginBottom: '1rem'
              }}></i>
              <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>
                Processing Your Donation...
              </h2>
              <p style={{ color: '#666' }}>
                Please wait while we confirm your generous contribution
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Seo title="Error" />
        <section className="donation-error" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }}>
          <div className="container">
            <motion.div 
              className="error-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                maxWidth: '500px',
                margin: '0 auto'
              }}
            >
              <i className="fas fa-exclamation-circle" style={{ 
                fontSize: '4rem', 
                color: '#f44336',
                marginBottom: '1rem'
              }}></i>
              <h2 style={{ marginBottom: '1rem', color: '#333' }}>
                Error Loading Donation
              </h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    transition: 'all 0.3s'
                  }}
                >
                  <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
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
                    transition: 'all 0.3s'
                  }}
                >
                  <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
                  Back to Home
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo title="Donation Successful | GreenEye Foundation" />
      <section className="donation-success" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem'
      }}>
        <div className="container">
          <motion.div
            className="success-card"
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
            <div className="success-icon" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <motion.i 
                className="fas fa-heart"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{ 
                  fontSize: '5rem', 
                  color: '#4CAF50'
                }}
              ></motion.i>
            </div>
            
            <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#333' }}>
              {donationDetails?.paymentStatus === 'COMPLETED' ? 'Thank You for Your Donation!' : 'Donation Received!'}
            </h1>
            <p className="success-message" style={{ 
              textAlign: 'center', 
              color: '#666',
              marginBottom: '2rem',
              fontSize: '1.1rem'
            }}>
              {donationDetails?.paymentStatus === 'COMPLETED' 
                ? 'Your generous contribution has been processed successfully' 
                : 'Your donation is being processed'}
            </p>

            {donationDetails && (
              <>
                <div className="donation-info" style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div className="info-row" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <span className="label" style={{ color: '#666', fontWeight: '500' }}>
                      Donation ID:
                    </span>
                    <span className="value" style={{ color: '#333', fontWeight: '600' }}>
                      {donationDetails.donationId}
                    </span>
                  </div>
                  {donationDetails.transactionId && (
                    <div className="info-row" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <span className="label" style={{ color: '#666', fontWeight: '500' }}>
                        Transaction ID:
                      </span>
                      <span className="value" style={{ 
                        color: '#333', 
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        wordBreak: 'break-all'
                      }}>
                        {donationDetails.transactionId}
                      </span>
                    </div>
                  )}
                  <div className="info-row" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <span className="label" style={{ color: '#666', fontWeight: '500' }}>
                      Amount Donated:
                    </span>
                    <span className="value total-amount" style={{ 
                      color: '#4CAF50', 
                      fontWeight: '700',
                      fontSize: '1.5rem'
                    }}>
                      ₹{donationDetails.amount}
                    </span>
                  </div>
                  <div className="info-row" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0 0 0'
                  }}>
                    <span className="label" style={{ color: '#666', fontWeight: '500' }}>
                      Payment Status:
                    </span>
                    <span className="value" style={{ 
                      color: donationDetails.paymentStatus === 'COMPLETED' ? '#4CAF50' : '#FF9800',
                      fontWeight: '600',
                      background: donationDetails.paymentStatus === 'COMPLETED' ? '#e8f5e9' : '#fff3e0',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>
                      {donationDetails.paymentStatus === 'COMPLETED' ? '✓ COMPLETED' : '⏳ PROCESSING'}
                    </span>
                  </div>
                </div>

                <div className="donor-info" style={{
                  background: '#e3f2fd',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    marginBottom: '0.75rem',
                    color: '#1976d2'
                  }}>
                    <i className="fas fa-user-circle" style={{ marginRight: '8px' }}></i>
                    Donor Information
                  </h3>
                  <p style={{ 
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: '0.5rem 0',
                    color: '#333'
                  }}>
                    {donationDetails.donorName}
                  </p>
                  <p style={{ color: '#666', margin: '0' }}>
                    {donationDetails.donorEmail}
                  </p>
                </div>

                <div className="tax-benefit-note" style={{
                  background: '#fff3e0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-file-invoice" style={{ 
                    fontSize: '2rem',
                    color: '#FF9800',
                    marginBottom: '0.5rem'
                  }}></i>
                  <p style={{ margin: 0, color: '#666' }}>
                    A donation receipt has been sent to your email. This receipt is eligible for 80G tax benefits.
                  </p>
                </div>
              </>
            )}

            <div className="success-actions" style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                className="btn btn-primary"
                onClick={() => router.push('/')}
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
                <i className="fas fa-home"></i>
                Back to Home
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => router.push('/#donate')}
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
                <i className="fas fa-heart"></i>
                Donate Again
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}