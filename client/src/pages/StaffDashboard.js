import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StaffDashboard() {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Staff' });

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/staff');
      setStaffList(res.data);
    } catch (err) {
      console.error('Error fetching staff:', err.message);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStaff) {
        await axios.put(`http://localhost:5000/api/staff/${selectedStaff._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/staff', formData);
      }
      setFormData({ name: '', email: '', role: 'Staff' });
      setSelectedStaff(null);
      fetchStaff();
    } catch (err) {
      console.error('Save error:', err.message);
    }
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setFormData({ name: staff.name, email: staff.email, role: staff.role });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this staff member?')) {
      await axios.delete(`http://localhost:5000/api/staff/${id}`);
      fetchStaff();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">👨‍💼 Staff Management</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {selectedStaff ? 'Update' : 'Add'}
          </button>
        </form>

        {/* List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Staff</h2>
          {staffList.length === 0 ? (
            <p className="text-gray-500">No staff found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {staffList.map((staff) => (
                <li key={staff._id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium text-gray-800">{staff.name}</p>
                    <p className="text-sm text-gray-500">{staff.email}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(staff._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
