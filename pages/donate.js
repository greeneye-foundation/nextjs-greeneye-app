import { useTranslations } from 'next-intl';
import Seo from '@/components/common/Seo';
import Donate from '@/components/Donate';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
}

export default function DonatePage() {
  const t = useTranslations('donate');
  return (
    <>
      <Seo
        title={t('seoTitle', { defaultMessage: 'Support GreenEye | Donate' })}
        description={t('seoDescription', { defaultMessage: "Your donation helps us plant more trees and expand our environmental impact. Support GreenEye's mission for a greener planet." })}
        ogTitle={t('seoTitle', { defaultMessage: 'Support GreenEye | Donate' })}
        ogDescription={t('seoDescription', { defaultMessage: "Your donation helps us plant more trees and expand our environmental impact. Support GreenEye's mission for a greener planet." })}
        canonical="https://greeneye.foundation/donate"
        siteName="GREENEYE"
        twitterSite="@greeneye_org"
      />
      <section className="page-header">
        <div className="container">
          <h1>{t('pageTitle', { defaultMessage: 'Support GreenEye' })}</h1>
          <p>{t('pageSubtitle', { defaultMessage: "Your donation helps us plant more trees and expand our environmental impact." })}</p>
        </div>
      </section>
      <Donate />
    </>
  );
}