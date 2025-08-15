import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api/auth" });

export const register = (payload) => API.post("/register", payload).then(r => r.data);
export const login = (payload) => API.post("/login", payload).then(r => r.data);
