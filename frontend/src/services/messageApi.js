import axios from "axios";

const api = axios.create({
    // baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/messages`,
    baseURL: "http://localhost:3000/api/messages",
    withCredentials: true,
});

const authHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
});

export const getConversations = (token) =>
    api.get("/", { headers: authHeaders(token) }).then((res) => res.data);

export const getMessagesWithUser = (recipientId, token) =>
    api.get(`/${recipientId}`, { headers: authHeaders(token) }).then((res) => res.data);

export const sendMessage = (recipientId, content, token) =>
    api.post("/", { recipientId, content }, { headers: authHeaders(token) }).then((res) => res.data);
