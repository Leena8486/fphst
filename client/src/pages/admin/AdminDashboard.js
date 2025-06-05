import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <Sidebar role="Admin" />
      <div className="flex-1 p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
        <h1 className="text-4xl font-bold text-blue-800 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-blue-200 cursor-pointer hover:bg-blue-50"
            onClick={() => navigate('/admin/manage-rooms')}

          >
            <h2 className="text-lg font-semibold text-blue-700 mb-2">📦 Manage Rooms</h2>
            <p className="text-sm text-gray-600">Add, update and view rooms.</p>
          </div>
<div
  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-blue-200 cursor-pointer hover:bg-blue-50"
  onClick={() => navigate('/admin/maintenance')}
>
  <h2 className="text-lg font-semibold text-blue-700 mb-2">🛠 Maintenance</h2>
  <p className="text-sm text-gray-600">Assign and track maintenance issues.</p>
</div>

          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-blue-200 cursor-pointer hover:bg-blue-50"
            onClick={() => navigate('/admin/users')}
          >
            <h2 className="text-lg font-semibold text-blue-700 mb-2">👥 Manage Users</h2>
            <p className="text-sm text-gray-600">Add or manage residents, staff, and admins.</p>
          </div>

          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-blue-200 cursor-pointer hover:bg-blue-50"
            onClick={() => navigate('/admin/payments')}
          >
            <h2 className="text-lg font-semibold text-blue-700 mb-2">💳 Payments</h2>
            <p className="text-sm text-gray-600">View and track payment records.</p>
          </div>
         
            </div>
        </div>
      </div>
    
  );
}
