// pages/index.js
import { useTranslations } from 'next-intl';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import About from '@/components/About';
import Donate from '@/components/Donate';
import Impact from '@/components/Impact';
import BlogIndex from '@/components/BlogIndex';
import Seo from '@/components/common/Seo';
import InstagramFeed from '@/components/InstagramFeed';
import { useEffect } from 'react';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  };
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "NGO"],
  "name": "GEYE INNOVATION FOUNDATION",
  "alternateName": "GREENEYE",
  "url": "https://greeneye.foundation",
  "logo": {
    "@type": "ImageObject",
    "url": "https://greeneye.foundation/assets/GreenLandscape.png",
    "width": 1200,
    "height": 630
  },
  "image": "https://greeneye.foundation/assets/GreenLandscape.png",
  "description": "GEYE INNOVATION FOUNDATION, branded as GREENEYE, is a sustainability-focused organization dedicated to environmental conservation through tree planting, urban greening, and community engagement.",
  "telephone": "+919226492263",
  "email": "contact@greeneye.foundation",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "G-4-2, Kanak Vrindavan, Indra Marg",
    "addressLocality": "Jaipur",
    "addressRegion": "Rajasthan",
    "postalCode": "302024",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+919226492263",
    "email": "contact@greeneye.foundation",
    "contactType": "customer support",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://www.facebook.com/greeneye.foundation/",
    "https://x.com/greeneye_org/",
    "https://www.instagram.com/greeneye.foundation/",
    "https://www.linkedin.com/company/greeneye-foundation/",
    "https://www.youtube.com/@greeneye.foundation/"
  ]
};

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', { page: 'HomePage' });
    }
  }, []);

  const t = useTranslations('home');

  return (
    <>
      <Seo
        title={t('title')}
        description={t('description')}
        ogTitle={t('title')}
        ogDescription={t('description')}
        ogType="website"
        ogImage="/assets/GreenLandscape.png"
        canonical="https://greeneye.foundation"
        twitterSite="@greeneye_org"
        siteName="GREENEYE"
        structuredData={organizationSchema}
      />
      <Hero />
      <HowItWorks />
      <About />
      <InstagramFeed />
      <BlogIndex />
      <Donate />
      <Impact />
    </>
  );
}
