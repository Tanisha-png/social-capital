// AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [initialized, setInitialized] = useState(false);

//   // Normalize user object to always have _id and id
//   const normalizeUser = (userData) => {
//     if (!userData) return null;
//     return {
//       ...userData,
//       _id: userData._id || userData.id || null,
//       id: userData.id || userData._id || null,
//     };
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");
//     if (token && storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(normalizeUser(parsedUser));
//       } catch (err) {
//         console.error("Failed to parse stored user:", err);
//         localStorage.removeItem("user");
//       }
//     }
//     setInitialized(true);
//   }, []);

//   function login(userData, token) {
//     const normalized = normalizeUser(userData);
//     setUser(normalized);
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(normalized)); // ✅ FIXED
//   }

//   function logOut() {
//     setUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   }

//   function getToken() {
//     return localStorage.getItem("token") || null;
//   }

//   return (
//     <AuthContext.Provider
//       value={{ user, setUser, login, logOut, initialized, getToken }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
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

  function login(userData, newToken) {
    const normalized = normalizeUser(userData);
    setUser(normalized);

    if (newToken) {
      setToken(newToken);
      localStorage.setItem("token", newToken);
    }

    // Keep storing normalized user object (so other code still reads it)
    try {
      localStorage.setItem("user", JSON.stringify(normalized));
    } catch (err) {
      console.warn("Could not save user to localStorage:", err);
    }
  }

  function logOut() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  function getToken() {
    return token || localStorage.getItem("token") || null;
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logOut, initialized, getToken, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
