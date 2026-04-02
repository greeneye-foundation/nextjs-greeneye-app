import { useTranslations } from 'next-intl';
import Seo from '@/components/common/Seo';
import BlogGrid from '@/components/BlogGrid';

export function getStaticProps({ locale }) {
  return { props: { messages: require(`../../locales/${locale}.json`), locale } };
}

export default function BlogPage() {
  const t = useTranslations('blog');
  return (
    <>
      <Seo
        title={t('seoTitle', { defaultMessage: 'Blog | GreenEye' })}
        description={t('seoDescription', { defaultMessage: 'Read the latest news and stories from GreenEye.' })}
        canonical="https://greeneye.foundation/blog"
        siteName="GREENEYE"
      />
      <section className="ge-section" style={{ paddingBottom: 0 }}>
        <div className="ge-container" style={{ textAlign: 'center' }}>
          <span className="ge-overline">Our Blog</span>
          <h1>{t('pageTitle', { defaultMessage: 'Stories & Updates' })}</h1>
          <p style={{ color: 'var(--ge-slate)', maxWidth: 520, margin: '0 auto' }}>
            {t('pageSubtitle', { defaultMessage: 'Read the latest news and stories from GreenEye.' })}
          </p>
        </div>
      </section>
      <BlogGrid />
    </>
  );
}