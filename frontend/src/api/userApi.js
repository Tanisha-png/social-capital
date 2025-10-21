// import axios from "axios";
// const base = axios.create({ baseURL: "http://localhost:5000/api/users" });

// export const getProfile = (id, token) =>
//     base.get(`/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// export const updateProfile = (data, token) =>
//     base.put("/", data, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// export const getFriendList = (token) =>
//     base.get("/friends", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// export const searchUsers = (query, token) =>
//     base.get(`/search?q=${query}`, {
//         headers: { Authorization: `Bearer ${token}` }
//     }).then(r => r.data);

// export const sendFriendRequest = (userId, token) =>
//     base.post(
//         "/friend-request",
//         { userId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     ).then((r) => r.data);

// export const getFriendRequests = (token) =>
//     base.get("/friend-requests", {
//         headers: { Authorization: `Bearer ${token}` },
//     }).then((r) => r.data);

// export const acceptFriendRequest = (requesterId, token) =>
//     base.post(
//         "/friend-requests/accept",
//         { requesterId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     ).then((r) => r.data);

// export const declineFriendRequest = (requesterId, token) =>
//     base.post(
//         "/friend-requests/decline",
//         { requesterId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     ).then((r) => r.data);

// export const getFriends = (token) =>
//     base.get("/friends", {
//         headers: { Authorization: `Bearer ${token}` },
//     }).then((r) => r.data);

// export const removeFriend = (friendId, token) =>
//     base.post(
//         "/friends/remove",
//         { friendId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     ).then((r) => r.data);

import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
const API_BASE = "http://localhost:3000/api/users";

// ==============================
// 🔹 FRIEND & CONNECTION ACTIONS
// ==============================

// Get all connections
export async function getFriends(token) {
    const res = await axios.get(`${BASE_URL}/connections`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Get incoming friend requests
export async function getFriendRequests(token) {
    const res = await axios.get(`${BASE_URL}/connections/requests`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Send a friend request
export async function sendFriendRequest(friendId, token) {
    const res = await axios.post(
        `${BASE_URL}/connections/request`,
        { userId: friendId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

// Accept a friend request
export async function acceptFriendRequest(requestId, token) {
    const res = await axios.post(
        `${BASE_URL}/connections/accept`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

// Reject a friend request
export async function rejectFriendRequest(requestId, token) {
    const res = await axios.post(
        `${BASE_URL}/connections/reject`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

// Remove a friend
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

// Get another user's profile
export async function getUserProfile(userId, token) {
    const res = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Get your own profile
export async function getMyProfile(token) {
    const res = await axios.get(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Update your profile
export async function updateUserProfile(formData, token) {
    const res = await axios.put(`${BASE_URL}/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export const getAllUsers = async (token) => {
    try {
        const res = await axios.get(BASE_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch users:", err.response?.data || err);
        throw err;
    }
};