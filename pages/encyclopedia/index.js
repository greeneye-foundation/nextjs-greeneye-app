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
        canonical="https://greeneye.foundation/encyclopedia"
      />
      <section className="page-header">
        <div className="container">
          <h1>Green Encyclopedia</h1>
          <p>Explore our comprehensive knowledge base on plants, environment, and sustainability.</p>
        </div>
      </section>
      <EncyclopediaArticlesSection />
    </>
  );
}
