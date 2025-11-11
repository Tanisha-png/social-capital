
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || `${BACKEND_URL}/api/messages`,
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
