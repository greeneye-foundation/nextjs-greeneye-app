import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const Impact = () => {
  const t = useTranslations("impact");
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const stats = [
    { icon: "fas fa-seedling", label: t("statTrees"), number: 50000, desc: t("statTreesDesc") },
    { icon: "fas fa-wind", label: t("statCO2"), number: 75000, desc: t("statCO2Desc") },
    { icon: "fas fa-users", label: t("statVolunteers"), number: 1200, desc: t("statVolunteersDesc") },
    { icon: "fas fa-map-marked-alt", label: t("statCities"), number: 25, desc: t("statCitiesDesc") },
  ];

  const numberRefs = useRef([]);

  // Intersection observer — animate counters only when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          numberRefs.current.forEach((ref, idx) => {
            if (!ref) return;
            const end = stats[idx].number;
            const duration = 1800;
            const increment = end / (duration / 16);
            let current = 0;
            const animate = () => {
              current += increment;
              if (current >= end) {
                ref.textContent = end.toLocaleString();
              } else {
                ref.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(animate);
              }
            };
            animate();
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="impact" className="ge-impact ge-section ge-section-forest ge-grain" ref={sectionRef}>
      <div className="ge-container">
        <div className="ge-impact__header">
          <span className="ge-overline" style={{ color: 'var(--ge-gold-light)' }}>Our Impact</span>
          <h2>{t("heading")}</h2>
          <hr className="ge-divider ge-divider-center" style={{ background: 'var(--ge-gold-light)' }} />
          <p className="ge-impact__blurb">{t("blurb")}</p>
        </div>

        <div className="ge-impact__stats">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="ge-impact__stat">
              <div className="ge-impact__stat-icon">
                <i className={stat.icon}></i>
              </div>
              <div
                className="ge-impact__stat-num"
                ref={(el) => (numberRefs.current[idx] = el)}
              >
                0
              </div>
              <div className="ge-impact__stat-label">{stat.label}</div>
              <div className="ge-impact__stat-desc">{stat.desc}</div>
            </div>
          ))}
        </div>

        <div className="ge-impact__bottom">
          <ul className="ge-impact__list">
            <li><i className="fas fa-leaf"></i> {t("listNative")}</li>
            <li><i className="fas fa-leaf"></i> {t("listCare")}</li>
            <li><i className="fas fa-leaf"></i> {t("listEducation")}</li>
            <li><i className="fas fa-leaf"></i> {t("listHabitat")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Impact;
