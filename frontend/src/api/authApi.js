import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = axios.create({ baseURL: `${BACKEND_URL}/api/auth` });

export const signup = (payload) => API.post("/signup", payload).then(r => r.data);
export const login = (payload) => API.post("/login", payload).then(r => r.data);
