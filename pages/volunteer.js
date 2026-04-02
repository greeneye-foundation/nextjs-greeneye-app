import { useTranslations } from 'next-intl';
import Seo from '@/components/common/Seo';
import Volunteer from '@/components/Volunteer';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
}

export default function VolunteerPage() {
  const t = useTranslations('volunteer');
  return (
    <>
      <Seo
        title={t('seoTitle', { defaultMessage: 'Volunteer with Us | GreenEye' })}
        description={t('seoDescription', { defaultMessage: 'Become part of a movement for a greener planet. Sign up today to volunteer with GreenEye.' })}
        ogTitle={t('seoTitle', { defaultMessage: 'Volunteer with Us | GreenEye' })}
        ogDescription={t('seoDescription', { defaultMessage: 'Become part of a movement for a greener planet. Sign up today to volunteer with GreenEye.' })}
        canonical="https://greeneye.foundation/volunteer"
        siteName="GREENEYE"
        twitterSite="@greeneye_org"
      />
      <section className="ge-section" style={{ paddingBottom: 0 }}>
        <div className="ge-container" style={{ textAlign: 'center' }}>
          <span className="ge-overline">Join the Movement</span>
          <h1>{t('pageTitle', { defaultMessage: 'Volunteer with Us' })}</h1>
          <p style={{ color: 'var(--ge-slate)', maxWidth: 520, margin: '0 auto' }}>{t('pageSubtitle', { defaultMessage: 'Become part of a movement for a greener planet. Sign up today!' })}</p>
        </div>
      </section>
      <Volunteer />
    </>
  );
}