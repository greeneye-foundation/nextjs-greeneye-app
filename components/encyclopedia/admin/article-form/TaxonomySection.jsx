"use client";

import React, { useState, useEffect } from 'react';
import { COUNTRIES } from '@/lib/constants/encyclopedia';
import { categoriesAPI, tagsAPI } from '@/lib/api/encyclopedia';

const TaxonomySection = ({ formData, updateFormData }) => {
  const [categorySearch, setCategorySearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch categories and tags from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          categoriesAPI.getAll('en'),
          tagsAPI.getAll('en')
        ]);

        setCategories(categoriesResponse.data || []);
        setTags(tagsResponse.data || []);
        
      } catch (error) {
        console.error('Error fetching taxonomy data:', error);
        // Fallback to empty arrays
        setCategories([]);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mockCategories = categories;
  const mockTags = tags;

  // Filter categories
  const filteredCategories = mockCategories.filter(cat =>
  (cat?.name?.en || "").toLowerCase().includes(categorySearch.toLowerCase())
);

  // Filter tags
  const filteredTags = mockTags.filter(tag =>
  (tag?.name?.en || "").toLowerCase().includes(tagSearch.toLowerCase())
);


  // Toggle category
  const toggleCategory = (categoryId) => {
    const currentCategories = formData.categories || [];
    if (currentCategories.includes(categoryId)) {
      updateFormData('categories', currentCategories.filter(id => id !== categoryId));
    } else {
      updateFormData('categories', [...currentCategories, categoryId]);
    }
  };

  // Toggle tag
  const toggleTag = (tagId) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tagId)) {
      updateFormData('tags', currentTags.filter(id => id !== tagId));
    } else {
      updateFormData('tags', [...currentTags, tagId]);
    }
  };

  // Add new tag
  const addNewTag = async () => {
  if (!newTag.trim()) return;

  try {
    const tagData = {
      name: { en: newTag.trim() },  // <-- Expected format
      slug: newTag.toLowerCase().replace(/\s+/g, '-')
    };

    const res = await tagsAPI.create(tagData);

    const createdTag = res.data; // -> because backend returns {success,message,data}

    setTags([...tags, createdTag]);

    updateFormData('tags', [...(formData.tags || []), createdTag._id]);

    setNewTag('');
    alert(`Tag "${tagData.name.en}" created successfully!`);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error creating tag");
  }
};


  // Toggle country
  const toggleCountry = (countryCode) => {
    const currentCountries = formData.publishedCountries || [];
    if (currentCountries.includes(countryCode)) {
      updateFormData('publishedCountries', currentCountries.filter(c => c !== countryCode));
    } else {
      updateFormData('publishedCountries', [...currentCountries, countryCode]);
    }
  };

  // Get category hierarchy
  const getCategoryHierarchy = (cat) => {
    if (!cat.parent) return cat.name.en;
    const parent = mockCategories.find(c => c._id === cat.parent);
    return parent ? `${parent?.name?.en || ""} > ${cat?.name?.en || ""}` : (cat?.name?.en || "");
  };

  return (
    <div className="taxonomy-section">
      <h3 className="section-title">
        <i className="fas fa-tags"></i>
        Categories & Tags
      </h3>
      <p className="section-description">
        Organize your article with categories, tags, and related countries for better discoverability.
      </p>

      {/* Categories */}
      <div className="taxonomy-group">
        <h4 className="group-title">
          <i className="fas fa-folder"></i>
          Categories
          {formData.categories?.length > 0 && (
            <span className="count-badge">{formData.categories.length} selected</span>
          )}
        </h4>

        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder="Search categories..."
          />
        </div>

        <div className="selection-grid">
          {filteredCategories.map(category => (
            <label key={category._id} className="checkbox-item">
              <input
                type="checkbox"
                checked={(formData.categories || []).includes(category._id)}
                onChange={() => toggleCategory(category._id)}
              />
              <div className="checkbox-content">
                <span className="checkbox-label">{getCategoryHierarchy(category)}</span>
                <span className="checkbox-description">{category?.description?.en || ""}</span>
              </div>
            </label>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No categories found matching "{categorySearch}"</p>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="taxonomy-group">
        <h4 className="group-title">
          <i className="fas fa-tags"></i>
          Tags
          {formData.tags?.length > 0 && (
            <span className="count-badge">{formData.tags.length} selected</span>
          )}
        </h4>

        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            placeholder="Search existing tags..."
          />
        </div>

        <div className="tag-cloud">
          {filteredTags.map(tag => (
            <button
              key={tag._id}
              type="button"
              className={`tag-chip ${(formData.tags || []).includes(tag._id) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag._id)}
            >
              {tag.name?.en || tag.name}
              <span className="tag-count">{tag.usageCount}</span>
            </button>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No tags found matching "{tagSearch}"</p>
          </div>
        )}

        {/* Create New Tag */}
        <div className="create-tag-section">
          <h5 className="subsection-title">
            <i className="fas fa-plus-circle"></i>
            Create New Tag
          </h5>
          <div className="create-tag-input">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter new tag name..."
              onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
            />
            <button
              type="button"
              className="btn-create"
              onClick={addNewTag}
              disabled={!newTag.trim()}
            >
              <i className="fas fa-plus"></i>
              Create Tag
            </button>
          </div>
          <small className="field-hint">
            Can't find the right tag? Create a new one here.
          </small>
        </div>
      </div>

      {/* Related Countries */}
      <div className="taxonomy-group">
        <h4 className="group-title">
          <i className="fas fa-globe"></i>
          Related Countries
          {formData.publishedCountries?.length > 0 && (
            <span className="count-badge">{formData.publishedCountries.length} selected</span>
          )}
        </h4>
        <p className="group-description">
          Select countries that are specifically relevant to this article's content.
        </p>

        <div className="country-grid">
          {COUNTRIES.map(country => (
            <label key={country.code} className="country-item">
              <input
                type="checkbox"
                checked={(formData.publishedCountries || []).includes(country.code)}
                onChange={() => toggleCountry(country.code)}
              />
              <div className="country-content">
                <span className="country-flag">{country.flag}</span>
                <span className="country-name">{country.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="taxonomy-summary">
        <h4 className="summary-title">
          <i className="fas fa-check-circle"></i>
          Selection Summary
        </h4>
        <div className="summary-content">
          <div className="summary-item">
            <strong>Categories:</strong>
            {formData.categories?.length > 0 ? (
              <div className="summary-tags">
                {formData.categories.map(catId => {
                  const cat = mockCategories.find(c => c._id === catId);
                  return cat ? (
                    <span key={catId} className="summary-tag">
                      {cat?.name?.en}
                      <button
                        type="button"
                        onClick={() => toggleCategory(catId)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            ) : (
              <span className="empty-text">No categories selected</span>
            )}
          </div>

          <div className="summary-item">
            <strong>Tags:</strong>
            {formData.tags?.length > 0 ? (
              <div className="summary-tags">
                {formData.tags.map(tagId => {
                  const tag = mockTags.find(t => t._id === tagId);
                  return tag ? (
                    <span key={tagId} className="summary-tag">
                      {tag.name?.en || tag.name}
                      <button
                        type="button"
                        onClick={() => toggleTag(tagId)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </span>
                  ) : (
                    <span key={tagId} className="summary-tag">
                      Custom Tag
                      <button
                        type="button"
                        onClick={() => toggleTag(tagId)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="empty-text">No tags selected</span>
            )}
          </div>

          <div className="summary-item">
            <strong>Countries:</strong>
            {formData.publishedCountries?.length > 0 ? (
              <div className="summary-tags">
                {formData.publishedCountries.map(code => {
                  const country = COUNTRIES.find(c => c.code === code);
                  return country ? (
                    <span key={code} className="summary-tag">
                      {country.flag} {country.name}
                      <button
                        type="button"
                        onClick={() => toggleCountry(code)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            ) : (
              <span className="empty-text">No countries selected</span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .taxonomy-section {
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

        .taxonomy-group {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .group-title {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .group-description {
          color: rgba(47, 60, 59, 0.7);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .count-badge {
          background: var(--lime-spark);
          color: white;
          padding: 0.15rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-left: auto;
        }

        .search-box {
          position: relative;
          margin-bottom: 1rem;
        }

        .search-box i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(47, 60, 59, 0.5);
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          font-size: 1rem;
          background: white;
        }

        .search-box input:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        .selection-grid {
          display: grid;
          gap: 0.75rem;
          max-height: 400px;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .checkbox-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .checkbox-item:hover {
          border-color: var(--lime-spark);
          box-shadow: 0 2px 8px rgba(159, 211, 86, 0.2);
        }

        .checkbox-item input[type="checkbox"] {
          margin-top: 0.25rem;
          cursor: pointer;
        }

        .checkbox-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .checkbox-label {
          font-weight: 600;
          color: var(--evergreen);
        }

        .checkbox-description {
          font-size: 0.875rem;
          color: rgba(47, 60, 59, 0.7);
        }

        .tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .tag-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .tag-chip:hover {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.1);
        }

        .tag-chip.selected {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .tag-count {
          background: rgba(159, 211, 86, 0.2);
          color: var(--evergreen);
          padding: 0.1rem 0.4rem;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .tag-chip.selected .tag-count {
          background: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .create-tag-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(159, 211, 86, 0.3);
        }

        .subsection-title {
          font-weight: 600;
          color: var(--evergreen);
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .create-tag-input {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .create-tag-input input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          font-size: 1rem;
        }

        .create-tag-input input:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        .btn-create {
          padding: 0.75rem 1.5rem;
          background: var(--lime-spark);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .btn-create:hover:not(:disabled) {
          background: #7fb83e;
        }

        .btn-create:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .field-hint {
          display: block;
          color: rgba(47, 60, 59, 0.6);
          font-size: 0.875rem;
        }

        .country-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
          padding: 0.5rem;
        }

        .country-item {
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

        .country-item:hover {
          border-color: var(--lime-spark);
          background: rgba(159, 211, 86, 0.05);
        }

        .country-item input[type="checkbox"] {
          cursor: pointer;
        }

        .country-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .country-flag {
          font-size: 1.5rem;
        }

        .country-name {
          font-weight: 500;
          color: var(--charcoal-bark);
        }

        .no-results {
          text-align: center;
          padding: 2rem;
          color: rgba(47, 60, 59, 0.5);
        }

        .no-results i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          opacity: 0.3;
        }

        .taxonomy-summary {
          background: #e8f5e9;
          padding: 1.5rem;
          border-radius: 8px;
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

        .summary-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .summary-item strong {
          color: var(--evergreen);
          font-family: 'Montserrat', sans-serif;
        }

        .summary-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .summary-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          background: white;
          border-radius: 16px;
          font-size: 0.9rem;
          color: var(--evergreen);
          font-weight: 500;
        }

        .remove-btn {
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

        .remove-btn:hover {
          background: #e74c3c;
          color: white;
        }

        .empty-text {
          color: rgba(47, 60, 59, 0.5);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .country-grid {
            grid-template-columns: 1fr;
          }

          .create-tag-input {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default TaxonomySection;
