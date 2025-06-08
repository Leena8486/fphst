import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PaymentForm = ({ payment, onClose, onSave, residents }) => {
  const [formData, setFormData] = useState({
    resident: payment?.resident || '',
    category: payment?.category || '',
    amount: payment?.amount || '',
    status: payment?.status || 'Pending',
    date: payment?.date ? new Date(payment.date).toISOString().split('T')[0] : '',
  });

  const statusOnly = payment?.statusOnly;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (payment?._id) {
        // Edit payment
        await axios.put(`${API_BASE_URL}/payments/${payment._id}`, formData, config);
      } else {
        // Add new payment
        await axios.post(`${API_BASE_URL}/payments`, formData, config);
      }

      onSave(); // refresh parent list
      onClose(); // close form
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to save payment. Please check input and try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{payment?._id ? 'Edit Payment' : 'Add Payment'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!statusOnly && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resident</label>
                <select
                  name="resident"
                  value={formData.resident}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select a resident</option>
                  {residents.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select category</option>
                  <option value="Room Rent">Room Rent</option>
                  <option value="Food">Food</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Previous Balance">Previous Balance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              {payment?._id ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
