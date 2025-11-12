"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const RelocateTreeHero = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    location: '',
    photoFile: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleLocationChange = (e) => {
    setForm(prev => ({ ...prev, location: e.target.value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        alert('File size must be less than 20MB');
        return;
      }

      setForm(prev => ({ ...prev, photoFile: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!form.location) {
      alert('Please enter the tree location');
      return;
    }

    // Create URL params
    const params = new URLSearchParams({
      location: form.location,
    });

    // Store photo in sessionStorage if available
    if (photoPreview) {
      sessionStorage.setItem('relocateTreePhoto', photoPreview);
      sessionStorage.setItem('relocateTreePhotoName', form.photoFile.name);
    }

    router.push(`/relocate-tree?${params.toString()}`);
  };

  const removePhoto = () => {
    setForm(prev => ({ ...prev, photoFile: null }));
    setPhotoPreview(null);
  };

  return (
    <div className="relocate-tree-hero">
      <div className="relocate-hero-content">
        <div className="relocate-hero-text">
          <div>
            <h2 className="relocate-hero-title">
              <i className="fas fa-truck-moving"></i> Relocate a Tree
            </h2>
            <p className="relocate-hero-subtitle">
              Help save trees from being cut down. Report trees that need relocation,
              and our team will handle the rest.
            </p>
            <div className="relocate-hero-features">
              <div className="feature-item">
                <i className="fas fa-shield-alt"></i>
                <span>Prevent Tree Cutting</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-users"></i>
                <span>Global Network</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-hands-helping"></i>
                <span>Crowd Funded</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relocate-hero-form">
          <form onSubmit={handleContinue} className="relocate-form-container">
            <h3>Report a Tree for Relocation</h3>
            <p className="form-description">
              Provide the tree's current location and optionally upload a photo
            </p>

            {/* Location Input */}
            <div className="form-group">
              <label htmlFor="location">
                Tree Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter address or coordinates (e.g., 123 Main St, or lat, lng)"
                value={form.location}
                onChange={handleLocationChange}
                required
              />
              <i className="fas fa-map-marker-alt"></i>
              <small className="form-hint">
                Current location of the tree that needs relocation
              </small>
            </div>

            {/* Photo Upload */}
            <div className="form-group">
              <label htmlFor="photo">
                <i className="fas fa-camera"></i> Tree Photo (Optional)
              </label>

              {!photoPreview ? (
                <div className="photo-upload-area">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo" className="upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Click to upload or drag photo here</span>
                    <small>Max size: 20MB • JPG, PNG, WebP</small>
                  </label>
                </div>
              ) : (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Tree preview" />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={removePhoto}
                  >
                    <i className="fas fa-times"></i> Remove Photo
                  </button>
                </div>
              )}
              <small className="form-hint">
                Photo helps our team assess the tree better
              </small>
            </div>

            {/* Continue Button */}
            <button type="submit" className="btn-continue">
              Continue <i className="fas fa-arrow-right"></i>
            </button>

            <p className="form-note">
              <i className="fas fa-info-circle"></i>
              Our team will contact you within 24 hours to discuss the relocation plan
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RelocateTreeHero;
