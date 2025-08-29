// components/Legal/TermsOfService.jsx

import React from "react";
import { useTranslations } from "next-intl";

const TermsOfService = () => {
  const t = useTranslations("termsOfService");
  return (
    <main style={{ background: "#f0fdf4" }}>
      <header style={{
        backgroundColor: "#2d6a4f",
        color: "#fff",
        padding: "1rem",
        textAlign: "center",
        marginTop: 40
      }}>
        <h1>{t("title")}</h1>
      </header>
      <div style={{
        maxWidth: 800,
        margin: "auto",
        padding: "2rem",
        lineHeight: 1.6,
        color: "#1b4332"
      }}>
        <p>{t("effectiveDate")}</p>
        <p>
          {t("welcome")} <a href="https://greeneye.foundation">https://greeneye.foundation</a>,
          {t("agree")}
        </p>
        <h2 style={{ color: "#2d6a4f" }}>{t("useTitle")}</h2>
        <p>{t("useText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("userDataTitle")}</h2>
        <p>{t("userDataText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("ownershipTitle")}</h2>
        <p>{t("ownershipText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("changesTitle")}</h2>
        <p>{t("changesText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("contactTitle")}</h2>
        <p>{t("contactText")}</p>
        <p>
          📞 Phone: +91 92264-92263<br />
          📧 Email: contact@greeneye.foundation<br />
          🏠 Address: Prime, C11, Kanak Vrindavan, Jaipur, Rajasthan, Bajiri Mandi-302034
        </p>
      </div>
    </main>
  );
};

export default TermsOfService;