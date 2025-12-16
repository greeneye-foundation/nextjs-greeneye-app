"use client";

import React, { useState, useEffect } from 'react';
import { Hash, Search, TrendingUp } from 'lucide-react';
import EncyclopediaAdminLayout from '@/components/encyclopedia/admin/EncyclopediaAdminLayout';
import { mediaAPI } from '@/lib/api/encyclopedia';

const MediaPage = () => {
    const language = 'en';
    const getText = (obj) => (typeof obj === 'object' && obj !== null ? obj[language] || obj.en || '' : obj || '');

    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState({
        status: 'active',
        sortBy: 'usage'
    });

    useEffect(() => {
        fetchMedia();
    }, [filters, searchTerm]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const response = await mediaAPI.getAll();
            if (response.success) {
                let filteredMedia = response.data || [];

                if (searchTerm) {
                    filteredMedia = filteredMedia.filter(item =>
                        getText(item.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.slug.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                if (filters.status === 'active') {
                    filteredMedia = filteredMedia.filter(item => item.isActive);
                }

                if (filters.sortBy === 'usage') {
                    filteredMedia.sort((a, b) => b.usageCount - a.usageCount);
                } else if (filters.sortBy === 'name') {
                    filteredMedia.sort((a, b) => getText(a.name).localeCompare(getText(b.name)));
                }

                setMedia(filteredMedia);
            } else {
                throw new Error(response.message || 'Failed to fetch media');
            }
        } catch (error) {
            console.error('Error fetching media:', error);
            alert(`Failed to load media: ${error.message}`);
            setMedia([]);
        } finally {
            setLoading(false);
        }
    };

    const getMediaColor = (usageCount) => {
        if (usageCount > 50) return '#10b981';
        if (usageCount > 30) return '#3b82f6';
        if (usageCount > 15) return '#8b5cf6';
        return '#6b7280';
    };

    return (
        <EncyclopediaAdminLayout>
            <div className="media-layout">
                <nav className="admin-nav">
                    <div className="nav-brand">
                        <i className="fas fa-book"></i>
                        Encyclopedia Admin
                    </div>
                    <div className="nav-links">
                        <a href="/admin/encyclopedia/articles">Articles</a>
                        <a href="/admin/encyclopedia/analytics">Analytics</a>
                        <a href="/admin/encyclopedia/categories">Categories</a>
                        <a href="/admin/encyclopedia/media" className="active">Media</a>
                    </div>
                </nav>

                <div className="media-page">
                    <div className="page-header">
                        <div className="header-left">
                            <h2 className="page-title">
                                <Hash size={32} />
                                Media
                            </h2>
                            <p className="page-subtitle">View and browse media content</p>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#dcfce7' }}>
                                <Hash size={24} style={{ color: '#16a34a' }} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Media</p>
                                <p className="stat-value">{media.length}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#dbeafe' }}>
                                <TrendingUp size={24} style={{ color: '#2563eb' }} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Most Popular</p>
                                <p className="stat-value-small">
                                    {media.length > 0 ? getText(media[0]?.name) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#f3e8ff' }}>
                                <Search size={24} style={{ color: '#9333ea' }} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Active Media</p>
                                <p className="stat-value">{media.filter(t => t.isActive).length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="filters-section">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search media by name or slug..."
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
                                <option value="all">All Media</option>
                            </select>

                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <option value="usage">Sort by Usage</option>
                                <option value="name">Sort by Name</option>
                            </select>
                        </div>
                    </div>

                    <div className="media-container">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading media...</p>
                            </div>
                        ) : media.length === 0 ? (
                            <div className="empty-state">
                                <Hash size={64} style={{ color: '#d1d5db' }} />
                                <h3>No media found</h3>
                                <p>Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="media-grid">
                                {media.map((item) => (
                                    <div className="media-card" key={item._id}>
                                        <div className="media-preview">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.thumbnailUrl || item.url}`}
                                                alt={item.altText?.en || "media"}
                                            />
                                        </div>

                                        <div className="media-footer">
                                            <div className="media-meta">
                                                <span className={`status-badge ${item.isActive ? 'status-active' : 'status-inactive'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="usage-badge" style={{
                                                    backgroundColor: getMediaColor(item.usageCount) + '20',
                                                    color: getMediaColor(item.usageCount)
                                                }}>
                                                    {item.usageCount} articles
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .media-layout {
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

        .media-page {
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
          flex-shrink: 0;
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
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .filters-row select {
          padding: 0.75rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .filters-row select:focus {
          outline: none;
          border-color: #9fd356;
        }

        .media-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .media-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .media-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: #9fd356;
        }

        .media-preview {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .media-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-footer {
          padding: 1rem;
        }

        .media-meta {
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

        @media (max-width: 768px) {
          .media-page {
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

          .media-grid {
            grid-template-columns: 1fr;
          }

          .nav-links {
            display: none;
          }

          .media-preview {
            height: 180px;
          }
        }
      `}</style>
        </EncyclopediaAdminLayout>
    );
};

export default MediaPage;