import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminMaintenancePanel = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('/api/maintenance')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleStatusUpdate = async (id, status) => {
    await axios.put(`/api/maintenance/${id}/status`, { status });
    setRequests(prev =>
      prev.map(r => (r._id === id ? { ...r, status } : r))
    );
  };

  const handleResolve = async (id) => {
    const resolutionNote = prompt('Enter resolution note:');
    if (resolutionNote) {
      await axios.put(`/api/maintenance/${id}/resolve`, { resolutionNote });
      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: 'Resolved', resolutionNotes: resolutionNote } : r
        )
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 p-6 bg-white rounded-lg border shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Maintenance Requests</h2>
      <ul className="space-y-4">
        {requests.map(req => (
          <li key={req._id} className="border p-4 rounded">
            <h3 className="font-bold">{req.title}</h3>
            <p>{req.description}</p>
            <p>Status: <strong>{req.status}</strong></p>
            <p>By: {req.requestedBy?.name || 'Unknown'}</p>
            {req.resolutionNotes && (
              <p className="text-green-700">Note: {req.resolutionNotes}</p>
            )}
            {req.status !== 'Resolved' && (
              <div className="space-x-2 mt-2">
                <button onClick={() => handleStatusUpdate(req._id, 'In Progress')}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Mark In Progress</button>
                <button onClick={() => handleResolve(req._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Resolve</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMaintenancePanel;
