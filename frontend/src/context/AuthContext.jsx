import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  register: () => {},
  logout: () => {},
  updateProfile: () => {},
});

const USERS_KEY = "grocify_users";
const SESSION_KEY = "grocify_user";

const defaultUsers = [
  {
    id: "admin-1",
    name: "Admin",
    email: "admin@grocify.com",
    password: "admin123",
    phone: "9999999999",
    address: "Grocify HQ, Lucknow",
    role: "admin",
  },
  {
    id: "user-1",
    name: "Demo User",
    email: "user@grocify.com",
    password: "user123",
    phone: "9876543210",
    address: "12 Park Street, Lucknow",
    role: "user",
  },
];

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return [...defaultUsers];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [...defaultUsers];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const register = ({ name, email, password, phone = "", address = "" }) => {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email already registered");
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      phone,
      address,
      role: "user",
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...safe } = newUser;
    setUser(safe);
    return safe;
  };

  const login = ({ email, password }) => {
    const users = loadUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );
    if (!found) throw new Error("Invalid email or password");
    const { password: _, ...safe } = found;
    setUser(safe);
    return safe;
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    if (!user) return;
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...updates, password: users[idx].password };
    if (updates.password) users[idx].password = updates.password;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...safe } = users[idx];
    setUser(safe);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
