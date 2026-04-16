"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Seo from '@/components/common/Seo';
import { CheckCircle, AlertCircle, Loader2, ListOrdered, ShoppingBag, Home, Info, Package, Truck } from 'lucide-react';

export default function OrderSuccess() {
  const { getAuthHeaders } = useAuth();
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
        if (!getAuthHeaders().Authorization) {
          setError('Please login to view order details');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`,
          {
            headers: getAuthHeaders()
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
    );
  }

  if (error) {
    return (
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
            <Link href="/plantshop">
              <button className="ge-btn ge-btn-primary ge-btn-lg">
                <ShoppingBag size={18} />
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Seo noindex title="Order Successful | GREENEYE" />
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

          <h1 className="ge-status-title">Order Placed Successfully!</h1>
          <p className="ge-status-subtitle">
            Thank you for your purchase! Your order has been confirmed.
          </p>

          {/* Order Details */}
          {orderDetails && (
            <>
              {/* Order Information */}
              <div className="ge-status-info">
                <div className="ge-status-row">
                  <span className="ge-status-label">Order ID</span>
                  <span className="ge-status-value">{orderDetails._id}</span>
                </div>

                {router.query.txnid && (
                  <div className="ge-status-row">
                    <span className="ge-status-label">Transaction ID</span>
                    <span className="ge-status-value">{router.query.txnid}</span>
                  </div>
                )}

                <div className="ge-status-row">
                  <span className="ge-status-label">Order Date</span>
                  <span className="ge-status-value">
                    {new Date(orderDetails.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="ge-status-row">
                  <span className="ge-status-label">Payment Status</span>
                  <span className={`ge-badge ${orderDetails.isPaid ? 'ge-badge-green' : 'ge-badge-gold'}`}>
                    {orderDetails.isPaid ? 'PAID' : 'PENDING'}
                  </span>
                </div>

                <div className="ge-status-row">
                  <span className="ge-status-label">Order Status</span>
                  <span className="ge-badge ge-badge-blue">
                    {orderDetails.orderStatus}
                  </span>
                </div>

                <div className="ge-status-row">
                  <span className="ge-status-label">Total Amount</span>
                  <span className="ge-status-value ge-status-value--highlight">
                    &#8377;{orderDetails.finalPrice || orderDetails.totalPrice}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="ge-status-section">
                <h3 className="ge-status-section-title">
                  <Package size={18} />
                  Order Items ({orderDetails.orderItems?.length || 0})
                </h3>

                {orderDetails.orderItems?.map((item, index) => (
                  <div key={index} className="ge-status-item">
                    <div>
                      <div className="ge-status-item-name">{item.name}</div>
                      <div className="ge-status-item-detail">Quantity: {item.quantity}</div>
                    </div>
                    <span className="ge-status-item-price">
                      &#8377;{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="ge-status-section">
                <h3 className="ge-status-section-title">
                  <Truck size={18} />
                  Shipping Address
                </h3>
                <p className="ge-status-item-name">{orderDetails.shippingAddress?.name}</p>
                <p className="ge-status-item-detail">{orderDetails.shippingAddress?.street}</p>
                <p className="ge-status-item-detail">
                  {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state} - {orderDetails.shippingAddress?.pincode}
                </p>
                <p className="ge-status-item-detail">Phone: {orderDetails.shippingAddress?.phone}</p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="ge-status-actions">
            <Link href="/myorders">
              <button className="ge-btn ge-btn-primary ge-btn-lg">
                <ListOrdered size={18} />
                View My Orders
              </button>
            </Link>
            <Link href="/plantshop">
              <button className="ge-btn ge-btn-secondary ge-btn-lg">
                <ShoppingBag size={18} />
                Continue Shopping
              </button>
            </Link>
            <Link href="/">
              <button className="ge-btn ge-btn-ghost ge-btn-lg">
                <Home size={18} />
                Back to Home
              </button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="ge-status-footer">
            <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
            You will receive order updates via email and SMS
          </div>
        </motion.div>
      </div>
    </>
  );
}
