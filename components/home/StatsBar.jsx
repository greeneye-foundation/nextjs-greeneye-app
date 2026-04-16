import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import axios from 'axios';

const StatsBar = () => {
  const t = useTranslations('statsBar');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trees/stats`
        );
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        // Silently fail — statsbar is non-critical
        console.error('StatsBar fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = stats
    ? [
        { value: stats.totalPlanted, label: t('treesPlanted') },
        { value: stats.co2AbsorbedKg, label: t('co2Absorbed') },
        { value: stats.forestAreaSqM, label: t('forestArea') },
      ]
    : [];

  const formatNumber = (num) => {
    if (num == null) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <section className="ge-statsbar">
      <div className="ge-container ge-statsbar__inner">
        {loading ? (
          <div className="ge-statsbar__items">
            {[0, 1, 2].map((i) => (
              <div key={i} className="ge-statsbar__item">
                <div className="ge-statsbar__skeleton" />
                <div className="ge-statsbar__skeleton ge-statsbar__skeleton--label" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="ge-statsbar__items">
              {statItems.map((item, i) => (
                <motion.div
                  key={i}
                  className="ge-statsbar__item"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <span className="ge-statsbar__number">
                    {formatNumber(item.value)}+
                  </span>
                  <span className="ge-statsbar__label">{item.label}</span>
                </motion.div>
              ))}
            </div>
            <p className="ge-statsbar__footnote">{t('estimated')}</p>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default StatsBar;
