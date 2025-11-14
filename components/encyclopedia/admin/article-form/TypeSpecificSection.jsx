"use client";

import React from 'react';
import { COUNTRIES, CARE_LEVELS, WATER_REQUIREMENTS, SUNLIGHT_REQUIREMENTS, CONSERVATION_STATUS, POLICY_TYPES, SDG_GOALS } from '@/lib/constants/encyclopedia';

const TypeSpecificSection = ({ formData, updateFormData, errors }) => {
  const articleType = formData.articleTypeId;

  // Update type-specific data
  const updateTypeData = (field, value) => {
    updateFormData('typeData', {
      ...formData.typeData,
      [articleType]: {
        ...(formData.typeData[articleType] || {}),
        [field]: value
      }
    });
  };

  const typeData = formData.typeData[articleType] || {};

  // If no article type selected
  if (!articleType) {
    return (
      <div className="type-specific-section">
        <div className="no-type-selected">
          <i className="fas fa-info-circle"></i>
          <h3>No Article Type Selected</h3>
          <p>Please select an article type in the Basic Info tab to see type-specific fields.</p>
        </div>

        <style jsx>{`
          .type-specific-section {
            max-width: 900px;
          }

          .no-type-selected {
            text-align: center;
            padding: 4rem 2rem;
            background: #f8f9fa;
            border-radius: 8px;
            color: rgba(47, 60, 59, 0.7);
          }

          .no-type-selected i {
            font-size: 3rem;
            color: var(--lime-spark);
            margin-bottom: 1rem;
          }

          .no-type-selected h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--evergreen);
            margin-bottom: 0.5rem;
            font-family: 'Montserrat', sans-serif;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="type-specific-section">
      <h3 className="section-title">
        <i className="fas fa-list-alt"></i>
        {articleType === 'plant' && 'Plant Details'}
        {articleType === 'topic' && 'Topic Details'}
        {articleType === 'policy' && 'Policy Details'}
        {articleType === 'product' && 'Product Details'}
      </h3>
      <p className="section-description">
        Enter specific information for this {articleType} article.
      </p>

      {/* PLANT FIELDS */}
      {articleType === 'plant' && (
        <div className="type-fields">
          {/* Scientific Name */}
          <div className="form-group">
            <label className="form-label required">Scientific Name</label>
            <input
              type="text"
              value={typeData.scientificName || ''}
              onChange={(e) => updateTypeData('scientificName', e.target.value)}
              placeholder="e.g., Mangifera indica"
              className={errors.scientificName ? 'error' : ''}
            />
            {errors.scientificName && <span className="error-message">{errors.scientificName}</span>}
            <small className="field-hint">Latin/binomial name of the plant</small>
          </div>

          {/* Family */}
          <div className="form-group">
            <label className="form-label">Family</label>
            <input
              type="text"
              value={typeData.family || ''}
              onChange={(e) => updateTypeData('family', e.target.value)}
              placeholder="e.g., Anacardiaceae"
            />
            <small className="field-hint">Botanical family classification</small>
          </div>

          {/* Native Region */}
          <div className="form-group">
            <label className="form-label">Native Region</label>
            <input
              type="text"
              value={typeData.nativeRegion || ''}
              onChange={(e) => updateTypeData('nativeRegion', e.target.value)}
              placeholder="e.g., South Asia, Indian Subcontinent"
            />
            <small className="field-hint">Geographic origin of the plant</small>
          </div>

          <div className="form-row">
            {/* Care Level */}
            <div className="form-group">
              <label className="form-label">Care Level</label>
              <select
                value={typeData.careLevel || ''}
                onChange={(e) => updateTypeData('careLevel', e.target.value)}
              >
                <option value="">Select care level...</option>
                {CARE_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Water Requirement */}
            <div className="form-group">
              <label className="form-label">Water Requirement</label>
              <select
                value={typeData.waterRequirement || ''}
                onChange={(e) => updateTypeData('waterRequirement', e.target.value)}
              >
                <option value="">Select water need...</option>
                {WATER_REQUIREMENTS.map(req => (
                  <option key={req.value} value={req.value}>
                    {req.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Sunlight Requirement */}
            <div className="form-group">
              <label className="form-label">Sunlight Requirement</label>
              <select
                value={typeData.sunlightRequirement || ''}
                onChange={(e) => updateTypeData('sunlightRequirement', e.target.value)}
              >
                <option value="">Select sunlight need...</option>
                {SUNLIGHT_REQUIREMENTS.map(req => (
                  <option key={req.value} value={req.value}>
                    {req.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Growth Rate */}
            <div className="form-group">
              <label className="form-label">Growth Rate</label>
              <select
                value={typeData.growthRate || ''}
                onChange={(e) => updateTypeData('growthRate', e.target.value)}
              >
                <option value="">Select growth rate...</option>
                <option value="slow">Slow</option>
                <option value="moderate">Moderate</option>
                <option value="fast">Fast</option>
              </select>
            </div>
          </div>

          {/* Conservation Status */}
          <div className="form-group">
            <label className="form-label">Conservation Status (IUCN)</label>
            <select
              value={typeData.conservationStatus || ''}
              onChange={(e) => updateTypeData('conservationStatus', e.target.value)}
            >
              <option value="">Select status...</option>
              {CONSERVATION_STATUS.map(status => (
                <option key={status.code} value={status.code}>
                  {status.code} - {status.label}
                </option>
              ))}
            </select>
            <small className="field-hint">IUCN Red List conservation status</small>
          </div>
        </div>
      )}

      {/* TOPIC FIELDS */}
      {articleType === 'topic' && (
        <div className="type-fields">
          {/* Urgency Level */}
          <div className="form-group">
            <label className="form-label">Urgency Level</label>
            <select
              value={typeData.urgencyLevel || ''}
              onChange={(e) => updateTypeData('urgencyLevel', e.target.value)}
            >
              <option value="">Select urgency...</option>
              <option value="low">Low - Informational</option>
              <option value="medium">Medium - Attention Needed</option>
              <option value="high">High - Immediate Action Required</option>
              <option value="critical">Critical - Crisis Level</option>
            </select>
            <small className="field-hint">How urgent is action on this topic?</small>
          </div>

          {/* SDG Goals */}
          <div className="form-group">
            <label className="form-label">Related UN SDG Goals</label>
            <div className="checkbox-grid">
              {SDG_GOALS.map(goal => (
                <label key={goal.number} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={(typeData.sdgGoals || []).includes(goal.number)}
                    onChange={(e) => {
                      const current = typeData.sdgGoals || [];
                      if (e.target.checked) {
                        updateTypeData('sdgGoals', [...current, goal.number]);
                      } else {
                        updateTypeData('sdgGoals', current.filter(n => n !== goal.number));
                      }
                    }}
                  />
                  <span className="checkbox-text">
                    {goal.number}. {goal.name}
                  </span>
                </label>
              ))}
            </div>
            <small className="field-hint">Select all relevant Sustainable Development Goals</small>
          </div>

          {/* Impact Areas */}
          <div className="form-group">
            <label className="form-label">Primary Impact Areas</label>
            <textarea
              value={typeData.impact || ''}
              onChange={(e) => updateTypeData('impact', e.target.value)}
              placeholder="Describe the environmental, social, and economic impacts..."
              rows={4}
            />
            <small className="field-hint">How does this topic affect the environment and society?</small>
          </div>
        </div>
      )}

      {/* POLICY FIELDS */}
      {articleType === 'policy' && (
        <div className="type-fields">
          {/* Country */}
          <div className="form-group">
            <label className="form-label required">Country</label>
            <select
              value={typeData.countryCode || ''}
              onChange={(e) => updateTypeData('countryCode', e.target.value)}
              className={errors.policyCountry ? 'error' : ''}
            >
              <option value="">Select country...</option>
              {COUNTRIES.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            {errors.policyCountry && <span className="error-message">{errors.policyCountry}</span>}
            <small className="field-hint">Country where this policy applies</small>
          </div>

          {/* Policy Type */}
          <div className="form-group">
            <label className="form-label">Policy Type</label>
            <select
              value={typeData.policyType || ''}
              onChange={(e) => updateTypeData('policyType', e.target.value)}
            >
              <option value="">Select type...</option>
              {POLICY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            {/* Effective Date */}
            <div className="form-group">
              <label className="form-label">Effective Date</label>
              <input
                type="date"
                value={typeData.effectiveDate || ''}
                onChange={(e) => updateTypeData('effectiveDate', e.target.value)}
              />
              <small className="field-hint">When did/will this policy take effect?</small>
            </div>

            {/* Expiry Date */}
            <div className="form-group">
              <label className="form-label">Expiry Date (if applicable)</label>
              <input
                type="date"
                value={typeData.expiryDate || ''}
                onChange={(e) => updateTypeData('expiryDate', e.target.value)}
              />
              <small className="field-hint">Leave empty if no expiry</small>
            </div>
          </div>

          {/* Enforcement Level */}
          <div className="form-group">
            <label className="form-label">Enforcement Level</label>
            <select
              value={typeData.enforcementLevel || ''}
              onChange={(e) => updateTypeData('enforcementLevel', e.target.value)}
            >
              <option value="">Select enforcement...</option>
              <option value="voluntary">Voluntary / Guidelines</option>
              <option value="incentivized">Incentivized</option>
              <option value="mandatory">Mandatory</option>
              <option value="strict">Strict Penalties</option>
            </select>
          </div>

          {/* Governing Body */}
          <div className="form-group">
            <label className="form-label">Governing Body</label>
            <input
              type="text"
              value={typeData.governingBody || ''}
              onChange={(e) => updateTypeData('governingBody', e.target.value)}
              placeholder="e.g., Ministry of Environment, Forest and Climate Change"
            />
            <small className="field-hint">Organization responsible for this policy</small>
          </div>
        </div>
      )}

      {/* PRODUCT FIELDS */}
      {articleType === 'product' && (
        <div className="type-fields">
          {/* Product Name */}
          <div className="form-group">
            <label className="form-label required">Product Name</label>
            <input
              type="text"
              value={typeData.productName || ''}
              onChange={(e) => updateTypeData('productName', e.target.value)}
              placeholder="e.g., EcoBottle Bamboo Water Bottle"
              className={errors.productName ? 'error' : ''}
            />
            {errors.productName && <span className="error-message">{errors.productName}</span>}
          </div>

          <div className="form-row">
            {/* Brand */}
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                type="text"
                value={typeData.brand || ''}
                onChange={(e) => updateTypeData('brand', e.target.value)}
                placeholder="Brand name"
              />
            </div>

            {/* Manufacturer */}
            <div className="form-group">
              <label className="form-label">Manufacturer</label>
              <input
                type="text"
                value={typeData.manufacturer || ''}
                onChange={(e) => updateTypeData('manufacturer', e.target.value)}
                placeholder="Manufacturing company"
              />
            </div>
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label">Price Range</label>
            <input
              type="text"
              value={typeData.price || ''}
              onChange={(e) => updateTypeData('price', e.target.value)}
              placeholder="e.g., $15-25 USD, ₹500-800 INR"
            />
            <small className="field-hint">Typical retail price or price range</small>
          </div>

          {/* Certifications */}
          <div className="form-group">
            <label className="form-label">Certifications</label>
            <input
              type="text"
              value={typeData.certifications || ''}
              onChange={(e) => updateTypeData('certifications', e.target.value)}
              placeholder="e.g., Fair Trade, Organic, B Corp, FSC"
            />
            <small className="field-hint">Comma-separated list of eco-certifications</small>
          </div>

          {/* Available In */}
          <div className="form-group">
            <label className="form-label">Available In (Countries)</label>
            <div className="checkbox-grid">
              {COUNTRIES.map(country => (
                <label key={country.code} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={(typeData.availableIn || []).includes(country.code)}
                    onChange={(e) => {
                      const current = typeData.availableIn || [];
                      if (e.target.checked) {
                        updateTypeData('availableIn', [...current, country.code]);
                      } else {
                        updateTypeData('availableIn', current.filter(c => c !== country.code));
                      }
                    }}
                  />
                  <span className="checkbox-text">
                    {country.flag} {country.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Purchase Links */}
          <div className="form-group">
            <label className="form-label">Purchase Links (JSON format)</label>
            <textarea
              value={typeData.purchaseLinks ? JSON.stringify(typeData.purchaseLinks, null, 2) : ''}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  updateTypeData('purchaseLinks', parsed);
                } catch (err) {
                  // Invalid JSON, store as string temporarily
                  updateTypeData('purchaseLinks', e.target.value);
                }
              }}
              placeholder={'[\n  {"platform": "Amazon", "url": "https://..."},\n  {"platform": "Official Site", "url": "https://..."}\n]'}
              rows={4}
            />
            <small className="field-hint">JSON array of purchase links</small>
          </div>
        </div>
      )}

      <style jsx>{`
        .type-specific-section {
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

        .type-fields {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
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
        input[type="date"],
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
        input[type="date"]:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: var(--lime-spark);
          box-shadow: 0 0 0 3px rgba(159, 211, 86, 0.1);
        }

        input.error,
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

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          max-height: 300px;
          overflow-y: auto;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .checkbox-label:hover {
          background: white;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          cursor: pointer;
        }

        .checkbox-text {
          font-size: 0.9rem;
          color: var(--charcoal-bark);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .checkbox-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TypeSpecificSection;
