import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, setToken, API_ENABLED } from '../api/client';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: () => {},
});

const USERS_KEY = 'grocify_users';
const SESSION_KEY = 'grocify_user';

const defaultUsers = [
  { id: 'admin-1', name: 'Admin', email: 'admin@grocify.com', password: 'admin123', phone: '9999999999', address: 'Grocify HQ, Lucknow', role: 'admin' },
  { id: 'user-1', name: 'Demo User', email: 'user@grocify.com', password: 'user123', phone: '9876543210', address: '12 Park Street, Lucknow', role: 'user' },
];

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) { localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers)); return [...defaultUsers]; }
  try { return JSON.parse(raw); } catch { return [...defaultUsers]; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const login = async ({ email, password }) => {
    if (API_ENABLED) {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      const safe = { id: data._id, name: data.name, email: data.email, role: data.role };
      setUser(safe);
      return safe;
    }
    const users = loadUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _, ...safe } = found;
    setUser(safe);
    return safe;
  };

  const register = async ({ name, email, password, phone = '', address = '' }) => {
    if (API_ENABLED) {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setToken(data.token);
      const safe = { id: data._id, name: data.name, email: data.email, role: data.role };
      setUser(safe);
      return safe;
    }
    const users = loadUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered');
    }
    const newUser = { id: `user-${Date.now()}`, name, email, password, phone, address, role: 'user' };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...safe } = newUser;
    setUser(safe);
    return safe;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    if (!API_ENABLED) {
      const users = loadUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates, password: updates.password || users[idx].password };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
