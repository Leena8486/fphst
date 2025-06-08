import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = { _id, name, role, ... }
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
  try {
    const token = localStorage.getItem('token'); // Read token from localStorage
    const res = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(res.data);
  } catch (err) {
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
