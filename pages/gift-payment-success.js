"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import Seo from '@/components/common/Seo';
import { showNotification } from '@/components/Notification';
import { CheckCircle, AlertCircle, Loader2, Home, RefreshCw, Gift } from 'lucide-react';

export default function GiftPaymentSuccess() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrderDetails = async () => {
            if (!router.isReady) return;

            try {
                const { orderId, txnid, amount, status } = router.query;

                if (!orderId) {
                    setError('No order ID found');
                    setLoading(false);
                    return;
                }

                // Fetch order details from backend
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gift-tree/${orderId}`
                );

                if (response.data.success) {
                    setOrderDetails(response.data.data);

                    if (response.data.data.paymentStatus === 'COMPLETED') {
                        showNotification('Payment completed successfully!', 'success');
                    } else {
                        showNotification('Order details loaded', 'info');
                    }
                } else {
                    setError('Failed to load order details');
                }
            } catch (err) {
                console.error('Error loading order:', err);
                setError(err.response?.data?.message || 'Failed to load order details');
                showNotification('Failed to load order details', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadOrderDetails();
    }, [router.isReady, router.query]);

    if (loading) {
        return (
            <>
                <Seo noindex title="Loading..." />
                <div className="ge-status">
                    <div className="ge-status-card ge-text-center">
                        <div className="ge-status-icon ge-status-icon--loading">
                            <Loader2 size={40} className="ge-spin" />
                        </div>
                        <h2 className="ge-status-title">Loading Order Details...</h2>
                        <p className="ge-status-subtitle">
                            Please wait while we fetch your order information
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
                        <h2 className="ge-status-title">Error Loading Order</h2>
                        <p className="ge-status-subtitle">{error}</p>
                        <div className="ge-status-actions">
                            <button
                                className="ge-btn ge-btn-primary ge-btn-lg"
                                onClick={() => router.push('/gift-a-tree')}
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
            <Seo noindex title="Payment Successful | GreenEye Foundation" />
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
                        <CheckCircle size={40} />
                    </motion.div>

                    <h1 className="ge-status-title">
                        {orderDetails?.paymentStatus === 'COMPLETED' ? 'Payment Successful!' : 'Order Received!'}
                    </h1>
                    <p className="ge-status-subtitle">
                        {orderDetails?.paymentStatus === 'COMPLETED'
                            ? 'Your tree gift payment has been processed successfully'
                            : 'Your order has been received and is being processed'}
                    </p>

                    {orderDetails && (
                        <>
                            {/* Order Information */}
                            <div className="ge-status-info">
                                <div className="ge-status-row">
                                    <span className="ge-status-label">Order ID</span>
                                    <span className="ge-status-value">{orderDetails.orderId}</span>
                                </div>

                                {orderDetails.transactionId && (
                                    <div className="ge-status-row">
                                        <span className="ge-status-label">Transaction ID</span>
                                        <span className="ge-status-value">{orderDetails.transactionId}</span>
                                    </div>
                                )}

                                <div className="ge-status-row">
                                    <span className="ge-status-label">Amount Paid</span>
                                    <span className="ge-status-value ge-status-value--highlight">
                                        &#8377;{orderDetails.totalAmount}
                                    </span>
                                </div>

                                <div className="ge-status-row">
                                    <span className="ge-status-label">Payment Status</span>
                                    <span className={`ge-badge ${orderDetails.paymentStatus === 'COMPLETED' ? 'ge-badge-green' : 'ge-badge-gold'}`}>
                                        {orderDetails.paymentStatus === 'COMPLETED' ? 'COMPLETED' : 'PROCESSING'}
                                    </span>
                                </div>
                            </div>

                            {/* Recipient Information */}
                            <div className="ge-status-section ge-text-center">
                                <h3 className="ge-status-section-title ge-justify-center">
                                    <Gift size={18} />
                                    Gift Recipient
                                </h3>
                                <p className="ge-status-item-name">{orderDetails.recipientName}</p>
                                <p className="ge-status-item-detail">{orderDetails.recipientEmail}</p>
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
                            onClick={() => router.push('/gift-a-tree')}
                        >
                            <Gift size={18} />
                            Send Another Gift
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
