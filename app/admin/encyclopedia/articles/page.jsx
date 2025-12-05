"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EncyclopediaAdminLayout from '@/components/encyclopedia/admin/EncyclopediaAdminLayout';
import { useEncyclopedia } from '@/context/EncyclopediaContext';
import { articlesAPI } from '@/lib/api/encyclopedia';
import { ARTICLE_TYPES, ARTICLE_STATUS, TYPE_COLORS } from '@/lib/constants/encyclopedia';

const ArticlesPage = ({ initialStatus = 'all' }) => {
  const router = useRouter();
  const { language, country, getText } = useEncyclopedia();

  // State management
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    status: initialStatus,
    type: 'all',
    category: 'all',
    country: country || 'all',
    dateFrom: '',
    dateTo: ''
  });

    // Update filters when initialStatus changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      status: initialStatus
    }));
    setCurrentPage(1); // Reset to first page when status changes
  }, [initialStatus]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalArticles, setTotalArticles] = useState(0);

  // Sort
  const [sortBy, setSortBy] = useState('latest');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
      fetchArticles();
    }, [filters, currentPage, itemsPerPage, sortBy, sortOrder, searchTerm]);
  
    const fetchArticles = async () => {
      setLoading(true);
  
      try {
        // Build query parameters
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          language: language,
          sortBy: sortBy,
          sortOrder: sortOrder
        };
  
        // Add filters if not 'all'
        if (filters.status !== 'all') params.status = filters.status;
        if (filters.type !== 'all') params.type = filters.type;
        if (filters.category !== 'all') params.category = filters.category;
        if (filters.country !== 'all') params.country = filters.country;
        if (searchTerm) params.search = searchTerm;
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;
  
        // Call API
        const response = await articlesAPI.getAll(params);
        if (response.success) {
          setArticles(response.data.articles || []);
          setTotalPages(response.pagination?.totalPages || 1);
          setTotalArticles(response.pagination?.totalItems || 0);
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

  // Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedArticles(articles.map(a => a._id));
    } else {
      setSelectedArticles([]);
    }
  };

  const handleSelectArticle = (id) => {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter(a => a !== id));
    } else {
      setSelectedArticles([...selectedArticles, id]);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedArticles.length === 0) {
      alert('Please select articles first');
      return;
    }

    const confirmed = confirm(`Are you sure you want to ${action} ${selectedArticles.length} article(s)?`);
    if (!confirmed) return;

    // Refresh list
    fetchArticles();
    setSelectedArticles([]);
  };

  const handleDelete = async (slug) => {
    const confirmed = confirm('Are you sure you want to delete this article? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await articlesAPI.delete(slug);
      
      if (response.success) {
        alert('Article deleted successfully!');
        fetchArticles(); // Refresh the list
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert(`Failed to delete article: ${error.message}`);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // TODO: Implement status change API call
    fetchArticles();
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: { text: 'Published', class: 'status-published' },
      draft: { text: 'Draft', class: 'status-draft' },
      pending_review: { text: 'Pending Review', class: 'status-pending' },
      archived: { text: 'Archived', class: 'status-archived' }
    };
    return badges[status] || badges.draft;
  };

  const getTypeBadge = (type) => {
    const color = TYPE_COLORS[type]?.primary || '#3498db';
    return { color };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <EncyclopediaAdminLayout>
      <div className="articles-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h2 className="page-title">
              <i className="fas fa-file-alt"></i>
              Articles
            </h2>
            <p className="page-subtitle">Manage your encyclopedia articles</p>
          </div>
          <div className="header-right">
            <button
              className="btn btn-primary"
              onClick={() => router.push('/admin/encyclopedia/articles/create')}
            >
              <i className="fas fa-plus"></i>
              Create Article
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="filters-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search articles by title, author, or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters-row">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="archived">Archived</option>
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedArticles.length > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">
              {selectedArticles.length} article(s) selected
            </span>
            <div className="bulk-buttons">
              <button
                className="bulk-btn"
                onClick={() => handleBulkAction('publish')}
              >
                <i className="fas fa-check"></i> Publish
              </button>
              <button
                className="bulk-btn"
                onClick={() => handleBulkAction('archive')}
              >
                <i className="fas fa-archive"></i> Archive
              </button>
              <button
                className="bulk-btn bulk-btn-danger"
                onClick={() => handleBulkAction('delete')}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        )}

        {/* Articles Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-file-alt"></i>
              <h3>No articles found</h3>
              <p>Try adjusting your filters or create a new article</p>
              <button
                className="btn btn-primary"
                onClick={() => router.push('/admin/encyclopedia/articles/create')}
              >
                Create Article
              </button>
            </div>
          ) : (
            <table className="articles-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedArticles.length === articles.length}
                    />
                  </th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Published</th>
                  <th>Views</th>
                  <th>Countries</th>
                  <th className="actions-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article._id)}
                        onChange={() => handleSelectArticle(article._id)}
                      />
                    </td>
                    <td className="title-cell">
                      <div className="article-title">
                        <Link href={`/admin/encyclopedia/articles/${article.slug}/edit`}>
                          {getText(article.title)}
                        </Link>
                        <span className="article-slug">/{article.slug}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="type-badge"
                        style={{
                          backgroundColor: getTypeBadge(article.articleType.slug).color + '20',
                          color: getTypeBadge(article.articleType.slug).color
                        }}
                      >
                        {getText(article.articleType.name)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(article.status).class}`}>
                        {getStatusBadge(article.status).text}
                      </span>
                    </td>
                    <td>
                      <div className="author-cell">
                        <img
                          src={article.author.avatarUrl || '/images/default-avatar.png'}
                          alt={article.author.name}
                          className="author-avatar"
                        />
                        <span>{article.author.name}</span>
                      </div>
                    </td>
                    <td>{formatDate(article.publishedAt)}</td>
                    <td>
                      <span className="view-count">
                        <i className="fas fa-eye"></i> {article.viewCount.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      {article.isGlobal ? (
                        <span className="global-badge">🌍 Global</span>
                      ) : (
                        <span className="countries-list">
                          {article.publishedCountries.join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button
                          className="action-btn"
                          title="Edit"
                          onClick={() => router.push(`/admin/encyclopedia/articles/${article._id}/edit`)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="action-btn"
                          title="View"
                          onClick={() => window.open(`/encyclopedia/${article.slug}`, '_blank')}
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </button>
                        {article.status === 'draft' && (
                          <button
                            className="action-btn action-btn-success"
                            title="Publish"
                            onClick={() => handleStatusChange(article._id, 'published')}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        <button
                          className="action-btn action-btn-danger"
                          title="Delete"
                          onClick={() => handleDelete(article.slug)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && articles.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, articles.length)} of {articles.length} articles
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="items-per-page">
              <label>Items per page:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .articles-page {
          max-width: 1400px;
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
          color: var(--evergreen);
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

        .btn-primary {
          background: var(--lime-spark);
          color: var(--charcoal-bark);
        }

        .btn-primary:hover {
          background: #7fb83e;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(159, 211, 86, 0.3);
        }

        /* Filters */
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
          color: var(--lime-spark);
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
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .filters-row select:focus {
          outline: none;
          border-color: var(--lime-spark);
        }

        /* Bulk Actions */
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
          color: var(--evergreen);
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

        .bulk-btn:hover {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .bulk-btn-danger {
          border-color: #e74c3c;
          color: #e74c3c;
        }

        .bulk-btn-danger:hover {
          background: #e74c3c;
          color: white;
        }

        /* Table */
        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .articles-table {
          width: 100%;
          border-collapse: collapse;
        }

        .articles-table thead {
          background: #f8f9fa;
        }

        .articles-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--evergreen);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .articles-table td {
          padding: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .articles-table tbody tr:hover {
          background: #f8f9fa;
        }

        .checkbox-cell {
          width: 40px;
          text-align: center;
        }

        .title-cell {
          min-width: 250px;
        }

        .article-title a {
          color: var(--evergreen);
          font-weight: 600;
          text-decoration: none;
          display: block;
          margin-bottom: 0.25rem;
        }

        .article-title a:hover {
          color: var(--lime-spark);
        }

        .article-slug {
          font-size: 0.85rem;
          color: rgba(47, 60, 59, 0.6);
        }

        .type-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-published {
          background: #d4edda;
          color: #155724;
        }

        .status-draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-pending {
          background: #d1ecf1;
          color: #0c5460;
        }

        .status-archived {
          background: #f8d7da;
          color: #721c24;
        }

        .author-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .author-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .view-count {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(47, 60, 59, 0.7);
        }

        .global-badge {
          font-size: 0.85rem;
          color: var(--lime-spark);
          font-weight: 600;
        }

        .countries-list {
          font-size: 0.85rem;
          color: rgba(47, 60, 59, 0.7);
        }

        .actions-cell {
          width: 150px;
        }

        .action-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(159, 211, 86, 0.3);
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: var(--charcoal-bark);
        }

        .action-btn:hover {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .action-btn-success {
          border-color: #28a745;
          color: #28a745;
        }

        .action-btn-success:hover {
          background: #28a745;
          color: white;
        }

        .action-btn-danger {
          border-color: #e74c3c;
          color: #e74c3c;
        }

        .action-btn-danger:hover {
          background: #e74c3c;
          color: white;
        }

        /* Loading & Empty States */
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
          color: var(--lime-spark);
        }

        .empty-state h3 {
          color: var(--evergreen);
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          margin-bottom: 1.5rem;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
        }

        .pagination-controls {
          display: flex;
          gap: 0.5rem;
        }

        .pagination-btn {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .pagination-btn.active {
          background: var(--lime-spark);
          color: white;
          border-color: var(--lime-spark);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .items-per-page {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .items-per-page select {
          padding: 0.5rem;
          border: 1px solid rgba(159, 211, 86, 0.3);
          border-radius: 6px;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .filters-row {
            grid-template-columns: 1fr;
          }

          .table-container {
            overflow-x: auto;
          }

          .articles-table {
            min-width: 1000px;
          }

          .pagination {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </EncyclopediaAdminLayout>
  );
};

export default ArticlesPage;
