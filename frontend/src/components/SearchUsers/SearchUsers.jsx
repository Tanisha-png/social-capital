import React, { useState } from "react";
import { searchUsers, sendFriendRequest } from "../../api/userApi";

const SearchUsers = ({ token, onSelectUser }) => {
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
            Search
            </button>
        </form>

        {loading && <p className="text-gray-500">Searching...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="divide-y divide-gray-200">
            {results.map((user) => (
            <li
                key={user._id}
                className="p-3 flex justify-between items-center hover:bg-gray-50"
            >
                <div
                onClick={() => onSelectUser && onSelectUser(user)}
                className="cursor-pointer"
                >
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                <div>
                {requestStatus[user._id] === "sent" ? (
                    <span className="text-green-600 text-sm">Request Sent</span>
                ) : (
                    <button
                    onClick={() => handleSendRequest(user._id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                    Add Friend
                    </button>
                )}
                {requestStatus[user._id] === "error" && (
                    <span className="text-red-500 text-sm">Error</span>
                )}
                </div>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default SearchUsers;
