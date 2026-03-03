"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function OrderFailure() {
  const { getAuthHeaders } = useAuth();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const { error, orderId, error_Message, txnid } = router.query;
      
      // Set error message based on error type
      if (error === 'missing_order_id') {
        setErrorMessage('Order ID is missing. Please contact support.');
      } else if (error === 'invalid_hash') {
        setErrorMessage('Payment verification failed due to security check.');
      } else if (error === 'order_not_found') {
        setErrorMessage('Order not found in our system.');
      } else if (error === 'callback_error') {
        setErrorMessage('Payment callback error. Please contact support.');
      } else if (error_Message) {
        setErrorMessage(error_Message);
      } else {
        setErrorMessage('Payment failed. Please try again.');
      }

      // Try to fetch order details if orderId is available
      if (orderId) {
        fetchOrderDetails(orderId);
      }
    }
  }, [router.isReady, router.query]);

  const fetchOrderDetails = async (orderId) => {
    try {
      if (!getAuthHeaders().Authorization) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`,
        {
          headers: getAuthHeaders()
        }
      );

      setOrderDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    }
  };

  const handleRetryPayment = () => {
    if (orderDetails) {
      // Redirect to checkout with order details
      router.push('/checkout');
    } else {
      router.push('/cart');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      padding: '2rem 1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '650px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Failure Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
        
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '0.5rem', 
          color: '#333',
          fontSize: '2rem'
        }}>
          Payment Failed
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666',
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Unfortunately, your payment could not be processed
        </p>

        {/* Error Details */}
        <div style={{
          background: '#fff3e0',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '2px solid #ff9800'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <i className="fas fa-exclamation-triangle" style={{ 
              fontSize: '2rem', 
              color: '#ff9800',
              marginTop: '0.25rem'
            }}></i>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#f57c00',
                fontSize: '1.1rem'
              }}>
                Error Details
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#666',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                {errorMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        {(router.query.orderId || router.query.txnid) && (
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: '#333',
              fontSize: '1.1rem'
            }}>
              Transaction Information
            </h3>
            
            {router.query.orderId && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #dee2e6'
              }}>
                <span style={{ color: '#666', fontWeight: '500' }}>Order ID:</span>
                <span style={{ 
                  color: '#333', 
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all'
                }}>
                  {router.query.orderId}
                </span>
              </div>
            )}

            {router.query.txnid && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #dee2e6'
              }}>
                <span style={{ color: '#666', fontWeight: '500' }}>Transaction ID:</span>
                <span style={{ 
                  color: '#333', 
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all'
                }}>
                  {router.query.txnid}
                </span>
              </div>
            )}

            {orderDetails && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0 0 0'
              }}>
                <span style={{ color: '#666', fontWeight: '500' }}>Amount:</span>
                <span style={{ 
                  color: '#f44336', 
                  fontWeight: '700',
                  fontSize: '1.2rem'
                }}>
                  ₹{orderDetails.finalPrice || orderDetails.totalPrice}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Common Reasons */}
        <div style={{
          background: '#e3f2fd',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            marginBottom: '1rem',
            color: '#1976d2'
          }}>
            <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
            Common Reasons for Payment Failure
          </h3>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '1.5rem',
            color: '#666',
            lineHeight: '1.8'
          }}>
            <li>Insufficient funds in your account</li>
            <li>Incorrect card details or expired card</li>
            <li>OTP verification failed or timed out</li>
            <li>Bank server temporarily unavailable</li>
            <li>Transaction limit exceeded</li>
            <li>Payment gateway technical issues</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <button
            onClick={handleRetryPayment}
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
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <i className="fas fa-redo"></i>
            Try Again
          </button>
          
          {orderDetails && (
            <Link href={`/myorders`}>
              <button style={{
                padding: '12px 30px',
                fontSize: '1rem',
                borderRadius: '50px',
                border: '2px solid #1976d2',
                background: 'white',
                color: '#1976d2',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600'
              }}>
                <i className="fas fa-list"></i>
                View Orders
              </button>
            </Link>
          )}

          <Link href="/plantshop">
            <button style={{
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
              gap: '8px',
              fontWeight: '600'
            }}>
              <i className="fas fa-shopping-bag"></i>
              Continue Shopping
            </button>
          </Link>
        </div>

        {/* Help Section */}
        <div style={{
          padding: '1.5rem',
          background: '#f5f5f5',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            marginBottom: '1rem',
            color: '#333'
          }}>
            Need Help?
          </h3>
          <p style={{ 
            color: '#666', 
            fontSize: '0.95rem', 
            marginBottom: '1rem',
            lineHeight: '1.6'
          }}>
            If you continue to face issues with payment, please contact our support team
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="mailto:support@greeneye.foundation" 
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '500'
              }}
            >
              <i className="fas fa-envelope"></i>
              support@greeneye.foundation
            </a>
            <a 
              href="tel:+919876543210" 
              style={{
                color: '#4CAF50',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '500'
              }}
            >
              <i className="fas fa-phone"></i>
              +91 98765 43210
            </a>
          </div>
        </div>

        {/* Note */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#fff9c4',
          borderRadius: '8px',
          border: '1px solid #fbc02d'
        }}>
          <p style={{ 
            color: '#f57f17', 
            fontSize: '0.9rem', 
            margin: 0,
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
            <strong>Note:</strong> Your order has been saved. No amount has been deducted. 
            You can retry the payment anytime from "My Orders" section.
          </p>
        </div>
      </motion.div>
    </div>
  );
}   