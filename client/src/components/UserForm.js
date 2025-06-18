import React, { useState, useEffect } from 'react';

export default function UserForm({ userData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Resident',
  });

  useEffect(() => {
    if (userData) {
      const { name, email, phone, role } = userData;
      setForm({ name, email, phone, role });
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend phone validation for Admin/Staff
    if (form.role !== 'Resident') {
      const phoneRegex = /^\+91\d{10}$/;
      if (!form.phone || !phoneRegex.test(form.phone)) {
        alert('Phone number must be in +91XXXXXXXXXX format for Admin and Staff');
        return;
      }
    }

    onSubmit(form);
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg mb-6">
      <h2 className="text-xl font-bold mb-4">{userData ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number (e.g. +919123456789)"
          value={form.phone}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="Resident">Resident</option>
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="col-span-2 flex gap-4 justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {userData ? 'Update' : 'Add'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
