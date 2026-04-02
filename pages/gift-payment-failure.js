"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Seo from '@/components/common/Seo';
import { showNotification } from '@/components/Notification';

export default function GiftPaymentFailure() {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const params = router.query;

      setPaymentInfo(params);
      showNotification('Payment failed. Please try again.', 'error');
      setLoading(false);
    }
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <>
        <Seo noindex title="Processing..." />
        <div className="ge-status">
          <div className="ge-status-card ge-text-center">
            <div className="ge-status-icon ge-status-icon--loading">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <h2 className="ge-status-title">Processing...</h2>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo noindex title="Payment Failed | GreenEye Foundation" />
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

          {/* Payment Info */}
          {paymentInfo && (paymentInfo.orderId || paymentInfo.txnid) && (
            <div className="ge-status-info">
              {paymentInfo.orderId && (
                <div className="ge-status-row">
                  <span className="ge-status-label">Order ID</span>
                  <span className="ge-status-value">{paymentInfo.orderId}</span>
                </div>
              )}
              {paymentInfo.txnid && (
                <div className="ge-status-row">
                  <span className="ge-status-label">Transaction ID</span>
                  <span className="ge-status-value">{paymentInfo.txnid}</span>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {paymentInfo && paymentInfo.error_Message && (
            <div className="ge-status-alert ge-status-alert--error">
              <i className="fas fa-info-circle"></i>
              <div>
                <p className="ge-status-alert-text">{paymentInfo.error_Message}</p>
              </div>
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
              <li>Incorrect card details or OTP</li>
              <li>Transaction timeout</li>
              <li>Bank server issues</li>
              <li>Payment gateway error</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="ge-status-actions">
            <button
              className="ge-btn ge-btn-primary ge-btn-lg"
              onClick={() => router.push('/gift-a-tree')}
            >
              <i className="fas fa-redo"></i>
              Try Again
            </button>
            <button
              className="ge-btn ge-btn-secondary ge-btn-lg"
              onClick={() => router.push('/')}
            >
              <i className="fas fa-home"></i>
              Back to Home
            </button>
          </div>

          {/* Help Section */}
          <div className="ge-status-help">
            <p className="ge-status-help-title">Need Help?</p>
            <p className="ge-status-help-text">
              If you continue to face issues, please contact our support team
            </p>
            <div className="ge-status-help-links">
              <a href="mailto:support@greeneye.foundation">
                <i className="fas fa-envelope"></i>
                support@greeneye.foundation
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
