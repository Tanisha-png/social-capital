import React from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function FriendRequestList({ requests = [] }) {
    const { token } = useAuth();

    const respond = async (fromId, action) => {
        try {
        await axios.post(
            `http://localhost:5000/api/connections/${fromId}/respond`,
            { action },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Done");
        window.location.reload();
        } catch (e) {
        alert(e.response?.data?.message || e.message);
        }
    };

    const pending = requests.filter((r) => r.status === "pending");

    return (
        <div>
        {pending.length === 0 && <div>No pending requests</div>}
        {pending.map((r) => (
            <div
            key={r.from}
            style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 8,
            }}
            >
            <div>{r.from}</div>
            <button onClick={() => respond(r.from, "accept")}>Accept</button>
            <button onClick={() => respond(r.from, "decline")}>Decline</button>
            </div>
        ))}
        </div>
    );
}
