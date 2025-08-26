import { useState } from "react";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setResults(data);
    };

    return (
        <div>
        <h2>Search Users</h2>
        <form onSubmit={handleSearch}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="submit">Search</button>
        </form>
        <ul>
            {results.map((u) => (
            <li key={u._id}>
                {u.name} ({u.email})
            </li>
            ))}
        </ul>
        </div>
    );
}
