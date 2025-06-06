import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ number: '', type: 'Single', capacity: 1 });
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/admin/rooms`, {
        withCredentials: true,
      });
      setRooms(data);
    } catch (err) {
      console.error('[Fetch Rooms Error]', err);
      toast.error('Failed to load rooms');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await axios.put(`${API_BASE_URL}/admin/rooms/${editingRoom._id}`, form, {
          withCredentials: true,
        });
        toast.success('Room updated!');
        setEditingRoom(null);
      } else {
        await axios.post(`${API_BASE_URL}/admin/rooms`, form, {
          withCredentials: true,
        });
        toast.success('Room added!');
      }
      setForm({ number: '', type: 'Single', capacity: 1 });
      fetchRooms();
    } catch (err) {
      console.error('[Room Save Error]', err);
      toast.error(err.response?.data?.message || 'Failed to save room');
    }
  };

  const startEdit = (room) => {
    setEditingRoom(room);
    setForm({ number: room.number, type: room.type, capacity: room.capacity });
  };

  const deleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/rooms/${id}`, {
        withCredentials: true,
      });
      toast.success('Room deleted');
      fetchRooms();
    } catch (err) {
      console.error('[Room Delete Error]', err);
      toast.error('Failed to delete room');
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-8 text-gray-100 font-sans">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-cyan-400 hover:text-cyan-500 font-semibold transition-colors flex items-center gap-2"
          aria-label="Back to Dashboard"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className="text-4xl font-extrabold mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
        Manage Rooms
      </h2>

      {user?.role === 'Admin' && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-850 bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg p-8 mb-10 max-w-4xl mx-auto border border-cyan-600"
        >
          <h3 className="text-2xl font-semibold mb-6 text-cyan-300">
            {editingRoom ? 'Edit Room' : 'Add New Room'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <input
              type="text"
              placeholder="Room Number"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              className="rounded-lg bg-gray-800 border border-cyan-600 px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-cyan-100 font-medium"
              required
              autoComplete="off"
            />

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="rounded-lg bg-gray-800 border border-cyan-600 px-4 py-3 text-cyan-100 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Dorm">Dorm</option>
            </select>

            <input
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
              className="rounded-lg bg-gray-800 border border-cyan-600 px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-cyan-100 font-medium"
              required
              min="1"
            />
          </div>

          <div className="flex items-center gap-5 justify-end">
            {editingRoom && (
              <button
                type="button"
                onClick={() => {
                  setEditingRoom(null);
                  setForm({ number: '', type: 'Single', capacity: 1 });
                }}
                className="text-cyan-400 hover:text-cyan-600 font-semibold transition-colors"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
            >
              {editingRoom ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      )}

      <div className="max-w-4xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search rooms by number or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg bg-gray-800 border border-cyan-600 px-5 py-3 text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRooms.map((room) => {
          const assignedCount = room.assignedTo?.length || 0;
          const full = assignedCount >= room.capacity;
          return (
            <div
              key={room._id}
              className="bg-gradient-to-tr from-gray-800 via-gray-900 to-gray-950 rounded-2xl p-6 shadow-lg border border-cyan-700 hover:shadow-cyan-600 transition-shadow duration-300"
            >
              <h3 className="text-2xl font-bold mb-2 text-cyan-400">
                Room #{room.number}
              </h3>

              <p className="text-gray-300 mb-1">
                Type: <span className="font-semibold text-cyan-300">{room.type}</span>
              </p>

              <p className="text-gray-300 mb-1">
                Capacity: <span className="font-semibold text-cyan-300">{room.capacity}</span>
              </p>

              <p className="text-gray-300 mb-2">
                Occupants: <span className="font-semibold text-cyan-300">{assignedCount}</span> / {room.capacity}
              </p>

              <p className="flex items-center gap-2 mt-3 font-semibold">
                Status:
                {full ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-red-400 bg-red-900 bg-opacity-30 drop-shadow-md">
                    🔴 Full
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-green-400 bg-green-900 bg-opacity-30 drop-shadow-md">
                    🟢 Available
                  </span>
                )}
              </p>

              {user?.role === 'Admin' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => startEdit(room)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg py-2 shadow-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRoom(room._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-2 shadow-md transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredRooms.length === 0 && (
          <p className="text-center text-gray-400 col-span-full mt-10 text-lg">
            No rooms match your search.
          </p>
        )}
      </div>
    </div>
  );
}
