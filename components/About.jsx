import React from "react";
import { useTranslations } from "next-intl";

const features = [
  { icon: "fas fa-tree", titleKey: "featurePlantationTitle", textKey: "featurePlantationText" },
  { icon: "fas fa-graduation-cap", titleKey: "featureEducationTitle", textKey: "featureEducationText" },
  { icon: "fas fa-recycle", titleKey: "featureSustainabilityTitle", textKey: "featureSustainabilityText" },
];

const About = () => {
  const t = useTranslations("about");

  return (
    <section id="about" className="ge-about ge-section">
      <div className="ge-container">
        <div className="ge-about__grid">
          {/* Text side */}
          <div className="ge-about__text">
            <span className="ge-overline">About GreenEye</span>
            <h2>{t("visionTitle")}</h2>
            <hr className="ge-divider" />
            <p className="ge-about__lead">{t("visionText")}</p>

            <h3 className="ge-about__sub-heading">{t("impactTitle")}</h3>
            <p>{t("impactText")}</p>
          </div>

          {/* Image side */}
          <div className="ge-about__visual">
            <div className="ge-about__img-wrap">
              <img
                src="/assets/Environmental Conservation.png"
                alt={t("imgAlt")}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Features row */}
        <div className="ge-about__features">
          {features.map((f) => (
            <div key={f.titleKey} className="ge-about__feature">
              <div className="ge-about__feature-icon">
                <i className={f.icon}></i>
              </div>
              <div>
                <h4 className="ge-about__feature-title">{t(f.titleKey)}</h4>
                <p className="ge-about__feature-text">{t(f.textKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
