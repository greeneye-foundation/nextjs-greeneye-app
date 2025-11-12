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
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => router.push("/volunteer")}>
            <i className="fas fa-hands-helping"></i>
            <span>{t("joinMission")}</span>
          </button>
          <button className="btn btn-secondary" onClick={() => router.push("/donate")}>
            <i className="fas fa-heart"></i>
            <span>{t("contribute")}</span>
          </button>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-number" data-target="50000">50000+</span>
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