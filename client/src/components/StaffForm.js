import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffForm = ({ selectedStaff = null, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedStaff) {
      setForm({
        name: selectedStaff.name || '',
        email: selectedStaff.email || '',
        phone: selectedStaff.phone || '',
        role: selectedStaff.role || 'Staff',
        password: '',
      });
    } else {
      setForm({ name: '', email: '', phone: '', role: 'Staff', password: '' });
    }
    setError('');
  }, [selectedStaff]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBase = 'https://fphst.onrender.com/api/staff';

      if (selectedStaff) {
        const { password, ...editData } = form;
        const dataToSend = password ? form : editData;

        await axios.put(`${apiBase}/${selectedStaff._id}`, dataToSend);
      } else {
        await axios.post(apiBase, form);
      }

      onSuccess();
      setForm({ name: '', email: '', phone: '', role: 'Staff', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 max-w-xl mx-auto border border-indigo-200">
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">
        {selectedStaff ? '✏️ Edit Staff' : '➕ Add New Staff'}
      </h2>

      {error && <div className="text-red-600 mb-3 bg-red-100 p-2 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Full Name"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number(+91......)"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder={selectedStaff ? "Leave blank to keep current password" : "Password"}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required={!selectedStaff}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? 'Saving...' : selectedStaff ? 'Update Staff' : 'Add Staff'}
        </button>
      </form>
    </div>
  );
};

export default StaffForm;
