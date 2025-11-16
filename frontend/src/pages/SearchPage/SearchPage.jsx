
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import { getSafeAvatarUrl } from "../../utils/avatar";

export default function SearchPage() {
    const { user } = useAuth();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debounceRef = useRef(null);

    const highlightMatch = (text) => {
        if (!query) return text;

        // Split search into words, escape regex special chars
        const words = query.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) return text;

        const regex = new RegExp(
        `(${words
            .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|")})`,
        "gi"
        );
        const parts = text.split(regex);

        return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} style={{ backgroundColor: "#fffb91" }}>
            {part}
            </mark>
        ) : (
            part
        )
        );
    };

    const fetchResults = async (searchQuery) => {
        if (!user || !searchQuery.trim()) {
        setResults([]);
        return;
        }

        const token = localStorage.getItem("token");
        setLoading(true);
        setError("");
        try {
        const res = await fetch(
            `/api/users/search?q=${encodeURIComponent(searchQuery)}`,
            {
            headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        } catch (err) {
        console.error("Search failed:", err);
        setError("Failed to fetch users.");
        setResults([]);
        } finally {
        setLoading(false);
        }
    };

    // Live search with debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
        fetchResults(query);
        }, 400); // wait 400ms after user stops typing

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    if (!user) return <p>Loading search...</p>;

    return (
        <div className="search-page p-4">
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full max-w-md p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {loading && <p className="text-gray-500">Searching users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="divide-y divide-gray-200 max-w-md">
            {!loading && results.length === 0 && query && (
            <li className="py-2 text-gray-500">No users found.</li>
            )}

            {results.map((u) =>
            u?._id ? (
                <li key={u._id} className="py-2 hover:bg-gray-50 rounded-lg">
                <Link
                    to={`/profile/${u._id}`}
                    style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                    }}
                >
                    <Avatar
                    src={getSafeAvatarUrl(u.avatar, u._id)} // ✅ Fix broken image
                    alt={`${u.firstName || ""} ${u.lastName || ""}`}
                    className="result-avatar"
                    style={{ width: "40px", height: "40px", marginRight: "12px" }}
                    />
                    <div>
                    <p className="font-semibold text-gray-900">
                        {highlightMatch(
                        u.firstName || u.lastName
                            ? `${u.firstName ?? ""} ${u.lastName ?? ""}`
                            : u.name || "Unknown User"
                        )}
                    </p>
                    {u.occupation && (
                        <p className="text-sm text-gray-600">
                        {highlightMatch(u.occupation)}
                        </p>
                    )}
                    {u.location && (
                        <p className="text-sm text-gray-500">
                        {highlightMatch(u.location)}
                        </p>
                    )}
                    </div>
                </Link>
                </li>
            ) : null
            )}
        </ul>
        </div>
    );
}
