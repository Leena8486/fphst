import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = { _id, name, role, ... }
  const [loading, setLoading] = useState(true);

  // Fetch the current logged-in user from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', 
 { withCredentials: true });
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

// ✅ Custom hook to use auth context in components
export const useAuth = () => useContext(AuthContext);
