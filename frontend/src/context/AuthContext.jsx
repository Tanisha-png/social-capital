// // import React, { createContext, useContext, useState, useEffect } from "react";

// // const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //     const [user, setUser] = useState(() => {
// //         const raw = localStorage.getItem("user");
// //         return raw ? JSON.parse(raw) : null;
// //     });
// //     const [token, setToken] = useState(
// //         () => localStorage.getItem("token") || null
// //     );

// //     useEffect(() => {
// //         if (user) localStorage.setItem("user", JSON.stringify(user));
// //         else localStorage.removeItem("user");
// //         if (token) localStorage.setItem("token", token);
// //         else localStorage.removeItem("token");
// //     }, [user, token]);

// //     const logout = () => {
// //         setUser(null);
// //         setToken(null);
// //     };

// //     return (
// //         <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
// //         {children}
// //         </AuthContext.Provider>
// //     );
// // };

// // export const useAuth = () => useContext(AuthContext);

// // src/services/authService.js

// // import React, { createContext, useContext, useState, useEffect } from "react";
// // import * as authService from "../services/authService";

// // const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //     const [user, setUser] = useState(null);
// //     const [isLoading, setIsLoading] = useState(true);

// //     useEffect(() => {
// //         const currentUser = authService.getUser();
// //         setUser(currentUser);
// //         setIsLoading(false);
// //     }, []);

// //     const logOut = () => {
// //         authService.logOut();
// //         setUser(null);
// //     };

// //     return (
// //         <AuthContext.Provider value={{ user, setUser }}>
// //         {children}
// //         </AuthContext.Provider>
// //     );
// // }

// // export function useAuth() {
// //     return useContext(AuthContext);
// // }

// // // Log in user with credentials and save token
// // export async function logIn({ email, password }) {
// //   // Replace with your actual backend endpoint
// //     const res = await fetch("/api/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password }),
// //     });

// //     if (!res.ok) {
// //         throw new Error("Login failed");
// //     }

// //     const data = await res.json();

// //   // Save token in localStorage
// //     localStorage.setItem("token", data.token);

// //   // Return user object decoded from token
// //     return getUser();
// // }

// // // Log out user by removing token
// // export function logOut() {
// //     localStorage.removeItem("token");
// // }

// // // Get current user from token
// // export function getUser() {
// //     const token = localStorage.getItem("token");
// //     if (!token) return null;

// //     try {
// //         // Decode JWT payload (base64)
// //         const payload = JSON.parse(atob(token.split(".")[1]));
// //         return payload; // Example: { id, name, email }
// //     } catch (err) {
// //         console.error("Failed to parse token:", err);
// //         return null;
// //     }
// // }

// import React, { createContext, useContext, useState, useEffect } from "react";
// import * as authService from "../services/authService";

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }


// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     // const [isLoading, setIsLoading] = useState(true);

//   // On mount, check for a user from localStorage (via token)
//     // useEffect(() => {
//     //     const currentUser = authService.getUser();
//     //     setUser(currentUser);
//     //     setIsLoading(false);
//     // }, []);

//     useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Login wrapper
//     const logIn = async (credentials) => {
//         // const loggedInUser = await authService.logIn(credentials);
//         const { token, user } = await authService.logIn(credentials);
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         setUser(loggedInUser);
//         return loggedInUser;
//     };

//   // Logout wrapper
//     const logOut = () => {
//         // authService.logOut();
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setUser(null);
//     };

//     const value = {
//     user,
//     setUser,
//     logIn,
//     logOut,
//   };

//     return (
//         <AuthContext.Provider value={{ user, setUser, logIn, logOut }}>
//         {children}
//         </AuthContext.Provider>
//         // <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//     );
// }

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState } from "react";

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
