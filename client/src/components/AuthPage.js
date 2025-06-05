import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { setUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Resident',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setForm({ name: '', email: '', password: '', role: 'Resident' });
    setError('');
  }, [isLogin]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

   const url = `${API_BASE_URL}/api/auth/${isLogin ? 'login' : 'register'}`;

    try {
      const { data } = await axios.post(url, form, {
        withCredentials: true,
      });

      if (!data || !data.user) {
        throw new Error('Invalid response from server');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setUser(data.user);
      const role = data.user.role?.toLowerCase();

      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'staff') navigate('/staff/dashboard');
      else if (role === 'resident') navigate('/resident/dashboard');
      else setError('Unknown user role');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
          {isLogin ? 'Welcome Back!' : 'Create Your Account'}
        </h2>

        <div className="flex justify-center mb-6 space-x-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`py-2 px-6 rounded-full font-semibold transition-colors duration-300 ${
              isLogin
                ? 'bg-white text-indigo-700 shadow-lg'
                : 'text-white hover:text-indigo-200'
            }`}
            aria-label="Switch to Login"
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`py-2 px-6 rounded-full font-semibold transition-colors duration-300 ${
              !isLogin
                ? 'bg-white text-indigo-700 shadow-lg'
                : 'text-white hover:text-indigo-200'
            }`}
            aria-label="Switch to Register"
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-5 text-center text-red-400 font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              autoComplete="name"
              className="w-full px-4 py-3 rounded-md bg-white bg-opacity-20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-opacity-30 transition"
            />
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-md bg-white bg-opacity-20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-opacity-30 transition"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            className="w-full px-4 py-3 rounded-md bg-white bg-opacity-20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-opacity-30 transition"
          />

          {!isLogin && (
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-white bg-opacity-20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-opacity-30 transition"
              aria-label="Select Role"
            >
              <option value="Resident">Resident</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
