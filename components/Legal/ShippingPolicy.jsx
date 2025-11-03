// components/Legal/ShippingPolicy.jsx

import React from "react";
import { useTranslations } from "next-intl";

const ShippingPolicy = () => {
  const t = useTranslations("shippingPolicy");

  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-header-content">
          <div className="legal-header-icon">
            <i className="fas fa-shipping-fast"></i>
          </div>
          <h1>{t("title")}</h1>
        </div>
      </header>

      <div className="legal-content">
        <div className="legal-card">
          <p>{t("intro")}</p>

          <h2>
            <i className="fas fa-map-marked-alt"></i>
            {t("domesticTitle")}
          </h2>
          <p>{t("domesticText")}</p>

          <h2>
            <i className="fas fa-clock"></i>
            {t("processingTitle")}
          </h2>
          <p>{t("processingText")}</p>

          <h2>
            <i className="fas fa-exclamation-triangle"></i>
            {t("liabilityTitle")}
          </h2>
          <p>{t("liabilityText")}</p>

          <h2>
            <i className="fas fa-credit-card"></i>
            {t("paymentsTitle")}
          </h2>
          <p>{t("paymentsText")}</p>

          <h2>
            <i className="fas fa-hands-helping"></i>
            {t("servicesTitle")}
          </h2>
          <p>{t("servicesText")}</p>

          <h2>
            <i className="fas fa-dollar-sign"></i>
            {t("chargesTitle")}
          </h2>
          <p>{t("chargesText")}</p>

          <h2>
            <i className="fas fa-info-circle"></i>
            {t("disclaimerTitle")}
          </h2>
          <p>{t("disclaimerText")}</p>

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

export default ShippingPolicy;
