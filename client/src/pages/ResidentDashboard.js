import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [ setUserId] = useState('');

  const handleLogout = () => {
    alert('Logged out! Redirecting to login page...');
    navigate('/login');
  };

  const cards = [
    {
      title: 'View Profile',
      description: 'Access and review your profile details.',
      onClick: () => navigate('/resident/profile'),
      icon: '👤',
    },
    {
      title: 'Maintenance Request',
      description: 'Submit or check the status of issues.',
      onClick: () => navigate('/resident/maintenance'),
      icon: '🛠️',
    },
    {
      title: 'Make a Payment',
      description: 'Pay hostel fees quickly and securely.',
      onClick: () => navigate('/resident/payments'),
      icon: '💳',
    },
  ];

  // ✅ Fetch notifications and logged-in user ID
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('📦 Token:', token);

        if (!token) {
          console.warn('⚠️ No token found in localStorage.');
          return;
        }

        // 🔍 Fetch current user info
        const userRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('👤 Logged in user ID:', userRes.data._id);
        setUserId(userRes.data._id);

        // 🔔 Fetch notifications
        const notifRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('📬 Notifications response:', notifRes.data);
        setNotifications(notifRes.data);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 p-6">
      {/* Logout */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
        Resident Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {cards.map(({ title, description, onClick, icon }) => (
          <div
            key={title}
            onClick={onClick}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-3">{icon}</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        ))}
      </div>

      {/* 🔔 Notifications */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🔔 Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No new notifications.</p>
        ) : (
          <ul className="bg-white p-4 rounded shadow space-y-3">
            {notifications.map((note) => (
              <li key={note._id} className="border-b pb-2 text-gray-700">
                {note.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;
