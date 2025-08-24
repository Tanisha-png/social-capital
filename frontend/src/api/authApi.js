import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api/auth" });

export const signup = (payload) => API.post("/signup", payload).then(r => r.data);
export const login = (payload) => API.post("/login", payload).then(r => r.data);
