"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { showNotification } from "./Notification";

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 2);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 2) % 2);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Slide 1: Plant Today, Breathe Tomorrow
  const renderMainHero = () => (
    <section id="home" className="hero">
      <div className="hero-background">
        <img
          src="https://pixabay.com/get/g6160ab0932297547c6b89d675a1550ee2a684f87e0ad077d548cfeadf5784fa7524acbfb904790f1583fa42f56dd16e535f57b65913deb5d063e709b86fd1ba2_1280.jpg"
          alt={tHero("heroImgAlt")}
          className="hero-img"
        />
        <div className="hero-overlay"></div>
      </div>

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

                <div className="form-group">
                  <label htmlFor="occasion">Select Occasion</label>
                  <select
                    id="occasion"
                    name="occasion"
                    value={form.occasion}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose an occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="wedding">Wedding</option>
                    <option value="memorial">Memorial</option>
                    <option value="corporate">Corporate Gift</option>
                    <option value="holiday">Holiday</option>
                    <option value="just-because">Just Because</option>
                  </select>
                  <i className="fas fa-calendar-alt input-icon"></i>
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
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-slide"
        >
          {currentSlide === 0 ? renderMainHero() : renderGiftingHero()}
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
      </div>
    </div>
  );
};

export default HeroCarousel;
