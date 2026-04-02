import { useTranslations } from 'next-intl';
import Seo from '@/components/common/Seo';
import Impact from '@/components/Impact';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
}

export default function ImpactPage() {
  const t = useTranslations('impact');
  return (
    <>
      <Seo
        title={t('seoTitle', { defaultMessage: 'Our Impact | GreenEye' })}
        description={t('seoDescription', { defaultMessage: "Measurable results and stories from our global reforestation journey. See how GreenEye is making a difference." })}
        ogTitle={t('seoTitle', { defaultMessage: 'Our Impact | GreenEye' })}
        ogDescription={t('seoDescription', { defaultMessage: "Measurable results and stories from our global reforestation journey. See how GreenEye is making a difference." })}
        canonical="https://greeneye.foundation/impact"
        siteName="GREENEYE"
        twitterSite="@greeneye_org"
      />
      <section className="ge-section" style={{ paddingBottom: 0 }}>
        <div className="ge-container" style={{ textAlign: 'center' }}>
          <span className="ge-overline">Making a Difference</span>
          <h1>{t('pageTitle', { defaultMessage: 'Our Impact' })}</h1>
          <p style={{ color: 'var(--ge-slate)', maxWidth: 520, margin: '0 auto' }}>{t('pageSubtitle', { defaultMessage: "Measurable results and stories from our global reforestation journey." })}</p>
        </div>
      </section>
      <Impact />
    </>
  );
}