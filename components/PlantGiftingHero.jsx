"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

const PlantGiftingHero = () => {
  const t = useTranslations("plantGifting");
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [form, setForm] = useState({
    occasion: "",
    numberOfTrees: "1",
  });

  // Background images for carousel
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1920",
      title: "Gift a Tree, Gift Life",
      subtitle: "Celebrate every occasion with nature",
    },
    {
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1920",
      title: "Plant Hope, Grow Love",
      subtitle: "Make memories that grow forever",
    },
    {
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1920",
      title: "Nature's Perfect Gift",
      subtitle: "For birthdays, anniversaries, and special moments",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

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
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="plant-gifting-hero">
      {/* Carousel Background */}
      <div className="gifting-carousel">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="carousel-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="carousel-image"
            />
            <div className="carousel-overlay"></div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation */}
        <button className="carousel-nav prev" onClick={prevSlide} aria-label="Previous slide">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="carousel-nav next" onClick={nextSlide} aria-label="Next slide">
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="gifting-content">
        <div className="container">
          <div className="gifting-grid">
            {/* Left Side - Text Content */}
            <motion.div
              className="gifting-text"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="gifting-title"
              >
                {slides[currentSlide].title}
              </motion.h2>
              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="gifting-subtitle"
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              <div className="gifting-features">
                <div className="feature-item">
                  <i className="fas fa-gift"></i>
                  <span>Perfect for any occasion</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-envelope"></i>
                  <span>Personalized e-certificate</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-tree"></i>
                  <span>Make a lasting impact</span>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Gift Form */}
            <motion.div
              className="gifting-form-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlantGiftingHero;
