"use client";

import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, SOCIAL_MEDIA_PLATFORMS } from '@/lib/constants/encyclopedia';

const SEOSection = ({ formData, updateFormData }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [newKeyword, setNewKeyword] = useState('');
  const [showPreview, setShowPreview] = useState('google');

  // Character count helpers
  const getCharCount = (text) => text?.length || 0;

  // Handle meta title change
  const handleMetaTitleChange = (lang, value) => {
    updateFormData('metaTitle', {
      ...formData.metaTitle,
      [lang]: value
    });
  };

  // Handle meta description change
  const handleMetaDescriptionChange = (lang, value) => {
    updateFormData('metaDescription', {
      ...formData.metaDescription,
      [lang]: value
    });
  };

  // Add keyword
  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    const currentKeywords = formData.keywords || [];
    if (currentKeywords.includes(newKeyword.trim())) {
      alert('Keyword already exists');
      return;
    }
    updateFormData('keywords', [...currentKeywords, newKeyword.trim()]);
    setNewKeyword('');
  };

  // Remove keyword
  const removeKeyword = (keyword) => {
    updateFormData('keywords', (formData.keywords || []).filter(k => k !== keyword));
  };

  // Auto-generate from title and excerpt
  const autoGenerateMeta = () => {
    const title = formData.title[selectedLanguage] || formData.title.en;
    const excerpt = formData.excerpt[selectedLanguage] || formData.excerpt.en;

    if (title && !formData.metaTitle[selectedLanguage]) {
      handleMetaTitleChange(selectedLanguage, title);
    }

    if (excerpt && !formData.metaDescription[selectedLanguage]) {
      const truncated = excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt;
      handleMetaDescriptionChange(selectedLanguage, truncated);
    }
  };

  // Get preview data
  const getPreviewTitle = () => {
    return formData.metaTitle[selectedLanguage] || formData.title[selectedLanguage] || 'Article Title';
  };

  const getPreviewDescription = () => {
    return formData.metaDescription[selectedLanguage] || formData.excerpt[selectedLanguage] || 'Article description...';
  };

  const getPreviewUrl = () => {
    return `https://greeneye.org/encyclopedia/${formData.slug || 'article-slug'}`;
  };

  return (
    <div className="seo-section">
      <h3 className="section-title">
        <i className="fas fa-search"></i>
        SEO & Social Media
      </h3>
      <p className="section-description">
        Optimize your article for search engines and social media platforms.
      </p>

      {/* Language Tabs */}
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
            {lang.code === 'en' && <span className="required-badge">Recommended</span>}
          </button>
        ))}
      </div>

      {/* Auto-generate Button */}
      <div className="auto-generate-section">
        <button
          type="button"
          className="btn-auto-generate"
          onClick={autoGenerateMeta}
        >
          <i className="fas fa-magic"></i>
          Auto-generate from Title & Excerpt
        </button>
        <small className="field-hint">
          Automatically fill meta fields using your article title and excerpt
        </small>
      </div>

      {/* Meta Title */}
      <div className="form-group">
        <label className="form-label">
          Meta Title ({SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name})
        </label>
        <div className="input-with-counter">
          <input
            type="text"
            value={formData.metaTitle[selectedLanguage] || ''}
            onChange={(e) => handleMetaTitleChange(selectedLanguage, e.target.value)}
            placeholder={`SEO title for ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...`}
            maxLength={60}
          />
          <span className={`char-counter ${getCharCount(formData.metaTitle[selectedLanguage]) > 60 ? 'warning' : ''}`}>
            {getCharCount(formData.metaTitle[selectedLanguage])}/60
          </span>
        </div>
        <small className="field-hint">
          {getCharCount(formData.metaTitle[selectedLanguage]) <= 60 ? (
            <>
              <i className="fas fa-check-circle"></i>
              Optimal length (50-60 characters recommended)
            </>
          ) : (
            <>
              <i className="fas fa-exclamation-circle"></i>
              Title is too long, may be truncated in search results
            </>
          )}
        </small>
      </div>

      {/* Meta Description */}
      <div className="form-group">
        <label className="form-label">
          Meta Description ({SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name})
        </label>
        <div className="textarea-with-counter">
          <textarea
            value={formData.metaDescription[selectedLanguage] || ''}
            onChange={(e) => handleMetaDescriptionChange(selectedLanguage, e.target.value)}
            placeholder={`SEO description for ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...`}
            rows={3}
            maxLength={160}
          />
          <span className={`char-counter ${getCharCount(formData.metaDescription[selectedLanguage]) > 160 ? 'warning' : ''}`}>
            {getCharCount(formData.metaDescription[selectedLanguage])}/160
          </span>
        </div>
        <small className="field-hint">
          {getCharCount(formData.metaDescription[selectedLanguage]) >= 120 && getCharCount(formData.metaDescription[selectedLanguage]) <= 160 ? (
            <>
              <i className="fas fa-check-circle"></i>
              Optimal length (120-160 characters recommended)
            </>
          ) : (
            <>
              <i className="fas fa-info-circle"></i>
              Aim for 120-160 characters for best results
            </>
          )}
        </small>
      </div>

      {/* Keywords */}
      <div className="form-group">
        <label className="form-label">
          Focus Keywords
          {formData.keywords?.length > 0 && (
            <span className="keyword-count">{formData.keywords.length} keywords</span>
          )}
        </label>

        <div className="keyword-input-group">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            placeholder="Enter a keyword and press Enter..."
          />
          <button
            type="button"
            className="btn-add-keyword"
            onClick={addKeyword}
            disabled={!newKeyword.trim()}
          >
            <i className="fas fa-plus"></i>
            Add
          </button>
        </div>

        {formData.keywords?.length > 0 && (
          <div className="keywords-list">
            {formData.keywords.map((keyword, index) => (
              <span key={index} className="keyword-chip">
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="remove-keyword-btn"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <small className="field-hint">
          <i className="fas fa-lightbulb"></i>
          Add 3-5 keywords that represent the main topics of your article
        </small>
      </div>

      {/* SEO Score Summary */}
      <div className="seo-score">
        <h4 className="score-title">
          <i className="fas fa-chart-line"></i>
          SEO Checklist
        </h4>
        <div className="checklist">
          <div className={`checklist-item ${formData.metaTitle[selectedLanguage] ? 'complete' : ''}`}>
            <i className={`fas ${formData.metaTitle[selectedLanguage] ? 'fa-check-circle' : 'fa-circle'}`}></i>
            <span>Meta title is set ({getCharCount(formData.metaTitle[selectedLanguage])}/60 characters)</span>
          </div>
          <div className={`checklist-item ${formData.metaDescription[selectedLanguage] ? 'complete' : ''}`}>
            <i className={`fas ${formData.metaDescription[selectedLanguage] ? 'fa-check-circle' : 'fa-circle'}`}></i>
            <span>Meta description is set ({getCharCount(formData.metaDescription[selectedLanguage])}/160 characters)</span>
          </div>
          <div className={`checklist-item ${formData.keywords?.length >= 3 ? 'complete' : ''}`}>
            <i className={`fas ${formData.keywords?.length >= 3 ? 'fa-check-circle' : 'fa-circle'}`}></i>
            <span>At least 3 focus keywords added ({formData.keywords?.length || 0})</span>
          </div>
          <div className={`checklist-item ${formData.slug ? 'complete' : ''}`}>
            <i className={`fas ${formData.slug ? 'fa-check-circle' : 'fa-circle'}`}></i>
            <span>URL slug is set</span>
          </div>
        </div>
      </div>

      {/* Preview Tabs */}
      <div className="preview-section">
        <h4 className="preview-title">
          <i className="fas fa-eye"></i>
          Preview
        </h4>

        <div className="preview-tabs">
          <button
            type="button"
            className={`preview-tab ${showPreview === 'google' ? 'active' : ''}`}
            onClick={() => setShowPreview('google')}
          >
            <i className="fab fa-google"></i>
            Google Search
          </button>
          <button
            type="button"
            className={`preview-tab ${showPreview === 'facebook' ? 'active' : ''}`}
            onClick={() => setShowPreview('facebook')}
          >
            <i className="fab fa-facebook"></i>
            Facebook
          </button>
          <button
            type="button"
            className={`preview-tab ${showPreview === 'twitter' ? 'active' : ''}`}
            onClick={() => setShowPreview('twitter')}
          >
            <i className="fab fa-twitter"></i>
            Twitter
          </button>
        </div>

        <div className="preview-content">
          {/* Google Preview */}
          {showPreview === 'google' && (
            <div className="google-preview">
              <div className="google-url">{getPreviewUrl()}</div>
              <div className="google-title">{getPreviewTitle()}</div>
              <div className="google-description">{getPreviewDescription()}</div>
            </div>
          )}

          {/* Facebook Preview */}
          {showPreview === 'facebook' && (
            <div className="facebook-preview">
              <div className="facebook-image">
                {formData.mediaIds?.length > 0 ? (
                  <div className="placeholder-image">
                    <i className="fas fa-image"></i>
                    Featured Image
                  </div>
                ) : (
                  <div className="no-image">No featured image</div>
                )}
              </div>
              <div className="facebook-content">
                <div className="facebook-url">{getPreviewUrl().toUpperCase()}</div>
                <div className="facebook-title">{getPreviewTitle()}</div>
                <div className="facebook-description">{getPreviewDescription()}</div>
              </div>
            </div>
          )}

          {/* Twitter Preview */}
          {showPreview === 'twitter' && (
            <div className="twitter-preview">
              {formData.mediaIds?.length > 0 && (
                <div className="twitter-image">
                  <i className="fas fa-image"></i>
                  Featured Image
                </div>
              )}
              <div className="twitter-content">
                <div className="twitter-title">{getPreviewTitle()}</div>
                <div className="twitter-description">{getPreviewDescription()}</div>
                <div className="twitter-url">{getPreviewUrl()}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .seo-section {
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

        .auto-generate-section {
          margin-bottom: 2rem;
        }

        .btn-auto-generate {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, var(--lime-spark), #7fb83e);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 0.5rem;
        }

        .btn-auto-generate:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(159, 211, 86, 0.3);
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
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .keyword-count {
          background: var(--lime-spark);
          color: white;
          padding: 0.15rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .input-with-counter,
        .textarea-with-counter {
          position: relative;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.75rem 4rem 0.75rem 1rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          font-size: 1rem;
          font-family: 'Open Sans', sans-serif;
          transition: all 0.3s ease;
        }

        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        .char-counter {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.875rem;
          color: rgba(47, 60, 59, 0.6);
          font-weight: 600;
        }

        .textarea-with-counter .char-counter {
          top: 1rem;
          transform: none;
        }

        .char-counter.warning {
          color: #e74c3c;
        }

        .field-hint {
          display: block;
          color: rgba(47, 60, 59, 0.6);
          font-size: 0.875rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .keyword-input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .keyword-input-group input {
          flex: 1;
        }

        .btn-add-keyword {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--lime-spark);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn-add-keyword:hover:not(:disabled) {
          background: #7fb83e;
        }

        .btn-add-keyword:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .keywords-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .keyword-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: white;
          border: 1px solid var(--lime-spark);
          border-radius: 20px;
          color: var(--evergreen);
          font-weight: 500;
        }

        .remove-keyword-btn {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          line-height: 1;
          transition: all 0.3s ease;
        }

        .remove-keyword-btn:hover {
          background: #e74c3c;
          color: white;
        }

        .seo-score {
          background: #e8f5e9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .score-title {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checklist {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(47, 60, 59, 0.6);
        }

        .checklist-item.complete {
          color: var(--evergreen);
        }

        .checklist-item i {
          font-size: 1.2rem;
        }

        .checklist-item.complete i {
          color: #28a745;
        }

        .preview-section {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .preview-title {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .preview-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .preview-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .preview-tab:hover {
          border-color: var(--lime-spark);
        }

        .preview-tab.active {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .preview-content {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
        }

        /* Google Preview */
        .google-preview {
          font-family: Arial, sans-serif;
        }

        .google-url {
          color: #202124;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .google-title {
          color: #1a0dab;
          font-size: 1.25rem;
          font-weight: 400;
          margin-bottom: 0.25rem;
          cursor: pointer;
        }

        .google-title:hover {
          text-decoration: underline;
        }

        .google-description {
          color: #4d5156;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        /* Facebook Preview */
        .facebook-preview {
          border: 1px solid #dadde1;
          border-radius: 8px;
          overflow: hidden;
        }

        .facebook-image {
          background: #f0f2f5;
          aspect-ratio: 1.91/1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #65676b;
        }

        .placeholder-image i {
          font-size: 3rem;
        }

        .no-image {
          color: #65676b;
          font-style: italic;
        }

        .facebook-content {
          padding: 0.75rem;
          background: #f0f2f5;
        }

        .facebook-url {
          color: #65676b;
          font-size: 0.75rem;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .facebook-title {
          color: #050505;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .facebook-description {
          color: #65676b;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        /* Twitter Preview */
        .twitter-preview {
          border: 1px solid #cfd9de;
          border-radius: 16px;
          overflow: hidden;
        }

        .twitter-image {
          background: #f7f9f9;
          aspect-ratio: 2/1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #536471;
          font-size: 3rem;
        }

        .twitter-content {
          padding: 0.75rem;
        }

        .twitter-title {
          color: #0f1419;
          font-size: 0.9375rem;
          font-weight: 400;
          margin-bottom: 0.25rem;
        }

        .twitter-description {
          color: #536471;
          font-size: 0.9375rem;
          line-height: 1.3;
          margin-bottom: 0.5rem;
        }

        .twitter-url {
          color: #536471;
          font-size: 0.9375rem;
        }

        @media (max-width: 768px) {
          .preview-tabs {
            flex-direction: column;
          }

          .keyword-input-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SEOSection;
