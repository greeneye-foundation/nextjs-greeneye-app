import { useTranslations } from 'next-intl';
import Seo from '@/components/common/Seo';
import EncyclopediaArticlesSection from '@/components/EncyclopediaArticlesSection';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`),
      locale,
    },
  };
}

export default function EncyclopediaPage() {
  return (
    <>
      <Seo
        title="Green Encyclopedia | GEYE INNOVATION FOUNDATION"
        description="Explore our comprehensive encyclopedia of plants, environmental topics, policies, and sustainable products."
        ogTitle="Green Encyclopedia | GEYE INNOVATION FOUNDATION"
        ogDescription="Explore our comprehensive encyclopedia of plants, environmental topics, policies, and sustainable products."
        canonical="https://greeneye.foundation/encyclopedia"
        siteName="GREENEYE"
        twitterSite="@greeneye_org"
      />
      <section className="ge-section" style={{ paddingBottom: 0 }}>
        <div className="ge-container" style={{ textAlign: 'center' }}>
          <span className="ge-overline">Knowledge Base</span>
          <h1>Green Encyclopedia</h1>
          <p style={{ color: 'var(--ge-slate)', maxWidth: 520, margin: '0 auto' }}>
            Explore our comprehensive knowledge base on plants, environment, and sustainability.
          </p>
        </div>
      </section>
      <EncyclopediaArticlesSection />
    </>
  );
}
