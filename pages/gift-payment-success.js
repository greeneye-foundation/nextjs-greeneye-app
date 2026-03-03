"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import Seo from '@/components/common/Seo';
import { showNotification } from '@/components/Notification';

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
                <section className="payment-loading" style={{
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
                                Loading Order Details...
                            </h2>
                            <p style={{ color: '#666' }}>
                                Please wait while we fetch your order information
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
                <Seo noindex title="Error" />
                <section className="payment-error" style={{
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
                                Error Loading Order
                            </h2>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => router.push('/gift-a-tree')}
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
            <Seo noindex title="Payment Successful | GreenEye Foundation" />
            <section className="payment-success" style={{
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
                                className="fas fa-check-circle"
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
                            {orderDetails?.paymentStatus === 'COMPLETED' ? 'Payment Successful!' : 'Order Received!'}
                        </h1>
                        <p className="success-message" style={{
                            textAlign: 'center',
                            color: '#666',
                            marginBottom: '2rem',
                            fontSize: '1.1rem'
                        }}>
                            {orderDetails?.paymentStatus === 'COMPLETED'
                                ? 'Your tree gift payment has been processed successfully'
                                : 'Your order has been received and is being processed'}
                        </p>

                        {orderDetails && (
                            <>
                                <div className="order-info" style={{
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
                                            Order ID:
                                        </span>
                                        <span className="value" style={{ color: '#333', fontWeight: '600' }}>
                                            {orderDetails.orderId}
                                        </span>
                                    </div>
                                    {orderDetails.transactionId && (
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
                                                {orderDetails.transactionId}
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
                                            Amount Paid:
                                        </span>
                                        <span className="value total-amount" style={{
                                            color: '#4CAF50',
                                            fontWeight: '700',
                                            fontSize: '1.2rem'
                                        }}>
                                            ₹{orderDetails.totalAmount}
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
                                            color: orderDetails.paymentStatus === 'COMPLETED' ? '#4CAF50' : '#FF9800',
                                            fontWeight: '600',
                                            background: orderDetails.paymentStatus === 'COMPLETED' ? '#e8f5e9' : '#fff3e0',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem'
                                        }}>
                                            {orderDetails.paymentStatus === 'COMPLETED' ? '✓ COMPLETED' : '⏳ PROCESSING'}
                                        </span>
                                    </div>
                                </div>

                                <div className="recipient-info" style={{
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
                                        <i className="fas fa-gift" style={{ marginRight: '8px' }}></i>
                                        Gift Recipient
                                    </h3>
                                    <p style={{
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        margin: '0.5rem 0',
                                        color: '#333'
                                    }}>
                                        {orderDetails.recipientName}
                                    </p>
                                    <p style={{ color: '#666', margin: '0' }}>
                                        {orderDetails.recipientEmail}
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
                                onClick={() => router.push('/gift-a-tree')}
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
                                <i className="fas fa-gift"></i>
                                Send Another Gift
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}