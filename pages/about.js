import { useTranslations } from 'next-intl';
import Seo from '@/components/common/Seo';
import About from '@/components/About';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
}

export default function AboutPage() {
  const t = useTranslations('about');
  return (
    <>
      <Seo
        title={t('seoTitle')}
        description={t('seoDescription')}
        ogTitle={t('seoTitle')}
        ogDescription={t('seoDescription')}
        canonical="https://greeneye.foundation/about"
        siteName="GREENEYE"
        twitterSite="@greeneye_org"
      />
      <About />
    </>
  );
}