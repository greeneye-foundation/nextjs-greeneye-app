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

        <h2 style={{ color: "#2d6a4f" }}>{t("domesticTitle")}</h2>
        <p>{t("domesticText")}</p>

        <h2 style={{ color: "#2d6a4f" }}>{t("processingTitle")}</h2>
        <p>{t("processingText")}</p>

        <h2 style={{ color: "#2d6a4f" }}>{t("liabilityTitle")}</h2>
        <p>{t("liabilityText")}</p>

        <h2 style={{ color: "#2d6a4f" }}>{t("paymentsTitle")}</h2>
        <p>{t("paymentsText")}</p>

        <h2 style={{ color: "#2d6a4f" }}>{t("servicesTitle")}</h2>
        <p>{t("servicesText")}</p>

        <h2 style={{ color: "#2d6a4f" }}>{t("chargesTitle")}</h2>
        <p>{t("chargesText")}</p>

        <h2 style={{ color: "#2d6a4f" }}>{t("disclaimerTitle")}</h2>
        <p>{t("disclaimerText")}</p>

        <h2 style={{ color: "#2d6a4f" }}>{t("contactTitle")}</h2>
        <p>{t("contactText")}</p>
      </div>
    </main>
  );
};

export default ShippingPolicy;
