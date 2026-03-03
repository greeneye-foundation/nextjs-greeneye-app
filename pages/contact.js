import { useTranslations } from 'next-intl';
import Seo from '@/components/common/Seo';
import Contact from '@/components/Contact';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["GardenStore", "NGO"],
  "name": "GEYE INNOVATION FOUNDATION",
  "alternateName": "GREENEYE",
  "url": "https://greeneye.foundation",
  "logo": "https://greeneye.foundation/assets/GreenLandscape.png",
  "image": "https://greeneye.foundation/assets/GreenLandscape.png",
  "description": "GEYE INNOVATION FOUNDATION, branded as GREENEYE, is a sustainability-focused nursery and environmental organization in Jaipur, Rajasthan, India. We plant trees, run eco-programs, and promote environmental awareness.",
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
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 26.9124466,
    "longitude": 75.7013369
  },
  "hasMap": "https://maps.app.goo.gl/hc2w2LcDFF1Ax3QQ7",
  "sameAs": [
    "https://www.facebook.com/greeneye.foundation/",
    "https://x.com/greeneye_india/",
    "https://www.instagram.com/greeneye.foundation/",
    "https://www.linkedin.com/company/greeneye-foundation/",
    "https://www.youtube.com/@greeneye.foundation/"
  ]
};

export default function ContactPage() {
  const t = useTranslations('contact');
  return (
    <>
      <Seo
        title={t('seoTitle', { defaultMessage: 'Contact Us | GreenEye' })}
        description={t('seoDescription', { defaultMessage: "We're here to answer your questions and welcome your feedback. Reach out to GreenEye for any inquiries or support." })}
        ogTitle={t('seoTitle', { defaultMessage: 'Contact Us | GreenEye' })}
        ogDescription={t('seoDescription', { defaultMessage: "We're here to answer your questions and welcome your feedback. Reach out to GreenEye for any inquiries or support." })}
        canonical="https://greeneye.foundation/contact"
        structuredData={localBusinessSchema}
      />
      <section className="page-header">
        <div className="container">
          <h1>{t('pageTitle', { defaultMessage: 'Contact Us' })}</h1>
          <p>{t('pageSubtitle', { defaultMessage: "We're here to answer your questions and welcome your feedback." })}</p>
        </div>
      </section>
      <Contact />
    </>
  );
}