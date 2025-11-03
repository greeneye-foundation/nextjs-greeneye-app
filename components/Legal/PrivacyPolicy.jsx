// components/Legal/PrivacyPolicy.jsx

import React from "react";
import { useTranslations } from "next-intl";

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

          <div className="contact-link-wrapper">
            <a href="/contact" className="contact-link">
              <i className="fas fa-envelope"></i>
              {t("contactTitle")}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
