import React, { useState, useEffect } from "react";
import * as authService from "../../services/authService";
import "./PotentialConnections.css";

export default function PotentialConnections({ userId, currentUserId }) {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState([]);
  const [connectedIds, setConnectedIds] = useState([]);

  useEffect(() => {
    async function fetchPotential() {
      if (!userId) return;
      const users = await authService.getPotentialConnections(userId);
      setResults(users);

      // Keep track of connected IDs to disable buttons
      const connections = await authService.getConnections(currentUserId);
      setConnectedIds(connections.map((c) => c._id));
    }
    fetchPotential();
  }, [userId, currentUserId]);

  async function handleConnect(uId) {
    await authService.addConnection(uId);
    alert("Connection added!");
    setConnectedIds((prev) => [...prev, uId]);
  }

  return (
    <div className="potential-connections">
      <h3>People You May Know</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const users = await authService.searchUsers(query, userId);
          setResults(users);
        }}
      >
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
            {/* <img src={u.profileImage || "/default-profile.png"} alt="" /> */}
            <img
              src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
              alt=""
            />
            <span>
              {u.firstName} {u.lastName}
            </span>
            {u._id !== currentUserId && !connectedIds.includes(u._id) && (
              <button onClick={() => handleConnect(u._id)}>Connect</button>
            )}
            {(u._id === currentUserId || connectedIds.includes(u._id)) && (
              <span>Connected</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
