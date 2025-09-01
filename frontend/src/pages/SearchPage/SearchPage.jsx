
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function SearchPage() {
    const { user } = useAuth();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    async function handleSearch(e) {
        e.preventDefault();
        if (!user) return;
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setResults(data);
    }

    if (!user) return <p>Loading search...</p>;

    return (
        <div>
        <form onSubmit={handleSearch}>
            <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            />
            <button type="submit">Search</button>
        </form>
        <ul>
            {results.map((u) => (
            <li key={u._id}>{u.name}</li>
            ))}
        </ul>
        </div>
    );
}



