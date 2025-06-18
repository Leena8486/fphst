import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved'];
const BASE_URL = 'https://fphst.onrender.com';

const AdminMaintenanceRequests = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchRequestsByStatus = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/maintenance?status=${statusFilter}`);
      setRequests(res.data);
    } catch (err) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const searchResolvedIssues = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/maintenance/search?query=${encodeURIComponent(searchQuery)}`
      );
      setRequests(res.data);
    } catch (err) {
      setError('Failed to search resolved issues');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axios.put(`${BASE_URL}/api/admin/maintenance/${id}`, {
        status: newStatus,
      });
      if (searchMode) {
        await searchResolvedIssues();
      } else {
        await fetchRequestsByStatus();
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this resolved request?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/admin/maintenance/${id}`);
      if (searchMode) {
        await searchResolvedIssues();
      } else {
        await fetchRequestsByStatus();
      }
    } catch (err) {
      alert('Failed to delete request');
    }
  };

  useEffect(() => {
    if (searchMode && searchQuery.trim()) {
      searchResolvedIssues();
    } else if (!searchMode) {
      fetchRequestsByStatus();
    } else {
      setRequests([]);
    }
  }, [statusFilter, searchQuery, searchMode, fetchRequestsByStatus, searchResolvedIssues]);

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: '2rem auto',
        fontFamily: 'Arial, sans-serif',
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          onClick={() => navigate('/admin/dashboard')}
          style={{
            color: '#2980b9',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          ← Back to Dashboard
        </span>

        <h1 style={{ color: '#2c3e50', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
          🛠️ Maintenance Requests
        </h1>

        <div style={{ width: 160 }} />
      </div>

      <div style={{ margin: '20px 0', display: 'flex', gap: 15, alignItems: 'center', flexWrap: 'wrap' }}>
        <label htmlFor="statusFilter" style={{ fontWeight: '600', fontSize: '1rem' }}>
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          disabled={searchMode}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '1rem',
            borderRadius: 6,
            border: '1px solid #bdc3c7',
            cursor: searchMode ? 'not-allowed' : 'pointer',
          }}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <label htmlFor="searchResolved" style={{ fontWeight: '600', fontSize: '1rem' }}>
          Search Resolved Issues:
        </label>
        <input
          id="searchResolved"
          type="text"
          placeholder="Search by problem or resident name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchMode(true)}
          onBlur={() => {
            if (!searchQuery.trim()) setSearchMode(false);
          }}
          style={{
            padding: '8px 12px',
            fontSize: '1rem',
            borderRadius: 6,
            border: '1px solid #bdc3c7',
            minWidth: 300,
          }}
        />
      </div>

      {loading && <p>Loading requests...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && requests.length === 0 && (
        <p style={{ color: '#7f8c8d' }}>
          {searchMode ? 'No resolved issues found for your search.' : 'No maintenance requests found.'}
        </p>
      )}

      {!loading && requests.length > 0 && (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <thead style={{ backgroundColor: '#2980b9', color: 'white' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left' }}>Problem</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Room No</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Issue</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Date</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Resident Name</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 10 }}>{req.title}</td>
                <td>{req.room?.number || 'N/A'}</td>
                <td style={{ padding: 10 }}>{req.description}</td>
                <td style={{ padding: 10 }}>{new Date(req.createdAt).toLocaleString()}</td>
                <td style={{ padding: 10 }}>{req.requestedBy?.name || 'N/A'}</td>
                <td style={{ padding: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <select
                      value={req.status}
                      disabled={updatingId === req._id}
                      onChange={(e) => handleStatusChange(req._id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid #bdc3c7',
                        fontWeight: '600',
                        backgroundColor:
                          req.status === 'Pending'
                            ? '#f39c12'
                            : req.status === 'In Progress'
                            ? '#3498db'
                            : '#27ae60',
                        color: 'white',
                        cursor: updatingId === req._id ? 'not-allowed' : 'pointer',
                        marginRight: req.status === 'Resolved' ? 8 : 0,
                      }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {req.status === 'Resolved' && (
                      <button
                        onClick={() => handleDelete(req._id)}
                        style={{
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: 6,
                          cursor: 'pointer',
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMaintenanceRequests;
