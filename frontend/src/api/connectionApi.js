import axios from "axios";
const base = axios.create({ baseURL: "http://localhost:5000/api/connections" });

export const sendRequest = (id, token) =>
    base.post(`/${id}/send-request`, {}, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const respondToRequest = (id, action, token) =>
    base.post(`/${id}/respond`, { action }, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const getConnections = (token) =>
    base.get("/", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);
