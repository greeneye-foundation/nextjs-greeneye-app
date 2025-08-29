// components/Legal/CancellationsRefunds.jsx

import React from "react";
import { useTranslations } from "next-intl";

const CancellationsRefunds = () => {
  const t = useTranslations("cancellationsRefunds");

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
        <h2 style={{ color: "#2d6a4f" }}>{t("cancellationTitle")}</h2>
        <p>{t("cancellationText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("refundTitle")}</h2>
        <p>{t("refundText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("exceptionsTitle")}</h2>
        <p>{t("exceptionsText")}</p>
        <h2 style={{ color: "#2d6a4f" }}>{t("contactTitle")}</h2>
        <p>{t("contactText")}</p>
      </div>
    </main>
  );
};

export default CancellationsRefunds;
