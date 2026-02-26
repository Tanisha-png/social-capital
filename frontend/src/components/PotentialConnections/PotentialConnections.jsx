import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/authService";
import { sendFriendRequest } from "../../api/userApi";
import Avatar from "../Avatar/Avatar";
import { getSafeAvatarUrl } from "../../utils/avatar";
import "./PotentialConnections.css";

export default function PotentialConnections() {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingId, setSendingId] = useState(null);

    useEffect(() => {
        async function fetchSuggestions() {
        try {
            const token = getToken();
            if (!token) return setLoading(false);

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
            {suggestions.map((user) => {
            const firstName = user.firstName || "Unknown";
            const lastName = user.lastName || "";
            const avatar = getSafeAvatarUrl(user.avatar, user._id);
            const occupation = user.occupation || "";
            const location = user.location || "";
            const mutual = user.mutualFriends || 0;

            return (
                <li key={user._id} className="suggestion-item">
                <Avatar
                    src={avatar}
                    alt={`${firstName} ${lastName}`}
                    className="connection-avatar"
                />

                <div className="suggestion-info">
                    <strong
                    className="cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                    >
                    {firstName} {lastName}
                    </strong>
                    {occupation && <p>{occupation}</p>}
                    {location && <p>{location}</p>}
                    {mutual > 0 && (
                    <p className="mutual">
                        {mutual} mutual connection{mutual !== 1 ? "s" : ""}
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
            );
            })}
        </ul>
        </div>
    );
}
