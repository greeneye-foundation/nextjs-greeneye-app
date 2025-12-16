"use client";

import React, { useState, useEffect } from 'react';
import EncyclopediaAdminLayout from '@/components/encyclopedia/admin/EncyclopediaAdminLayout';
import { categoriesAPI } from '@/lib/api/encyclopedia';

const CategoriesPage = () => {
  const language = 'en';
  const getText = (obj) => (typeof obj === 'object' && obj !== null ? obj[language] || obj.en || '' : obj || '');

  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: 'active',
    hasParent: 'all'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: { en: '', hi: '', zh: '', ar: '' },
    description: { en: '', hi: '', zh: '', ar: '' },
    slug: '',
    icon: '',
    color: '#4CAF50',
    parent: null,
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, [filters, searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = {
        language: language,
        includeInactive: filters.status === 'all'
      };

      const response = await categoriesAPI.getAll(params);
      if (response.success) {
        let filteredCategories = response.data || [];

        // Apply search filter
        if (searchTerm) {
          filteredCategories = filteredCategories.filter(cat =>
            getText(cat.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply parent filter
        if (filters.hasParent === 'parent') {
          filteredCategories = filteredCategories.filter(cat => !cat.parent);
        } else if (filters.hasParent === 'child') {
          filteredCategories = filteredCategories.filter(cat => cat.parent);
        }

        setCategories(filteredCategories);
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert(`Failed to load categories: ${error.message}`);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCategories(categories.map(c => c._id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(c => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: { en: '', hi: '', zh: '', ar: '' },
      description: { en: '', hi: '', zh: '', ar: '' },
      slug: '',
      icon: '',
      color: '#4CAF50',
      parent: null,
      order: 0,
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || { en: '', hi: '', zh: '', ar: '' },
      description: category.description || { en: '', hi: '', zh: '', ar: '' },
      slug: category.slug || '',
      icon: category.icon || '',
      color: category.color || '#4CAF50',
      parent: category.parent?._id || null,
      order: category.order || 0,
      isActive: category.isActive !== false
    });
    setShowCreateModal(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    
    if (!formData.name.en) {
      alert('English name is required');
      return;
    }

    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.slug, formData);
        alert('Category updated successfully');
      } else {
        await categoriesAPI.create(formData);
        alert('Category created successfully');
      }
      
      setShowCreateModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(`Failed to save category: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (slug) => {
    const confirmed = confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;

    try {
      await categoriesAPI.delete(slug);
      alert('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(`Failed to delete category: ${error.message}`);
    }
  };

  const getCategoryHierarchy = (category) => {
    if (category.parent) {
      return `${getText(category.parent.name)} → ${getText(category.name)}`;
    }
    return getText(category.name);
  };

  return (
    <EncyclopediaAdminLayout>
    <div className="categories-layout">
      {/* Admin Navigation */}
      <nav className="admin-nav">
        <div className="nav-brand">
          <i className="fas fa-book"></i>
          Encyclopedia Admin
        </div>
        <div className="nav-links">
          <a href="/admin/encyclopedia/articles">Articles</a>
          <a href="/admin/encyclopedia/analytics">Analytics</a>
          <a href="/admin/encyclopedia/categories" className="active">Categories</a>
          <a href="/admin/encyclopedia/tags">Tags</a>
        </div>
      </nav>

      <div className="categories-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h2 className="page-title">
              <i className="fas fa-folder"></i>
              Categories
            </h2>
            <p className="page-subtitle">Organize your encyclopedia content</p>
          </div>
          <div className="header-right">
            <button className="btn btn-primary" onClick={handleCreateCategory}>
              <i className="fas fa-plus"></i>
              Create Category
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="filters-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search categories by name or slug..."
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
              <option value="all">All Categories</option>
            </select>

            <select
              value={filters.hasParent}
              onChange={(e) => setFilters({ ...filters, hasParent: e.target.value })}
            >
              <option value="all">All Levels</option>
              <option value="parent">Parent Categories</option>
              <option value="child">Sub Categories</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCategories.length > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">
              {selectedCategories.length} category(ies) selected
            </span>
            <div className="bulk-buttons">
              <button className="bulk-btn bulk-btn-danger">
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="categories-container">
          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-folder-open"></i>
              <h3>No categories found</h3>
              <p>Try adjusting your filters or create a new category</p>
              <button className="btn btn-primary" onClick={handleCreateCategory}>
                Create Category
              </button>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category._id} className="category-card">
                  <div className="category-header">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleSelectCategory(category._id)}
                      className="category-checkbox"
                    />
                    <div
                      className="category-icon"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      <i className={`fas ${category.icon || 'fa-folder'}`}></i>
                    </div>
                  </div>

                  <div className="category-body">
                    <h3 className="category-name">{getCategoryHierarchy(category)}</h3>
                    <p className="category-slug">/{category.slug}</p>
                    {getText(category.description) && (
                      <p className="category-description">{getText(category.description)}</p>
                    )}
                  </div>

                  <div className="category-footer">
                    <div className="category-meta">
                      <span className={`status-badge ${category.isActive ? 'status-active' : 'status-inactive'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="order-badge">Order: {category.order}</span>
                    </div>
                    <div className="category-actions">
                      <button
                        className="action-btn"
                        onClick={() => handleEditCategory(category)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="action-btn action-btn-danger"
                        onClick={() => handleDeleteCategory(category.slug)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
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
                <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
                <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleSubmitCategory} className="category-form">
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
                    <label>Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Auto-generated if left empty"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description (English)</label>
                    <textarea
                      value={formData.description.en}
                      onChange={(e) => setFormData({
                        ...formData,
                        description: { ...formData.description, en: e.target.value }
                      })}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Display Settings</h4>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Icon (Font Awesome)</label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="fa-leaf"
                      />
                    </div>
                    <div className="form-group">
                      <label>Color</label>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Parent Category</label>
                      <select
                        value={formData.parent || ''}
                        onChange={(e) => setFormData({ ...formData, parent: e.target.value || null })}
                      >
                        <option value="">None (Top Level)</option>
                        {categories.filter(c => !c.parent).map(cat => (
                          <option key={cat._id} value={cat._id}>
                            {getText(cat.name)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Display Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>

      <style jsx>{`
        .categories-layout {
          min-height: 100vh;
          background: #f5f5f5;
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

        .categories-page {
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

        .search-box i {
          color: #9fd356;
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
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .filters-row select {
          padding: 0.75rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #e8f5e9;
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
        }

        .bulk-btn-danger {
          border-color: #e74c3c;
          color: #e74c3c;
        }

        .bulk-btn-danger:hover {
          background: #e74c3c;
          color: white;
        }

        .categories-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .category-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .category-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .category-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .category-body {
          margin-bottom: 1rem;
        }

        .category-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2f3c3b;
          margin: 0 0 0.25rem 0;
        }

        .category-slug {
          font-size: 0.85rem;
          color: rgba(47, 60, 59, 0.6);
          margin: 0 0 0.5rem 0;
        }

        .category-description {
          font-size: 0.9rem;
          color: rgba(47, 60, 59, 0.7);
          line-height: 1.5;
          margin: 0;
        }

        .category-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        .category-meta {
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
          background: #d4edda;
          color: #155724;
        }

        .status-inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .order-badge {
          padding: 0.25rem 0.75rem;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .category-actions {
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
          border-color: #e74c3c;
          color: #e74c3c;
        }

        .action-btn-danger:hover {
          background: #e74c3c;
          color: white;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(47, 60, 59, 0.6);
        }

        .loading-state i,
        .empty-state i {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #9fd356;
        }

        .empty-state h3 {
          color: #2f3c3b;
          margin-bottom: 0.5rem;
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
          border-bottom: 1px solid #e0e0e0;
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
          background: #f0f0f0;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #e0e0e0;
        }

        .category-form {
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
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
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
          border-top: 1px solid #e0e0e0;
        }

        @media (max-width: 968px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .filters-row {
            grid-template-columns: 1fr;
          }

          .categories-grid {
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
    </EncyclopediaAdminLayout>
  );
};   
export default CategoriesPage;