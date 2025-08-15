import axios from "axios";
const base = axios.create({ baseURL: "http://localhost:5000/api/messages" });

export const saveMessage = (payload, token) => base.post("/", payload, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);
export const getConversation = (userId, otherId, token) =>
    base.get("/", { params: { userId, otherId }, headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);
