// pages/index.js
import { useTranslations } from 'next-intl';
import HeroCarousel from "@/components/HeroCarousel";
import About from "@/components/About";
import Donate from "@/components/Donate";
import Impact from "@/components/Impact";
import Volunteer from "@/components/Volunteer";
import Programs from "@/components/Programs";
import BlogIndex from "@/components/BlogIndex";
import Seo from "@/components/common/Seo";
import InstagramFeed from "@/components/InstagramFeed";
import { useEffect } from "react";

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
};

export default function HomePage() {

    useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", {
        page: "HomePage",
      });
    }
  }, []);
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
      <HeroCarousel />
      <InstagramFeed />
      <About />
      <BlogIndex />
      <Donate />
      <Impact />
    </>
  );
}
