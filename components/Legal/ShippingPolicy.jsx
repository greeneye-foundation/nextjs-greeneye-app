// components/Legal/ShippingPolicy.jsx

import React from "react";
import { useTranslations } from "next-intl";

const ShippingPolicy = () => {
  const t = useTranslations("shippingPolicy");

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
        <p>{t("intro")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("processingTitle")}</h2>
        <p>{t("processingText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("shippingPartnersTitle")}</h2>
        <p>{t("shippingPartnersText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("deliveryTimeTitle")}</h2>
        <p>{t("deliveryTimeText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("trackingTitle")}</h2>
        <p>{t("trackingText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("internationalTitle")}</h2>
        <p>{t("internationalText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("contactTitle")}</h2>
        <p>{t("contactText")}</p>
      </div>
      <footer style={{
        background: "#2d6a4f",
        color: "#fff",
        textAlign: "center",
        padding: "1rem",
        marginTop: "2rem"
      }}>
        &copy; 2025 GreenEye. {t("rightsReserved")}
      </footer>
    </main>
  );
};

export default ShippingPolicy;
