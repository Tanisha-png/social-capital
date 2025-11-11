import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const base = axios.create({ baseURL: `${BACKEND_URL}/api/connections` });

export const sendRequest = (id, token) =>
    base.post(`/${id}/send-request`, {}, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const respondToRequest = (id, action, token) =>
    base.post(`/${id}/respond`, { action }, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const getConnections = (token) =>
    base.get("/", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);
