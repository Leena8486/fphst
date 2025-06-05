import React, { useState, useEffect } from 'react';
import StaffForm from './StaffForm';
import StaffList from './StaffList';
import CheckResident from './CheckResident';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/staff', { withCredentials: true });
      setStaffList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`);
      fetchStaff();
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  const handleSuccess = () => {
    fetchStaff();
    setSelectedStaff(null);
    setActiveTab('menu');
  };

  useEffect(() => {
    if (activeTab === 'list') fetchStaff();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-purple-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10">
        {/* Main Menu */}
        {activeTab === 'menu' && (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-indigo-800">👷 Welcome to the Staff Dashboard</h1>
            <p className="text-gray-500">Manage staff, search residents, and maintain hostel operations efficiently.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              <button
                onClick={() => {
                  setSelectedStaff(null);  // <-- Reset selected staff here!
                  setActiveTab('add');
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-4 px-6 rounded-xl shadow-lg"
              >
                ➕ Add New Staff
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-xl shadow-lg"
              >
                📋 View Staff List
              </button>
              <button
                onClick={() => setActiveTab('resident')}
                className="bg-pink-500 hover:bg-pink-600 text-white py-4 px-6 rounded-xl shadow-lg"
              >
                🔎 Check Resident Info
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-gray-400 hover:bg-gray-600 text-white py-4 px-6 rounded-xl shadow-lg"
              >
                🔙 Back to Login
              </button>
            </div>
          </div>
        )}

        {/* Add or Edit Staff Form */}
        {activeTab === 'add' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold text-indigo-700">
                {selectedStaff ? '✏️ Edit Staff Member' : '➕ Add Staff Member'}
              </h2>
              <button onClick={() => setActiveTab('menu')} className="text-indigo-600 hover:underline">
                ⬅ Back
              </button>
            </div>
            <StaffForm selectedStaff={selectedStaff} onSuccess={handleSuccess} />
          </div>
        )}

        {/* Staff List */}
        {activeTab === 'list' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold text-purple-700">📋 Staff Members</h2>
              <button onClick={() => setActiveTab('menu')} className="text-purple-600 hover:underline">
                ⬅ Back
              </button>
            </div>
            <StaffList staffList={staffList} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        )}

        {/* Check Resident Info */}
        {activeTab === 'resident' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold text-pink-700">🔎 Resident Lookup</h2>
              <button onClick={() => setActiveTab('menu')} className="text-pink-600 hover:underline">
                ⬅ Back
              </button>
            </div>
            <CheckResident />
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
