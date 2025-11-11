import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { showNotification } from '@/components/Notification';
import Seo from '@/components/common/Seo';

const RelocateTreePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // From homepage
    location: '',
    photoPreview: null,
    photoName: '',

    // Additional details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: 'development', // Why tree needs relocation
    urgency: 'medium',
    additionalNotes: '',
    agreeTerms: false,
  });

  useEffect(() => {
    if (router.isReady) {
      const { location } = router.query;

      // Get photo from sessionStorage
      const photoPreview = sessionStorage.getItem('relocateTreePhoto');
      const photoName = sessionStorage.getItem('relocateTreePhotoName');

      setForm(prev => ({
        ...prev,
        location: location || '',
        photoPreview: photoPreview || null,
        photoName: photoName || '',
      }));
    }
  }, [router.isReady, router.query]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agreeTerms) {
      showNotification('Please agree to the terms and conditions', 'error');
      return;
    }

    if (!form.location) {
      showNotification('Please provide the tree location', 'error');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('location', form.location);
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('reason', form.reason);
      formData.append('urgency', form.urgency);
      formData.append('additionalNotes', form.additionalNotes);

      // Add photo if available
      if (form.photoPreview) {
        // Convert base64 to blob
        const response = await fetch(form.photoPreview);
        const blob = await response.blob();
        formData.append('photo', blob, form.photoName);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/relocate-tree`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      showNotification(
        'Request submitted successfully! Our team will contact you within 24 hours.',
        'success'
      );

      // Clear sessionStorage
      sessionStorage.removeItem('relocateTreePhoto');
      sessionStorage.removeItem('relocateTreePhotoName');

      // Reset form
      setForm({
        location: '',
        photoPreview: null,
        photoName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        reason: 'development',
        urgency: 'medium',
        additionalNotes: '',
        agreeTerms: false,
      });

      // Redirect to success page or homepage
      setTimeout(() => {
        router.push('/?relocate=success');
      }, 2000);
    } catch (error) {
      console.error('Error submitting relocation request:', error);
      showNotification(
        error.response?.data?.message || 'Failed to submit request. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Relocate a Tree | GreenEye Foundation"
        description="Help save trees from being cut down. Report trees that need relocation and our global network will handle the rest."
        ogTitle="Relocate a Tree | Save Trees from Being Cut"
        ogDescription="Join our mission to save trees. Report trees at risk and help us relocate them safely."
        canonical="https://greeneye.foundation/relocate-tree"
      />

      <div className="relocate-tree-page">
        <div className="relocate-header">
          <div className="container">
            <button className="back-btn" onClick={() => router.push('/')}>
              <i className="fas fa-arrow-left"></i> Back to Home
            </button>
            <h1>
              <i className="fas fa-truck-moving"></i> Relocate a Tree
            </h1>
            <p className="page-subtitle">
              Complete the form below to report a tree that needs relocation
            </p>
          </div>
        </div>

        <div className="relocate-content">
          <div className="container">
            <div className="relocate-grid">
              {/* Left Side - Form */}
              <div className="form-section">
                <form onSubmit={handleSubmit} className="relocate-form">
                  <div className="form-section-header">
                    <h2>
                      <i className="fas fa-tree"></i> Tree Information
                    </h2>
                    <p>Tell us about the tree that needs relocation</p>
                  </div>

                  {/* Location (Pre-filled) */}
                  <div className="form-group">
                    <label htmlFor="location">
                      Tree Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Address or coordinates"
                      required
                    />
                    <i className="fas fa-map-marker-alt"></i>
                  </div>

                  {/* Photo Preview */}
                  {form.photoPreview && (
                    <div className="form-group">
                      <label>Uploaded Photo</label>
                      <div className="photo-display">
                        <img src={form.photoPreview} alt="Tree" />
                        <p className="photo-name">
                          <i className="fas fa-image"></i> {form.photoName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reason for Relocation */}
                  <div className="form-group">
                    <label htmlFor="reason">
                      Reason for Relocation *
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      required
                    >
                      <option value="development">Development/Construction</option>
                      <option value="government">Government Project</option>
                      <option value="private">Private Property Owner</option>
                      <option value="safety">Safety Concerns</option>
                      <option value="disease">Tree Health/Disease</option>
                      <option value="other">Other</option>
                    </select>
                    <i className="fas fa-question-circle"></i>
                  </div>

                  {/* Urgency */}
                  <div className="form-group">
                    <label htmlFor="urgency">
                      Urgency Level
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={form.urgency}
                      onChange={handleChange}
                    >
                      <option value="low">Low - Planning ahead</option>
                      <option value="medium">Medium - Within 2 weeks</option>
                      <option value="high">High - Within a few days</option>
                      <option value="critical">Critical - Immediate action needed</option>
                    </select>
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>

                  {/* Additional Notes */}
                  <div className="form-group">
                    <label htmlFor="additionalNotes">
                      Additional Information
                    </label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      rows="4"
                      value={form.additionalNotes}
                      onChange={handleChange}
                      placeholder="Any additional details about the tree, situation, or timeline..."
                    ></textarea>
                    <i className="fas fa-sticky-note"></i>
                  </div>

                  <div className="form-section-header">
                    <h2>
                      <i className="fas fa-user"></i> Your Contact Information
                    </h2>
                    <p>So our team can reach you about the relocation</p>
                  </div>

                  {/* Name */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                      />
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                      />
                      <i className="fas fa-user"></i>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      required
                    />
                    <i className="fas fa-envelope"></i>
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      required
                    />
                    <i className="fas fa-phone"></i>
                  </div>

                  {/* Terms Agreement */}
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={form.agreeTerms}
                        onChange={handleChange}
                        required
                      />
                      <span className="checkmark"></span>
                      I understand that our team will assess the situation and contact me within 24 hours
                      with the relocation plan and crowd-funding details.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Submitting Request...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Submit Request
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Side - Info */}
              <div className="info-section">
                <div className="info-card">
                  <h3>
                    <i className="fas fa-info-circle"></i> How It Works
                  </h3>
                  <ol className="process-steps">
                    <li>
                      <span className="step-number">1</span>
                      <div>
                        <strong>Submit Request</strong>
                        <p>Provide tree location and details</p>
                      </div>
                    </li>
                    <li>
                      <span className="step-number">2</span>
                      <div>
                        <strong>Team Assessment</strong>
                        <p>Our experts evaluate the situation</p>
                      </div>
                    </li>
                    <li>
                      <span className="step-number">3</span>
                      <div>
                        <strong>Crowd-Funding</strong>
                        <p>Community helps fund the relocation</p>
                      </div>
                    </li>
                    <li>
                      <span className="step-number">4</span>
                      <div>
                        <strong>Relocation</strong>
                        <p>Professional team relocates the tree</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="info-card">
                  <h3>
                    <i className="fas fa-globe"></i> Global Network
                  </h3>
                  <p>
                    We have volunteers and partners worldwide ready to help save trees.
                    No matter where you are, we can assist!
                  </p>
                  <div className="stats">
                    <div className="stat-item">
                      <i className="fas fa-tree"></i>
                      <strong>1,000+</strong>
                      <span>Trees Relocated</span>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-users"></i>
                      <strong>50+</strong>
                      <span>Countries</span>
                    </div>
                  </div>
                </div>

                <div className="info-card highlight">
                  <h3>
                    <i className="fas fa-clock"></i> Response Time
                  </h3>
                  <p>
                    Our team will review your request and contact you within <strong>24 hours</strong>
                    to discuss the relocation plan, timeline, and funding requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RelocateTreePage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      locale: locale || 'en',
      messages: require(`../locales/${locale || 'en'}.json`),
    },
  };
}
