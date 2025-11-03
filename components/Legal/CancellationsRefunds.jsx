// components/Legal/CancellationsRefunds.jsx

import React from "react";
import { useTranslations } from "next-intl";

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

export default CancellationsRefunds;
