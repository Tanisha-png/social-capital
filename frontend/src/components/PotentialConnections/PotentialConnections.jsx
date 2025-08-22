import React, { useState } from "react";
import * as authService from "../../services/authService";
import "./PotentialConnections.css";

export default function PotentialConnections() {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");

async function handleSearch(e) {
    e.preventDefault();
    const users = await authService.searchUsers(query);
    setResults(users);
}

async function handleConnect(userId) {
    await authService.addConnection(userId);
    alert("Connection added!");
}

return (
    <div className="potential-connections">
        <h3>Find People</h3>
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search by name, occupation, education"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>

    <ul>
        {results.map((u) => (
        <li key={u._id}>
            <img src={u.profileImage || "/default-profile.png"} alt="" />
            <span>
                {u.firstName} {u.lastName}
            </span>
            <button onClick={() => handleConnect(u._id)}>Connect</button>
        </li>
        ))}
        </ul>
    </div>
    );
}
