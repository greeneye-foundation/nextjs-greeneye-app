//'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProfileTabs from '@/components/ProfileTabs'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/context/AuthContext'
import Seo from '@/components/common/Seo'

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  };
}

export default function MyGift() {
  const { getAuthHeaders } = useAuth();
  const t = useTranslations('myGift');
  const [giftOrders, setGiftOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!getAuthHeaders().Authorization) {
      router.push('/login')
      return
    }

    // Fetch user's gift tree orders
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gift-tree/my-gifts`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        const userOrders = res.data.data || []
        setGiftOrders(userOrders)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch gift orders:', err)
        setLoading(false)
      })
  }, [router])

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
      CANCELLED: '#f44336',
      COMPLETED: '#388e3c',
      FAILED: '#f44336',
      EXPIRED: '#9e9e9e'
    }
    return colors[status] || '#666'
  }

  if (loading) {
    return (
      <section className="ge-profile">
        <div className="ge-profile__container">
          <div className="ge-profile__loading"><i className="fas fa-spinner fa-spin"></i><p>{t('loading') || 'Loading...'}</p></div>
        </div>
      </section>
    )
  }

  return (
    <>
    <Seo noindex title="My Gift Trees | GreenEye" />
    <section className="ge-profile">
    <div className="ge-profile__container">
      <ProfileTabs />
      <h2 className="ge-profile__page-title">
        <i className="fas fa-gift"></i> {t('heading') || 'My Gift Trees'}
      </h2>
      
      {!giftOrders.length ? (
        <div className="ge-profile__empty">
          <i className="fas fa-gift"></i>
          <p>{t('notFound') || 'No gift tree orders found'}</p>
          <Link href="/gift-a-tree" className="ge-btn ge-btn-primary">
            <i className="fas fa-seedling"></i> {t('sendGift') || 'Send a Gift Tree'}
          </Link>
        </div>
      ) : (
        giftOrders.map((order) => (
          <Link
            key={order._id}
            href={`/giftdetails/${order.orderId}`}
            style={{
              display: 'block',
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: '18px 18px 12px 18px',
              marginBottom: 18,
              textDecoration: 'none',
              color: '#222',
              background: '#fff',
              transition: 'all 0.2s',
              boxShadow: '0 2px 10px #f3f3f3',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(56, 142, 60, 0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px #f3f3f3'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Order ID & Occasion */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 8
            }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                <i className="fas fa-gift" style={{ color: '#388e3c', marginRight: 8 }}></i>
                {t('order') || 'Order'} #{order.orderId.slice(-8).toUpperCase()}
              </div>
              <div style={{ 
                fontSize: 20,
                filter: 'grayscale(0%)'
              }}>
                {getOccasionIcon(order.occasion)}
              </div>
            </div>

            {/* Occasion */}
            <div style={{ 
              fontSize: 13, 
              color: '#666',
              marginBottom: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <i className="fas fa-calendar-alt" style={{ fontSize: 11 }}></i>
              <span style={{ fontWeight: 500 }}>Occasion:</span> {getOccasionLabel(order.occasion)}
            </div>

            {/* Date */}
            <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
              <i className="fas fa-clock" style={{ fontSize: 11, marginRight: 6 }}></i>
              {t('placed') || 'Placed'}: {new Date(order.orderDate || order.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>

            {/* Recipient Info */}
            <div style={{ 
              fontSize: 13, 
              color: '#444',
              background: '#f5f5f5',
              padding: '8px 10px',
              borderRadius: 6,
              marginTop: 10,
              marginBottom: 10
            }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>
                <i className="fas fa-user" style={{ marginRight: 6, color: '#388e3c' }}></i>
                {t('recipient') || 'Recipient'}: {order.recipientName}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                <i className="fas fa-envelope" style={{ marginRight: 6 }}></i>
                {order.recipientEmail}
              </div>
            </div>

            {/* Trees Count */}
            <div style={{ fontSize: 13, color: '#444', marginBottom: 6 }}>
              <i className="fas fa-tree" style={{ color: '#388e3c', marginRight: 6 }}></i>
              <span style={{ fontWeight: 500 }}>{t('trees') || 'Trees'}:</span> {order.numberOfTrees}
            </div>

            {/* Total Amount */}
            <div style={{ fontSize: 13, color: '#444', marginBottom: 8 }}>
              <i className="fas fa-rupee-sign" style={{ marginRight: 6 }}></i>
              <span style={{ fontWeight: 500 }}>{t('amount') || 'Amount'}:</span>{' '}
              <span style={{ fontWeight: 600, color: '#388e3c' }}>₹{order.totalAmount}</span>
            </div>

            {/* Payment Method */}
            <div style={{ fontSize: 13, color: '#444', marginBottom: 6 }}>
              <i className="fas fa-credit-card" style={{ marginRight: 6 }}></i>
              <span style={{ fontWeight: 500 }}>{t('paymentMethod') || 'Payment'}:</span>{' '}
              {order.paymentMethod}
            </div>

            {/* Status Badges */}
            <div style={{ 
              display: 'flex', 
              gap: 8, 
              marginTop: 10,
              flexWrap: 'wrap'
            }}>
              {/* Order Status */}
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                background: getStatusColor(order.orderStatus) + '20',
                color: getStatusColor(order.orderStatus),
                border: `1px solid ${getStatusColor(order.orderStatus)}40`
              }}>
                <i className="fas fa-shipping-fast" style={{ marginRight: 4, fontSize: 10 }}></i>
                {order.orderStatus}
              </div>

              {/* Payment Status */}
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                background: order.paymentStatus === 'COMPLETED' ? '#388e3c20' : '#ff980020',
                color: order.paymentStatus === 'COMPLETED' ? '#388e3c' : '#ff9800',
                border: order.paymentStatus === 'COMPLETED' ? '1px solid #388e3c40' : '1px solid #ff980040'
              }}>
                <i className="fas fa-money-bill-wave" style={{ marginRight: 4, fontSize: 10 }}></i>
                {order.paymentStatus}
              </div>
            </div>

            {/* Track Trees */}
            {order.trees && order.trees.length > 0 && (
              <div style={{
                marginTop: 12,
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap'
              }}>
                {order.trees.map((tree) => (
                  <span
                    key={tree.trackingId}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/track/${tree.trackingId}`;
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      background: '#e8f5e9',
                      color: '#388e3c',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid #388e3c40'
                    }}
                  >
                    <i className="fas fa-seedling"></i>
                    {tree.treeName || tree.plantName} — {tree.status}
                  </span>
                ))}
              </div>
            )}

            {/* View Details Arrow */}
            <div style={{
              textAlign: 'right',
              marginTop: 12,
              color: '#388e3c',
              fontSize: 13,
              fontWeight: 600
            }}>
              {t('viewDetails') || 'View Details'} <i className="fas fa-arrow-right"></i>
            </div>
          </Link>
        ))
      )}
    </div>
    </section>
    </>
  )
}