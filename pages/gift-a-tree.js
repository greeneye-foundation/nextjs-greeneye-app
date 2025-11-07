"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Seo from '@/components/common/Seo';
import { showNotification } from '@/components/Notification';
import OccasionSelector from '@/components/OccasionSelector';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
}

export default function GiftATreePage() {
  const t = useTranslations('giftTree');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    occasion: "",
    numberOfTrees: "1",
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    message: "",
  });

  // Prefill form data from URL params
  useEffect(() => {
    if (router.isReady) {
      const { occasion, numberOfTrees } = router.query;
      if (occasion || numberOfTrees) {
        setForm(prev => ({
          ...prev,
          occasion: occasion || prev.occasion,
          numberOfTrees: numberOfTrees || prev.numberOfTrees,
        }));
      }
    }
  }, [router.isReady, router.query]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production: await axios.post('/api/gift-tree', form);

      showNotification(
        "Tree gift sent successfully! The recipient will receive a confirmation email.",
        "success"
      );

      // Reset form
      setForm({
        occasion: "",
        numberOfTrees: "1",
        recipientName: "",
        recipientEmail: "",
        senderName: "",
        message: "",
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      showNotification(
        "Failed to send tree gift. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const occasionLabels = {
    birthday: "Birthday",
    anniversary: "Anniversary",
    wedding: "Wedding",
    memorial: "Memorial",
    corporate: "Corporate Gift",
    holiday: "Holiday",
    "just-because": "Just Because"
  };

  return (
    <>
      <Seo
        title="Gift a Tree | GreenEye Foundation"
        description="Send a meaningful gift by planting trees in someone's name. Perfect for birthdays, anniversaries, and special occasions."
        ogTitle="Gift a Tree | GreenEye Foundation"
        ogDescription="Send a meaningful gift by planting trees in someone's name. Perfect for birthdays, anniversaries, and special occasions."
        canonical="https://greeneye.foundation/gift-a-tree"
      />

      <section className="gift-tree-page">
        <div className="container">
          <motion.div
            className="gift-tree-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              className="back-button"
              onClick={() => router.push('/')}
              aria-label="Go back to home"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1>
              <i className="fas fa-gift"></i>
              Complete Your Tree Gift
            </h1>
            <p>Fill in the details below to send a beautiful tree gift</p>
          </motion.div>

          <div className="gift-tree-content">
            {/* Summary Card */}
            <motion.div
              className="gift-summary-card"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>
                <i className="fas fa-clipboard-list"></i>
                Gift Summary
              </h3>
              <div className="summary-item">
                <span className="summary-label">
                  <i className="fas fa-calendar-alt"></i>
                  Occasion:
                </span>
                <span className="summary-value">
                  {form.occasion ? occasionLabels[form.occasion] : "Not selected"}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">
                  <i className="fas fa-tree"></i>
                  Number of Trees:
                </span>
                <span className="summary-value">
                  {form.numberOfTrees} {form.numberOfTrees === "1" ? "Tree" : "Trees"}
                </span>
              </div>
              <div className="summary-features">
                <h4>What&apos;s Included:</h4>
                <ul>
                  <li>
                    <i className="fas fa-certificate"></i>
                    Personalized e-certificate
                  </li>
                  <li>
                    <i className="fas fa-map-marker-alt"></i>
                    GPS coordinates of planted trees
                  </li>
                  <li>
                    <i className="fas fa-images"></i>
                    Photos of planting site
                  </li>
                  <li>
                    <i className="fas fa-envelope"></i>
                    Email delivery to recipient
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Gift Form */}
            <motion.div
              className="gift-form-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>
                    <i className="fas fa-cog"></i>
                    Gift Details
                  </h3>

                  <div className="form-group occasion-selector-group">
                    <label htmlFor="occasion">Select an Occasion</label>
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
                </div>

                <div className="form-section">
                  <h3>
                    <i className="fas fa-user-friends"></i>
                    Recipient Information
                  </h3>

                  <div className="form-group">
                    <label htmlFor="recipientName">Recipient Name *</label>
                    <input
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      value={form.recipientName}
                      onChange={handleChange}
                      placeholder="Who are you gifting to?"
                      required
                    />
                    <i className="fas fa-user input-icon"></i>
                  </div>

                  <div className="form-group">
                    <label htmlFor="recipientEmail">Recipient Email *</label>
                    <input
                      type="email"
                      id="recipientEmail"
                      name="recipientEmail"
                      value={form.recipientEmail}
                      onChange={handleChange}
                      placeholder="recipient@example.com"
                      required
                    />
                    <i className="fas fa-envelope input-icon"></i>
                  </div>
                </div>

                <div className="form-section">
                  <h3>
                    <i className="fas fa-user-circle"></i>
                    Your Information
                  </h3>

                  <div className="form-group">
                    <label htmlFor="senderName">Your Name *</label>
                    <input
                      type="text"
                      id="senderName"
                      name="senderName"
                      value={form.senderName}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                    <i className="fas fa-user-circle input-icon"></i>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Personal Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Add a heartfelt message to your gift..."
                      rows="4"
                    />
                    <i className="fas fa-comment input-icon"></i>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.push('/')}
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Sending Gift...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Send Tree Gift</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
