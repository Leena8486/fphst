import React, { useState } from 'react';
import axios from 'axios';

const CheckResident = () => {
  const [email, setEmail] = useState('');
  const [resident, setResident] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setResident(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/staff/residents/search?email=${email}`);
      setResident(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Resident not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 font-sans">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Check Resident Information</h2>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Enter Resident Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="example@email.com"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {resident && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Resident Details:</h3>
          <p className="text-gray-600">
            <strong>Name:</strong> {resident.name}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {resident.email}
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> {resident.phone || 'N/A'}
          </p>
          <p className="text-gray-600">
            <strong>Role:</strong> {resident.role}
          </p>
          <p className="text-gray-600">
            <strong>Room Assigned:</strong>{' '}
            {resident.assignedRoom
              ? `#${resident.assignedRoom.number} – ${resident.assignedRoom.type}, ${resident.assignedRoom.capacity} beds`
              : 'None'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckResident;
