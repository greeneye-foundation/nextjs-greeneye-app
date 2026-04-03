// pages/my-trees.js - My Trees dashboard page with auth guard
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import Seo from '@/components/common/Seo';
import MyTreesMap from '@/components/MyTrees/MyTreesMap';
import TreeCard from '@/components/MyTrees/TreeCard';
import { useAuth } from '@/context/AuthContext';
import { Trees, Gift } from 'lucide-react';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    },
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function MyTreesPage() {
  const { getAuthHeaders, isLoading: authLoading, isLoggedIn } = useAuth();
  const t = useTranslations('myTrees');
  const router = useRouter();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.push('/login?from=/my-trees');
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trees/my-trees`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        setTrees(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch trees:', err);
        setError(err.response?.data?.message || 'Failed to load your trees');
        setLoading(false);
      });
  }, [authLoading, isLoggedIn]);

  // Loading state
  if (loading || authLoading) {
    return (
      <>
        <Seo noindex title="My Trees | GreenEye" />
        <section className="ge-mytrees">
          <div className="ge-mytrees__inner">
            <div className="ge-mytrees__loading">
              <Trees size={24} style={{ marginRight: 8 }} />
              Loading your trees...
            </div>
          </div>
        </section>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Seo noindex title="My Trees | GreenEye" />
        <section className="ge-mytrees">
          <div className="ge-mytrees__inner">
            <div className="ge-mytrees__empty">
              <p style={{ color: 'var(--ge-error)' }}>{error}</p>
              <button
                className="ge-btn ge-btn-primary"
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  axios
                    .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trees/my-trees`, {
                      headers: getAuthHeaders(),
                    })
                    .then((res) => {
                      setTrees(res.data.data || []);
                      setLoading(false);
                    })
                    .catch((err) => {
                      setError(err.response?.data?.message || 'Failed to load your trees');
                      setLoading(false);
                    });
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Empty state (0 trees)
  if (trees.length === 0) {
    return (
      <>
        <Seo noindex title="My Trees | GreenEye" />
        <section className="ge-mytrees">
          <div className="ge-mytrees__inner">
            <div className="ge-mytrees__empty">
              <div className="ge-mytrees__empty-icon">
                <Trees size={48} />
              </div>
              <p>{t('empty')}</p>
              <Link href="/gift-a-tree" className="ge-btn ge-btn-primary">
                <Gift size={18} />
                {t('emptyCta')}
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Trees loaded
  return (
    <>
      <Seo noindex title="My Trees | GreenEye" />
      <section className="ge-mytrees">
        <div className="ge-mytrees__inner">
          {/* Header */}
          <div className="ge-mytrees__header">
            <h1 className="ge-mytrees__title">
              {t('pageTitle')}
              <span className="ge-mytrees__count">
                {t('treeCount', { count: trees.length })}
              </span>
            </h1>
          </div>

          {/* Map */}
          <div className="ge-mytrees__map-container">
            <MyTreesMap trees={trees} />
          </div>

          {/* Tree card list */}
          <div className="ge-mytrees__list">
            {trees.map((tree, i) => (
              <motion.div
                key={tree.trackingId}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <TreeCard tree={tree} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
