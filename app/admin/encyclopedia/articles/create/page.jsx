"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EncyclopediaAdminLayout from '@/components/encyclopedia/admin/EncyclopediaAdminLayout';
import { useEncyclopedia } from '@/context/EncyclopediaContext';
import { ARTICLE_TYPES, ARTICLE_STATUS } from '@/lib/constants/encyclopedia';
import { articlesAPI } from '@/lib/api/encyclopedia';

// Import form sections (we'll create these next)
import BasicInfoSection from '@/components/encyclopedia/admin/article-form/BasicInfoSection';
import ContentSection from '@/components/encyclopedia/admin/article-form/ContentSection';
import TypeSpecificSection from '@/components/encyclopedia/admin/article-form/TypeSpecificSection';
import MediaSection from '@/components/encyclopedia/admin/article-form/MediaSection';
import TaxonomySection from '@/components/encyclopedia/admin/article-form/TaxonomySection';
import PublishingSection from '@/components/encyclopedia/admin/article-form/PublishingSection';
import SEOSection from '@/components/encyclopedia/admin/article-form/SEOSection';

const CreateArticlePage = () => {
  const router = useRouter();
  const { language } = useEncyclopedia();

  // Active tab
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    slug: '',
    articleTypeId: '',
    title: { en: '', hi: '', zh: '', ar: '' },
    excerpt: { en: '', hi: '', zh: '', ar: '' },

    // Content
    content: { en: '', hi: '', zh: '', ar: '' },

    // Type-specific data
    typeData: {},

    // Taxonomy
    categoryIds: [],
    tagIds: [],
    relatedCountries: [],

    // Media
    mediaIds: [],

    // Publishing
    status: 'draft',
    isGlobal: true,
    publishedCountries: [],
    authorId: '', // Will be set from logged-in user

    // SEO
    metaTitle: { en: '', hi: '', zh: '', ar: '' },
    metaDescription: { en: '', hi: '', zh: '', ar: '' },
    keywords: []
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Saving state
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Auto-save draft
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (formData.slug && formData.title.en) {
        saveDraft();
      }
    }, 60000); // Auto-save every minute

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (lang, value) => {
    updateFormData('title', { ...formData.title, [lang]: value });

    // Auto-generate slug from English title if slug is empty
    if (lang === 'en' && !formData.slug) {
      updateFormData('slug', generateSlug(value));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.slug) newErrors.slug = 'Slug is required';
    if (!formData.articleTypeId) newErrors.articleTypeId = 'Article type is required';
    if (!formData.title.en) newErrors.titleEn = 'English title is required';
    if (!formData.content.en) newErrors.contentEn = 'English content is required';

    // Type-specific validation
    if (formData.articleTypeId) {
      const articleType = formData.articleTypeId; // Get type slug

      if (articleType === 'plant') {
        if (!formData.typeData.plant?.scientificName) {
          newErrors.scientificName = 'Scientific name is required for plants';
        }
      } else if (articleType === 'policy') {
        if (!formData.typeData.policy?.countryCode) {
          newErrors.policyCountry = 'Country is required for policies';
        }
      } else if (articleType === 'product') {
        if (!formData.typeData.product?.productName) {
          newErrors.productName = 'Product name is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save as draft
  const saveDraft = async () => {
    setSaving(true);

    try {
      const articleData = {
        ...formData,
        status: 'draft'
      };

      const response = await articlesAPI.create(articleData);
      console.log('Draft saved:', response);

      setSaveMessage('Draft saved successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveMessage(`Error: ${error.message}`);
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Submit for review
  const submitForReview = async () => {
    if (!validateForm()) {
      setActiveTab('basic'); // Go to first tab with errors
      alert('Please fix the validation errors before submitting');
      return;
    }

    setSaving(true);

    try {
      const articleData = {
        ...formData,
        status: 'pending_review'
      };

      const response = await articlesAPI.create(articleData);
      console.log('Submitted for review:', response);

      alert('Article submitted for review successfully!');
      router.push('/admin/encyclopedia/articles');
    } catch (error) {
      console.error('Error submitting article:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Publish immediately (admin only)
  const publishNow = async () => {
    if (!validateForm()) {
      setActiveTab('basic');
      alert('Please fix the validation errors before publishing');
      return;
    }

    const confirmed = confirm('Are you sure you want to publish this article immediately?');
    if (!confirmed) return;

    setSaving(true);

    try {
      const articleData = {
        ...formData,
        status: 'published',
        publishedAt: new Date().toISOString()
      };

      const response = await articlesAPI.create(articleData);
      console.log('Article published:', response);

      alert('Article published successfully!');
      router.push('/admin/encyclopedia/articles');
    } catch (error) {
      console.error('Error publishing article:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Tabs configuration
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'fa-info-circle' },
    { id: 'content', label: 'Content', icon: 'fa-file-text' },
    { id: 'type-specific', label: 'Details', icon: 'fa-list-alt' },
    { id: 'media', label: 'Media', icon: 'fa-images' },
    { id: 'taxonomy', label: 'Categories & Tags', icon: 'fa-tags' },
    { id: 'publishing', label: 'Publishing', icon: 'fa-globe' },
    { id: 'seo', label: 'SEO', icon: 'fa-search' }
  ];

  return (
    <EncyclopediaAdminLayout>
      <div className="article-form-page">
        {/* Header */}
        <div className="form-header">
          <div className="header-left">
            <button
              className="back-btn"
              onClick={() => router.back()}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h2 className="form-title">Create New Article</h2>
              <p className="form-subtitle">Fill in the details to create an encyclopedia article</p>
            </div>
          </div>

          <div className="header-right">
            {saveMessage && (
              <span className="save-message">
                <i className="fas fa-check-circle"></i> {saveMessage}
              </span>
            )}

            <button
              className="btn btn-secondary"
              onClick={saveDraft}
              disabled={saving}
            >
              <i className="fas fa-save"></i>
              {saving ? 'Saving...' : 'Save Draft'}
            </button>

            <button
              className="btn btn-warning"
              onClick={submitForReview}
              disabled={saving}
            >
              <i className="fas fa-paper-plane"></i>
              Submit for Review
            </button>

            <button
              className="btn btn-primary"
              onClick={publishNow}
              disabled={saving}
            >
              <i className="fas fa-check"></i>
              Publish Now
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="form-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span>{tab.label}</span>
              {errors[tab.id] && <i className="fas fa-exclamation-circle error-icon"></i>}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="form-content">
          {activeTab === 'basic' && (
            <BasicInfoSection
              formData={formData}
              updateFormData={updateFormData}
              handleTitleChange={handleTitleChange}
              generateSlug={generateSlug}
              errors={errors}
            />
          )}

          {activeTab === 'content' && (
            <ContentSection
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {activeTab === 'type-specific' && (
            <TypeSpecificSection
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}

          {activeTab === 'media' && (
            <MediaSection
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {activeTab === 'taxonomy' && (
            <TaxonomySection
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {activeTab === 'publishing' && (
            <PublishingSection
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {activeTab === 'seo' && (
            <SEOSection
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>

        {/* Validation Errors Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="errors-summary">
            <h4>
              <i className="fas fa-exclamation-triangle"></i>
              Please fix the following errors:
            </h4>
            <ul>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .article-form-page {
          max-width: 1200px;
        }

        /* Header */
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .back-btn {
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          color: var(--evergreen);
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: var(--lime-spark);
          color: white;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--evergreen);
          margin: 0 0 0.5rem 0;
          font-family: 'Montserrat', sans-serif;
        }

        .form-subtitle {
          color: rgba(47, 60, 59, 0.7);
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .save-message {
          color: #28a745;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Montserrat', sans-serif;
          border: none;
          white-space: nowrap;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: var(--lime-spark);
          color: var(--charcoal-bark);
        }

        .btn-primary:hover:not(:disabled) {
          background: #7fb83e;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(159, 211, 86, 0.3);
        }

        .btn-secondary {
          background: white;
          color: var(--evergreen);
          border: 1px solid rgba(159, 211, 86, 0.3);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(159, 211, 86, 0.1);
        }

        .btn-warning {
          background: #ffc107;
          color: #000;
        }

        .btn-warning:hover:not(:disabled) {
          background: #e0a800;
        }

        /* Tabs */
        .form-tabs {
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 1rem;
          border-radius: 12px 12px 0 0;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .form-tabs::-webkit-scrollbar {
          height: 4px;
        }

        .form-tabs::-webkit-scrollbar-thumb {
          background: rgba(159, 211, 86, 0.3);
          border-radius: 2px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          color: rgba(47, 60, 59, 0.7);
          white-space: nowrap;
          position: relative;
        }

        .tab-btn:hover {
          color: var(--evergreen);
          background: rgba(159, 211, 86, 0.05);
        }

        .tab-btn.active {
          color: var(--evergreen);
          border-bottom-color: var(--lime-spark);
          font-weight: 600;
        }

        .error-icon {
          color: #e74c3c;
          font-size: 0.85rem;
        }

        /* Form Content */
        .form-content {
          background: white;
          padding: 2rem;
          border-radius: 0 0 12px 12px;
          min-height: 500px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        /* Errors Summary */
        .errors-summary {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
        }

        .errors-summary h4 {
          color: #856404;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .errors-summary ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #856404;
        }

        .errors-summary li {
          margin-bottom: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .form-header {
            flex-direction: column;
          }

          .header-right {
            width: 100%;
            justify-content: flex-start;
          }

          .form-tabs {
            border-radius: 8px;
          }

          .form-content {
            border-radius: 8px;
            padding: 1.5rem;
          }

          .tab-btn span {
            display: none;
          }

          .tab-btn.active span {
            display: inline;
          }
        }

        @media (max-width: 768px) {
          .form-title {
            font-size: 1.5rem;
          }

          .btn {
            padding: 0.625rem 1rem;
            font-size: 0.9rem;
          }

          .form-content {
            padding: 1rem;
          }
        }
      `}</style>
    </EncyclopediaAdminLayout>
  );
};

export default CreateArticlePage;
