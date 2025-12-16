"use client";

import React, { useState, useEffect } from 'react';
import EncyclopediaAdminLayout from '@/components/encyclopedia/admin/EncyclopediaAdminLayout';
import { analyticsAPI } from '@/lib/api/encyclopedia';

const AnalyticsPage = () => {
  // Default language and country if context is not available
  const language = 'en';
  const country = 'all';
  const getText = (obj) => (typeof obj === 'object' && obj !== null ? obj[language] || obj.en || '' : obj || '');

  // State management
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');
  const [platformAnalytics, setPlatformAnalytics] = useState(null);
  const [popularArticles, setPopularArticles] = useState([]);
  const [searchAnalytics, setSearchAnalytics] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    country: country || 'all',
    type: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, filters]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch platform analytics
      const platformRes = await analyticsAPI.getPlatformAnalytics();
      if (platformRes.success) {
        setPlatformAnalytics(platformRes.data);
      }

      // Fetch popular articles
      const popularParams = new URLSearchParams({
        limit: '10',
        timeframe: timeframe,
        ...(filters.country !== 'all' && { country: filters.country }),
        ...(filters.type !== 'all' && { type: filters.type })
      });

      const popularRes = await analyticsAPI.getPopular(popularParams);
      if (popularRes.success) {
        setPopularArticles(popularRes.data);
      }

      // Fetch search analytics
      const searchRes = await analyticsAPI.getSearchAnalytics();
      if (searchRes.success) {
        setSearchAnalytics(searchRes.data);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <EncyclopediaAdminLayout>
    <div className="analytics-layout">
      {/* Simple Admin Navigation */}
      <nav className="admin-nav">
        <div className="nav-brand">
          <i className="fas fa-book"></i>
          Encyclopedia Admin
        </div>
        <div className="nav-links">
          <a href="/admin/encyclopedia/articles">Articles</a>
          <a href="/admin/encyclopedia/analytics" className="active">Analytics</a>
          <a href="/admin/encyclopedia/categories">Categories</a>
          <a href="/admin/encyclopedia/tags">Tags</a>
        </div>
      </nav>

      <div className="analytics-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h2 className="page-title">
              <i className="fas fa-chart-line"></i>
              Analytics Dashboard
            </h2>
            <p className="page-subtitle">Monitor your encyclopedia performance</p>
          </div>
          <div className="header-right">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="timeframe-select"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="365d">Last Year</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            >
              <option value="all">All Countries</option>
              <option value="IND">India</option>
              <option value="CHN">China</option>
              <option value="ARE">UAE</option>
              <option value="USA">USA</option>
              <option value="BRA">Brazil</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="plant">Plants</option>
              <option value="topic">Topics</option>
              <option value="policy">Policies</option>
              <option value="product">Products</option>
            </select>

            <button className="refresh-btn" onClick={fetchAnalytics}>
              <i className="fas fa-sync-alt"></i>
              Refresh Data
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Platform Overview Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                  <i className="fas fa-file-alt" style={{ color: '#4caf50' }}></i>
                </div>
                <div className="stat-content">
                  <h3>{formatNumber(platformAnalytics?.totalArticles || 0)}</h3>
                  <p>Total Articles</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#e3f2fd' }}>
                  <i className="fas fa-eye" style={{ color: '#2196f3' }}></i>
                </div>
                <div className="stat-content">
                  <h3>{formatNumber(platformAnalytics?.totalViews || 0)}</h3>
                  <p>Total Views</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fff3e0' }}>
                  <i className="fas fa-chart-line" style={{ color: '#ff9800' }}></i>
                </div>
                <div className="stat-content">
                  <h3>{formatNumber(Math.round(platformAnalytics?.averageViews || 0))}</h3>
                  <p>Avg. Views per Article</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#f3e5f5' }}>
                  <i className="fas fa-fire" style={{ color: '#9c27b0' }}></i>
                </div>
                <div className="stat-content">
                  <h3>{popularArticles.length}</h3>
                  <p>Trending Articles</p>
                </div>
              </div>
            </div>

            <div className="analytics-grid">
              {/* Popular Articles */}
              <div className="analytics-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-trophy"></i>
                    Most Popular Articles
                  </h3>
                  <span className="timeframe-badge">{timeframe}</span>
                </div>
                <div className="card-content">
                  {popularArticles.length === 0 ? (
                    <div className="empty-state-small">
                      <i className="fas fa-inbox"></i>
                      <p>No data available</p>
                    </div>
                  ) : (
                    <div className="articles-list">
                      {popularArticles.map((article, index) => (
                        <div key={article._id} className="article-item">
                          <div className="rank-badge">{index + 1}</div>
                          <div className="article-info">
                            <h4>{getText(article.title)}</h4>
                            <div className="article-meta">
                              <span className="meta-item">
                                <i className="fas fa-eye"></i>
                                {formatNumber(article.viewCount)} views
                              </span>
                              <span className="meta-item">
                                <i className="fas fa-calendar"></i>
                                {formatDate(article.publishedAt)}
                              </span>
                            </div>
                          </div>
                          <div className="article-actions">
                            <button
                              className="view-btn"
                              onClick={() => window.open(`/encyclopedia/${article.slug}`, '_blank')}
                              title="View Article"
                            >
                              <i className="fas fa-external-link-alt"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Search Trends */}
              <div className="analytics-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-search"></i>
                    Search Trends
                  </h3>
                  <span className="timeframe-badge">{timeframe}</span>
                </div>
                <div className="card-content">
                  {searchAnalytics.length === 0 ? (
                    <div className="empty-state-small">
                      <i className="fas fa-inbox"></i>
                      <p>No search data available</p>
                    </div>
                  ) : (
                    <div className="search-list">
                      {searchAnalytics.map((item, index) => (
                        <div key={index} className="search-item">
                          <div className="search-info">
                            <h4>{getText(item.title)}</h4>
                            <span className="search-count">
                              {formatNumber(item.viewCount)} searches
                            </span>
                          </div>
                          <div className="search-bar">
                            <div
                              className="search-fill"
                              style={{
                                width: `${(item.viewCount / searchAnalytics[0].viewCount) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="insights-section">
              <h3 className="section-title">
                <i className="fas fa-lightbulb"></i>
                Performance Insights
              </h3>
              <div className="insights-grid">
                <div className="insight-card">
                  <i className="fas fa-check-circle insight-icon success"></i>
                  <div className="insight-content">
                    <h4>Content Growth</h4>
                    <p>Your encyclopedia has {platformAnalytics?.totalArticles || 0} published articles</p>
                  </div>
                </div>
                <div className="insight-card">
                  <i className="fas fa-users insight-icon info"></i>
                  <div className="insight-content">
                    <h4>Audience Reach</h4>
                    <p>Total of {formatNumber(platformAnalytics?.totalViews || 0)} views across all articles</p>
                  </div>
                </div>
                <div className="insight-card">
                  <i className="fas fa-star insight-icon warning"></i>
                  <div className="insight-content">
                    <h4>Engagement Rate</h4>
                    <p>Average {formatNumber(Math.round(platformAnalytics?.averageViews || 0))} views per article</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
    </div>

      <style jsx>{`
        /* Admin Layout */
        .analytics-layout {
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

        .analytics-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--evergreen, #2f3c3b);
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Montserrat', sans-serif;
        }

        .page-subtitle {
          color: rgba(47, 60, 59, 0.7);
          margin: 0;
          font-size: 1rem;
        }

        .timeframe-select {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--lime-spark, #9fd356);
          border-radius: 8px;
          background: white;
          color: var(--charcoal-bark, #2f3c3b);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .timeframe-select:hover {
          background: var(--lime-spark, #9fd356);
          color: white;
        }

        /* Filters */
        .filters-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

        .refresh-btn {
          padding: 0.75rem 1.5rem;
          background: var(--lime-spark, #9fd356);
          color: var(--charcoal-bark, #2f3c3b);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(159, 211, 86, 0.3);
        }

        /* Stats Grid */
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
          gap: 1.5rem;
          align-items: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-content h3 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--evergreen, #2f3c3b);
          margin: 0 0 0.25rem 0;
        }

        .stat-content p {
          color: rgba(47, 60, 59, 0.7);
          margin: 0;
          font-size: 0.9rem;
        }

        /* Analytics Grid */
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .analytics-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(159, 211, 86, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--evergreen, #2f3c3b);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .timeframe-badge {
          padding: 0.25rem 0.75rem;
          background: rgba(159, 211, 86, 0.2);
          color: var(--lime-spark, #9fd356);
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .card-content {
          padding: 1.5rem;
        }

        /* Articles List */
        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .article-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .article-item:hover {
          background: rgba(159, 211, 86, 0.1);
        }

        .rank-badge {
          width: 36px;
          height: 36px;
          background: var(--lime-spark, #9fd356);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .article-info {
          flex: 1;
        }

        .article-info h4 {
          margin: 0 0 0.5rem 0;
          color: var(--evergreen, #2f3c3b);
          font-size: 1rem;
          font-weight: 600;
        }

        .article-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: rgba(47, 60, 59, 0.6);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .view-btn {
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
          color: var(--charcoal-bark, #2f3c3b);
        }

        .view-btn:hover {
          background: var(--lime-spark, #9fd356);
          color: white;
          border-color: var(--lime-spark, #9fd356);
        }

        /* Search List */
        .search-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .search-item {
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .search-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .search-info h4 {
          margin: 0;
          color: var(--evergreen, #2f3c3b);
          font-size: 0.95rem;
          font-weight: 600;
        }

        .search-count {
          font-size: 0.85rem;
          color: rgba(47, 60, 59, 0.6);
          font-weight: 600;
        }

        .search-bar {
          height: 8px;
          background: rgba(159, 211, 86, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .search-fill {
          height: 100%;
          background: var(--lime-spark, #9fd356);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        /* Insights */
        .insights-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--evergreen, #2f3c3b);
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .insight-card {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .insight-icon {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insight-icon.success {
          color: #4caf50;
        }

        .insight-icon.info {
          color: #2196f3;
        }

        .insight-icon.warning {
          color: #ff9800;
        }

        .insight-content h4 {
          margin: 0 0 0.5rem 0;
          color: var(--evergreen, #2f3c3b);
          font-weight: 600;
        }

        .insight-content p {
          margin: 0;
          color: rgba(47, 60, 59, 0.7);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        /* Loading & Empty States */
        .loading-state,
        .empty-state-small {
          text-align: center;
          padding: 3rem 2rem;
          color: rgba(47, 60, 59, 0.6);
        }

        .loading-state i,
        .empty-state-small i {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--lime-spark, #9fd356);
        }

        .empty-state-small {
          padding: 2rem 1rem;
        }

        .empty-state-small i {
          font-size: 2rem;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }

          .filters-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </EncyclopediaAdminLayout>
  );
};

export default AnalyticsPage;