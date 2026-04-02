"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Seo from '@/components/common/Seo';

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
    <>
      <Seo noindex title="Order Failed | GREENEYE" />
      <div className="ge-status">
        <motion.div
          className="ge-status-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error Icon */}
          <motion.div
            className="ge-status-icon ge-status-icon--error"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <i className="fas fa-times"></i>
          </motion.div>

          <h1 className="ge-status-title">Payment Failed</h1>
          <p className="ge-status-subtitle">
            Unfortunately, your payment could not be processed
          </p>

          {/* Error Details */}
          <div className="ge-status-alert ge-status-alert--error">
            <i className="fas fa-exclamation-triangle"></i>
            <div>
              <p className="ge-status-alert-title">Error Details</p>
              <p className="ge-status-alert-text">{errorMessage}</p>
            </div>
          </div>

          {/* Transaction Details */}
          {(router.query.orderId || router.query.txnid) && (
            <div className="ge-status-info">
              {router.query.orderId && (
                <div className="ge-status-row">
                  <span className="ge-status-label">Order ID</span>
                  <span className="ge-status-value">{router.query.orderId}</span>
                </div>
              )}

              {router.query.txnid && (
                <div className="ge-status-row">
                  <span className="ge-status-label">Transaction ID</span>
                  <span className="ge-status-value">{router.query.txnid}</span>
                </div>
              )}

              {orderDetails && (
                <div className="ge-status-row">
                  <span className="ge-status-label">Amount</span>
                  <span className="ge-status-value ge-status-value--highlight">
                    &#8377;{orderDetails.finalPrice || orderDetails.totalPrice}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Common Reasons */}
          <div className="ge-status-section">
            <h3 className="ge-status-section-title">
              <i className="fas fa-info-circle"></i>
              Common Reasons for Payment Failure
            </h3>
            <ul className="ge-status-reasons">
              <li>Insufficient funds in your account</li>
              <li>Incorrect card details or expired card</li>
              <li>OTP verification failed or timed out</li>
              <li>Bank server temporarily unavailable</li>
              <li>Transaction limit exceeded</li>
              <li>Payment gateway technical issues</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="ge-status-actions">
            <button className="ge-btn ge-btn-primary ge-btn-lg" onClick={handleRetryPayment}>
              <i className="fas fa-redo"></i>
              Try Again
            </button>

            {orderDetails && (
              <Link href="/myorders" className="ge-btn ge-btn-secondary ge-btn-lg">
                <i className="fas fa-list"></i>
                View Orders
              </Link>
            )}

            <Link href="/plantshop" className="ge-btn ge-btn-secondary ge-btn-lg">
              <i className="fas fa-shopping-bag"></i>
              Continue Shopping
            </Link>
          </div>

          {/* Help Section */}
          <div className="ge-status-help">
            <p className="ge-status-help-title">Need Help?</p>
            <p className="ge-status-help-text">
              If you continue to face issues with payment, please contact our support team
            </p>
            <div className="ge-status-help-links">
              <a href="mailto:support@greeneye.foundation">
                <i className="fas fa-envelope"></i>
                support@greeneye.foundation
              </a>
              <a href="tel:+919876543210">
                <i className="fas fa-phone"></i>
                +91 98765 43210
              </a>
            </div>
          </div>

          {/* Note */}
          <div className="ge-status-note">
            <i className="fas fa-shield-alt"></i>
            <strong>Note:</strong> Your order has been saved. No amount has been deducted.
            You can retry the payment anytime from &quot;My Orders&quot; section.
          </div>
        </motion.div>
      </div>
    </>
  );
}
