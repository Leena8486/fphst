import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Dialog } from '@headlessui/react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';

const API_BASE = 'https://fphst.onrender.com/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Resident',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchRooms();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/admin/users`, { withCredentials: true });
      setUsers(data);
    } catch {
      toast.error('Failed to fetch users');
    }
  };

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/admin/rooms`, { withCredentials: true });
      setRooms(data);
    } catch {
      toast.error('Failed to fetch rooms');
    }
  };

  const assignRoom = async (userId, roomId) => {
    try {
      await axios.put(`${API_BASE}/admin/users/${userId}/assign-room`, { roomId }, { withCredentials: true });
      toast.success('Room assigned');
      fetchUsers();
    } catch {
      toast.error('Failed to assign room');
    }
  };

  const checkIn = async (userId) => {
    try {
      await axios.put(`${API_BASE}/admin/users/${userId}/check-in`, {}, { withCredentials: true });
      toast.success('User checked in');
      fetchUsers();
    } catch {
      toast.error('Check-in failed');
    }
  };

  const checkOut = async (userId) => {
    try {
      await axios.put(`${API_BASE}/admin/users/${userId}/check-out`, {}, { withCredentials: true });
      toast.success('User checked out');
      fetchUsers();
    } catch {
      toast.error('Check-out failed');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete user?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/users/${id}`, { withCredentials: true });
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Delete failed');
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        password: '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Resident',
        password: '',
      });
    }
    setShowModal(true);
  };

  const saveUser = async () => {
    try {
      if (editingUser) {
        await axios.put(`${API_BASE}/admin/users/${editingUser._id}`, formData, { withCredentials: true });
        toast.success('User updated');
      } else {
        await axios.post(`${API_BASE}/admin/users`, formData, { withCredentials: true });
        toast.success('User added');
      }
      fetchUsers();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (!filterRole || user.role === filterRole) &&
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">Manage Users</h1>

      <div className="flex items-center gap-4 mb-6">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded px-4 py-2 shadow-sm"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
          <option value="Resident">Resident</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 shadow-sm"
        />
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow"
        >
          <PlusIcon className="w-4 h-4" /> Add User
        </button>
      </div>

      {!filterRole && <p className="text-gray-500 mb-4">Please select a role to view users.</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white rounded shadow p-4 border">
            <p className="text-lg font-bold mb-1">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.phone && <p className="text-sm text-gray-600">Phone: {user.phone}</p>}
            <p className="text-sm text-gray-600">Role: {user.role}</p>

            {user.role === 'Resident' && (
              <>
                <p className="mt-2 text-sm">
                  Room:{' '}
                  {user.assignedRoom
                    ? `${user.assignedRoom.number} (${user.assignedRoom.type})`
                    : 'Unassigned'}
                </p>
                <select
                  className="mt-2 border px-3 py-1 rounded w-full"
                  value={user.assignedRoom?._id || ''}
                  onChange={(e) => assignRoom(user._id, e.target.value)}
                >
                  <option value="">Assign Room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.number} ({room.type}) - {room.assignedTo.length}/{room.capacity}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => checkIn(user._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded w-full"
                  >
                    Check-In
                  </button>
                  <button
                    onClick={() => checkOut(user._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
                  >
                    Check-Out
                  </button>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800">
                <PencilIcon className="w-5 h-5" />
              </button>
              <button onClick={() => deleteUser(user._id)} className="text-red-600 hover:text-red-800">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <Dialog.Panel className="bg-white p-6 rounded shadow w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Add User'}
          </Dialog.Title>
          <div className="space-y-3">
  <input
    type="text"
    name="name"
    autoComplete="name"
    placeholder="Name"
    className="w-full border px-3 py-2 rounded"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />

  <input
    type="email"
    name="email"
    autoComplete="email"
    placeholder="Email"
    className="w-full border px-3 py-2 rounded"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  />

  <input
    type="tel"
    name="phoneNumber"
    autoComplete="tel-national"
    placeholder="Enter phone number with +91"
    className="w-full border px-3 py-2 rounded"
    pattern="\+91\d{10}"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  />

  <select
    name="role"
    autoComplete="off"
    className="w-full border px-3 py-2 rounded"
    value={formData.role}
    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
  >
    <option value="Admin">Admin</option>
    <option value="Staff">Staff</option>
    <option value="Resident">Resident</option>
  </select>

  <input
    type="password"
    name="password"
    autoComplete="new-password"
    placeholder="Password"
    className="w-full border px-3 py-2 rounded"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
  />
</div>
 <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={saveUser}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
