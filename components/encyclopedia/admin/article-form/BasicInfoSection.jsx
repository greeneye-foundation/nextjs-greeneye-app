"use client";

import React, { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/constants/encyclopedia';
import { articleTypesAPI } from '@/lib/api/encyclopedia';

const BasicInfoSection = ({ formData, updateFormData, handleTitleChange, generateSlug, errors }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [articleTypes, setArticleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch article types from API
  useEffect(() => {
    const fetchArticleTypes = async () => {
      try {
        const response = await articleTypesAPI.getAll('en');
        setArticleTypes(response.data || []);
      } catch (error) {
        console.error('Error fetching article types:', error);
        // Fallback to default types
        setArticleTypes([
          { _id: 'plant', slug: 'plant', name: { en: 'Plant' } },
          { _id: 'topic', slug: 'topic', name: { en: 'Environmental Topic' } },
          { _id: 'policy', slug: 'policy', name: { en: 'Policy' } },
          { _id: 'product', slug: 'product', name: { en: 'Sustainable Product' } }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleTypes();
  }, []);

  return (
    <div className="basic-info-section">
      <h3 className="section-title">
        <i className="fas fa-info-circle"></i>
        Basic Information
      </h3>
      <p className="section-description">
        Enter the basic details for your article. English fields are required.
      </p>

      {/* Article Type */}
      <div className="form-group">
        <label className="form-label required">
          Article Type
        </label>
        <select
          value={formData.articleType || ""}
          onChange={(e) => updateFormData('articleType', e.target.value)}
          className={errors.articleType ? 'error' : ''}
        >
          <option value="">Select article type...</option>
          {articleTypes.map(type => (
            <option key={type._id} value={type._id}>
             {type.name?.en || type.slug}
            </option>
          ))}
        </select>
        {errors.articleType && <span className="error-message">{errors.articleType}</span>}
        <small className="field-hint">
          Choose the type of content you're creating. This determines what additional fields you'll need to fill.
        </small>
      </div>

      {/* Slug */}
      <div className="form-group">
        <label className="form-label required">
          URL Slug
        </label>
        <div className="slug-input-group">
          <span className="slug-prefix">/encyclopedia/</span>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => updateFormData('slug', e.target.value)}
            placeholder="mango-tree-cultivation"
            className={errors.slug ? 'error' : ''}
          />
          {formData.title.en && (
            <button
              type="button"
              className="generate-slug-btn"
              onClick={() => updateFormData('slug', generateSlug(formData.title.en))}
              title="Generate from title"
            >
              <i className="fas fa-sync"></i>
            </button>
          )}
        </div>
        {errors.slug && <span className="error-message">{errors.slug}</span>}
        <small className="field-hint">
          URL-friendly version of the title. Use lowercase letters, numbers, and hyphens only.
        </small>
      </div>

      {/* Language Tabs for Title & Excerpt */}
      <div className="language-tabs">
        {SUPPORTED_LANGUAGES.map(lang => (
          <button
            key={lang.code}
            type="button"
            className={`lang-tab ${selectedLanguage === lang.code ? 'active' : ''}`}
            onClick={() => setSelectedLanguage(lang.code)}
          >
            <span className="lang-flag">{lang.flag}</span>
            <span className="lang-name">{lang.name}</span>
            {lang.code === 'en' && <span className="required-badge">Required</span>}
          </button>
        ))}
      </div>

      {/* Title (Multi-language) */}
      <div className="form-group">
        <label className="form-label required">
          Title ({SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name})
        </label>
        <input
          type="text"
          value={formData.title[selectedLanguage] || ''}
          onChange={(e) => handleTitleChange(selectedLanguage, e.target.value)}
          placeholder={`Enter title in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...`}
          className={selectedLanguage === 'en' && errors.titleEn ? 'error' : ''}
        />
        {selectedLanguage === 'en' && errors.titleEn && (
          <span className="error-message">{errors.titleEn}</span>
        )}
        <small className="field-hint">
          Main heading for the article. This will be displayed prominently.
        </small>
      </div>

      {/* Excerpt (Multi-language) */}
      <div className="form-group">
        <label className="form-label">
          Excerpt ({SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name})
        </label>
        <textarea
          value={formData.excerpt[selectedLanguage] || ''}
          onChange={(e) => updateFormData('excerpt', {
            ...formData.excerpt,
            [selectedLanguage]: e.target.value
          })}
          placeholder={`Brief summary in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...`}
          rows={3}
        />
        <small className="field-hint">
          Short description used in listings and social media. Recommended: 150-160 characters.
        </small>
      </div>

      {/* Translation Status */}
      <div className="translation-status">
        <h4>Translation Status:</h4>
        <div className="status-grid">
          {SUPPORTED_LANGUAGES.map(lang => (
            <div key={lang.code} className="status-item">
              <span className="status-flag">{lang.flag}</span>
              <span className="status-lang">{lang.name}</span>
              <span className={`status-badge ${formData.title[lang.code] ? 'complete' : 'pending'}`}>
                {formData.title[lang.code] ? (
                  <><i className="fas fa-check"></i> Complete</>
                ) : (
                  <><i className="fas fa-times"></i> Pending</>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .basic-info-section {
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
          margin-bottom: 0.5rem;
          font-family: 'Montserrat', sans-serif;
        }

        .form-label.required::after {
          content: '*';
          color: #e74c3c;
          margin-left: 0.25rem;
        }

        input[type="text"],
        textarea,
        select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          font-size: 1rem;
          font-family: 'Open Sans', sans-serif;
          transition: all 0.3s ease;
        }

        input[type="text"]:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        input.error,
        textarea.error,
        select.error {
          border-color: #e74c3c;
        }

        .error-message {
          display: block;
          color: #e74c3c;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          font-weight: 500;
        }

        .field-hint {
          display: block;
          color: rgba(47, 60, 59, 0.6);
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .slug-input-group {
          display: flex;
          align-items: stretch;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .slug-input-group:focus-within {
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        .slug-prefix {
          background: #f8f9fa;
          padding: 0.75rem 1rem;
          color: rgba(47, 60, 59, 0.6);
          border-right: 1px solid rgba(159, 211, 86, 0.2);
          display: flex;
          align-items: center;
          font-family: 'Courier New', monospace;
        }

        .slug-input-group input {
          flex: 1;
          border: none;
          padding: 0.75rem 1rem;
        }

        .slug-input-group input:focus {
          box-shadow: none;
        }

        .generate-slug-btn {
          background: var(--lime-spark);
          border: none;
          color: white;
          padding: 0 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .generate-slug-btn:hover {
          background: #7fb83e;
        }

        .language-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .lang-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
        }

        .lang-tab:hover {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.05);
        }

        .lang-tab.active {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .lang-flag {
          font-size: 1.2rem;
        }

        .required-badge {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .lang-tab.active .required-badge {
          background: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .translation-status {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 2rem;
        }

        .translation-status h4 {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.75rem;
          border-radius: 6px;
        }

        .status-flag {
          font-size: 1.2rem;
        }

        .status-lang {
          flex: 1;
          font-weight: 500;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .status-badge.complete {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        @media (max-width: 768px) {
          .slug-input-group {
            flex-direction: column;
          }

          .slug-prefix {
            border-right: none;
            border-bottom: 1px solid rgba(159, 211, 86, 0.2);
          }

          .language-tabs {
            flex-direction: column;
          }

          .status-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BasicInfoSection;
