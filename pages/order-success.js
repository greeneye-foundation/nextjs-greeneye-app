"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function OrderSuccess() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { orderId, txnid, amount, status } = router.query;

        if (!router.isReady) return;

        if (!orderId) {
          setError('Order ID not found');
          setLoading(false);
          return;
        }

        // Fetch order details
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Please login to view order details');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError(err.response?.data?.message || 'Failed to fetch order details');
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchOrderDetails();
    }
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
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
    );
  }

  if (error) {
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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/plantshop">
              <button style={{
                padding: '12px 30px',
                fontSize: '1rem',
                borderRadius: '50px',
                border: 'none',
                background: '#4CAF50',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                <i className="fas fa-shopping-bag" style={{ marginRight: '8px' }}></i>
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          maxWidth: '700px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Success Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
        
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#333', fontSize: '2rem' }}>
          🎉 Order Placed Successfully!
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666',
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Thank you for your purchase! Your order has been confirmed.
        </p>

        {/* Order Details */}
        {orderDetails && (
          <>
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.2rem' }}>
                Order Information
              </h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #dee2e6'
              }}>
                <span style={{ color: '#666', fontWeight: '500' }}>Order ID:</span>
                <span style={{ color: '#333', fontWeight: '600' }}>
                  {orderDetails._id}
                </span>
              </div>

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

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #dee2e6'
              }}>
                <span style={{ color: '#666', fontWeight: '500' }}>Order Date:</span>
                <span style={{ color: '#333', fontWeight: '600' }}>
                  {new Date(orderDetails.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #dee2e6'
              }}>
                <span style={{ color: '#666', fontWeight: '500' }}>Payment Status:</span>
                <span style={{ 
                  color: '#4CAF50',
                  fontWeight: '600',
                  background: '#e8f5e9',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}>
                  ✓ {orderDetails.isPaid ? 'PAID' : 'PENDING'}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #dee2e6'
              }}>
                <span style={{ color: '#666', fontWeight: '500' }}>Order Status:</span>
                <span style={{ 
                  color: '#1976d2',
                  fontWeight: '600',
                  background: '#e3f2fd',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}>
                  {orderDetails.orderStatus}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0 0 0'
              }}>
                <span style={{ color: '#666', fontWeight: '500', fontSize: '1.1rem' }}>
                  Total Amount:
                </span>
                <span style={{ 
                  color: '#4CAF50', 
                  fontWeight: '700',
                  fontSize: '1.5rem'
                }}>
                  ₹{orderDetails.finalPrice || orderDetails.totalPrice}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div style={{
              background: '#e3f2fd',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem',
                color: '#1976d2'
              }}>
                <i className="fas fa-shopping-bag" style={{ marginRight: '8px' }}></i>
                Order Items ({orderDetails.orderItems?.length || 0})
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {orderDetails.orderItems?.map((item, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong style={{ color: '#333', fontSize: '1rem' }}>
                        {item.name}
                      </strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span style={{ 
                      color: '#4CAF50', 
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{
              background: '#fff3e0',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem',
                color: '#f57c00'
              }}>
                <i className="fas fa-truck" style={{ marginRight: '8px' }}></i>
                Shipping Address
              </h3>
              <p style={{ margin: '0.25rem 0', color: '#333' }}>
                <strong>{orderDetails.shippingAddress?.name}</strong>
              </p>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>
                {orderDetails.shippingAddress?.street}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>
                {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state} - {orderDetails.shippingAddress?.pincode}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>
                Phone: {orderDetails.shippingAddress?.phone}
              </p>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '2rem'
        }}>
          <Link href="/myorders">
            <button style={{
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
            }}>
              <i className="fas fa-list"></i>
              View My Orders
            </button>
          </Link>
          
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
              gap: '8px'
            }}>
              <i className="fas fa-shopping-bag"></i>
              Continue Shopping
            </button>
          </Link>

          <Link href="/">
            <button style={{
              padding: '12px 30px',
              fontSize: '1rem',
              borderRadius: '50px',
              border: '2px solid #4CAF50',
              background: 'white',
              color: '#4CAF50',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-home"></i>
              Back to Home
            </button>
          </Link>
        </div>

        {/* Additional Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#1976d2' }}></i>
            You will receive order updates via email and SMS
          </p>
        </div>
      </motion.div>
    </div>
  );
}