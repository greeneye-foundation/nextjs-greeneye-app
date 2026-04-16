// components/Legal/PrivacyPolicy.jsx

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

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

          {/* Account Deletion Section */}
          <h2>
            <i className="fas fa-user-times"></i>
            {t("accountDeletionTitle") || "Account Deletion & Data Rights"}
          </h2>
          <p>{t("accountDeletionText") || "You have the right to request deletion of your account and all associated personal data at any time. We are committed to respecting your data privacy rights under applicable laws including GDPR and India's Digital Personal Data Protection Act."}</p>

          <div className="info-box">
            <h3>
              {t("yourRightsTitle") || "Your Rights Include:"}
            </h3>
            <ul>
              <li>{t("rightToDelete") || "Right to deletion of your personal data"}</li>
              <li>{t("rightToAccess") || "Right to access your data"}</li>
              <li>{t("rightToCorrect") || "Right to correct inaccurate data"}</li>
              <li>{t("rightToPortability") || "Right to data portability"}</li>
              <li>{t("rightToWithdraw") || "Right to withdraw consent"}</li>
            </ul>

            <p>
              {t("deletionProcess") || "To request account deletion, please visit our dedicated account deletion page where you can submit your request. Our team will review and process your request within 7-10 business days."}
            </p>

            <Link
              href="/legal/account-deletion"
              className="ge-btn legal-btn-delete"
            >
              <i className="fas fa-trash-alt"></i>
              {t("requestDeletionButton") || "Request Account Deletion"}
            </Link>
          </div>

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