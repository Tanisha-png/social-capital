
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
const USERS_URL = `${BASE_URL}/users`;

// ==============================
// 🔹 FRIEND & CONNECTION ACTIONS
// ==============================
export async function getFriends(token) {
    const res = await axios.get(`${BASE_URL}/connections`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function getFriendRequests(token) {
    const res = await axios.get(`${BASE_URL}/connections/requests`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function sendFriendRequest(friendId, token) {
    const res = await axios.post(
        `${BASE_URL}/connections/request`,
        { userId: friendId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function acceptFriendRequest(requestId, token) {
    const res = await axios.post(
        `${BASE_URL}/connections/accept`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function rejectFriendRequest(requestId, token) {
    const res = await axios.post(
        `${BASE_URL}/connections/reject`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function removeFriend(friendId, token) {
    const res = await axios.delete(`${BASE_URL}/connections/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: friendId },
    });
    return res.data;
}

// ==============================
// 🔹 USER PROFILE ACTIONS
// ==============================
export async function getUserProfile(userId, token) {
    const res = await axios.get(`${USERS_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function getMyProfile(token) {
    const res = await axios.get(`${USERS_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function updateUserProfile(formData, token) {
    const res = await axios.put(`${USERS_URL}/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// ✅ Get all users
export const getAllUsers = async (token) => {
    try {
        const res = await axios.get(`${USERS_URL}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch users:", err.response?.data || err);
        throw err;
    }
};
