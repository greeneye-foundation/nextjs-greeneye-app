import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');

  return (
    <footer className="ge-footer">
      {/* Main footer */}
      <div className="ge-footer__main">
        <div className="ge-container">
          <div className="ge-footer__grid">
            {/* Brand column */}
            <div className="ge-footer__brand">
              <Link href="/" className="ge-footer__logo">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <path d="M14 2C14 2 6 8 6 16c0 4.4 3.6 8 8 8s8-3.6 8-8c0-8-8-14-8-14z" fill="currentColor" opacity="0.2"/>
                  <path d="M14 6c0 0-5 4.5-5 10a5 5 0 0010 0c0-5.5-5-10-5-10z" fill="currentColor"/>
                </svg>
                <span>GreenEye</span>
              </Link>
              <p className="ge-footer__mission">{t('mission')}</p>
              <div className="ge-footer__social">
                <a href="https://www.facebook.com/greeneye.foundation" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://x.com/greeneye_org/" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <i className="fab fa-x-twitter"></i>
                </a>
                <a href="https://www.instagram.com/greeneye.foundation/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.linkedin.com/company/greeneye-foundation/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="ge-footer__col">
              <h4 className="ge-footer__heading">{t('quickLinks')}</h4>
              <ul className="ge-footer__links">
                <li><Link href="/about">{t('about')}</Link></li>
                <li><Link href="/programs">{t('programs')}</Link></li>
                <li><Link href="/volunteer">{t('volunteer')}</Link></li>
                <li><Link href="/donate">{t('donate')}</Link></li>
                <li><Link href="/forest">Our Forest</Link></li>
              </ul>
            </div>

            {/* Programs */}
            <div className="ge-footer__col">
              <h4 className="ge-footer__heading">{t('programs')}</h4>
              <ul className="ge-footer__links">
                <li><Link href="/programs">{t('urbanReforestation')}</Link></li>
                <li><Link href="/programs">{t('communityDrives')}</Link></li>
                <li><Link href="/programs">{t('schoolPrograms')}</Link></li>
                <li><Link href="/programs">{t('corporatePartnerships')}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="ge-footer__col">
              <h4 className="ge-footer__heading">{t('contactInfo')}</h4>
              <div className="ge-footer__contact">
                <a href="https://maps.app.goo.gl/hc2w2LcDFF1Ax3QQ7" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{t('address')}</span>
                </a>
                <a href="tel:+919226492263">
                  <i className="fas fa-phone"></i>
                  <span>+91 92264 92263</span>
                </a>
                <a href="mailto:contact@greeneye.foundation">
                  <i className="fas fa-envelope"></i>
                  <span>contact@greeneye.foundation</span>
                </a>
                <Link href="/contact">
                  <i className="fas fa-paper-plane"></i>
                  <span>{t('contactUs') || 'Contact Us'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ge-footer__bottom">
        <div className="ge-container">
          <div className="ge-footer__bottom-inner">
            <p>&copy; {new Date().getFullYear()} GEYE INNOVATION FOUNDATION. {t('rightsReserved')}</p>
            <div className="ge-footer__legal">
              <Link href="/legal/privacy-policy">{t('privacy')}</Link>
              <Link href="/legal/terms-of-service">{t('terms')}</Link>
              <Link href="/legal/cookies-policy">{t('cookies')}</Link>
              <Link href="/legal/shipping-policy">{t('shipping')}</Link>
              <Link href="/legal/cancellations-refunds">{t('cancellation&refund')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
