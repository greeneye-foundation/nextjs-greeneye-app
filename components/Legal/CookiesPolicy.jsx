// components/Legal/CookiesPolicy.jsx

import React from "react";
import { useTranslations } from "next-intl";

const CookiesPolicy = () => {
  const t = useTranslations("cookiesPolicy");
  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-header-content">
          <div className="legal-header-icon">
            <i className="fas fa-cookie-bite"></i>
          </div>
          <h1>{t("title")}</h1>
          <p>{t("effectiveDate")}</p>
        </div>
      </header>

      <div className="legal-content">
        <div className="legal-card">
          <p>
            <strong>GEYE INNOVATION FOUNDATION (doing business as GREENEYE®)</strong> {t("intro")}{" "}
            <a href="https://greeneye.foundation" target="_blank" rel="noopener noreferrer">
              https://greeneye.foundation
            </a>.
          </p>

          <h2>
            <i className="fas fa-ban"></i>
            {t("noTrackingTitle")}
          </h2>
          <p>{t("noTrackingText")}</p>

          <h2>
            <i className="fas fa-external-link-alt"></i>
            {t("thirdPartyTitle")}
          </h2>
          <p>{t("thirdPartyText")}</p>

          <h2>
            <i className="fas fa-sync-alt"></i>
            {t("changesTitle")}
          </h2>
          <p>{t("changesText")}</p>

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

export default CookiesPolicy;
