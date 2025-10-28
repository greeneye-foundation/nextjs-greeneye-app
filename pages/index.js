// pages/index.js
import { useTranslations } from 'next-intl';
import Hero from "@/components/Hero";
import About from "@/components/About";
import Donate from "@/components/Donate";
import Impact from "@/components/Impact";
import Contact from "@/components/Contact";
import Volunteer from "@/components/Volunteer";
import Programs from "@/components/Programs";
import BlogIndex from "@/components/BlogIndex";
import Seo from "@/components/common/Seo";
import InstagramFeed from "@/components/InstagramFeed";

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
};

export default function HomePage() {
  const t = useTranslations('home');
  return (
    <>
      <Seo
        title={t('title')}
        description={t('description')}
        ogTitle={t('title')}
        ogDescription={t('cta')}
        ogType="website"
        ogImage='assets/GreeneyeLandscape.png'
      />
      <Hero />
      <InstagramFeed />
      <About />
      <BlogIndex />
      <Donate />
      <Volunteer />
      <Programs />
      <Impact />
      <Contact />
    </>
  );
}