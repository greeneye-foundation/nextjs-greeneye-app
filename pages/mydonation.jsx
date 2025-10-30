//'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileTabs from '@/components/ProfileTabs';
import { useTranslations } from 'next-intl';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  };
}

export default function MyDonations() {
    const t = useTranslations('myDonations');
    const [donations, setDonations] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            router.push('/login')
            return
        }

        axios
            .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/mydonations`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setDonations(res.data || [])
                setLoading(false)
            })
            .catch((err) => {
                // Error fetching donations - show empty state
                setLoading(false)
            })
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

    if (!donations.length) {
        return (
            <div className="container" style={{ maxWidth: 600, marginTop: 60 }}>
                <div style={{ color: '#888' }}>{t('notFound')}</div>
            </div>
        )
    }

    return (
        <div className="container" style={{ maxWidth: 600, marginTop: 70 }}>
            <ProfileTabs />
            <h2 style={{ marginTop: 5, marginBottom: 20 }}>
                <i className="fas fa-hand-holding-heart"></i> {t('heading')}
            </h2>
            {donations.map((donation) => (
                <Link
                    key={donation._id}
                    href={`/donationdetails/${donation._id}`}
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
                        {t('donation')} #{donation._id.slice(-6).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 13, color: '#666' }}>
                        {t('date')}: {new Date(donation.createdAt).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                        {t('amount')}: ₹{donation.amount}
                    </div>
                    <div>
                        <span style={{ fontWeight: 500 }}>{t('status')}:</span>{' '}
                        <span
                            style={{
                                color: donation.isPaid ? '#388e3c' : '#b62222',
                                fontWeight: 600,
                            }}
                        >
                            {donation.isPaid ? t('paid') : t('pending')}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    )
}