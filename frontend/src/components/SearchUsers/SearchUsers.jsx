import React, { useState } from "react";
import { searchUsers } from "../../api/userApi";

const SearchUsers = ({ token, onSelectUser }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
                className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between"
                onClick={() => onSelectUser && onSelectUser(user)}
            >
                <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                </div>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default SearchUsers;
