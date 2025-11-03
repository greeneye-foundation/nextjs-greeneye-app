// components/Legal/CancellationsRefunds.jsx

import React from "react";
import { useTranslations } from "next-intl";
import "../../styles/legal-styles.css";

const CancellationsRefunds = () => {
  const t = useTranslations("cancellationsRefunds");

  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-header-content">
          <div className="legal-header-icon">
            <i className="fas fa-undo-alt"></i>
          </div>
          <h1>{t("title")}</h1>
        </div>
      </header>

      <div className="legal-content">
        <div className="legal-card">
          <p>{t("intro")}</p>

          <h2>
            <i className="fas fa-times-circle"></i>
            {t("cancellationTitle")}
          </h2>
          <p>{t("cancellationText")}</p>

          <h2>
            <i className="fas fa-hand-holding-usd"></i>
            {t("refundTitle")}
          </h2>
          <p>{t("refundText")}</p>

          <h2>
            <i className="fas fa-exclamation-circle"></i>
            {t("exceptionsTitle")}
          </h2>
          <p>{t("exceptionsText")}</p>

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

export default CancellationsRefunds;
