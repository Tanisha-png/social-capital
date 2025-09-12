
import sendRequest from "./sendRequest";

const BACKEND_URL = "http://localhost:3000";
const AUTH_URL = `${BACKEND_URL}/api/auth`;
const USER_URL = `${BACKEND_URL}/api/users`; // note full URL here

// Get token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Login user
export async function login({ email, password }) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// Signup user
export async function signup(data) {
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

// Get current user's profile
export async function getProfile(token) {
  const response = await fetch(`${USER_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch profile: ${text}`);
  }

  return await response.json();
}

// Update current user's profile
export async function updateProfile(formData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${USER_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update profile");
  return data;
}

// Get connections/friends for a specific user
export async function getConnections(userId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${USER_URL}/${userId}/connections`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch connections: ${text}`);
  }

  return res.json();
}
