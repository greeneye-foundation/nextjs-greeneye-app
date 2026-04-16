import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileTabs from '@/components/ProfileTabs';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import Seo from '@/components/common/Seo';

export function getStaticProps({ locale }) {
  return { props: { messages: require(`../locales/${locale}.json`), locale } };
}

export default function MyOrders() {
  const { getAuthHeaders, isLoading: authLoading, isLoggedIn } = useAuth();
  const t = useTranslations('myOrders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { router.push('/login?from=/myorders'); return; }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/myorders`, { headers: getAuthHeaders() })
      .then((res) => { setOrders(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [authLoading, isLoggedIn]);

  if (loading || authLoading) {
    return (
      <section className="ge-profile">
        <div className="ge-profile__container">
          <div className="ge-profile__loading"><i className="fas fa-spinner fa-spin"></i><p>{t('loading')}</p></div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo noindex title="My Orders | GreenEye" />
      <section className="ge-profile">
        <div className="ge-profile__container">
          <ProfileTabs />
          <h2 className="ge-profile__page-title"><i className="fas fa-box"></i> {t('heading')}</h2>

          {!orders.length ? (
            <div className="ge-profile__empty">
              <i className="fas fa-box-open"></i>
              <p>{t('notFound')}</p>
              <Link href="/plantshop" className="ge-profile__empty-cta">Browse Plant Shop</Link>
            </div>
          ) : (
            <div className="ge-profile__list">
              {orders.map((order) => (
                <Link key={order._id} href={`/orderdetails/${order._id}`} className="ge-profile__list-card">
                  <div className="ge-profile__list-row">
                    <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                    <span className={`ge-badge ${order.isPaid ? 'ge-badge-green' : 'ge-badge-red'}`}>
                      {order.isPaid ? t('paid') : t('notPaid')}
                    </span>
                  </div>
                  <div className="ge-profile__list-meta">
                    <span><i className="fas fa-clock"></i> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span><i className="fas fa-box"></i> {order.orderItems.length} {t('items')}</span>
                    <span><i className="fas fa-credit-card"></i> {order.paymentMethod}</span>
                  </div>
                  <div className="ge-profile__list-status">
                    <span>{t('status')}: </span>
                    <strong style={{ color: order.isDelivered ? 'var(--ge-forest)' : 'var(--ge-gold)' }}>
                      {order.isDelivered ? t('delivered') : t('pending')}
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
