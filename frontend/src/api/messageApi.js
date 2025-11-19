
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
const API_BASE = (BACKEND_URL.replace(/\/$/, "") || "") + "/api/messages";

const API = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

// Attach token automatically from localStorage
API.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) { }
    return config;
});

// Get conversations list (merged friends + last messages on backend)
export const getConversations = async () => {
    const res = await API.get("/");
    return res.data;
};

// Get chat history with a specific user
export const getMessagesWithUser = async (userId) => {
    if (!userId) return [];
    const res = await API.get(`/${userId}`);
    return res.data || [];
};

// Send a message (recipientId must be a Mongo ObjectId string)
export const sendMessage = async (recipientId, text) => {
    if (!recipientId || !text) {
        throw new Error("recipientId and text are required");
    }
    const res = await API.post("/", { recipientId, text });
    return res.data;
};

// Mark messages read (optional senderId)
export const markMessagesRead = async (senderId = null) => {
    const res = await API.post("/mark-read", { senderId });
    return res.data;
};

export const getUnreadCount = async () => {
    const res = await API.get("/unread-count");
    return res.data;
};

export const getUnreadCountsByUser = async () => {
    const res = await API.get("/unread-counts");
    return res.data;
};

export default API;
