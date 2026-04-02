import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const Hero = () => {
  const router = useRouter();
  const t = useTranslations('hero');

  return (
    <section className="ge-hero">
      {/* Background layers */}
      <div className="ge-hero__bg">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1920&auto=format"
          alt=""
          className="ge-hero__bg-img"
          loading="eager"
        />
        <div className="ge-hero__bg-overlay" />
        <div className="ge-hero__bg-grain" />
      </div>

      <div className="ge-container ge-hero__inner">
        <div className="ge-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="ge-hero__eyebrow">
              Plant a tree. Change a life.
            </span>
          </motion.div>

          <motion.h1
            className="ge-hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            {t('titleMain')}
          </motion.h1>

          <motion.p
            className="ge-hero__desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {t('description')}
          </motion.p>

          <motion.div
            className="ge-hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <button
              className="ge-btn ge-btn-lg ge-hero__cta-primary"
              onClick={() => router.push('/gift-a-tree')}
            >
              <i className="fas fa-seedling"></i>
              Gift a Tree
            </button>
            <button
              className="ge-btn ge-btn-lg ge-hero__cta-secondary"
              onClick={() => router.push('/donate')}
            >
              Donate Now
            </button>
          </motion.div>

          <motion.div
            className="ge-hero__proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="ge-hero__proof-item">
              <strong>50,000+</strong>
              <span>Trees Planted</span>
            </div>
            <div className="ge-hero__proof-dot" />
            <div className="ge-hero__proof-item">
              <strong>25+</strong>
              <span>Cities</span>
            </div>
            <div className="ge-hero__proof-dot" />
            <div className="ge-hero__proof-item">
              <strong>1,200+</strong>
              <span>Volunteers</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="ge-hero__scroll">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <i className="fas fa-chevron-down"></i>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
