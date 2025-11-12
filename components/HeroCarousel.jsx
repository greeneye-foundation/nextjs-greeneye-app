"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { showNotification } from "./Notification";
import OccasionSelector from "./OccasionSelector";
import RelocateTreeHero from "./RelocateTreeHero";

const HeroCarousel = () => {
  const router = useRouter();
  const tHero = useTranslations("hero");
  const tGifting = useTranslations("plantGifting");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [form, setForm] = useState({
    occasion: "",
    numberOfTrees: "1",
  });

  // Auto-advance disabled - manual navigation only

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = (e) => {
    e.preventDefault();

    // Navigate to gift-a-tree page with form data as URL params
    const params = new URLSearchParams({
      occasion: form.occasion,
      numberOfTrees: form.numberOfTrees,
    });

    router.push(`/gift-a-tree?${params.toString()}`);
  };

  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 1
    })
  };

  // Slide 1: Plant Today, Breathe Tomorrow
  const renderMainHero = () => (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-main">{tHero("titleMain")}</span>
          <span className="hero-title-sub">{tHero("titleSub")}</span>
        </h1>
        <p className="hero-description">
          {tHero("description")}
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => router.push("/volunteer")}>
            <i className="fas fa-hands-helping"></i>
            <span>{tHero("joinMission")}</span>
          </button>
          <button className="btn btn-secondary" onClick={() => router.push("/donate")}>
            <i className="fas fa-heart"></i>
            <span>{tHero("contribute")}</span>
          </button>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-number" data-target="50000">50000+</span>
          <span className="stat-label">{tHero("statTrees")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" data-target="1200">1200+</span>
          <span className="stat-label">{tHero("statVolunteers")}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" data-target="25">25+</span>
          <span className="stat-label">{tHero("statCities")}</span>
        </div>
      </div>
    </section>
  );

  // Slide 2: Gift Trees
  const renderGiftingHero = () => (
    <section className="plant-gifting-hero">
      <div className="gifting-carousel">
        <div className="carousel-slide">
          <img
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1920"
            alt="Gift a Tree"
            className="carousel-image"
          />
          <div className="carousel-overlay"></div>
        </div>
      </div>

      <div className="gifting-content">
        <div className="container">
          <div className="gifting-grid">
            {/* Centered Header */}
            <div className="gifting-header">
              <h2 className="gifting-title">Gift a Tree, Gift Life</h2>
              <p className="gifting-subtitle">Celebrate every occasion with nature's most meaningful gift</p>
            </div>

            {/* Centered Gift Form */}
            <div className="gifting-form-container">
              <form className="gifting-form" onSubmit={handleContinue}>
                <h3 className="form-title">
                  <i className="fas fa-seedling"></i>
                  Gift Trees Today
                </h3>

                <div className="form-group occasion-selector-group">
                  <label htmlFor="occasion">Select Occasion</label>
                  <OccasionSelector
                    value={form.occasion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="numberOfTrees">Number of Trees</label>
                  <select
                    id="numberOfTrees"
                    name="numberOfTrees"
                    value={form.numberOfTrees}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">1 Tree</option>
                    <option value="5">5 Trees</option>
                    <option value="10">10 Trees</option>
                    <option value="25">25 Trees</option>
                    <option value="50">50 Trees</option>
                    <option value="100">100 Trees</option>
                  </select>
                  <i className="fas fa-tree input-icon"></i>
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  <i className="fas fa-arrow-right"></i> <span>Continue to Gift Details</span>
                </button>

                <p className="form-note">
                  <i className="fas fa-info-circle"></i>
                  Complete your gift details on the next page
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="hero-carousel-wrapper">
      {/* Carousel Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", ease: "easeInOut", duration: 0.5 },
            opacity: { duration: 0.2 }
          }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          className="hero-slide"
        >
          {currentSlide === 0 ? renderMainHero() : currentSlide === 1 ? renderGiftingHero() : <RelocateTreeHero />}
        </motion.div>
      </AnimatePresence>

      {/* Carousel Navigation */}
      <button
        className="hero-carousel-nav prev"
        onClick={prevSlide}
        aria-label="Previous hero slide"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button
        className="hero-carousel-nav next"
        onClick={nextSlide}
        aria-label="Next hero slide"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Carousel Indicators */}
      <div className="hero-carousel-indicators">
        <button
          className={`hero-indicator ${currentSlide === 0 ? "active" : ""}`}
          onClick={() => goToSlide(0)}
          aria-label="Go to Plant Today slide"
        >
          <span className="indicator-label">Plant Today</span>
        </button>
        <button
          className={`hero-indicator ${currentSlide === 1 ? "active" : ""}`}
          onClick={() => goToSlide(1)}
          aria-label="Go to Gift Trees slide"
        >
          <span className="indicator-label">Gift Trees</span>
        </button>
        <button
          className={`hero-indicator ${currentSlide === 2 ? "active" : ""}`}
          onClick={() => goToSlide(2)}
          aria-label="Go to Relocate Tree slide"
        >
          <span className="indicator-label">Relocate Tree</span>
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
