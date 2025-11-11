// src/api/axios.js
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true
});

// 🔥 Attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
