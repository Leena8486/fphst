import React, { useEffect, useState } from 'react';
import { api, getAuthHeaders } from '../utils/api'; // Adjust path if needed

const PaymentForm = ({ residents }) => {
  const [formData, setFormData] = useState({
    resident: '',
    category: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().slice(0, 10),
  });

  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showListOnly, setShowListOnly] = useState(true); // 👈 toggle state

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments', {
        headers: getAuthHeaders(),
      });
      setPayments(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch payments:', error.message);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, amount: parseFloat(formData.amount) };

    try {
      if (editingPayment?._id) {
        await api.put(`/payments/${editingPayment._id}`, payload, {
          headers: getAuthHeaders(),
        });
      } else {
        await api.post('/payments', payload, {
          headers: getAuthHeaders(),
        });
      }

      fetchPayments();
      resetForm();
      setShowListOnly(true);
    } catch (error) {
      console.error('❌ Error saving payment:', error.response?.data?.message || error.message);
      alert('Error saving payment. Please check all fields.');
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      resident: payment.resident?._id || payment.resident,
      category: payment.category,
      amount: payment.amount,
      status: payment.status,
      date: new Date(payment.date).toISOString().slice(0, 10),
    });
    setShowListOnly(false);
  };

  const resetForm = () => {
    setEditingPayment(null);
    setFormData({
      resident: '',
      category: '',
      amount: '',
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-800">
          {showListOnly ? 'Payment List' : editingPayment ? 'Edit Payment' : 'Add Payment'}
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowListOnly(!showListOnly);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showListOnly ? '➕ Add Payment' : '📄 Show Payments'}
        </button>
      </div>

      {showListOnly ? (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full table-auto border">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-4 py-2 text-left">Resident</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay._id} className="border-t">
                    <td className="px-4 py-2">{pay.resident?.name || 'Unknown'}</td>
                    <td className="px-4 py-2">{pay.category}</td>
                    <td className="px-4 py-2">₹{pay.amount}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          pay.status === 'Completed'
                            ? 'bg-green-500'
                            : pay.status === 'Pending'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(pay.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(pay)}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto space-y-4">
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
              onClick={() => {
                resetForm();
                setShowListOnly(true);
              }}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {editingPayment ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
