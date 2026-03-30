// components/TreeTracking/TreeTimeline.jsx - Vertical timeline with lifecycle milestones
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// All lifecycle statuses in order
const LIFECYCLE_STATUSES = [
  'PAID',
  'PLANT_SELECTED',
  'PLANTING_SCHEDULED',
  'PLANTED',
  'GROWING',
];

export default function TreeTimeline({ milestones = [], currentStatus, expectedPlantingDate, onPhotoClick }) {
  const t = useTranslations('treeTracking');

  // Build a map of milestones by status for quick lookup
  const milestoneMap = {};
  milestones.forEach((m) => {
    milestoneMap[m.status] = m;
  });

  // Find the index of the current status
  const currentIndex = LIFECYCLE_STATUSES.indexOf(currentStatus);

  return (
    <ol className="tree-timeline" role="list" aria-label="Tree lifecycle timeline">
      {LIFECYCLE_STATUSES.map((status, index) => {
        const milestone = milestoneMap[status];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        const stepClass = isUpcoming ? 'upcoming' : isCurrent ? 'current' : 'completed';

        return (
          <motion.li
            key={status}
            className={`timeline-step ${stepClass}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeOut' }}
            {...(isCurrent ? { 'aria-current': 'step' } : {})}
          >
            <div className="timeline-dot" />
            <div className="timeline-content">
              <p className="timeline-status-label">{t(`status.${status}`)}</p>

              {/* Show date for completed/current milestones */}
              {milestone?.createdAt && (isCompleted || isCurrent) && (
                <p className="timeline-date">
                  {new Date(milestone.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}

              {/* Show notes */}
              {milestone?.notes && (isCompleted || isCurrent) && (
                <p className="timeline-notes">{milestone.notes}</p>
              )}

              {/* Expected planting date for PLANTED step if not yet planted */}
              {status === 'PLANTED' && isUpcoming && expectedPlantingDate && (
                <p className="timeline-expected">
                  {t('expectedBy', { date: new Date(expectedPlantingDate).toLocaleDateString() })}
                </p>
              )}

              {/* Photos */}
              {milestone?.photos && milestone.photos.length > 0 && (isCompleted || isCurrent) && (
                <div className="milestone-photos">
                  {milestone.photos.map((photoUrl, pIdx) => (
                    <img
                      key={pIdx}
                      src={photoUrl}
                      alt={`${t(`status.${status}`)} photo ${pIdx + 1}`}
                      className="milestone-photo"
                      onClick={() => onPhotoClick && onPhotoClick(photoUrl)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onPhotoClick && onPhotoClick(photoUrl);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${t(`status.${status}`)} photo ${pIdx + 1} full size`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
