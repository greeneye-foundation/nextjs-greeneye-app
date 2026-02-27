import { useTranslations } from 'next-intl';
import Seo from '@/components/common/Seo';
import BlogGrid from '@/components/BlogGrid';
import EncyclopediaArticlesSection from '@/components/EncyclopediaArticlesSection';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`),
      locale,
    }
  }
}

export default function BlogPage() {
  const t = useTranslations('blog');
  return (
    <>
      <Seo
        title={t('seoTitle', { defaultMessage: 'Blog | GreenEye' })}
        description={t('seoDescription', { defaultMessage: 'Read the latest news and stories from GreenEye.' })}
        ogTitle={t('seoTitle', { defaultMessage: 'Blog | GreenEye' })}
        ogDescription={t('seoDescription', { defaultMessage: 'Read the latest news and stories from GreenEye.' })}
        canonical="https://greeneye.foundation/blog"
      />
      <section className="page-header">
        <div className="container">
          <h1>{t('pageTitle', { defaultMessage: 'Blog' })}</h1>
          <p>{t('pageSubtitle', { defaultMessage: 'Read the latest news and stories from GreenEye.' })}</p>
        </div>
      </section>
      <BlogGrid />
      <EncyclopediaArticlesSection />
    </>
  );
}