"use client";

import React, { useState, useEffect } from 'react';
import { Hash, Search, TrendingUp, Plus, Edit2, Trash2, X } from 'lucide-react';
import EncyclopediaAdminLayout from '@/components/encyclopedia/admin/EncyclopediaAdminLayout';
import { tagsAPI } from '@/lib/api/encyclopedia';

const TagsPage = () => {
  const language = 'en';
  const getText = (obj) => (typeof obj === 'object' && obj !== null ? obj[language] || obj.en || '' : obj || '');

  // State management
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: 'active',
    sortBy: 'usage'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: { en: '', hi: '', zh: '', ar: '' },
    slug: '',
    isActive: true
  });

  useEffect(() => {
    fetchTags();
  }, [filters, searchTerm]);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await tagsAPI.getAll();
      if (response.success) {
        let filteredTags = response.data || [];

        // Apply search filter
        if (searchTerm) {
          filteredTags = filteredTags.filter(tag =>
            getText(tag.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
            tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply status filter
        if (filters.status === 'active') {
          filteredTags = filteredTags.filter(tag => tag.isActive);
        }

        // Sort tags
        if (filters.sortBy === 'usage') {
          filteredTags.sort((a, b) => b.usageCount - a.usageCount);
        } else if (filters.sortBy === 'name') {
          filteredTags.sort((a, b) => getText(a.name).localeCompare(getText(b.name)));
        }

        setTags(filteredTags);
      } else {
        throw new Error(response.message || 'Failed to fetch tags');
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      alert(`Failed to load tags: ${error.message}`);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTags(tags.map(t => t._id));
    } else {
      setSelectedTags([]);
    }
  };

  const handleSelectTag = (id) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter(t => t !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const handleCreateTag = () => {
    setEditingTag(null);
    setFormData({
      name: { en: '', hi: '', zh: '', ar: '' },
      slug: '',
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name || { en: '', hi: '', zh: '', ar: '' },
      slug: tag.slug || '',
      isActive: tag.isActive !== false
    });
    setShowCreateModal(true);
  };

  const handleSubmitTag = async (e) => {
    e.preventDefault();
    
    if (!formData.name.en) {
      alert('English name is required');
      return;
    }

    try {
      if (editingTag) {
        await tagsAPI.update(editingTag.slug, formData);
        alert('Tag updated successfully');
      } else {
        await tagsAPI.create(formData);
        alert('Tag created successfully');
      }
      
      setShowCreateModal(false);
      fetchTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      alert(`Failed to save tag: ${error.message}`);
    }
  };

  const handleDeleteTag = async (slug) => {
    const confirmed = confirm('Are you sure you want to delete this tag?');
    if (!confirmed) return;

    try {
      await tagsAPI.delete(slug);
      alert('Tag deleted successfully');
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert(`Failed to delete tag: ${error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete ${selectedTags.length} tag(s)?`);
    if (!confirmed) return;

    try {
      for (const tagId of selectedTags) {
        const tag = tags.find(t => t._id === tagId);
        if (tag) {
          await tagsAPI.delete(tag.slug);
        }
      }
      alert('Tags deleted successfully');
      setSelectedTags([]);
      fetchTags();
    } catch (error) {
      console.error('Error deleting tags:', error);
      alert(`Failed to delete tags: ${error.message}`);
    }
  };

  // Get tag color based on usage count
  const getTagColor = (usageCount) => {
    if (usageCount > 50) return '#10b981';
    if (usageCount > 30) return '#3b82f6';
    if (usageCount > 15) return '#8b5cf6';
    return '#6b7280';
  };

  return (
    <EncyclopediaAdminLayout>
    <div className="tags-layout">
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
          <a href="/admin/encyclopedia/tags" className="active">Tags</a>
        </div>
      </nav>

      <div className="tags-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h2 className="page-title">
              <Hash size={32} />
              Tags
            </h2>
            <p className="page-subtitle">Organize and manage content tags</p>
          </div>
          <div className="header-right">
            <button className="btn btn-primary" onClick={handleCreateTag}>
              <Plus size={20} />
              Create Tag
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>
              <Hash size={24} style={{ color: '#16a34a' }} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Tags</p>
              <p className="stat-value">{tags.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>
              <TrendingUp size={24} style={{ color: '#2563eb' }} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Most Popular</p>
              <p className="stat-value-small">
                {tags.length > 0 ? getText(tags[0]?.name) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f3e8ff' }}>
              <Search size={24} style={{ color: '#9333ea' }} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Active Tags</p>
              <p className="stat-value">{tags.filter(t => t.isActive).length}</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search tags by name or slug..."
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
              <option value="all">All Tags</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="usage">Sort by Usage</option>
              <option value="name">Sort by Name</option>
            </select>

            <label className="select-all-label">
              <input
                type="checkbox"
                checked={selectedTags.length === tags.length && tags.length > 0}
                onChange={handleSelectAll}
              />
              <span>Select All</span>
            </label>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTags.length > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">
              {selectedTags.length} tag(s) selected
            </span>
            <div className="bulk-buttons">
              <button className="bulk-btn bulk-btn-danger" onClick={handleBulkDelete}>
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Tags Grid */}
        <div className="tags-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading tags...</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="empty-state">
              <Hash size={64} style={{ color: '#d1d5db' }} />
              <h3>No tags found</h3>
              <p>Try adjusting your filters or create a new tag</p>
              <button className="btn btn-primary" onClick={handleCreateTag}>
                Create Tag
              </button>
            </div>
          ) : (
            <div className="tags-grid">
              {tags.map((tag) => (
                <div key={tag._id} className="tag-card">
                  <div className="tag-header">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag._id)}
                      onChange={() => handleSelectTag(tag._id)}
                      className="tag-checkbox"
                    />
                    <div
                      className="tag-icon"
                      style={{ 
                        backgroundColor: getTagColor(tag.usageCount) + '20', 
                        color: getTagColor(tag.usageCount) 
                      }}
                    >
                      <Hash size={24} />
                    </div>
                  </div>

                  <div className="tag-body">
                    <h3 className="tag-name">{getText(tag.name)}</h3>
                    <p className="tag-slug">/{tag.slug}</p>
                    {tag.name.hi && (
                      <p className="tag-translation">{tag.name.hi}</p>
                    )}
                  </div>

                  <div className="tag-footer">
                    <div className="tag-meta">
                      <span className={`status-badge ${tag.isActive ? 'status-active' : 'status-inactive'}`}>
                        {tag.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="usage-badge" style={{ 
                        backgroundColor: getTagColor(tag.usageCount) + '20',
                        color: getTagColor(tag.usageCount)
                      }}>
                        {tag.usageCount} articles
                      </span>
                    </div>
                    <div className="tag-actions">
                      <button
                        className="action-btn"
                        onClick={() => handleEditTag(tag)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn action-btn-danger"
                        onClick={() => handleDeleteTag(tag.slug)}
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
                <h3>{editingTag ? 'Edit Tag' : 'Create New Tag'}</h3>
                <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitTag} className="tag-form">
                <div className="form-section">
                  <h4>Basic Information</h4>
                  
                  <div className="form-group">
                    <label>Name (English) *</label>
                    <input
                      type="text"
                      value={formData.name.en}
                      onChange={(e) => setFormData({
                        ...formData,
                        name: { ...formData.name, en: e.target.value }
                      })}
                      placeholder="e.g., Climate Change"
                      required
                    />
                  </div>

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
                        placeholder="e.g., जलवायु परिवर्तन"
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
                    />
                  </div>

                  <div className="form-group">
                    <label>Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Auto-generated if left empty"
                    />
                    <small className="form-hint">
                      URL-friendly version (e.g., climate-change)
                    </small>
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
                      Inactive tags won't appear in tag selection
                    </small>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingTag ? 'Update Tag' : 'Create Tag'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .tags-layout {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%);
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

        .tags-page {
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

        .stat-value-small {
          font-size: 1.25rem;
          font-weight: 600;
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
          background: #dcfce7;
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

        .tags-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .tags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .tag-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .tag-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: #9fd356;
        }

        .tag-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .tag-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .tag-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .tag-body {
          margin-bottom: 1rem;
        }

        .tag-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2f3c3b;
          margin: 0 0 0.25rem 0;
        }

        .tag-slug {
          font-size: 0.85rem;
          color: rgba(47, 60, 59, 0.6);
          margin: 0 0 0.5rem 0;
        }

        .tag-translation {
          font-size: 0.9rem;
          color: rgba(47, 60, 59, 0.7);
          margin: 0;
        }

        .tag-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        .tag-meta {
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

        .usage-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .tag-actions {
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

        .tag-form {
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
          .tags-page {
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

          .tags-grid {
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

export default TagsPage;