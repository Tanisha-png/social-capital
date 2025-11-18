
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

import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE = import.meta.env.VITE_API_URL || `${BACKEND_URL}/api/messages`;

// Generic helper to pass token explicitly
const createHeaders = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

// ⭐ Get conversations list
export const getConversations = async (token) => {
    const res = await axios.get(`${API_BASE}/`, createHeaders(token));
    return res.data;
};

// Get chat history with specific user
export const getMessagesWithUser = async (token, userId) => {
    const res = await axios.get(`${API_BASE}/${userId}`, createHeaders(token));
    return res.data;
};

// Send message
export const sendMessage = async (token, recipientId, text) => {
    const res = await axios.post(
        `${API_BASE}/`,
        { recipientId, text },
        createHeaders(token)
    );
    return res.data;
};

// Mark messages as read
export const markMessagesRead = async (token, senderId = null) =>
    axios.post(`${API_BASE}/mark-read`, { senderId }, createHeaders(token));

// Get unread counts by user
export const getUnreadCountsByUser = async (token) =>
    axios.get(`${API_BASE}/unread-counts`, createHeaders(token));
