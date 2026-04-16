import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import axios from 'axios';

function getDaysAgo(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const planted = new Date(dateStr);
  const diffMs = now - planted;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

const PhotoProofStrip = () => {
  const t = useTranslations('photoStrip');
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trees/recent-plantings`
        );
        if (res.data?.success && res.data.data?.length) {
          setPhotos(res.data.data);
        }
      } catch (err) {
        // Silently fail — photo strip is non-critical
        console.error('PhotoProofStrip fetch error:', err.message);
      }
    };
    fetchPhotos();
  }, []);

  if (!photos.length) return null;

  const getTimeLabel = (dateStr) => {
    const days = getDaysAgo(dateStr);
    if (days === null) return '';
    if (days === 0) return t('today');
    if (days === 1) return t('yesterday');
    return t('daysAgo', { days });
  };

  return (
    <section className="ge-proof-strip">
      <div className="ge-container">
        <div className="ge-proof-strip__header">
          <h3>{t('title')}</h3>
        </div>
        <div className="ge-proof-strip__scroll">
          {photos.map((tree, i) => (
            <motion.div
              key={i}
              className="ge-proof-strip__card"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="ge-proof-strip__photo">
                <img
                  src={tree.latestPhoto}
                  alt={tree.treeName || tree.plantName || tree.species || 'Tree'}
                  loading="lazy"
                />
              </div>
              <div className="ge-proof-strip__info">
                <span className="ge-proof-strip__name">
                  {tree.treeName || tree.plantName || tree.species || 'Tree'}
                </span>
                <span className="ge-proof-strip__time">
                  {getTimeLabel(tree.plantedAt)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoProofStrip;
