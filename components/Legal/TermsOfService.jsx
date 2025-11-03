// components/Legal/TermsOfService.jsx

import React from "react";
import { useTranslations } from "next-intl";

const TermsOfService = () => {
  const t = useTranslations("termsOfService");
  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-header-content">
          <div className="legal-header-icon">
            <i className="fas fa-file-contract"></i>
          </div>
          <h1>{t("title")}</h1>
          <p>{t("effectiveDate")}</p>
        </div>
      </header>

      <div className="legal-content">
        <div className="legal-card">
          <p>
            {t("welcome")}{" "}
            <a href="https://greeneye.foundation" target="_blank" rel="noopener noreferrer">
              https://greeneye.foundation
            </a>
            , {t("agree")}
          </p>

          <h2>
            <i className="fas fa-check-circle"></i>
            {t("useTitle")}
          </h2>
          <p>{t("useText")}</p>

          <h2>
            <i className="fas fa-user-shield"></i>
            {t("userDataTitle")}
          </h2>
          <p>{t("userDataText")}</p>

          <h2>
            <i className="fas fa-copyright"></i>
            {t("ownershipTitle")}
          </h2>
          <p>{t("ownershipText")}</p>

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

export default TermsOfService;
