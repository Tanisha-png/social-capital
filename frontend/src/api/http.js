import axios from "axios";

const http = axios.create({
    baseURL: "/api", // served by backend in prod; proxied in dev
    withCredentials: true,
});

// attach token from localStorage if present
http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default http;
