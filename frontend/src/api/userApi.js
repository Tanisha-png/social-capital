import axios from "axios";
const base = axios.create({ baseURL: "http://localhost:5000/api/users" });

export const getProfile = (id, token) =>
    base.get(`/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const updateProfile = (data, token) =>
    base.put("/", data, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// export const getFriendList = async (token) => {
//     const { data } = await axios.get('/api/users/friends', {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     return data;
// };

export const getFriendList = (token) =>
    base.get("/friends", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const searchUsers = (query, token) =>
    base.get(`/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.data);

export const sendFriendRequest = (userId, token) =>
    base.post(
        "/friend-request",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then((r) => r.data);

export const getFriendRequests = (token) =>
    base.get("/friend-requests", {
        headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.data);

export const acceptFriendRequest = (requesterId, token) =>
    base.post(
        "/friend-requests/accept",
        { requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then((r) => r.data);

export const declineFriendRequest = (requesterId, token) =>
    base.post(
        "/friend-requests/decline",
        { requesterId },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then((r) => r.data);

export const getFriends = (token) =>
    base.get("/friends", {
        headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.data);

export const removeFriend = (friendId, token) =>
    base.post(
        "/friends/remove",
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
    ).then((r) => r.data);
