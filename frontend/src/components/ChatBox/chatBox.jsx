import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { getConversation, saveMessage } from "../api/messageApi";
import "../styles/chatBox.css"; // make sure this path matches your setup

export default function ChatBox({ otherId }) {
    const { user, token } = useAuth();
    const { socket } = useSocket();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        if (!otherId) return;
        (async () => {
        const conv = await getConversation(user.id, otherId, token);
        setMessages(conv);
        })();
    }, [otherId, user, token]);

    useEffect(() => {
        if (!socket) return;
        const handler = (msg) => {
        if (
            String(msg.sender) === String(otherId) ||
            String(msg.receiver) === String(otherId)
        ) {
            setMessages((prev) => [...prev, msg]);
        }
        };
        socket.on("receive_message", handler);
        socket.on("message_saved", (msg) => {
        setMessages((prev) => [...prev.filter((m) => m._id !== msg._id), msg]);
        });
        return () => {
        socket.off("receive_message", handler);
        socket.off("message_saved");
        };
    }, [socket, otherId]);

    const handleSend = async () => {
        if (!text.trim() || !otherId) return;
        const payload = { sender: user.id, receiver: otherId, content: text };
        socket.emit("send_message", payload);
        setMessages((prev) => [
        ...prev,
        {
            ...payload,
            createdAt: new Date().toISOString(),
            _id: Math.random().toString(36),
        },
        ]);
        setText("");
        try {
        await saveMessage(payload, token);
        } catch (e) {
        console.error(e);
        }
    };

    return (
        <div className="chat-section">
        <div className="chat-messages">
            {messages.length === 0 ? (
            <div className="no-messages">No messages yet</div>
            ) : (
            messages.map((m) => (
                <div
                key={m._id}
                className={`message-bubble ${
                    String(m.sender) === String(user.id) ? "sent" : "received"
                }`}
                >
                {m.content}
                <span className="timestamp">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    })}
                </span>
                </div>
            ))
            )}
        </div>

        <div className="chat-input">
            <input
            type="text"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
        </div>
        </div>
    );
}
