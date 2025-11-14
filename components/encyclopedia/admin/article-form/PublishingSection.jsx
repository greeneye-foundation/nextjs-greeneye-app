"use client";

import React, { useState, useEffect } from 'react';
import { COUNTRIES, ARTICLE_STATUS } from '@/lib/constants/encyclopedia';
import { authorsAPI } from '@/lib/api/encyclopedia';

const PublishingSection = ({ formData, updateFormData }) => {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch authors from API
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await authorsAPI.getAll();
        setAuthors(response.data || []);
      } catch (error) {
        console.error('Error fetching authors:', error);
        // Fallback to empty array
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const mockAuthors = authors;

  // Toggle country in publishedCountries
  const togglePublishedCountry = (countryCode) => {
    const current = formData.publishedCountries || [];
    if (current.includes(countryCode)) {
      updateFormData('publishedCountries', current.filter(c => c !== countryCode));
    } else {
      updateFormData('publishedCountries', [...current, countryCode]);
    }
  };

  // Select all countries
  const selectAllCountries = () => {
    updateFormData('publishedCountries', COUNTRIES.map(c => c.code));
  };

  // Clear all countries
  const clearAllCountries = () => {
    updateFormData('publishedCountries', []);
  };

  return (
    <div className="publishing-section">
      <h3 className="section-title">
        <i className="fas fa-globe"></i>
        Publishing Options
      </h3>
      <p className="section-description">
        Configure how and where your article will be published.
      </p>

      {/* Status */}
      <div className="form-group">
        <label className="form-label">Publication Status</label>
        <div className="status-options">
          {Object.entries(ARTICLE_STATUS).map(([key, value]) => (
            <label key={value} className="radio-card">
              <input
                type="radio"
                name="status"
                value={value}
                checked={formData.status === value}
                onChange={(e) => updateFormData('status', e.target.value)}
              />
              <div className="radio-content">
                <div className="radio-header">
                  <span className={`status-badge status-${value}`}>
                    {value === 'draft' && <i className="fas fa-file-alt"></i>}
                    {value === 'pending_review' && <i className="fas fa-clock"></i>}
                    {value === 'published' && <i className="fas fa-check-circle"></i>}
                    {value === 'archived' && <i className="fas fa-archive"></i>}
                    {value.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="radio-description">
                  {value === 'draft' && 'Save as draft for later editing'}
                  {value === 'pending_review' && 'Submit for editorial review'}
                  {value === 'published' && 'Make article publicly visible'}
                  {value === 'archived' && 'Hide from public view'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Author */}
      <div className="form-group">
        <label className="form-label">Author</label>
        <select
          value={formData.authorId || ''}
          onChange={(e) => updateFormData('authorId', e.target.value)}
        >
          <option value="">Select author...</option>
          {mockAuthors.map(author => (
            <option key={author._id} value={author._id}>
              {author.name} ({author.role})
            </option>
          ))}
        </select>
        <small className="field-hint">
          The person credited for this article
        </small>
      </div>

      {/* Global vs Country-Specific */}
      <div className="form-group">
        <label className="form-label">Geographic Targeting</label>
        <div className="targeting-options">
          <label className="radio-option">
            <input
              type="radio"
              name="isGlobal"
              checked={formData.isGlobal === true}
              onChange={() => {
                updateFormData('isGlobal', true);
                updateFormData('publishedCountries', []);
              }}
            />
            <div className="radio-option-content">
              <i className="fas fa-globe-americas"></i>
              <div>
                <strong>Global Article</strong>
                <p>Available to all countries</p>
              </div>
            </div>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="isGlobal"
              checked={formData.isGlobal === false}
              onChange={() => updateFormData('isGlobal', false)}
            />
            <div className="radio-option-content">
              <i className="fas fa-map-marked-alt"></i>
              <div>
                <strong>Country-Specific</strong>
                <p>Available only in selected countries</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Country Selection (if not global) */}
      {formData.isGlobal === false && (
        <div className="form-group">
          <div className="country-selector-header">
            <label className="form-label">Select Countries</label>
            <div className="bulk-actions">
              <button
                type="button"
                className="bulk-btn"
                onClick={selectAllCountries}
              >
                <i className="fas fa-check-double"></i>
                Select All
              </button>
              <button
                type="button"
                className="bulk-btn"
                onClick={clearAllCountries}
              >
                <i className="fas fa-times"></i>
                Clear All
              </button>
            </div>
          </div>

          <div className="country-grid">
            {COUNTRIES.map(country => (
              <label key={country.code} className="country-checkbox">
                <input
                  type="checkbox"
                  checked={(formData.publishedCountries || []).includes(country.code)}
                  onChange={() => togglePublishedCountry(country.code)}
                />
                <div className="country-content">
                  <span className="country-flag">{country.flag}</span>
                  <div className="country-info">
                    <span className="country-name">{country.name}</span>
                    <span className="country-native">{country.nativeName}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {formData.publishedCountries?.length > 0 && (
            <div className="selected-summary">
              <i className="fas fa-check-circle"></i>
              <strong>{formData.publishedCountries.length}</strong> countries selected
            </div>
          )}
        </div>
      )}

      {/* Scheduled Publishing */}
      <div className="form-group">
        <div className="schedule-header">
          <label className="form-label">Scheduled Publishing</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(e) => {
                setScheduleEnabled(e.target.checked);
                if (!e.target.checked) {
                  updateFormData('scheduledPublishTime', null);
                }
              }}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {scheduleEnabled && (
          <div className="schedule-inputs">
            <div className="schedule-input-group">
              <label>Publish Date & Time</label>
              <input
                type="datetime-local"
                value={formData.scheduledPublishTime || ''}
                onChange={(e) => updateFormData('scheduledPublishTime', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <small className="field-hint">
              <i className="fas fa-info-circle"></i>
              Article will be automatically published at the scheduled time
            </small>
          </div>
        )}
      </div>

      {/* Publishing Summary */}
      <div className="publishing-summary">
        <h4 className="summary-title">
          <i className="fas fa-clipboard-list"></i>
          Publishing Summary
        </h4>
        <div className="summary-grid">
          <div className="summary-item">
            <i className="fas fa-circle-notch"></i>
            <div>
              <strong>Status:</strong>
              <span className={`status-text status-${formData.status}`}>
                {formData.status?.replace('_', ' ').toUpperCase() || 'Not Set'}
              </span>
            </div>
          </div>

          <div className="summary-item">
            <i className="fas fa-user"></i>
            <div>
              <strong>Author:</strong>
              <span>
                {mockAuthors.find(a => a._id === formData.authorId)?.name || 'Not assigned'}
              </span>
            </div>
          </div>

          <div className="summary-item">
            <i className="fas fa-globe"></i>
            <div>
              <strong>Visibility:</strong>
              <span>
                {formData.isGlobal
                  ? 'Global (All Countries)'
                  : `${formData.publishedCountries?.length || 0} Selected Countries`}
              </span>
            </div>
          </div>

          <div className="summary-item">
            <i className="fas fa-clock"></i>
            <div>
              <strong>Scheduled:</strong>
              <span>
                {scheduleEnabled && formData.scheduledPublishTime
                  ? new Date(formData.scheduledPublishTime).toLocaleString()
                  : 'Immediate'}
              </span>
            </div>
          </div>
        </div>

        {formData.status === 'published' && !scheduleEnabled && (
          <div className="warning-box">
            <i className="fas fa-exclamation-triangle"></i>
            <p>
              <strong>Warning:</strong> This article will be published immediately upon saving.
              Make sure all content is finalized.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .publishing-section {
          max-width: 900px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--evergreen);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Montserrat', sans-serif;
        }

        .section-description {
          color: rgba(47, 60, 59, 0.7);
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 0.75rem;
          font-family: 'Montserrat', sans-serif;
        }

        select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          font-size: 1rem;
          font-family: 'Open Sans', sans-serif;
          transition: all 0.3s ease;
        }

        select:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        .field-hint {
          display: block;
          color: rgba(47, 60, 59, 0.6);
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .status-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .radio-card {
          position: relative;
          cursor: pointer;
        }

        .radio-card input[type="radio"] {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .radio-content {
          padding: 1rem;
          background: white;
          border: 2px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          transition: all 0.3s ease;
          height: 100%;
        }

        .radio-card input[type="radio"]:checked + .radio-content {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.05);
        }

        .radio-card:hover .radio-content {
          border-color: var(--lime-spark);
        }

        .radio-header {
          margin-bottom: 0.5rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .status-badge.status-draft {
          background: #e3f2fd;
          color: #1976d2;
        }

        .status-badge.status-pending_review {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.status-published {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.status-archived {
          background: #f8f9fa;
          color: #6c757d;
        }

        .radio-description {
          color: rgba(47, 60, 59, 0.7);
          font-size: 0.875rem;
          margin: 0;
        }

        .targeting-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .radio-option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: white;
          border: 2px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .radio-option:hover {
          border-color: var(--lime-spark);
        }

        .radio-option input[type="radio"]:checked ~ .radio-option-content {
          color: var(--evergreen);
        }

        .radio-option input[type="radio"] {
          margin-top: 0.25rem;
          cursor: pointer;
        }

        .radio-option-content {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .radio-option-content i {
          font-size: 1.5rem;
          color: var(--lime-spark);
          margin-top: 0.25rem;
        }

        .radio-option-content strong {
          display: block;
          font-family: 'Montserrat', sans-serif;
          margin-bottom: 0.25rem;
        }

        .radio-option-content p {
          margin: 0;
          font-size: 0.875rem;
          color: rgba(47, 60, 59, 0.7);
        }

        .country-selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .bulk-actions {
          display: flex;
          gap: 0.5rem;
        }

        .bulk-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .bulk-btn:hover {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.1);
        }

        .country-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.75rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        .country-checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .country-checkbox:hover {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.05);
        }

        .country-checkbox input[type="checkbox"] {
          cursor: pointer;
        }

        .country-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .country-flag {
          font-size: 1.5rem;
        }

        .country-info {
          display: flex;
          flex-direction: column;
        }

        .country-name {
          font-weight: 500;
          color: var(--charcoal-bark);
        }

        .country-native {
          font-size: 0.8rem;
          color: rgba(47, 60, 59, 0.6);
        }

        .selected-summary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(159, 211, 86, 0.1);
          border-radius: 8px;
          margin-top: 1rem;
          color: var(--evergreen);
          font-weight: 500;
        }

        .schedule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 26px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        .toggle-switch input:checked + .toggle-slider {
          background-color: var(--lime-spark);
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .schedule-inputs {
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .schedule-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .schedule-input-group label {
          font-weight: 600;
          color: var(--evergreen);
          font-size: 0.9rem;
        }

        .schedule-input-group input[type="datetime-local"] {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          font-size: 1rem;
        }

        .schedule-input-group input[type="datetime-local"]:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        .publishing-summary {
          background: #e8f5e9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 2rem;
        }

        .summary-title {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .summary-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .summary-item i {
          color: var(--lime-spark);
          font-size: 1.2rem;
          margin-top: 0.25rem;
        }

        .summary-item strong {
          display: block;
          color: var(--evergreen);
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }

        .summary-item span {
          color: rgba(47, 60, 59, 0.8);
        }

        .status-text {
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .status-text.status-draft {
          background: #e3f2fd;
          color: #1976d2;
        }

        .status-text.status-pending_review {
          background: #fff3cd;
          color: #856404;
        }

        .status-text.status-published {
          background: #d4edda;
          color: #155724;
        }

        .status-text.status-archived {
          background: #f8f9fa;
          color: #6c757d;
        }

        .warning-box {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .warning-box i {
          color: #856404;
          font-size: 1.2rem;
        }

        .warning-box p {
          margin: 0;
          color: #856404;
        }

        @media (max-width: 768px) {
          .status-options {
            grid-template-columns: 1fr;
          }

          .targeting-options {
            grid-template-columns: 1fr;
          }

          .country-grid {
            grid-template-columns: 1fr;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PublishingSection;
