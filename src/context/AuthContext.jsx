import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('app_cafe_admin_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('app_cafe_admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.login(username, password);
    if (res && res.user) {
      setUser(res.user);
      localStorage.setItem('app_cafe_admin_user', JSON.stringify(res.user));
      localStorage.setItem('app_cafe_admin_token', res.token);
      return res.user;
    }
    throw new Error('Authentication failed');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_cafe_admin_user');
    localStorage.removeItem('app_cafe_admin_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
