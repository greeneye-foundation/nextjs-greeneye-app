// pages/404.js
import Link from 'next/link';
import Seo from '@/components/common/Seo';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    },
  };
}

const notFoundSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Not Found — GreenEye",
  "description": "The page you're looking for doesn't exist. Explore GreenEye's tree adoption, gifting, and environmental programs.",
  "url": "https://greeneye.foundation/404",
  "isPartOf": {
    "@type": "WebSite",
    "name": "GreenEye",
    "url": "https://greeneye.foundation",
  },
  "publisher": {
    "@type": "Organization",
    "name": "GEYE INNOVATION FOUNDATION",
    "alternateName": "GREENEYE",
    "url": "https://greeneye.foundation",
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://greeneye.foundation",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Page Not Found",
      },
    ],
  },
};

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found — GreenEye"
        description="The page you're looking for doesn't exist. Explore GreenEye's tree adoption, gifting, and environmental programs."
        noindex={true}
        ogTitle="Page Not Found — GreenEye"
        ogDescription="Explore GreenEye's tree adoption, gifting, and environmental programs."
        ogUrl="https://greeneye.foundation/404"
        structuredData={notFoundSchema}
      />

      <section className="not-found-page">
        <div className="not-found-content">
          <div className="not-found-icon" aria-hidden="true">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="52" y="70" width="16" height="24" rx="3" fill="#3A4442" opacity="0.3" />
              <ellipse cx="35" cy="88" rx="12" ry="6" transform="rotate(-20 35 88)" fill="#7FAD4B" opacity="0.4" />
              <ellipse cx="85" cy="85" rx="10" ry="5" transform="rotate(15 85 85)" fill="#2A7A4E" opacity="0.3" />
              <text x="60" y="55" textAnchor="middle" fontSize="48" fontFamily="Montserrat, sans-serif" fontWeight="800" fill="#2A7A4E" opacity="0.15">?</text>
            </svg>
          </div>

          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">This page has wandered off the trail</h2>
          <p className="not-found-description">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="not-found-actions">
            <Link href="/" className="not-found-btn not-found-btn-primary">
              Back to Home
            </Link>
            <Link href="/gift-a-tree" className="not-found-btn not-found-btn-secondary">
              Gift a Tree
            </Link>
          </div>

          <nav className="not-found-links" aria-label="Suggested pages">
            <p className="not-found-links-label">Or explore:</p>
            <ul className="not-found-nav">
              <li><Link href="/plantshop">Plant Shop</Link></li>
              <li><Link href="/donate">Donate</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/forest">Our Forest</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
