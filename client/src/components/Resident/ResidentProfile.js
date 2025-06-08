import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResidentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://fphst.onrender.com/api/residents/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (!profile) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center py-16 px-4">
      <div className="bg-white border border-indigo-200 rounded-3xl shadow-xl w-full max-w-lg p-10">
        <button
          onClick={() => navigate('/resident/dashboard')}
          className="mb-8 inline-block text-indigo-600 font-semibold hover:text-indigo-900 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-6 rounded-full border-8 border-indigo-300 shadow-lg overflow-hidden ring-4 ring-indigo-200">
            <img
              src="https://api.dicebear.com/7.x/personas/svg?seed=resident"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-4xl font-extrabold text-indigo-900 mb-2">{profile.name}</h2>
          <p className="text-indigo-600 font-medium mb-8 tracking-wide">Resident</p>

          <div className="w-full bg-indigo-50 rounded-xl p-6 shadow-inner space-y-4">
            <p className="text-indigo-800 text-lg">
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p className="text-indigo-800 text-lg">
              <span className="font-semibold">Phone:</span> {profile.phone || 'Not Provided'}
            </p>
            <p className="text-indigo-800 text-lg">
              <span className="font-semibold">Room:</span> {profile.assignedRoom?.roomNumber || 'Not Assigned'}
            </p>
            <p className="text-indigo-800 text-lg">
              <span className="font-semibold">Role:</span> {profile.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentProfile;
