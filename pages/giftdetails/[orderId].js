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
      birthday: '🎂', anniversary: '💑', wedding: '💒',
      memorial: '🕊️', corporate: '🏢', holiday: '🎄', 'just-because': '💚'
    }
    return icons[occasion] || '🎁'
  }

  const getOccasionLabel = (occasion) => {
    const labels = {
      birthday: 'Birthday', anniversary: 'Anniversary', wedding: 'Wedding',
      memorial: 'Memorial', corporate: 'Corporate Gift', holiday: 'Holiday', 'just-because': 'Just Because'
    }
    return labels[occasion] || occasion
  }

  const getBadgeClass = (status) => {
    const map = {
      PENDING: 'ge-badge-gold', CONFIRMED: 'ge-badge-blue', PROCESSING: 'ge-badge-blue',
      CANCELLED: 'ge-badge-red', COMPLETED: 'ge-badge-green', FAILED: 'ge-badge-red', EXPIRED: 'ge-badge-gray'
    }
    return map[status] || 'ge-badge-gray'
  }

  if (loading) {
    return (
      <div className="ge-detail ge-detail-wide">
        <div className="ge-detail-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>{t('loading') || 'Loading gift details...'}</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="ge-detail ge-detail-wide">
        <div className="ge-detail-empty">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{t('notFound') || 'Gift order not found'}</p>
          <Link href="/mygift" className="ge-btn ge-btn-primary">
            <i className="fas fa-arrow-left"></i> {t('back') || 'Back to My Gifts'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ge-detail ge-detail-wide">
      {/* Back Button */}
      <Link href="/mygift" className="ge-detail-back">
        <i className="fas fa-arrow-left"></i> {t('back') || 'Back to My Gifts'}
      </Link>

      {/* Header */}
      <div className="ge-detail-header">
        <div>
          <div className="ge-detail-header-title">
            <i className="fas fa-gift"></i>
            {t('heading') || 'Gift Tree Order'}
          </div>
          <div className="ge-detail-header-sub">
            {t('orderId') || 'Order ID'}: <strong>#{order.orderId}</strong>
          </div>
        </div>
        <div className="ge-detail-header-icon">
          {getOccasionIcon(order.occasion)}
        </div>
      </div>

      {/* Main Content */}
      <div className="ge-detail-card ge-detail-card--body">
        {/* Status Badges */}
        <div className="ge-detail-badges">
          <span className={`ge-badge ${getBadgeClass(order.orderStatus)}`}>
            <i className="fas fa-shipping-fast"></i>
            {t('orderStatus') || 'Order'}: {order.orderStatus}
          </span>
          <span className={`ge-badge ${order.paymentStatus === 'COMPLETED' ? 'ge-badge-green' : 'ge-badge-gold'}`}>
            <i className="fas fa-money-bill-wave"></i>
            {t('paymentStatus') || 'Payment'}: {order.paymentStatus}
          </span>
        </div>

        {/* Occasion & Date */}
        <div className="ge-detail-section">
          <div className="ge-detail-meta">
            <div>
              <div className="ge-detail-meta-label">
                {t('occasion') || 'Occasion'}
              </div>
              <div className="ge-detail-meta-value">
                {getOccasionLabel(order.occasion)}
              </div>
            </div>
            <div>
              <div className="ge-detail-meta-label">
                {t('orderDate') || 'Order Date'}
              </div>
              <div className="ge-detail-meta-value">
                {new Date(order.orderDate || order.createdAt).toLocaleString('en-IN', {
                  day: '2-digit', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div className="ge-detail-section">
          <h3 className="ge-detail-section-title">
            <i className="fas fa-user-friends"></i>
            {t('recipientInfo') || 'Recipient Information'}
          </h3>
          <div className="ge-detail-infobox">
            <div className="ge-detail-infobox-row">
              <i className="fas fa-user"></i>
              <strong>{order.recipientName}</strong>
            </div>
            <div className="ge-detail-infobox-row">
              <i className="fas fa-envelope"></i>
              {order.recipientEmail}
            </div>
            <div className="ge-detail-infobox-row">
              <i className="fas fa-phone"></i>
              {order.recipientPhone}
            </div>
          </div>
        </div>

        {/* Sender Information */}
        <div className="ge-detail-section">
          <h3 className="ge-detail-section-title">
            <i className="fas fa-user-circle"></i>
            {t('senderInfo') || 'Your Information'}
          </h3>
          <div className="ge-detail-infobox">
            <div className="ge-detail-infobox-row">
              <i className="fas fa-user"></i>
              <strong>{order.senderName}</strong>
            </div>
            {order.senderEmail && (
              <div className="ge-detail-infobox-row">
                <i className="fas fa-envelope"></i>
                {order.senderEmail}
              </div>
            )}
            {order.senderPhone && (
              <div className="ge-detail-infobox-row">
                <i className="fas fa-phone"></i>
                {order.senderPhone}
              </div>
            )}
          </div>
        </div>

        {/* Personal Message */}
        {order.message && (
          <div className="ge-detail-section">
            <h3 className="ge-detail-section-title">
              <i className="fas fa-heart"></i>
              {t('message') || 'Personal Message'}
            </h3>
            <div className="ge-detail-message">
              &ldquo;{order.message}&rdquo;
            </div>
          </div>
        )}

        {/* Selected Trees */}
        <div className="ge-detail-section">
          <h3 className="ge-detail-section-title">
            <i className="fas fa-tree"></i>
            {t('selectedTrees') || 'Selected Trees'} ({order.numberOfTrees})
          </h3>
          {order.products.map((product, index) => (
            <div key={index} className="ge-detail-product">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="ge-detail-product-img"
                />
              )}
              <div>
                <div className="ge-detail-product-name">{product.name}</div>
                <div className="ge-detail-product-price">₹{product.price}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Track Your Trees */}
        {order.trees && order.trees.length > 0 && (
          <div className="ge-detail-section">
            <h3 className="ge-detail-section-title">
              <i className="fas fa-map-marked-alt"></i>
              Track Your Trees
            </h3>
            {order.trees.map((tree) => (
              <Link
                key={tree.trackingId}
                href={`/track/${tree.trackingId}`}
                className="ge-detail-track"
              >
                <div>
                  <div className="ge-detail-track-name">
                    <i className="fas fa-seedling" style={{ color: 'var(--ge-forest)', marginRight: '8px' }}></i>
                    {tree.treeName || tree.plantName}
                  </div>
                  <div className="ge-detail-track-status">
                    Status: <span>{tree.status}</span>
                  </div>
                </div>
                <div className="ge-detail-track-btn">
                  Track <i className="fas fa-arrow-right"></i>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="ge-detail-section">
            <h3 className="ge-detail-section-title">
              <i className="fas fa-map-marker-alt"></i>
              {t('deliveryAddress') || 'Delivery Address'}
            </h3>
            <div className="ge-detail-infobox">
              <div className="ge-detail-infobox-row">
                <i className="fas fa-road"></i>
                {order.deliveryAddress.street}
              </div>
              <div className="ge-detail-infobox-row">
                <i className="fas fa-city"></i>
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </div>
              <div className="ge-detail-infobox-row">
                <i className="fas fa-globe"></i>
                {order.deliveryAddress.pincode}, {order.deliveryAddress.country}
              </div>
              {order.deliveryAddress.landmark && (
                <div className="ge-detail-infobox-row">
                  <i className="fas fa-map-pin"></i>
                  Landmark: {order.deliveryAddress.landmark}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="ge-detail-section">
          <h3 className="ge-detail-section-title">
            <i className="fas fa-receipt"></i>
            {t('paymentSummary') || 'Payment Summary'}
          </h3>
          <div className="ge-detail-infobox">
            <div className="ge-detail-summary-row">
              <span>{t('subtotal') || 'Subtotal'}</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="ge-detail-summary-row">
              <span>{t('tax') || 'Tax (GST 18%)'}</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="ge-detail-summary-total">
              <span className="ge-detail-summary-total-label">
                {t('total') || 'Total Amount'}
              </span>
              <span className="ge-detail-summary-total-value">
                ₹{order.totalAmount}
              </span>
            </div>
            <div className="ge-detail-summary-row" style={{ marginTop: 'var(--ge-space-3)', paddingTop: 'var(--ge-space-3)', borderTop: '1px solid var(--ge-cloud)' }}>
              <span>
                <i className="fas fa-credit-card" style={{ marginRight: '8px' }}></i>
                {t('paymentMethod') || 'Payment Method'}
              </span>
              <span style={{ fontWeight: 600 }}>{order.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="ge-detail-actions">
        <Link href="/mygift" className="ge-btn ge-btn-secondary">
          <i className="fas fa-arrow-left"></i>
          {t('backToGifts') || 'Back to My Gifts'}
        </Link>
        <Link href="/gift-a-tree" className="ge-btn ge-btn-primary">
          <i className="fas fa-gift"></i>
          {t('sendAnother') || 'Send Another Gift'}
        </Link>
      </div>
    </div>
  )
}
