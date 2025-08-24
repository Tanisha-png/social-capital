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
