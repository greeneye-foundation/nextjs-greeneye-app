"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EncyclopediaAdminLayout from '@/components/encyclopedia/admin/EncyclopediaAdminLayout';
import { useEncyclopedia } from '@/context/EncyclopediaContext';
import { articlesAPI } from '@/lib/api/encyclopedia';

// Import form sections
import BasicInfoSection from '@/components/encyclopedia/admin/article-form/BasicInfoSection';
import ContentSection from '@/components/encyclopedia/admin/article-form/ContentSection';
import TypeSpecificSection from '@/components/encyclopedia/admin/article-form/TypeSpecificSection';
import MediaSection from '@/components/encyclopedia/admin/article-form/MediaSection';
import TaxonomySection from '@/components/encyclopedia/admin/article-form/TaxonomySection';
import PublishingSection from '@/components/encyclopedia/admin/article-form/PublishingSection';
import SEOSection from '@/components/encyclopedia/admin/article-form/SEOSection';

const EditArticlePage = () => {
  const router = useRouter();
  const params = useParams();
  const articleSlug = params.slug;
  const { language } = useEncyclopedia();

  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);


  // Fetch article data
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        // Call API
        const response = await articlesAPI.getBySlug(articleSlug);
        if (response.success) {
          setArticles(response.data || []);
          setFormData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch articles');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        alert(`Failed to load articles: ${error.message}`);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    if (articleSlug) fetchArticles();
  }, [articleSlug]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (lang, value) => {
    updateFormData('title', { ...formData.title, [lang]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.slug) newErrors.slug = 'Slug is required';
    if (!formData.articleType) newErrors.articleType = 'Article type is required';
    if (!formData.title.en) newErrors.titleEn = 'English title is required';
    if (!formData.content.en) newErrors.contentEn = 'English content is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveChanges = async () => {
    if (!validateForm()) {
      setActiveTab('basic');
      alert('Please fix the validation errors');
      return;
    }

    setSaving(true);

    try {
      // 🔥 Yahi actual update request
      const res = await articlesAPI.update(articleSlug, formData);

      if (res.success) {
        setSaveMessage('Changes saved successfully');
        setTimeout(() => {
          setSaveMessage('');
          router.push('/admin/encyclopedia/articles');
        }, 1500);
      } else {
        alert(res.message || "Update failed");
      }
    } catch (error) {
      console.error('Error updating article:', error);
      alert(`Error updating article: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };


  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'fa-info-circle' },
    { id: 'content', label: 'Content', icon: 'fa-file-text' },
    { id: 'type-specific', label: 'Details', icon: 'fa-list-alt' },
    { id: 'media', label: 'Media', icon: 'fa-images' },
    { id: 'taxonomy', label: 'Categories & Tags', icon: 'fa-tags' },
    { id: 'publishing', label: 'Publishing', icon: 'fa-globe' },
    { id: 'seo', label: 'SEO', icon: 'fa-search' }
  ];

  if (loading) {
    return (
      <EncyclopediaAdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--lime-spark)' }}></i>
          <p>Loading article...</p>
        </div>
      </EncyclopediaAdminLayout>
    );
  }

  if (!formData) {
    return (
      <EncyclopediaAdminLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Article not found</p>
        </div>
      </EncyclopediaAdminLayout>
    );
  }

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
              <h2 className="form-title">Edit Article</h2>
              <p className="form-subtitle">Update article details</p>
            </div>
          </div>

          <div className="header-right">
            {saveMessage && (
              <span className="save-message">
                <i className="fas fa-check-circle"></i> {saveMessage}
              </span>
            )}

            <button
              className="btn btn-primary"
              onClick={saveChanges}
              disabled={saving}
            >
              <i className="fas fa-save"></i>
              {saving ? 'Saving...' : 'Save Changes'}
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
      </div>

      <style jsx>{`
        .article-form-page {
          max-width: 1200px;
        }

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

        .form-tabs {
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 1rem;
          border-radius: 12px 12px 0 0;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

        .form-content {
          background: white;
          padding: 2rem;
          border-radius: 0 0 12px 12px;
          min-height: 500px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </EncyclopediaAdminLayout>
  );
};

export default EditArticlePage;