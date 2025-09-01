// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";

// export default function SearchPage() {
//     const [query, setQuery] = useState("");
//     const [results, setResults] = useState([]);

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         const res = await fetch(`/api/users/search?q=${query}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         const data = await res.json();
//         setResults(data);
//     };

//     return (
//         <div>
//         <h2>Search Users</h2>
//         <form onSubmit={handleSearch}>
//             <input value={query} onChange={(e) => setQuery(e.target.value)} />
//             <button type="submit">Search</button>
//         </form>
//         <ul>
//             {results.map((u) => (
//             <li key={u._id}>
//                 {u.name} ({u.email})
//             </li>
//             ))}
//         </ul>
//         </div>
//     );
// }

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



