
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
// const USERS_URL = `${BASE_URL}/users`;

// // ==============================
// // 🔹 FRIEND & CONNECTION ACTIONS
// // ==============================
// export async function getFriends(token) {
//     const res = await axios.get(`${BASE_URL}/connections`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
// }

// export async function getFriendRequests(token) {
//     const res = await axios.get(`${BASE_URL}/connections/requests`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
// }

// export async function sendFriendRequest(friendId, token) {
//     const res = await axios.post(
//         `${BASE_URL}/connections/request`,
//         { userId: friendId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data;
// }

// export async function acceptFriendRequest(requestId, token) {
//     const res = await axios.post(
//         `${BASE_URL}/connections/accept`,
//         { requestId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data;
// }

// export async function rejectFriendRequest(requestId, token) {
//     const res = await axios.post(
//         `${BASE_URL}/connections/reject`,
//         { requestId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data;
// }

// export async function removeFriend(friendId, token) {
//     const res = await axios.delete(`${BASE_URL}/connections/remove`, {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { userId: friendId },
//     });
//     return res.data;
// }

// // ==============================
// // 🔹 USER PROFILE ACTIONS
// // ==============================
// export async function getUserProfile(userId, token) {
//     const res = await axios.get(`${USERS_URL}/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
// }

// export async function getMyProfile(token) {
//     const res = await axios.get(`${USERS_URL}/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
// }

// export async function updateUserProfile(formData, token) {
//     const res = await axios.put(`${USERS_URL}/me`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
// }

// // ✅ Get all users
// export const getAllUsers = async (token) => {
//     try {
//         const res = await axios.get(`${USERS_URL}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         return res.data;
//     } catch (err) {
//         console.error("Failed to fetch users:", err.response?.data || err);
//         throw err;
//     }
// };

// import axios from "axios";

// // Use relative /api path if env variable not set
// const BASE_URL = import.meta.env.VITE_BACKEND_URL
//     ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "") + "/api"
//     : "/api";
// const USERS_URL = `${BASE_URL}/users`;

// // ==============================
// // 🔹 FRIEND & CONNECTION ACTIONS
// // ==============================
// // export async function getFriends(token) {
// //     const res = await axios.get(`${BASE_URL}/connections`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //     });
// //     return res.data;
// // }

// export const getFriends = async (token) => {
//     if (!token) throw new Error("Auth token required for getFriends");
//     try {
//         const res = await axios.get(`${BASE_URL}/connections`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         return res.data;
//     } catch (err) {
//         console.error("Failed to fetch friends:", err.response?.data || err.message);
//         throw err;
//     }
// };

// export async function getFriendRequests(token) {
//     const res = await axios.get(`${BASE_URL}/connections/requests`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
// }

// export async function sendFriendRequest(friendId, token) {
//     if (!friendId) throw new Error("Friend ID is required");
//     if (!token) throw new Error("Auth token is required");

//     // Force /api prefix
//     const url = `${BASE_URL.replace(/\/$/, "")}/connections/request`;
//     console.log("Sending friend request to:", url); // should now log /api/connections/request

//     try {
//         const res = await axios.post(
//             url,
//             { userId: friendId },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         return res.data;
//     } catch (err) {
//         console.error(
//             "Failed to send friend request:",
//             err.response?.data || err.message
//         );
//         throw err;
//     }
// }


// export async function acceptFriendRequest(requestId, token) {
//     const res = await axios.post(
//         `${BASE_URL}/connections/accept`,
//         { requestId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data;
// }

// export async function rejectFriendRequest(requestId, token) {
//     const res = await axios.post(
//         `${BASE_URL}/connections/reject`,
//         { requestId },
//         { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data;
// }

// export async function removeFriend(friendId, token) {
//     const res = await axios.delete(`${BASE_URL}/connections/remove`, {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { userId: friendId },
//     });
//     return res.data;
// }

// // ==============================
// // 🔹 USER PROFILE ACTIONS
// // ==============================
// export async function getUserProfile(userId, token) {
//     const res = await axios.get(`${USERS_URL}/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
// }

// export async function getMyProfile(token) {
//     const res = await axios.get(`${USERS_URL}/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
// }

// export async function updateUserProfile(formData, token) {
//     const res = await axios.put(`${USERS_URL}/me`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
// }

// // ✅ Get all users
// export const getAllUsers = async (token) => {
//     try {
//         const res = await axios.get(`${USERS_URL}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         return res.data;
//     } catch (err) {
//         console.error("Failed to fetch users:", err.response?.data || err);
//         throw err;
//     }
// };

// src/api/userApi.js
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
const API_BASE = (BACKEND_URL.replace(/\/$/, "") || "") + "/api";

// Create instance that attaches token automatically
const API = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
        // ignore localStorage errors in some browsers
    }
    return config;
});

/**
 * Get friends/connections for the logged-in user.
 * Tries the /connections endpoint first (if you have connectionRoutes),
 * falls back to /users/me/connections if available (userRoutes).
 */
export const getFriends = async () => {
    try {
        // Primary: /api/connections (connectionRoutes.js)
        const res = await API.get("/connections");
        return res.data || [];
    } catch (err) {
        // Fallback: /api/users/me/connections (userRoutes.js)
        try {
            const res2 = await API.get("/users/me/connections");
            return res2.data || [];
        } catch (err2) {
            console.error("getFriends failed:", err?.response?.data || err.message);
            throw new Error("Auth token required for getFriends");
        }
    }
};

// Get a public list of users (used for search / messaging)
export const getAllUsers = async () => {
    const res = await API.get("/users");
    return res.data || [];
};

// Get a single user by id
export const getUserById = async (id) => {
    const res = await API.get(`/users/${id}`);
    return res.data;
};

// ----- Friend Request API -----

export const getFriendRequests = async () => {
    const res = await API.get("/users/me/requests");
    return res.data || [];
};

export const sendFriendRequest = async (userId) => {
    const res = await API.post(`/users/${userId}/request`);
    return res.data;
};

export const acceptFriendRequest = async (userId) => {
    const res = await API.post(`/users/${userId}/accept`);
    return res.data;
};

export const declineFriendRequest = async (userId) => {
    const res = await API.post(`/users/${userId}/decline`);
    return res.data;
};


export default API;
