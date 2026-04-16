"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import Seo from '@/components/common/Seo';
import { showNotification } from '@/components/Notification';
import { Heart, AlertCircle, Loader2, Home, RefreshCw, User, FileText } from 'lucide-react';

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
        <Seo noindex title="Processing Donation..." />
        <div className="ge-status">
          <div className="ge-status-card ge-text-center">
            <div className="ge-status-icon ge-status-icon--loading">
              <Loader2 size={40} className="ge-spin" />
            </div>
            <h2 className="ge-status-title">Processing Your Donation...</h2>
            <p className="ge-status-subtitle">
              Please wait while we confirm your generous contribution
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Seo noindex title="Error" />
        <div className="ge-status">
          <motion.div
            className="ge-status-card ge-text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="ge-status-icon ge-status-icon--error">
              <AlertCircle size={40} />
            </div>
            <h2 className="ge-status-title">Error Loading Donation</h2>
            <p className="ge-status-subtitle">{error}</p>
            <div className="ge-status-actions">
              <button
                className="ge-btn ge-btn-primary ge-btn-lg"
                onClick={() => router.push('/#donate')}
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                className="ge-btn ge-btn-secondary ge-btn-lg"
                onClick={() => router.push('/')}
              >
                <Home size={18} />
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo noindex title="Donation Successful | GreenEye Foundation" />
      <div className="ge-status">
        <motion.div
          className="ge-status-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div
            className="ge-status-icon ge-status-icon--success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Heart size={40} />
          </motion.div>

          <h1 className="ge-status-title">
            {donationDetails?.paymentStatus === 'COMPLETED' ? 'Thank You for Your Donation!' : 'Donation Received!'}
          </h1>
          <p className="ge-status-subtitle">
            {donationDetails?.paymentStatus === 'COMPLETED'
              ? 'Your generous contribution has been processed successfully'
              : 'Your donation is being processed'}
          </p>

          {donationDetails && (
            <>
              {/* Donation Information */}
              <div className="ge-status-info">
                <div className="ge-status-row">
                  <span className="ge-status-label">Donation ID</span>
                  <span className="ge-status-value">{donationDetails.donationId}</span>
                </div>

                {donationDetails.transactionId && (
                  <div className="ge-status-row">
                    <span className="ge-status-label">Transaction ID</span>
                    <span className="ge-status-value">{donationDetails.transactionId}</span>
                  </div>
                )}

                <div className="ge-status-row">
                  <span className="ge-status-label">Amount Donated</span>
                  <span className="ge-status-value ge-status-value--highlight">
                    &#8377;{donationDetails.amount}
                  </span>
                </div>

                <div className="ge-status-row">
                  <span className="ge-status-label">Payment Status</span>
                  <span className={`ge-badge ${donationDetails.paymentStatus === 'COMPLETED' ? 'ge-badge-green' : 'ge-badge-gold'}`}>
                    {donationDetails.paymentStatus === 'COMPLETED' ? 'COMPLETED' : 'PROCESSING'}
                  </span>
                </div>
              </div>

              {/* Donor Information */}
              <div className="ge-status-section ge-text-center">
                <h3 className="ge-status-section-title ge-justify-center">
                  <User size={18} />
                  Donor Information
                </h3>
                <p className="ge-status-item-name">{donationDetails.donorName}</p>
                <p className="ge-status-item-detail">{donationDetails.donorEmail}</p>
              </div>

              {/* Tax Benefit Note */}
              <div className="ge-status-alert ge-status-alert--warning">
                <FileText size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div className="ge-status-alert-title">Tax Benefits</div>
                  <div className="ge-status-alert-text">
                    A donation receipt has been sent to your email. This receipt is eligible for 80G tax benefits.
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="ge-status-actions">
            <button
              className="ge-btn ge-btn-primary ge-btn-lg"
              onClick={() => router.push('/')}
            >
              <Home size={18} />
              Back to Home
            </button>
            <button
              className="ge-btn ge-btn-gold ge-btn-lg"
              onClick={() => router.push('/#donate')}
            >
              <Heart size={18} />
              Donate Again
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
