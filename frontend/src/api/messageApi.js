// import axios from "axios";
// const base = axios.create({ baseURL: "http://localhost:5000/api/messages" });

// export const saveMessage = (payload, token) =>
//     base.post("/", payload, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// export const getConversation = (userId, otherId, token) =>
//     base.get("/", {
//         params: { userId, otherId },
//         headers: { Authorization: `Bearer ${token}` }
//     }).then(r => r.data);


// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:3000/api/messages",
//     withCredentials: true,
// });

// const base = axios.create({
//     // baseURL: "http://localhost:5050/api/messages",
//     baseURL: "http://localhost:3000/api/messages",
// });

// // ✅ Helper for Authorization header
// const authHeader = (token) => ({
//     Authorization: `Bearer ${token}`,
// });

// // ✅ Get all conversations (for sidebar)
// export const getConversations = async (token) => {
//     const res = await base.get("/", {
//         headers: authHeader(token),
//     });
//     return res.data;
// };

// // ✅ Get all messages between logged-in user and another user
// export const getMessagesWithUser = async (userId, token) => {
//     const res = await base.get(`/${userId}`, {
//         headers: authHeader(token),
//     });
//     return res.data;
// };

// // ✅ Send a new message (field names match backend)
// export const sendMessage = async (recipientId, text, token) => {
//     const res = await base.post(
//         "/",
//         { recipient: recipientId, text },
//         { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data;
// };

// // ✅ Mark messages as read
// export const markMessagesRead = async (senderId, token) => {
//     const res = await base.post(
//         "/mark-read",
//         { senderId },
//         { headers: authHeader(token) }
//     );
//     return res.data;
// };

// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:3000/api/messages", // or import.meta.env.VITE_BACKEND_URL
//     withCredentials: true,
// });

// const authHeaders = (token) => ({
//     Authorization: `Bearer ${token}`,
// });

// // Fetch conversations
// export const getConversations = (token) =>
//     api.get("/", { headers: authHeaders(token) }).then((res) => res.data);

// // Fetch messages with a specific user
// export const getMessagesWithUser = (recipientId, token) =>
//     api.get(`/${recipientId}`, { headers: authHeaders(token) }).then((res) => res.data);

// // Send a message
// export const sendMessage = (recipientId, text, token) =>
//     api.post("/", { recipientId, text }, { headers: authHeaders(token) }).then((res) => res.data);

// // Fetch unread count
// export const getUnreadCount = (token) =>
//     api.get("/unread-count", { headers: authHeaders(token) }).then((res) => res.data.count);

// // Mark messages as read
// export const markMessagesRead = (senderId = null, token) =>
//     api.post("/mark-read", { senderId }, { headers: authHeaders(token) }).then((res) => res.data);

import axios from "axios";

const token = localStorage.getItem("token");
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/messages",
    withCredentials: true,
});

// Attach Token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// GET unread count
export const getUnreadCount = async () => {
    return API.get(`/unread-count`, config);
};

export const markMessagesRead = async (senderId = null) => {
    return API.post(`/mark-read`, { senderId }, config);
};


// Get chat history
export const getMessagesWithUser = async (userId) => {
    const res = await API.get(`/${userId}`);
    return res.data;
};

// Send message
export const sendMessage = async (recipientId, text) => {
    const res = await API.post("/", { recipientId, text });
    return res.data;
};

export const getUnreadCountsByUser = async () => {
    return API.get(`/unread-counts`, config);
};


export default API;
