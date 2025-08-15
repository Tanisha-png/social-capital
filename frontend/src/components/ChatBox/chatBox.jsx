import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { getConversation, saveMessage } from "../api/messageApi";

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
        // appended ACK from server for messages you sent
        setMessages((prev) => [...prev.filter((m) => m._id !== msg._id), msg]);
        });
        return () => {
        socket.off("receive_message", handler);
        socket.off("message_saved");
        };
    }, [socket, otherId]);

    const handleSend = async () => {
        if (!text || !otherId) return;
        const payload = { sender: user.id, receiver: otherId, content: text };
        // emit via socket for real-time
        socket.emit("send_message", payload);
        // optimistic update
        setMessages((prev) => [
        ...prev,
        {
            ...payload,
            createdAt: new Date().toISOString(),
            _id: Math.random().toString(36),
        },
        ]);
        setText("");
        // optionally also call REST to ensure saved (socket server already saves)
        try {
        await saveMessage(payload, token);
        } catch (e) {
        console.error(e);
        }
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: 12, width: 600 }}>
        <div style={{ height: 300, overflowY: "auto", marginBottom: 8 }}>
            {messages.map((m) => (
            <div
                key={m._id}
                style={{
                textAlign:
                    String(m.sender) === String(user.id) ? "right" : "left",
                margin: "6px 0",
                }}
            >
                <div
                style={{
                    display: "inline-block",
                    padding: 8,
                    borderRadius: 8,
                    background: "#eee",
                }}
                >
                {m.content}
                </div>
                <div style={{ fontSize: 10 }}>
                {new Date(m.createdAt).toLocaleString()}
                </div>
            </div>
            ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
            <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1 }}
            />
            <button onClick={handleSend}>Send</button>
        </div>
        </div>
    );
}
