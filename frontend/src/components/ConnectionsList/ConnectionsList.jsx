import React, { useState, useEffect } from "react";
import * as authService from "../../services/authService";
import "./ConnectionsList.css";

export default function ConnectionsList({ userId }) {
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        async function fetchConnections() {
        if (!userId) return;
        const data = await authService.getConnections(userId);
        setConnections(data);
        }
        fetchConnections();
    }, [userId]);

    return (
        <div className="connections-list">
        <h3>Connections</h3>
        {connections.length === 0 ? (
            <p>No connections yet.</p>
        ) : (
            <ul>
            {connections.map((c) => (
                <li key={c._id}>
                <img src={c.profileImage || "/default-profile.png"} alt="" />
                <span>
                    {c.firstName} {c.lastName}
                </span>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}
