// components/TreeTracking/TreeHeader.jsx - Rich header with photo background and status badge
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function TreeHeader({ tree }) {
  const t = useTranslations('treeTracking');

  const displayName = tree.treeName || tree.plantName || 'Your Tree';
  const hasPhoto = !!tree.latestPhoto;

  return (
    <div className="tree-header">
      {/* Background */}
      <div
        className={`tree-header-bg ${!hasPhoto ? 'tree-header-no-photo' : ''}`}
        style={hasPhoto ? { backgroundImage: `url(${tree.latestPhoto})` } : {}}
      />

      {/* Content overlay */}
      <div className="tree-header-content">
        {/* Status badge with pulse animation */}
        <motion.span
          className={`tree-status-badge ${tree.status}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ alignSelf: 'flex-start', marginBottom: '12px' }}
        >
          {t(`status.${tree.status}`)}
        </motion.span>

        <h1 className="tree-header-name">{displayName}</h1>

        {tree.species && (
          <p className="tree-header-species">{tree.species}</p>
        )}
        {!tree.species && tree.plantName && tree.treeName && (
          <p className="tree-header-species">{tree.plantName}</p>
        )}

        {/* Quick stats */}
        {tree.plantedAt && (
          <p className="tree-header-species" style={{ opacity: 0.8, fontSize: '14px' }}>
            Planted on {new Date(tree.plantedAt).toLocaleDateString()}
          </p>
        )}

        {/* Gift info */}
        {tree.senderName && tree.recipientName && (
          <p className="tree-header-species" style={{ opacity: 0.8, fontSize: '14px' }}>
            {tree.senderName} &rarr; {tree.recipientName}
            {tree.occasion ? ` | ${tree.occasion}` : ''}
          </p>
        )}
      </div>
    </div>
  );
}
