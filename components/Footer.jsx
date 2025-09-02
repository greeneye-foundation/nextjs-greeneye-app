//'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <i className="fas fa-seedling"></i>
              <span>GreenEye</span>
            </div>
            <p>{t('mission')}</p>
            <div className="footer-social">
              <a href="https://www.facebook.com/greeneye.foundation" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://x.com/greeneye_india/" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/greeneye.foundation/" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/company/greeneye-foundation/" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>{t('quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link href="/about">{t('about')}</Link></li>
              <li><Link href="/programs">{t('programs')}</Link></li>
              <li><Link href="/volunteer">{t('volunteer')}</Link></li>
              <li><Link href="/donate">{t('donate')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('programs')}</h4>
            <ul className="footer-links">
              <li><Link href="/programs">{t('urbanReforestation')}</Link></li>
              <li><Link href="/programs">{t('communityDrives')}</Link></li>
              <li><Link href="/programs">{t('schoolPrograms')}</Link></li>
              <li><Link href="/programs">{t('corporatePartnerships')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('contactInfo')}</h4>
            <div className="footer-contact">
              <p><i className="fas fa-map-marker-alt"></i> {t('address')}</p>
              <p><i className="fas fa-phone"></i> <a href="tel:+919226492263">+91 92264 92263</a></p>
              <p><i className="fas fa-envelope"></i> contact@greeneye.foundation</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 GREENEYE®. {t('rightsReserved')}</p>
            <div className="footer-bottom-links">
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
