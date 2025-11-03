// components/Legal/PrivacyPolicy.jsx

import React from "react";
import { useTranslations } from "next-intl";
import "../../styles/legal-styles.css";

const PrivacyPolicy = () => {
  const t = useTranslations("privacyPolicy");
  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-header-content">
          <div className="legal-header-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1>{t("title")}</h1>
          <p>{t("effectiveDate")}</p>
        </div>
      </header>

      <div className="legal-content">
        <div className="legal-card">
          <p>
            {t("intro")}{" "}
            <a href="https://greeneye.foundation" target="_blank" rel="noopener noreferrer">
              https://greeneye.foundation
            </a>
            , {t("intro2")}
          </p>

          <h2>
            <i className="fas fa-database"></i>
            {t("infoCollectedTitle")}
          </h2>
          <p>{t("infoCollectedText")}</p>
          <ul>
            <li>{t("infoName")}</li>
            <li>{t("infoEmail")}</li>
            <li>{t("infoPhone")}</li>
          </ul>

          <h2>
            <i className="fas fa-cogs"></i>
            {t("howWeUseTitle")}
          </h2>
          <p>{t("howWeUseText")}</p>

          <h2>
            <i className="fas fa-cookie-bite"></i>
            {t("cookiesTitle")}
          </h2>
          <p>{t("cookiesText")}</p>

          <h2>
            <i className="fas fa-lock"></i>
            {t("dataProtectionTitle")}
          </h2>
          <p>{t("dataProtectionText")}</p>

          <div className="contact-section">
            <h2>
              <i className="fas fa-envelope"></i>
              {t("contactTitle")}
            </h2>
            <p>{t("contactText")}</p>

            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="contact-details">
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">
                    <a href="tel:+919226492263">+91 92264-92263</a>
                  </div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <div className="contact-label">Email</div>
                  <div className="contact-value">
                    <a href="mailto:contact@greeneye.foundation">contact@greeneye.foundation</a>
                  </div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <div className="contact-label">Address</div>
                  <div className="contact-value">
                    Prime, C11, Kanak Vrindavan, Jaipur, Rajasthan, Bajiri Mandi-302034
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
