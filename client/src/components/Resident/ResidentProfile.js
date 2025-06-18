import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResidentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please login.");
          return;
        }

        const res = await axios.get('https://fphst.onrender.com/api/residents/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        setProfile(res.data);
        setForm({
          name: res.data.name,
          phone: res.data.phone || '',
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put('https://fphst.onrender.com/api/residents/profile', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      setProfile((prev) => ({
        ...prev,
        name: res.data.name,
        phone: res.data.phone,
      }));
      setMessage('✅ Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (!profile) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center py-16 px-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1584697964403-c0b7c9b5ff65?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      <div className="bg-white bg-opacity-90 border border-indigo-200 rounded-3xl shadow-xl w-full max-w-lg p-10">
        <button
          onClick={() => navigate('/resident/dashboard')}
          className="mb-6 inline-block text-indigo-600 font-semibold hover:text-indigo-900 transition"
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

          <h2 className="text-3xl font-extrabold text-indigo-900 mb-2">{profile.name}</h2>
          <p className="text-indigo-600 font-medium mb-4 tracking-wide">Resident</p>

          {message && <div className="text-green-700 bg-green-100 px-4 py-2 rounded mb-3">{message}</div>}
          {error && <div className="text-red-700 bg-red-100 px-4 py-2 rounded mb-3">{error}</div>}

          <form className="w-full bg-indigo-50 rounded-xl p-6 shadow-inner space-y-4">
            <div>
              <label className="block font-semibold text-indigo-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full border px-4 py-2 rounded ${editMode ? 'bg-white' : 'bg-gray-100'}`}
              />
            </div>

            <div>
              <label className="block font-semibold text-indigo-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full border px-4 py-2 rounded ${editMode ? 'bg-white' : 'bg-gray-100'}`}
              />
            </div>

            <div>
              <label className="block font-semibold text-indigo-700 mb-1">Email</label>
              <input
                type="text"
                value={profile.email}
                disabled
                className="w-full border px-4 py-2 rounded bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-indigo-700 mb-1">Room</label>
              <input
                type="text"
                value={profile.assignedRoom?.roomNumber || 'Not Assigned'}
                disabled
                className="w-full border px-4 py-2 rounded bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-indigo-700 mb-1">Role</label>
              <input
                type="text"
                value={profile.role}
                disabled
                className="w-full border px-4 py-2 rounded bg-gray-100 text-gray-600"
              />
            </div>
          </form>

          <div className="mt-6 flex space-x-4">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
              >
                ✏️ Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setForm({
                      name: profile.name,
                      phone: profile.phone || '',
                    });
                    setMessage('');
                    setError('');
                  }}
                  className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
                >
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentProfile;
