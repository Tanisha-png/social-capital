
import React, { useState } from "react";
import { searchUsers, sendFriendRequest } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const SearchUsers = ({ token, onSelectUser }) => {
    const { user: authUser } = useAuth();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [requestStatus, setRequestStatus] = useState({}); // track per-user

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        try {
        const users = await searchUsers(query, token);
        setResults(users);
        } catch (err) {
        setError("Failed to fetch users.");
        } finally {
        setLoading(false);
        }
    };

    const handleSendRequest = async (userId) => {
        try {
        await sendFriendRequest(userId, token);
        setRequestStatus((prev) => ({ ...prev, [userId]: "sent" }));
        } catch (err) {
        setRequestStatus((prev) => ({ ...prev, [userId]: "error" }));
        }
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow-md">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
            Search
            </button>
        </form>

        {loading && <p className="text-gray-500">Searching...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="divide-y divide-gray-200">
            {results.map((userItem) => (
            <li
                key={userItem._id}
                className="p-3 flex justify-between items-center hover:bg-gray-50"
            >
                <div
                onClick={() => onSelectUser && onSelectUser(userItem)}
                className="cursor-pointer"
                >
                <p className="font-semibold">{userItem.name}</p>
                <p className="text-sm text-gray-600">{userItem.email}</p>
                </div>

                <div className="flex items-center gap-2">
                {userItem._id === authUser?._id ? (
                    <span className="text-gray-500 text-sm">This is you</span>
                ) : requestStatus[userItem._id] === "sent" ? (
                    <span className="text-green-600 text-sm font-medium">
                    ✅ Request Sent
                    </span>
                ) : requestStatus[userItem._id] === "error" ? (
                    <span className="text-red-500 text-sm">❌ Error</span>
                ) : (
                    <button
                    onClick={() => handleSendRequest(userItem._id)}
                    className="px-4 py-1.5 text-sm font-medium border border-gray-300 
                                                text-gray-700 rounded-full hover:bg-blue-50 
                                                hover:border-blue-500 hover:text-blue-600 
                                                transition-all duration-200"
                    >
                    ➕ Add Connection
                    </button>
                )}
                </div>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default SearchUsers;
