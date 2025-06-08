import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PaymentForm from './PaymentForm';
import Pagination from './Pagination';
import MonthlyRevenueChart from './MonthlyRevenueChart';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminPaymentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState({ category: '', resident: '', date: '' });
  const [residents, setResidents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showChart, setShowChart] = useState(false);

  const limit = 5;
  const canEditAll = user?.role === 'Admin';
  const canUpdateStatus = user?.role === 'Staff';

  const fetchPayments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(
        `${API_BASE_URL}/payments?page=${currentPage}&limit=${limit}&category=${filter.category}&resident=${filter.resident}&date=${filter.date}`,
        config
      );
      setPayments(data.data || []);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  }, [currentPage, filter]);

  const fetchResidents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(`${API_BASE_URL}/admin/users/residents/list`, config);
      setResidents(data || []);
    } catch (error) {
      console.error('Failed to fetch residents:', error);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchResidents();
  }, [fetchPayments, fetchResidents]);

  const openForm = async (payment = null) => {
    await fetchResidents();
    setEditing(payment);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPayments();
      } catch (error) {
        console.error('Failed to delete payment:', error);
      }
    }
  };

  const handleSave = () => {
    setEditing(null);
    setFormOpen(false);
    fetchPayments();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6 relative">
          <div className="absolute left-0">
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline font-semibold">
              &larr; Back to Dashboard
            </Link>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mx-auto">Payment Management</h2>
          <div className="absolute right-0">
            <button
              onClick={() => setShowChart((prev) => !prev)}
              className="text-blue-600 hover:underline font-semibold"
            >
              {showChart ? 'Hide Monthly Revenue Chart' : 'View Monthly Revenue Chart'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex flex-col">
            <label className="mb-1 text-gray-600 font-medium">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="Room Rent">Room Rent</option>
              <option value="Food">Food</option>
              <option value="Electricity">Electricity</option>
              <option value="Previous Balance">Previous Balance</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-600 font-medium">Resident</label>
            <select
              value={filter.resident}
              onChange={(e) => setFilter({ ...filter, resident: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Residents</option>
              {residents.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-600 font-medium">Date</label>
            <input
              type="date"
              value={filter.date}
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Add Button */}
        {canEditAll && (
          <button
            onClick={() => openForm(null)}
            className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md"
          >
            + Add Payment
          </button>
        )}

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Resident</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                {(canEditAll || canUpdateStatus) && (
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments.map((payment, idx) => (
                  <tr key={payment._id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4">{payment.residentName || 'N/A'}</td>
                    <td className="px-6 py-4">{payment.category}</td>
                    <td className="px-6 py-4 text-right font-semibold">₹{payment.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : payment.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payment.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(payment.date).toLocaleDateString()}</td>
                    {(canEditAll || canUpdateStatus) && (
                      <td className="px-6 py-4 text-center space-x-2">
                        {canEditAll && (
                          <>
                            <button
                              onClick={() => openForm(payment)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(payment._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {canUpdateStatus && (
                          <button
                            onClick={() => openForm({ ...payment, statusOnly: true })}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                          >
                            Update Status
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={canEditAll || canUpdateStatus ? 6 : 5}
                    className="text-center py-8 text-gray-500"
                  >
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        {showChart && (
          <div className="mt-10">
            <MonthlyRevenueChart />
          </div>
        )}

        {formOpen && (
          <PaymentForm
            payment={editing}
            onClose={() => {
              setFormOpen(false);
              setEditing(null);
            }}
            onSave={handleSave}
            residents={residents}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPaymentDashboard;
