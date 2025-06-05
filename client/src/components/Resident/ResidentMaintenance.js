import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResidentMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [showRequests, setShowRequests] = useState(false);
  const navigate = useNavigate(); // ✅ React Router hook

  useEffect(() => {
    if (showRequests) fetchRequests();
  }, [showRequests]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/residents/maintenance', {
        withCredentials: true,
      });
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRequests(sorted);
    } catch (error) {
      console.error('Error fetching requests:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/residents/maintenance', form, {
        withCredentials: true,
      });
      setForm({ title: '', description: '' });
      if (showRequests) fetchRequests();
    } catch (error) {
      console.error('Error submitting request:', error.message);
    }
  };

  const getStatusStyle = (status) => {
    const base = {
      padding: '4px 10px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '0.85rem',
      color: '#fff',
      display: 'inline-block',
      minWidth: 80,
      textAlign: 'center',
    };
    switch (status) {
      case 'Pending':
        return { ...base, backgroundColor: '#f39c12' };
      case 'In Progress':
        return { ...base, backgroundColor: '#3498db' };
      case 'Resolved':
        return { ...base, backgroundColor: '#27ae60' };
      default:
        return { ...base, backgroundColor: '#7f8c8d' };
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      {/* ✅ Navigate to Dashboard on click */}
      <button
          onClick={() => navigate('/resident/dashboard')}
          className="mb-8 inline-block text-indigo-600 font-semibold hover:text-indigo-900 transition"
        >
          ← Back to Dashboard
        </button>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Form */}
        <section
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
            Submit a Maintenance Request
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Issue Title</label>
              <input
                type="text"
                placeholder="e.g. Water leakage"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #bdc3c7',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>Description</label>
              <textarea
                placeholder="Describe the problem..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={5}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #bdc3c7',
                  fontSize: '1rem',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#2980b9',
                color: 'white',
                padding: '12px 0',
                fontSize: '1.1rem',
                fontWeight: '700',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Submit Request
            </button>
          </form>
        </section>

        {/* Table */}
        <section style={{ flex: 1 }}>
          <button
            onClick={() => setShowRequests(!showRequests)}
            style={{
              marginBottom: 15,
              padding: '10px 20px',
              fontWeight: '600',
              borderRadius: 8,
              border: '1px solid #2980b9',
              backgroundColor: showRequests ? '#2980b9' : 'white',
              color: showRequests ? 'white' : '#2980b9',
              cursor: 'pointer',
            }}
          >
            {showRequests ? 'Hide Previous Requests' : 'Show Previous Requests'}
          </button>

          {showRequests && (
            <>
              {requests.length === 0 ? (
                <p style={{ color: '#7f8c8d' }}>No maintenance requests found.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead style={{ backgroundColor: '#2980b9', color: '#fff' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req._id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px' }}>{req.title}</td>
                        <td style={{ padding: '10px' }}>{req.description}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={getStatusStyle(req.status)}>{req.status}</span>
                        </td>
                        <td style={{ padding: '10px' }}>
                          {new Date(req.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResidentMaintenance;

