import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import
import { getToken } from "../../services/authService";
import { sendFriendRequest } from "../../api/userApi";
import Avatar from "../Avatar/Avatar";
import { getSafeAvatarUrl } from "../../utils/avatar";
import "./PotentialConnections.css";

export default function PotentialConnections() {
    const navigate = useNavigate(); // ✅ useNavigate hook
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingId, setSendingId] = useState(null);

    useEffect(() => {
        async function fetchSuggestions() {
        try {
            const token = getToken();
            if (!token) {
            setLoading(false);
            return;
            }

            const res = await fetch("/api/connections/suggestions", {
            headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) setSuggestions(data);
            else console.error("Suggestion fetch failed:", data);
        } catch (err) {
            console.error("Suggestion fetch error:", err);
        } finally {
            setLoading(false);
        }
        }

        fetchSuggestions();
    }, []);

    async function handleConnect(userId) {
        try {
        setSendingId(userId);
        await sendFriendRequest(userId, getToken());
        setSuggestions((prev) => prev.filter((user) => user._id !== userId));
        } catch (err) {
        console.error("Connection request failed:", err);
        } finally {
        setSendingId(null);
        }
    }

    if (loading) return <p>Loading suggestions...</p>;
    if (suggestions.length === 0) return <p>No suggestions available yet.</p>;

    return (
        <div className="potential-connections">
        <ul>
            {suggestions.map((user) => (
            <li key={user._id} className="suggestion-item">
                <Avatar
                src={getSafeAvatarUrl(user.avatar, user._id)}
                alt={`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                className="connection-avatar"
                />
                <div className="suggestion-info">
                <strong
                    className="cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)} // ✅ react-router
                >
                    {user.firstName || "Unknown"} {user.lastName || ""}
                </strong>
                {user.occupation && <p>{user.occupation}</p>}
                {user.location && <p>{user.location}</p>}
                {user.mutualFriends > 0 && (
                    <p className="mutual">
                    {user.mutualFriends} mutual connection
                    {user.mutualFriends !== 1 ? "s" : ""}
                    </p>
                )}
                </div>

                <button
                onClick={() => handleConnect(user._id)}
                disabled={sendingId === user._id}
                className="connect-btn"
                >
                {sendingId === user._id ? "Sending..." : "Connect"}
                </button>
            </li>
            ))}
        </ul>
        </div>
    );
}
