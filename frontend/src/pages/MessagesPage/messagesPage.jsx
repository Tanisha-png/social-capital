
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";


export default function MessagesPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!user) return;
        async function fetchMessages() {
            const token = localStorage.getItem("token");
            try {
            const res = await fetch("/api/messages", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            // ✅ Make sure messages is always an array
            setMessages(Array.isArray(data) ? data : data.messages || []);
            } catch (err) {
            console.error("Failed to fetch messages:", err);
            setMessages([]); // fallback to empty array
            }
        }

        fetchMessages();
    }, [user]);

    if (!user) return <p>Loading messages...</p>;

    return (
        <div>
            <h2>Messages</h2>
            {messages.length === 0 ? (
            <p>No messages yet</p>
            ) : (
            messages.map((msg) => (
                <div key={msg._id}>
                <strong>{msg.senderName}:</strong> {msg.text}
                </div>
            ))
            )}
        </div>
    );
}


