// frontend/services/authService.js
const BACKEND_URL = "http://localhost:3000";
const AUTH_URL = `${BACKEND_URL}/api/auth`;
const USER_URL = `${BACKEND_URL}/api/users`;

export function getToken() {
  return localStorage.getItem("token");
}

export async function login(credentials) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Login failed");
  }
  return res.json();
}

export async function signup(formData) {
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: "POST",
    body: formData, // FormData includes file
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Signup failed");
  }
  return res.json();
}

export async function updateProfile(formData, token) {
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${USER_URL}/me`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Update profile failed");
  }
  return res.json();
}

export async function getProfile(token) {
  const res = await fetch(`${USER_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
