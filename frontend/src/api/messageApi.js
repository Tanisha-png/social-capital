
// import axios from "axios";
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// const token = localStorage.getItem("token");
// const config = {
//     headers: {
//         Authorization: `Bearer ${token}`,
//     },
// };

// const API = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || `${BACKEND_URL}/api/messages`,
//     withCredentials: true,
// });

// // Attach Token
// API.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });

// // GET unread count
// export const getUnreadCount = async () => {
//     return API.get(`/unread-count`, config);
// };

// export const markMessagesRead = async (senderId = null) => {
//     return API.post(`/mark-read`, { senderId }, config);
// };


// // Get chat history
// export const getMessagesWithUser = async (userId) => {
//     const res = await API.get(`/${userId}`);
//     return res.data;
// };

// // Send message
// export const sendMessage = async (recipientId, text) => {
//     const res = await API.post("/", { recipientId, text });
//     return res.data;
// };

// export const getUnreadCountsByUser = async () => {
//     return API.get(`/unread-counts`, config);
// };


// export default API;

// import axios from "axios";

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// const API = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || `${BACKEND_URL}/api/messages`,
//     withCredentials: true,
// });

// // Automatically attach token from localStorage
// API.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });

// // Get all conversations
// export const getConversations = async () => {
//     const res = await API.get("/");
//     return res.data;
// };

// // Get unread total count
// export const getUnreadCount = async () => API.get("/unread-count");

// // Mark messages as read
// export const markMessagesRead = async (senderId = null) =>
//     API.post("/mark-read", { senderId });

// // Get chat history with specific user
// export const getMessagesWithUser = async (userId) => {
//     const res = await API.get(`/${userId}`);
//     return res.data;
// };

// // Send a message
// export const sendMessage = async (recipientId, text) => {
//     const res = await API.post("/", { recipientId, text });
//     return res.data;
// };

// // Unread counts grouped by each user
// export const getUnreadCountsByUser = async () => API.get("/unread-counts");

// export default API;

// src/api/messageApi.js
import axios from "axios";

const API_BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "") + "/api/messages";

const API = axios.create({ baseURL: API_BASE, withCredentials: true });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getConversations = async () => (await API.get("/")).data;
export const getMessagesWithUser = async (userId) => (await API.get(`/${userId}`)).data || [];
export const sendMessage = async (recipientId, text) => (await API.post("/", { recipientId, text })).data;
export const markMessagesRead = async (senderId = null) => (await API.post("/mark-read", { senderId })).data;
export const getUnreadCount = async () => (await API.get("/unread-count")).data;
export const getUnreadCountsByUser = async () => (await API.get("/unread-counts")).data;

export default API;
