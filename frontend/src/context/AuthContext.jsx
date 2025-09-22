// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // ✅ keep this
  const [initialized, setInitialized] = useState(false);

  // Normalize user object to always have _id and id
  const normalizeUser = (userData) => {
    if (!userData) return null;
    return {
      ...userData,
      _id: userData._id || userData.id || null,
      id: userData.id || userData._id || null,
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (token && storedUser) setUser(normalizeUser(storedUser));
    setInitialized(true); // mark context as ready
  }, []);

  function login(userData, token) {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalized));
  }

  function logOut() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logOut, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
