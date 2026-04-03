// components/MyTrees/TreeCard.jsx - Rich tree card component for My Trees dashboard
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Trees } from 'lucide-react';

/**
 * Get badge color class based on tree status
 * @param {string} status - Tree status string
 * @returns {string} CSS class for badge color
 */
function getBadgeClass(status) {
  const upper = (status || '').toUpperCase();
  if (upper === 'PLANTED' || upper === 'GROWING') return 'ge-badge ge-badge-green';
  if (upper === 'PENDING' || upper === 'SELECTED') return 'ge-badge ge-badge-gold';
  return 'ge-badge ge-badge-gray';
}

/**
 * TreeCard - Displays a single tree with photo, info, status badge, and track link
 * @param {Object} props
 * @param {Object} props.tree - Tree object with trackingId, treeName, plantName, species, status, plantedAt, latestPhoto
 */
export default function TreeCard({ tree }) {
  const t = useTranslations('myTrees');

  const displayName = tree.treeName || tree.plantName || 'Your Tree';
  const statusLabel = tree.status
    ? (t.has(`status.${tree.status}`) ? t(`status.${tree.status}`) : tree.status)
    : t.has('status.PLANTED') ? t('status.PLANTED') : 'Planted';

  return (
    <motion.div
      className="ge-mytrees__card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Photo */}
      <div className="ge-mytrees__card-photo">
        {tree.latestPhoto ? (
          <img
            src={tree.latestPhoto}
            alt={displayName}
            loading="lazy"
          />
        ) : (
          <div className="ge-mytrees__card-placeholder">
            <Trees size={40} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="ge-mytrees__card-body">
        <div className="ge-mytrees__card-top">
          <h3>{displayName}</h3>
          <span className={getBadgeClass(tree.status)}>
            {statusLabel}
          </span>
        </div>

        {tree.species && (
          <p className="ge-mytrees__card-species">{tree.species}</p>
        )}

        {tree.plantedAt && (
          <p className="ge-mytrees__card-date">
            {t('plantedOn', { date: new Date(tree.plantedAt).toLocaleDateString() })}
          </p>
        )}

        <div className="ge-mytrees__card-actions">
          <Link
            href={`/track/${tree.trackingId}`}
            className="ge-btn ge-btn-sm ge-btn-primary"
          >
            {t('track')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
