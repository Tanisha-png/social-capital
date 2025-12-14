// import axios from "axios";
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// const base = axios.create({ baseURL: `${BACKEND_URL}/api/connections` });

// // export const sendRequest = (id, token) =>
// //     base.post(`/${id}/send-request`, {}, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// // export const respondToRequest = (id, action, token) =>
// //     base.post(`/${id}/respond`, { action }, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// // export const getConnections = (token) =>
// //     base.get("/", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);


// // ✅ Send friend request
// export const sendRequest = (friendId, token) =>
//     base.post(
//         "/request",
//         { userId: friendId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     ).then(r => r.data);

// // ✅ Accept friend request
// export const acceptRequest = (requestId, token) =>
//     base.post(
//         "/accept",
//         { requestId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     ).then(r => r.data);

// // ✅ Reject friend request
// export const rejectRequest = (requestId, token) =>
//     base.post(
//         "/reject",
//         { requestId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     ).then(r => r.data);

// // ✅ Get connections
// export const getConnections = (token) =>
//     base.get("/", {
//         headers: { Authorization: `Bearer ${token}` },
//     }).then(r => r.data);

import axios from "axios";

// Use relative URL so browser sees requests as same-origin
const API = axios.create({
    baseURL: "/api/connections",
});

// Automatically attach token
API.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) { }
    return config;
});

// -------------------- CONNECTIONS / FRIEND REQUESTS --------------------

// Send a friend request
export const sendRequest = async (friendId) =>
    (await API.post("/request", { userId: friendId })).data;

// Accept a friend request
export const acceptRequest = async (requestId) =>
    (await API.post("/accept", { requestId })).data;

// Reject a friend request
export const rejectRequest = async (requestId) =>
    (await API.post("/reject", { requestId })).data;

// Get all connections
export const getConnections = async () => (await API.get("/")).data;

export default API;
