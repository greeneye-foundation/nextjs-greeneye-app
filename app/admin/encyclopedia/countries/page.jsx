"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Search, MapPin, Plus, Edit2, Trash2, X, Flag } from 'lucide-react';
import EncyclopediaAdminLayout from '@/components/encyclopedia/admin/EncyclopediaAdminLayout';
import { countriesAPI } from '@/lib/api/encyclopedia';

const CountriesPage = () => {
  const language = 'en';
  const getText = (obj) => (typeof obj === 'object' && obj !== null ? obj[language] || obj.en || '' : obj || '');

  // State management
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: 'active',
    sortBy: 'name'
  });

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: { en: '', hi: '', zh: '', ar: '' },
    nativeName: '',
    flagEmoji: '',
    isActive: true
  });

  useEffect(() => {
    fetchCountries();
  }, [filters, searchTerm]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await countriesAPI.getAll(language);
      if (response.success) {
        let filteredCountries = response.data || [];

        // Apply search filter
        if (searchTerm) {
          filteredCountries = filteredCountries.filter(country =>
            getText(country.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (country.nativeName && country.nativeName.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }

        // Apply status filter
        if (filters.status === 'active') {
          filteredCountries = filteredCountries.filter(country => country.isActive);
        }

        // Sort countries
        if (filters.sortBy === 'name') {
          filteredCountries.sort((a, b) => getText(a.name).localeCompare(getText(b.name)));
        } else if (filters.sortBy === 'code') {
          filteredCountries.sort((a, b) => a.code.localeCompare(b.code));
        }

        setCountries(filteredCountries);
      } else {
        throw new Error(response.message || 'Failed to fetch countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      alert(`Failed to load countries: ${error.message}`);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCountries(countries.map(c => c._id));
    } else {
      setSelectedCountries([]);
    }
  };

  const handleSelectCountry = (id) => {
    if (selectedCountries.includes(id)) {
      setSelectedCountries(selectedCountries.filter(c => c !== id));
    } else {
      setSelectedCountries([...selectedCountries, id]);
    }
  };

  const handleCreateCountry = () => {
    setEditingCountry(null);
    setFormData({
      code: '',
      name: { en: '', hi: '', zh: '', ar: '' },
      nativeName: '',
      flagEmoji: '',
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditCountry = (country) => {
    setEditingCountry(country);
    setFormData({
      code: country.code || '',
      name: country.name || { en: '', hi: '', zh: '', ar: '' },
      nativeName: country.nativeName || '',
      flagEmoji: country.flagEmoji || '',
      isActive: country.isActive !== false
    });
    setShowCreateModal(true);
  };

  const handleSubmitCountry = async (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name.en) {
      alert('Country code and English name are required');
      return;
    }

    if (formData.code.length < 2 || formData.code.length > 3) {
      alert('Country code must be 2-3 characters');
      return;
    }

    try {
      if (editingCountry) {
        await countriesAPI.update(editingCountry.code, formData);
        alert('Country updated successfully');
      } else {
        await countriesAPI.create(formData);
        alert('Country created successfully');
      }
      
      setShowCreateModal(false);
      fetchCountries();
    } catch (error) {
      console.error('Error saving country:', error);
      alert(`Failed to save country: ${error.message}`);
    }
  };

  const handleDeleteCountry = async (code) => {
    const confirmed = confirm('Are you sure you want to delete this country?');
    if (!confirmed) return;

    try {
      await countriesAPI.delete(code);
      alert('Country deleted successfully');
      fetchCountries();
    } catch (error) {
      console.error('Error deleting country:', error);
      alert(`Failed to delete country: ${error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete ${selectedCountries.length} country(ies)?`);
    if (!confirmed) return;

    try {
      for (const countryId of selectedCountries) {
        const country = countries.find(c => c._id === countryId);
        if (country) {
          await countriesAPI.delete(country.code);
        }
      }
      alert('Countries deleted successfully');
      setSelectedCountries([]);
      fetchCountries();
    } catch (error) {
      console.error('Error deleting countries:', error);
      alert(`Failed to delete countries: ${error.message}`);
    }
  };

  return (
    <EncyclopediaAdminLayout>
    <div className="countries-layout">
        {/* Admin Navigation */}
        <nav className="admin-nav">
          <div className="nav-brand">
            <i className="fas fa-book"></i>
            Encyclopedia Admin
          </div>
          <div className="nav-links">
            <a href="/admin/encyclopedia/articles">Articles</a>
            <a href="/admin/encyclopedia/analytics">Analytics</a>
            <a href="/admin/encyclopedia/categories">Categories</a>
            <a href="/admin/encyclopedia/tags">Tags</a>
            <a href="/admin/encyclopedia/countries" className="active">Countries</a>
          </div>
        </nav>

        <div className="countries-page">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-left">
              <h2 className="page-title">
                <Globe size={32} />
                Countries
              </h2>
              <p className="page-subtitle">Manage country data and translations</p>
            </div>
            <div className="header-right">
              <button className="btn btn-primary" onClick={handleCreateCountry}>
                <Plus size={20} />
                Add Country
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>
                <Globe size={24} style={{ color: '#2563eb' }} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Countries</p>
                <p className="stat-value">{countries.length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dcfce7' }}>
                <MapPin size={24} style={{ color: '#16a34a' }} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Active Countries</p>
                <p className="stat-value">{countries.filter(c => c.isActive).length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>
                <Flag size={24} style={{ color: '#f59e0b' }} />
              </div>
              <div className="stat-content">
                <p className="stat-label">With Flags</p>
                <p className="stat-value">{countries.filter(c => c.flagEmoji).length}</p>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search countries by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filters-row">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="active">Active Only</option>
                <option value="all">All Countries</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="name">Sort by Name</option>
                <option value="code">Sort by Code</option>
              </select>

              <label className="select-all-label">
                <input
                  type="checkbox"
                  checked={selectedCountries.length === countries.length && countries.length > 0}
                  onChange={handleSelectAll}
                />
                <span>Select All</span>
              </label>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCountries.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedCountries.length} country(ies) selected
              </span>
              <div className="bulk-buttons">
                <button className="bulk-btn bulk-btn-danger" onClick={handleBulkDelete}>
                  <Trash2 size={16} />
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Countries Grid */}
          <div className="countries-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading countries...</p>
              </div>
            ) : countries.length === 0 ? (
              <div className="empty-state">
                <Globe size={64} style={{ color: '#d1d5db' }} />
                <h3>No countries found</h3>
                <p>Try adjusting your filters or add a new country</p>
                <button className="btn btn-primary" onClick={handleCreateCountry}>
                  Add Country
                </button>
              </div>
            ) : (
              <div className="countries-grid">
                {countries.map((country) => (
                  <div key={country._id} className="country-card">
                    <div className="country-header">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country._id)}
                        onChange={() => handleSelectCountry(country._id)}
                        className="country-checkbox"
                      />
                      <div className="country-flag">
                        {country.flagEmoji ? (
                          <span className="flag-emoji">{country.flagEmoji}</span>
                        ) : (
                          <Globe size={32} style={{ color: '#9ca3af' }} />
                        )}
                      </div>
                    </div>

                    <div className="country-body">
                      <h3 className="country-name">{getText(country.name)}</h3>
                      <p className="country-code">{country.code}</p>
                      {country.nativeName && (
                        <p className="country-native">{country.nativeName}</p>
                      )}
                      {country.name.hi && (
                        <p className="country-translation">{country.name.hi}</p>
                      )}
                    </div>

                    <div className="country-footer">
                      <div className="country-meta">
                        <span className={`status-badge ${country.isActive ? 'status-active' : 'status-inactive'}`}>
                          {country.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="country-actions">
                        <button
                          className="action-btn"
                          onClick={() => handleEditCountry(country)}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn action-btn-danger"
                          onClick={() => handleDeleteCountry(country.code)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create/Edit Modal */}
          {showCreateModal && (
            <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingCountry ? 'Edit Country' : 'Add New Country'}</h3>
                  <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmitCountry} className="country-form">
                  <div className="form-section">
                    <h4>Basic Information</h4>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Country Code (ISO) *</label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) => setFormData({
                            ...formData,
                            code: e.target.value.toUpperCase()
                          })}
                          placeholder="e.g., IN, US, GB"
                          maxLength={3}
                          required
                          disabled={!!editingCountry}
                        />
                        <small className="form-hint">
                          2-3 letter ISO code (cannot be changed after creation)
                        </small>
                      </div>

                      <div className="form-group">
                        <label>Flag Emoji</label>
                        <input
                          type="text"
                          value={formData.flagEmoji}
                          onChange={(e) => setFormData({
                            ...formData,
                            flagEmoji: e.target.value
                          })}
                          placeholder="🇮🇳"
                        />
                        <small className="form-hint">
                          Country flag emoji
                        </small>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Name (English) *</label>
                      <input
                        type="text"
                        value={formData.name.en}
                        onChange={(e) => setFormData({
                          ...formData,
                          name: { ...formData.name, en: e.target.value }
                        })}
                        placeholder="e.g., India"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Native Name</label>
                      <input
                        type="text"
                        value={formData.nativeName}
                        onChange={(e) => setFormData({
                          ...formData,
                          nativeName: e.target.value
                        })}
                        placeholder="e.g., भारत (Bhārat)"
                      />
                      <small className="form-hint">
                        Country name in local language
                      </small>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Translations</h4>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Name (Hindi)</label>
                        <input
                          type="text"
                          value={formData.name.hi}
                          onChange={(e) => setFormData({
                            ...formData,
                            name: { ...formData.name, hi: e.target.value }
                          })}
                          placeholder="e.g., भारत"
                        />
                      </div>
                      <div className="form-group">
                        <label>Name (Chinese)</label>
                        <input
                          type="text"
                          value={formData.name.zh}
                          onChange={(e) => setFormData({
                            ...formData,
                            name: { ...formData.name, zh: e.target.value }
                          })}
                          placeholder="e.g., 印度"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Name (Arabic)</label>
                      <input
                        type="text"
                        value={formData.name.ar}
                        onChange={(e) => setFormData({
                          ...formData,
                          name: { ...formData.name, ar: e.target.value }
                        })}
                        placeholder="e.g., الهند"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Settings</h4>
                    
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        <span>Active</span>
                      </label>
                      <small className="form-hint">
                        Inactive countries won't appear in country selection
                      </small>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingCountry ? 'Update Country' : 'Add Country'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .countries-layout {
            min-height: 100vh;
            background: linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f0fdf4 100%);
          }

          .admin-nav {
            background: white;
            padding: 1rem 2rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }

          .nav-brand {
            font-size: 1.25rem;
            font-weight: 700;
            color: #2f3c3b;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-links {
            display: flex;
            gap: 1rem;
          }

          .nav-links a {
            padding: 0.5rem 1rem;
            color: #2f3c3b;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.3s ease;
          }

          .nav-links a:hover,
          .nav-links a.active {
            background: #9fd356;
            color: white;
          }

          .countries-page {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
          }

          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2rem;
          }

          .page-title {
            font-size: 2rem;
            font-weight: 700;
            color: #2f3c3b;
            margin: 0 0 0.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .page-subtitle {
            color: rgba(47, 60, 59, 0.7);
            margin: 0;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          }

          .stat-icon {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .stat-content {
            flex: 1;
          }

          .stat-label {
            font-size: 0.875rem;
            color: rgba(47, 60, 59, 0.7);
            margin: 0 0 0.25rem 0;
          }

          .stat-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: #2f3c3b;
            margin: 0;
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
            border: none;
            font-size: 0.95rem;
          }

          .btn-primary {
            background: #9fd356;
            color: #2f3c3b;
          }

          .btn-primary:hover {
            background: #7fb83e;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(159, 211, 86, 0.3);
          }

          .btn-secondary {
            background: #e0e0e0;
            color: #2f3c3b;
          }

          .btn-secondary:hover {
            background: #d0d0d0;
          }

          .filters-section {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          .search-box {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 1rem;
          }

          .search-box input {
            flex: 1;
            border: none;
            background: transparent;
            outline: none;
            font-size: 0.95rem;
          }

          .filters-row {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            gap: 1rem;
            align-items: center;
          }

          .filters-row select {
            padding: 0.75rem;
            border: 1px solid rgba(159, 211, 86, 0.3);
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .select-all-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-weight: 500;
            color: #2f3c3b;
          }

          .select-all-label input {
            width: 18px;
            height: 18px;
            cursor: pointer;
          }

          .bulk-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #dbeafe;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
          }

          .selected-count {
            font-weight: 600;
            color: #2f3c3b;
          }

          .bulk-buttons {
            display: flex;
            gap: 0.5rem;
          }

          .bulk-btn {
            padding: 0.5rem 1rem;
            background: white;
            border: 1px solid rgba(159, 211, 86, 0.5);
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
          }

          .bulk-btn-danger {
            border-color: #ef4444;
            color: #ef4444;
          }

          .bulk-btn-danger:hover {
            background: #ef4444;
            color: white;
          }

          .countries-container {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          .countries-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
          }

          .country-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s ease;
          }

          .country-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            border-color: #9fd356;
          }

          .country-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .country-checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
          }

          .country-flag {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .flag-emoji {
            font-size: 2.5rem;
            line-height: 1;
          }

          .country-body {
            margin-bottom: 1rem;
          }

          .country-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2f3c3b;
            margin: 0 0 0.25rem 0;
          }

          .country-code {
            font-size: 0.85rem;
            color: #2563eb;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
            text-transform: uppercase;
          }

          .country-native {
            font-size: 0.9rem;
            color: rgba(47, 60, 59, 0.7);
            margin: 0 0 0.25rem 0;
          }

          .country-translation {
            font-size: 0.9rem;
            color: rgba(47, 60, 59, 0.6);
            margin: 0;
          }

          .country-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid #f0f0f0;
          }

          .country-meta {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
          }

          .status-active {
            background: #d1fae5;
            color: #065f46;
          }

          .status-inactive {
            background: #fee2e2;
            color: #991b1b;
          }

          .country-actions {
            display: flex;
            gap: 0.5rem;
          }

          .action-btn {
            width: 36px;
            height: 36px;
            border: 1px solid rgba(159, 211, 86, 0.3);
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #2f3c3b;
          }

          .action-btn:hover {
            background: #9fd356;
            color: white;
            border-color: #9fd356;
          }

          .action-btn-danger {
            border-color: #ef4444;
            color: #ef4444;
          }

          .action-btn-danger:hover {
            background: #ef4444;
            color: white;
          }

          .loading-state,
          .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: rgba(47, 60, 59, 0.6);
          }

          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #f3f4f6;
            border-top-color: #9fd356;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .empty-state h3 {
            color: #2f3c3b;
            margin: 1rem 0 0.5rem 0;
          }

          .empty-state p {
            color: rgba(47, 60, 59, 0.6);
            margin-bottom: 1.5rem;
          }

          /* Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 2rem;
          }

          .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
          }

          .modal-header h3 {
            margin: 0;
            color: #2f3c3b;
            font-size: 1.5rem;
          }

          .close-btn {
            width: 36px;
            height: 36px;
            border: none;
            background: #f3f4f6;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .close-btn:hover {
            background: #e5e7eb;
          }

          .country-form {
            padding: 1.5rem;
          }

          .form-section {
            margin-bottom: 2rem;
          }

          .form-section h4 {
            margin: 0 0 1rem 0;
            color: #2f3c3b;
            font-size: 1.1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #9fd356;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #2f3c3b;
            font-size: 0.9rem;
          }

          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 0.95rem;
            transition: border-color 0.3s ease;
          }

          .form-group input:focus,
          .form-group textarea:focus,
          .form-group select:focus {
            outline: none;
            border-color: #9fd356;
          }

          .form-group input:disabled {
            background: #f3f4f6;
            cursor: not-allowed;
          }

          .form-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .form-hint {
            display: block;
            margin-top: 0.25rem;
            font-size: 0.8rem;
            color: rgba(47, 60, 59, 0.6);
          }

          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
          }

          .checkbox-label input {
            width: auto;
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
          }

          @media (max-width: 768px) {
            .countries-page {
              padding: 1rem;
            }

            .page-header {
              flex-direction: column;
              gap: 1rem;
            }

            .stats-grid {
              grid-template-columns: 1fr;
            }

            .filters-row {
              grid-template-columns: 1fr;
            }

            .countries-grid {
              grid-template-columns: 1fr;
            }

            .form-row {
              grid-template-columns: 1fr;
            }

            .modal-overlay {
              padding: 1rem;
            }

            .nav-links {
              display: none;
            }
          }
        `}</style>
      </div>
    </EncyclopediaAdminLayout>
  );
};

export default CountriesPage;