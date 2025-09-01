import React, { useState, useEffect } from "react";
import * as authService from "../../services/authService";
import "./ConnectionsList.css";

export default function ConnectionsList() {
    const [connections, setConnections] = useState([]);

useEffect(() => {
    async function fetchConnections() {
        const data = await authService.getConnections();
        setConnections(data);
    }
    fetchConnections();
    }, []);

return (
    <div className="connections-list">
        <h3>My Connections</h3>
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
