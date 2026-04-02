//'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/context/AuthContext'

export function getServerSideProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`),
      locale,
    }
  };
}

export default function GiftOrderDetails() {
  const { getAuthHeaders, isLoading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter()
  const { orderId } = router.query
  const t = useTranslations('giftDetails')

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !orderId) return

    if (!isLoggedIn) {
      router.push(`/login?from=/giftdetails/${orderId}`)
      return
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gift-tree/${orderId}`, {
        headers: getAuthHeaders()
      })
      .then((res) => {
        setOrder(res.data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch gift order:', err)
        setLoading(false)
      })
  }, [orderId, authLoading, isLoggedIn])

  const getOccasionIcon = (occasion) => {
    const icons = {
      birthday: '🎂',
      anniversary: '💑',
      wedding: '💒',
      memorial: '🕊️',
      corporate: '🏢',
      holiday: '🎄',
      'just-because': '💚'
    }
    return icons[occasion] || '🎁'
  }

  const getOccasionLabel = (occasion) => {
    const labels = {
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      wedding: 'Wedding',
      memorial: 'Memorial',
      corporate: 'Corporate Gift',
      holiday: 'Holiday',
      'just-because': 'Just Because'
    }
    return labels[occasion] || occasion
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ff9800',
      CONFIRMED: '#2196f3',
      PROCESSING: '#9c27b0',
      SHIPPED: '#00bcd4',
      DELIVERED: '#388e3c',
      CANCELLED: '#f44336'
    }
    return colors[status] || '#666'
  }

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 800, marginTop: 100, textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#388e3c' }}></i>
        <p style={{ marginTop: 20, color: '#666' }}>{t('loading') || 'Loading gift details...'}</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container" style={{ maxWidth: 800, marginTop: 100, textAlign: 'center' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: 40, color: '#ff9800' }}></i>
        <p style={{ marginTop: 20, color: '#666' }}>{t('notFound') || 'Gift order not found'}</p>
        <Link 
          href="/mygift"
          style={{
            display: 'inline-block',
            marginTop: 20,
            padding: '12px 24px',
            background: '#388e3c',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 6,
            fontWeight: 600
          }}
        >
          <i className="fas fa-arrow-left"></i> {t('back') || 'Back to My Gifts'}
        </Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: 800, marginTop: 80, marginBottom: 60 }}>
      {/* Back Button */}
      <Link 
        href="/mygift"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: '#388e3c',
          textDecoration: 'none',
          fontWeight: 600,
          marginBottom: 20,
          fontSize: 15
        }}
      >
        <i className="fas fa-arrow-left"></i> {t('back') || 'Back to My Gifts'}
      </Link>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
        color: '#fff',
        padding: '30px',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
              <i className="fas fa-gift"></i> {t('heading') || 'Gift Tree Order'}
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.95, fontSize: 15 }}>
              {t('orderId') || 'Order ID'}: <strong>#{order.orderId}</strong>
            </p>
          </div>
          <div style={{ fontSize: 48, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
            {getOccasionIcon(order.occasion)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        background: '#fff',
        borderRadius: '0 0 12px 12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: 0
      }}>
        {/* Status Section */}
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          <div style={{
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
            background: getStatusColor(order.orderStatus) + '20',
            color: getStatusColor(order.orderStatus),
            border: `2px solid ${getStatusColor(order.orderStatus)}40`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}>
            <i className="fas fa-shipping-fast"></i>
            <span>{t('orderStatus') || 'Order'}: {order.orderStatus}</span>
          </div>
          <div style={{
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
            background: order.paymentStatus === 'COMPLETED' ? '#388e3c20' : '#ff980020',
            color: order.paymentStatus === 'COMPLETED' ? '#388e3c' : '#ff9800',
            border: order.paymentStatus === 'COMPLETED' ? '2px solid #388e3c40' : '2px solid #ff980040',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}>
            <i className="fas fa-money-bill-wave"></i>
            <span>{t('paymentStatus') || 'Payment'}: {order.paymentStatus}</span>
          </div>
        </div>

        {/* Occasion & Date */}
        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
                <i className="fas fa-calendar-alt"></i> {t('occasion') || 'Occasion'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#222' }}>
                {getOccasionLabel(order.occasion)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
                <i className="fas fa-clock"></i> {t('orderDate') || 'Order Date'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#222' }}>
                {new Date(order.orderDate || order.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, color: '#222' }}>
            <i className="fas fa-user-friends" style={{ color: '#388e3c', marginRight: 8 }}></i>
            {t('recipientInfo') || 'Recipient Information'}
          </h3>
          <div style={{
            background: '#f9f9f9',
            padding: '16px',
            borderRadius: 8,
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ marginBottom: 12 }}>
              <i className="fas fa-user" style={{ color: '#388e3c', marginRight: 8, width: 20 }}></i>
              <strong>{order.recipientName}</strong>
            </div>
            <div style={{ marginBottom: 12, fontSize: 14, color: '#666' }}>
              <i className="fas fa-envelope" style={{ color: '#388e3c', marginRight: 8, width: 20 }}></i>
              {order.recipientEmail}
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>
              <i className="fas fa-phone" style={{ color: '#388e3c', marginRight: 8, width: 20 }}></i>
              {order.recipientPhone}
            </div>
          </div>
        </div>

        {/* Sender Information */}
        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, color: '#222' }}>
            <i className="fas fa-user-circle" style={{ color: '#388e3c', marginRight: 8 }}></i>
            {t('senderInfo') || 'Your Information'}
          </h3>
          <div style={{
            background: '#f9f9f9',
            padding: '16px',
            borderRadius: 8,
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ marginBottom: 12 }}>
              <i className="fas fa-user" style={{ color: '#388e3c', marginRight: 8, width: 20 }}></i>
              <strong>{order.senderName}</strong>
            </div>
            {order.senderEmail && (
              <div style={{ marginBottom: 12, fontSize: 14, color: '#666' }}>
                <i className="fas fa-envelope" style={{ color: '#388e3c', marginRight: 8, width: 20 }}></i>
                {order.senderEmail}
              </div>
            )}
            {order.senderPhone && (
              <div style={{ fontSize: 14, color: '#666' }}>
                <i className="fas fa-phone" style={{ color: '#388e3c', marginRight: 8, width: 20 }}></i>
                {order.senderPhone}
              </div>
            )}
          </div>
        </div>

        {/* Personal Message */}
        {order.message && (
          <div style={{ padding: '20px 30px', borderBottom: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, color: '#222' }}>
              <i className="fas fa-heart" style={{ color: '#e91e63', marginRight: 8 }}></i>
              {t('message') || 'Personal Message'}
            </h3>
            <div style={{
              background: '#fff3e0',
              padding: '16px',
              borderRadius: 8,
              border: '1px solid #ffb74d',
              fontStyle: 'italic',
              color: '#555',
              lineHeight: 1.6
            }}>
              "{order.message}"
            </div>
          </div>
        )}

        {/* Selected Trees */}
        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, color: '#222' }}>
            <i className="fas fa-tree" style={{ color: '#388e3c', marginRight: 8 }}></i>
            {t('selectedTrees') || 'Selected Trees'} ({order.numberOfTrees})
          </h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {order.products.map((product, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  background: '#f9f9f9',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0'
                }}
              >
                {product.image && (
                  <img
                    src={`${product.image}`}
                    alt={product.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '2px solid #388e3c'
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#222', marginBottom: 4 }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#388e3c' }}>
                    ₹{product.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address (only for legacy orders that have it) */}
        {order.deliveryAddress && (
        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, color: '#222' }}>
            <i className="fas fa-map-marker-alt" style={{ color: '#388e3c', marginRight: 8 }}></i>
            {t('deliveryAddress') || 'Delivery Address'}
          </h3>
          <div style={{
            background: '#f9f9f9',
            padding: '16px',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
            lineHeight: 1.8,
            color: '#444'
          }}>
            <div>{order.deliveryAddress.street}</div>
            <div>{order.deliveryAddress.city}, {order.deliveryAddress.state}</div>
            <div>{order.deliveryAddress.pincode}, {order.deliveryAddress.country}</div>
            {order.deliveryAddress.landmark && (
              <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                <i className="fas fa-map-pin" style={{ marginRight: 6 }}></i>
                Landmark: {order.deliveryAddress.landmark}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Payment Summary */}
        <div style={{ padding: '20px 30px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, color: '#222' }}>
            <i className="fas fa-receipt" style={{ color: '#388e3c', marginRight: 8 }}></i>
            {t('paymentSummary') || 'Payment Summary'}
          </h3>
          <div style={{
            background: '#f9f9f9',
            padding: '16px',
            borderRadius: 8,
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: '#666' }}>{t('subtotal') || 'Subtotal'}:</span>
              <span style={{ fontWeight: 600 }}>₹{order.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: '#666' }}>{t('deliveryCharge') || 'Delivery Charge'}:</span>
              <span style={{ fontWeight: 600, color: order.deliveryCharge === 0 ? '#388e3c' : '#222' }}>
                {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: '#666' }}>{t('tax') || 'Tax (GST 18%)'}:</span>
              <span style={{ fontWeight: 600 }}>₹{order.tax}</span>
            </div>
            <div style={{ 
              borderTop: '2px solid #388e3c', 
              marginTop: 12, 
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#222' }}>
                {t('total') || 'Total Amount'}:
              </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#388e3c' }}>
                ₹{order.totalAmount}
              </span>
            </div>
            <div style={{ 
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#666' }}>
                <i className="fas fa-credit-card" style={{ marginRight: 8 }}></i>
                {t('paymentMethod') || 'Payment Method'}:
              </span>
              <span style={{ fontWeight: 600 }}>
                {order.paymentMethod}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        marginTop: 24, 
        display: 'flex', 
        gap: 12,
        justifyContent: 'center'
      }}>
        <Link
          href="/mygift"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: '#fff',
            color: '#388e3c',
            border: '2px solid #388e3c',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          <i className="fas fa-arrow-left"></i>
          {t('backToGifts') || 'Back to My Gifts'}
        </Link>
        
        <Link
          href="/gift-a-tree"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: '#388e3c',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          <i className="fas fa-gift"></i>
          {t('sendAnother') || 'Send Another Gift'}
        </Link>
      </div>
    </div>
  )
}