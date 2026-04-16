import { useTranslations } from 'next-intl';
import Seo from '@/components/common/Seo';
import Programs from '@/components/Programs';
import Impact from '@/components/Impact';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
}

export default function ProgramsPage() {
  const t = useTranslations('programs');
  return (
    <>
      <Seo
        title={t('seoTitle', { defaultMessage: 'Our Programs | GreenEye' })}
        description={t('seoDescription', { defaultMessage: 'Explore our reforestation, education, and community initiatives. Join GreenEye\'s programs for a greener future.' })}
        ogTitle={t('seoTitle', { defaultMessage: 'Our Programs | GreenEye' })}
        ogDescription={t('seoDescription', { defaultMessage: 'Explore our reforestation, education, and community initiatives. Join GreenEye\'s programs for a greener future.' })}
        canonical="https://greeneye.foundation/programs"
        siteName="GREENEYE"
        twitterSite="@greeneye_org"
      />
      <section className="ge-section" style={{ paddingBottom: 0 }}>
        <div className="ge-container" style={{ textAlign: 'center' }}>
          <span className="ge-overline">What We Do</span>
          <h1>{t('pageTitle', { defaultMessage: 'Our Programs' })}</h1>
          <p style={{ color: 'var(--ge-slate)', maxWidth: 520, margin: '0 auto' }}>{t('pageSubtitle', { defaultMessage: 'Explore our reforestation, education, and community initiatives.' })}</p>
        </div>
      </section>
      <Impact />
      <Programs />
    </>
  );
}