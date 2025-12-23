"use client";
import React from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const Hero = () => {
  const router = useRouter(); // Next.js routing hook
  const t = useTranslations("hero");

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-main">{t("titleMain")}</span>
          <span className="hero-title-sub">{t("titleSub")}</span>
        </h1>
        <p className="hero-description">
          {t("description")}
        </p>
        <p className="hero-urgency" style={{
          fontSize: '0.95rem',
          color: 'rgba(255, 217, 61, 1)',
          fontWeight: '600',
          marginBottom: '1.5rem',
          marginTop: '-1rem',
          textShadow: '0 1px 6px rgba(0, 0, 0, 0.3)'
        }}>
          {t("urgency")}
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => router.push("/volunteer")}>
            <i className="fas fa-seedling"></i>
            <span>{t("plantFirstTree")}</span>
          </button>
          <button className="btn btn-secondary" onClick={() => router.push("/donate")}>
            <i className="fas fa-heart"></i>
            <span>{t("makeImpact")}</span>
          </button>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-number" data-target="50000">2000+</span>
          <span className="stat-label">{t("statTrees")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" data-target="1200">1200+</span>
          <span className="stat-label">{t("statVolunteers")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" data-target="25">25+</span>
          <span className="stat-label">{t("statCities")}</span>
        </div>
      </div>

    </section>
  );
};

export default Hero;