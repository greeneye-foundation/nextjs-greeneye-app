// components/Admin/AdminTrees.jsx - Admin tree management list component
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { showNotification } from "@/components/Notification";
import TreeUpdateForm from "./TreeUpdateForm";

const STATUS_OPTIONS = ['ALL', 'PAID', 'PLANT_SELECTED', 'PLANTING_SCHEDULED', 'PLANTED', 'GROWING'];

const STATUS_LABELS = {
  PAID: 'Paid',
  PLANT_SELECTED: 'Plant Selected',
  PLANTING_SCHEDULED: 'Planting Scheduled',
  PLANTED: 'Planted',
  GROWING: 'Growing'
};

function AdminTrees() {
  const { getAuthHeaders } = useAuth();

  const [trees, setTrees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTree, setSelectedTree] = useState(null);

  const fetchTrees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('page', page);
      params.append('limit', 20);

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trees/admin/list?${params}`,
        { headers: getAuthHeaders() }
      );
      if (data.success) {
        setTrees(data.data.trees);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to load trees', 'error');
      setTrees([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, page, getAuthHeaders]);

  // Fetch trees when filters or page change
  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  // Debounce search input by 300ms
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // When debounced search changes, reset page to 1 and trigger fetch
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTreeClick = (tree) => {
    setSelectedTree(tree);
  };

  const handleFormClose = () => {
    setSelectedTree(null);
    fetchTrees();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="admin-trees">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className="fas fa-tree" style={{ color: '#388e3c' }}></i>
        Tree Management
        <span className="admin-trees-count">{total}</span>
      </h2>

      {/* Filters bar */}
      <div className="admin-trees-filters">
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'ALL' ? 'All Statuses' : (STATUS_LABELS[opt] || opt)}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by tree ID or recipient name..."
          aria-label="Search trees"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="admin-trees-loading">
          <i className="fas fa-spinner fa-spin"></i> Loading trees...
        </div>
      ) : trees.length === 0 ? (
        <div className="admin-trees-empty">
          <i className="fas fa-tree" style={{ fontSize: 48, color: '#ccc', display: 'block', marginBottom: 16 }}></i>
          No trees match your search.
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-trees-table">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Recipient</th>
                  <th className="hide-mobile">Plant</th>
                  <th>Status</th>
                  <th className="hide-mobile">Date</th>
                </tr>
              </thead>
              <tbody>
                {trees.map((tree) => (
                  <tr key={tree._id} onClick={() => handleTreeClick(tree)}>
                    <td style={{ color: '#388e3c', fontWeight: 600 }}>
                      {tree.trackingId}
                    </td>
                    <td>{tree.recipientName || '-'}</td>
                    <td className="hide-mobile">{tree.plantName || tree.species || '-'}</td>
                    <td>
                      <span className={`tree-status-badge ${tree.status}`}>
                        {STATUS_LABELS[tree.status] || tree.status}
                      </span>
                    </td>
                    <td className="hide-mobile" style={{ fontSize: 13, color: '#666' }}>
                      {formatDate(tree.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-trees-pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Tree Update Form */}
      {selectedTree && (
        <TreeUpdateForm
          tree={selectedTree}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

export default AdminTrees;
