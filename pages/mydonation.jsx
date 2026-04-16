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

export default function MyDonations() {
  const { getAuthHeaders, isLoading: authLoading, isLoggedIn } = useAuth();
  const t = useTranslations('myDonations');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { router.push('/login?from=/mydonation'); return; }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/mydonations`, { headers: getAuthHeaders() })
      .then((res) => { setDonations(res.data || []); setLoading(false); })
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
      <Seo noindex title="My Donations | GreenEye" />
      <section className="ge-profile">
        <div className="ge-profile__container">
          <ProfileTabs />
          <h2 className="ge-profile__page-title"><i className="fas fa-heart"></i> {t('heading')}</h2>

          {!donations.length ? (
            <div className="ge-profile__empty">
              <i className="fas fa-heart"></i>
              <p>{t('notFound')}</p>
              <Link href="/donate" className="ge-profile__empty-cta">Make a Donation</Link>
            </div>
          ) : (
            <div className="ge-profile__list">
              {donations.map((donation) => (
                <Link key={donation._id} href={`/donationdetails/${donation._id}`} className="ge-profile__list-card">
                  <div className="ge-profile__list-row">
                    <strong>#{donation._id.slice(-6).toUpperCase()}</strong>
                    <span className={`ge-badge ${donation.isPaid ? 'ge-badge-green' : 'ge-badge-red'}`}>
                      {donation.isPaid ? t('paid') : t('pending')}
                    </span>
                  </div>
                  <div className="ge-profile__list-meta">
                    <span><i className="fas fa-clock"></i> {new Date(donation.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span><i className="fas fa-rupee-sign"></i> ₹{donation.amount}</span>
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
