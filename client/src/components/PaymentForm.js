import React, { useState, useEffect } from 'react';
import { api, getAuthHeaders } from '../utils/api'; // Adjust if needed

const PaymentForm = ({ payment, onClose, onSave, residents }) => {
  const [formData, setFormData] = useState({
    resident: '',
    category: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().slice(0, 10),
  });

  const isStatusOnly = payment?.statusOnly;

  useEffect(() => {
    if (payment) {
      setFormData({
        resident: payment.resident?._id || payment.resident || '',
        category: payment.category || '',
        amount: payment.amount || '',
        status: payment.status || 'Pending',
        date: payment.date ? new Date(payment.date).toISOString().slice(0, 10) : '',
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount), // ✅ ensure it's a number
    };

    console.log('🚀 Submitting payment:', payload); // ✅ frontend debug log

    try {
      if (!payload.resident || !payload.category || !payload.amount || !payload.date) {
        alert('All fields are required');
        return;
      }

      if (payment?._id) {
        await api.put(`/payments/${payment._id}`, payload, {
          headers: getAuthHeaders(),
        });
      } else {
        await api.post('/payments', payload, {
          headers: getAuthHeaders(),
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('❌ Error saving payment:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error saving payment. Check console for details.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {payment?._id
            ? isStatusOnly
              ? 'Update Payment Status'
              : 'Edit Payment'
            : 'Add Payment'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isStatusOnly && (
            <>
              <div>
                <label className="block font-medium">Resident</label>
                <select
                  name="resident"
                  value={formData.resident}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Resident</option>
                  {residents.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} ({r.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Category</option>
                  <option value="Room Rent">Room Rent</option>
                  <option value="Food">Food</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Previous Balance">Previous Balance</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
