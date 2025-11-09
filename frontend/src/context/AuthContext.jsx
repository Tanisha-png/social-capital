// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(normalizeUser(parsedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("user");
      }
    }
    setInitialized(true);
  }, []);

  function login(userData, token) {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalized)); // ✅ FIXED
  }

  function logOut() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  function getToken() {
    return localStorage.getItem("token") || null;
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logOut, initialized, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
