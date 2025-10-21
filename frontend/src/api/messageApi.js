// import axios from "axios";
// const base = axios.create({ baseURL: "http://localhost:5000/api/messages" });

// export const saveMessage = (payload, token) =>
//     base.post("/", payload, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// export const getConversation = (userId, otherId, token) =>
//     base.get("/", {
//         params: { userId, otherId },
//         headers: { Authorization: `Bearer ${token}` }
//     }).then(r => r.data);


import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/messages",
    withCredentials: true,
});

const base = axios.create({
    // baseURL: "http://localhost:5050/api/messages",
    baseURL: "http://localhost:3000/api/messages",
});

// ✅ Helper for Authorization header
const authHeader = (token) => ({
    Authorization: `Bearer ${token}`,
});

// ✅ Get all conversations (for sidebar)
export const getConversations = async (token) => {
    const res = await base.get("/", {
        headers: authHeader(token),
    });
    return res.data;
};

// ✅ Get all messages between logged-in user and another user
export const getMessagesWithUser = async (userId, token) => {
    const res = await base.get(`/${userId}`, {
        headers: authHeader(token),
    });
    return res.data;
};

// ✅ Send a new message (field names match backend)
export const sendMessage = async (recipientId, text, token) => {
    const res = await base.post(
        "/",
        { recipient: recipientId, text },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

// ✅ Mark messages as read
export const markMessagesRead = async (senderId, token) => {
    const res = await base.post(
        "/mark-read",
        { senderId },
        { headers: authHeader(token) }
    );
    return res.data;
};
