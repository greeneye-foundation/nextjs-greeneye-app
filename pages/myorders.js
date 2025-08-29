//'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProfileTabs from '@/components/ProfileTabs'
import { useTranslations } from 'next-intl'

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  };
}

export default function MyOrders() {
  const t = useTranslations('myOrders');
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
      return
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 600, marginTop: 40 }}>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <i className="fas fa-spinner fa-spin"></i> {t('loading')}
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: 70 }}>
      <ProfileTabs />
      <h2 style={{ marginTop: 30, marginBottom: 20 }}>
        <i className="fas fa-box"></i> {t('heading')}
      </h2>
      {!orders.length ? (
        <div style={{ color: '#888' }}>{t('notFound')}</div>
      ) : (
        orders.map((order) => (
          <Link
            key={order._id}
            href={`orderdetails/${order._id}`}
            style={{
              display: 'block',
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: '18px 18px 12px 18px',
              marginBottom: 18,
              textDecoration: 'none',
              color: '#222',
              background: '#fff',
              transition: 'box-shadow 0.2s',
              boxShadow: '0 2px 10px #f3f3f3',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {t('order')} #{order._id.slice(-6).toUpperCase()}
            </div>

            <div style={{ fontSize: 13, color: '#666' }}>
              {t('placed')}: {new Date(order.createdAt).toLocaleString()}
            </div>

            <div style={{ fontSize: 13, color: '#888', margin: '6px 0' }}>
              {t('items')}: {order.orderItems.length}
            </div>

            {/* ✅ Payment Method */}
            <div style={{ fontSize: 13, color: '#444', margin: '6px 0' }}>
              <span style={{ fontWeight: 500 }}>{t('paymentMethod')}:</span>{' '}
              {order.paymentMethod}
            </div>

            {/* ✅ Payment Status */}
            <div>
              <span style={{ fontWeight: 500 }}>{t('payment')}:</span>{' '}
              <span
                style={{
                  color: order.isPaid ? '#388e3c' : '#b62222',
                  fontWeight: 600,
                }}
              >
                {order.isPaid ? t('paid') : t('notPaid')}
              </span>
            </div>  

            {/* ✅ Delivery Status */}
            <div>
              <span style={{ fontWeight: 500 }}>{t('status')}:</span>{' '}
              <span
                style={{
                  color: order.isDelivered ? '#388e3c' : '#b62222',
                  fontWeight: 600,
                }}
              >
                {order.isDelivered ? t('delivered') : t('pending')}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
