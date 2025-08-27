// import sendRequest from './sendRequest';

// const BASE_URL = '/api/auth';

// // Helper to parse JWT safely
// function parseJwt(token) {
//   if (!token) return null;
//   try {
//     const base64Url = token.split('.')[1];
//     if (!base64Url) return null;
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
//     return JSON.parse(atob(padded));
//   } catch (err) {
//     console.error('Failed to parse JWT:', err);
//     return null;
//   }
// }

// // Get token from localStorage and validate expiration
// export function getToken() {
//   const token = localStorage.getItem('token');
//   if (!token) return null;

//   const payload = parseJwt(token);
//   if (!payload) {
//     localStorage.removeItem('token');
//     return null;
//   }

//   // Check expiration (exp is in seconds)
//   if (payload.exp * 1000 < Date.now()) {
//     localStorage.removeItem('token');
//     return null;
//   }

//   return token;
// }

// // Get current user from token
// export function getUser() {
//   const token = getToken();
//   const payload = parseJwt(token);
//   return payload ? payload.user : null;
// }

// // Sign up a new user
// export async function signUp(userData) {
//   const response = await sendRequest(`${BASE_URL}/signup`, 'POST', userData);
//   // Make sure response contains a token
//   const token = response.token;
//   if (!token) throw new Error("No token returned from signup");
//   localStorage.setItem('token', token);
//   return getUser();
// }

// // Log in an existing user
// export async function logIn(credentials) {
//   const response = await sendRequest(`${BASE_URL}/login`, 'POST', credentials);
//   const token = response.token;
//   if (!token) throw new Error("No token returned from login");
//   localStorage.setItem('token', token);
//   return getUser();
// }

// // Log out
// export function logOut() {
//   localStorage.removeItem('token');
// }

// import sendRequest from './sendRequest';

// // const BASE_URL = '/api/auth';
// const BASE_URL = "http://localhost:3000/api/auth";

// // Save auth data to localStorage
// function saveAuthData(token, user) {
//   localStorage.setItem('token', token);
//   localStorage.setItem('user', JSON.stringify(user));
// }

// // Remove auth data
// export function logOut() {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
// }

// // Get current user from localStorage
// export function getUser() {
//   const user = localStorage.getItem('user');
//   return user ? JSON.parse(user) : null;
// }

// // Get token from localStorage
// export function getToken() {
//   const token = localStorage.getItem('token');
//   if (!token) return null;

//   const payload = parseJwt(token);
//   if (!payload) {
//     logOut();
//     return null;
//   }

//   if (payload.exp * 1000 < Date.now()) {
//     logOut();
//     return null;
//   }

//   return token;
// }

// // Helper to parse JWT safely
// function parseJwt(token) {
//   if (!token) return null;
//   try {
//     const base64Url = token.split('.')[1];
//     if (!base64Url) return null;
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
//     return JSON.parse(atob(padded));
//   } catch (err) {
//     console.error('Failed to parse JWT:', err);
//     return null;
//   }
// }

// // Sign up a new user
// export async function signUp(userData) {
//   const response = await sendRequest(`${BASE_URL}/signup`, 'POST', userData);
//   const { token, user } = response;
//   if (!token || !user) throw new Error("Signup failed: no token or user returned");
//   saveAuthData(token, user);
//   return user;
// }

// // Log in an existing user
// export async function logIn(credentials) {
//   const response = await sendRequest(`${BASE_URL}/login`, 'POST', credentials);
//   const { token, user } = response;
//   if (!token || !user) throw new Error("Login failed: no token or user returned");
//   saveAuthData(token, user);
//   return user;
// }


// src/services/authService.js
// import sendRequest from "./sendRequest";

// const BASE_URL = "/api/users";

// export function getProfile() {
//   return sendRequest(`${BASE_URL}/me`);
// }

// export function updateProfile(data) {
//   return sendRequest(`${BASE_URL}/me`, "PUT", data);
// }

// export function getConnections() {
//   return sendRequest(`${BASE_URL}/connections`);
// }

// export function addConnection(userId) {
//   return sendRequest(`${BASE_URL}/connections/${userId}`, "POST");
// }

// export function searchUsers(query) {
//   return sendRequest(`${BASE_URL}/search?query=${query}`);
// }

// src/services/authService.js
// import sendRequest from "./sendRequest";

// const BASE_URL = "/api/users";

// // Token helpers
// export function saveAuthData(token, user) {
//   localStorage.setItem("token", token);
//   localStorage.setItem("user", JSON.stringify(user));
// }

// export function getToken() {
//   return localStorage.getItem("token");
// }

// export function removeAuthData() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
// }

// export function getUser() {
//   const user = localStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// }

// // API calls
// export function getProfile() {
//   return sendRequest(`${BASE_URL}/me`);
// }

// export function updateProfile(data) {
//   return sendRequest(`${BASE_URL}/me`, "PUT", data);
// }

// export function getConnections() {
//   return sendRequest(`${BASE_URL}/connections`);
// }

// export function addConnection(userId) {
//   return sendRequest(`${BASE_URL}/connections/${userId}`, "POST");
// }

// export function searchUsers(query) {
//   return sendRequest(`${BASE_URL}/search?query=${query}`);
// }


import sendRequest from "./sendRequest";

const BACKEND_URL = "http://localhost:3000";
// const AUTH_URL = "/api/auth";
const AUTH_URL = `${BACKEND_URL}/api/auth`;
const USER_URL = "/api/users";

// Token helpers
export function saveAuthData(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// 🔑 AUTH API calls
export async function signUp(userData) {
  return sendRequest(`${AUTH_URL}/signup`, "POST", userData);
}

export async function logIn(credentials) {
  return sendRequest(`${AUTH_URL}/login`, "POST", credentials);
}

// 👤 USER API calls
export function getProfile() {
  return sendRequest(`${USER_URL}/me`);
}

export function updateProfile(data) {
  return sendRequest(`${USER_URL}/me`, "PUT", data);
}

export function getConnections() {
  return sendRequest(`${USER_URL}/connections`);
}

export function addConnection(userId) {
  return sendRequest(`${USER_URL}/connections/${userId}`, "POST");
}

export function searchUsers(query) {
  return sendRequest(`${USER_URL}/search?query=${query}`);
}
