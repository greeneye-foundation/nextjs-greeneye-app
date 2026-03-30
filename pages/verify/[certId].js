// pages/verify/[certId].js - Public certificate verification page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle, ExternalLink, Loader } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function getServerSideProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale || 'en'}.json`),
      locale: locale || 'en',
    },
  };
}

export default function VerifyCertificatePage() {
  const router = useRouter();
  const { certId } = router.query;
  const t = useTranslations('certificate');

  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch certificate verification data
  useEffect(() => {
    if (!certId) return;

    const fetchCertificate = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(
          `${API_BASE}/api/trees/verify/${certId}`
        );
        if (response.data.success) {
          setTree(response.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certId]);

  // Loading state
  if (loading) {
    return (
      <>
        <Head>
          <title>{t('verifiedTitle')} | GreenEye Foundation</title>
        </Head>
        <div className="verify-page">
          <div className="verify-loading">
            <Loader size={32} className="spin" style={{ color: '#2A7A4E' }} />
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !tree) {
    return (
      <>
        <Head>
          <title>{t('errorState.heading')} | GreenEye Foundation</title>
        </Head>
        <div className="verify-page">
          <div className="verify-error">
            <h2>{t('errorState.heading')}</h2>
            <p>{t('errorState.body')}</p>
            <Link href="/contact">Contact us</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{t('verifiedTitle')} | GreenEye Foundation</title>
        <meta
          name="description"
          content={`Verified certificate for ${tree.treeName || 'a tree'} at GreenEye Foundation`}
        />
      </Head>

      <div className="verify-page">
        <div className="verify-card">
          <div className="verify-checkmark">
            <CheckCircle size={32} />
          </div>

          <h1 className="verify-title">{t('verifiedTitle')}</h1>

          <div className="verify-details">
            {tree.occasion && (
              <div className="verify-detail-row">
                <span className="verify-detail-label">{t('occasion')}</span>
                <span className="verify-detail-value">{tree.occasion}</span>
              </div>
            )}
            {tree.senderName && (
              <div className="verify-detail-row">
                <span className="verify-detail-label">{t('from')}</span>
                <span className="verify-detail-value">{tree.senderName}</span>
              </div>
            )}
            {tree.recipientName && (
              <div className="verify-detail-row">
                <span className="verify-detail-label">{t('to')}</span>
                <span className="verify-detail-value">{tree.recipientName}</span>
              </div>
            )}
            {tree.treeName && (
              <div className="verify-detail-row">
                <span className="verify-detail-label">{t('treeName')}</span>
                <span className="verify-detail-value">{tree.treeName}</span>
              </div>
            )}
            {(tree.species || tree.plantName) && (
              <div className="verify-detail-row">
                <span className="verify-detail-label">Species</span>
                <span className="verify-detail-value">{tree.species || tree.plantName}</span>
              </div>
            )}
            <div className="verify-detail-row">
              <span className="verify-detail-label">{t('certificateId')}</span>
              <span className="verify-detail-value">{tree.certificateId}</span>
            </div>
          </div>

          <Link href={`/track/${tree.trackingId}`} className="verify-track-btn">
            <ExternalLink size={18} />
            {t('trackTree')}
          </Link>
        </div>
      </div>
    </>
  );
}
