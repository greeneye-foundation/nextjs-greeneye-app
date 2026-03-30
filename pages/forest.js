// pages/forest.js - Global forest map page showing all planted trees
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import Head from 'next/head';
import ForestMap from '@/components/Forest/ForestMap';
import { Trees, Loader } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function getServerSideProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale || 'en'}.json`),
      locale: locale || 'en',
    },
  };
}

export default function ForestPage() {
  const t = useTranslations('forest');

  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all planted trees on mount
  useEffect(() => {
    const fetchTrees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE}/api/trees/forest`);
        if (response.data.success) {
          setTrees(response.data.data || []);
        } else {
          setError('Failed to load forest data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load forest data');
      } finally {
        setLoading(false);
      }
    };

    fetchTrees();
  }, []);

  return (
    <>
      <Head>
        <title>{t('title')} | GreenEye Foundation</title>
        <meta name="description" content={t('subtitle')} />
      </Head>

      <div className="forest-page">
        {loading && (
          <div className="forest-loading">
            <Loader size={32} className="spin" style={{ color: '#2A7A4E' }} />
          </div>
        )}

        {!loading && trees.length === 0 && (
          <div className="forest-empty">
            <Trees size={48} color="#7A8583" />
            <h2>{t('emptyState.heading')}</h2>
            <p>{t('emptyState.body')}</p>
          </div>
        )}

        {!loading && trees.length > 0 && (
          <>
            <div className="forest-header">
              <div className="forest-header-content">
                <h1 className="forest-title">{t('title')}</h1>
                <p className="forest-subtitle">{t('subtitle')}</p>
                <div className="forest-tree-count">
                  <span className="count-number">{trees.length}</span>
                  {t('totalTrees', { count: trees.length })}
                </div>
              </div>
            </div>

            <ForestMap trees={trees} />

            <div className="forest-hint">{t('clickToTrack')}</div>
          </>
        )}
      </div>
    </>
  );
}
