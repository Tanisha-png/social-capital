import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { getConversation, saveMessage } from "../api/messageApi";
import ChatBox from "../components/ChatBox";
import ContactList from "../components/ContactList";

export default function MessagesPage() {
    const { user, token } = useAuth();
    const { socket } = useSocket();
    const [conversations, setConversations] = useState([]); // simple: list of userIds
    const [activeUser, setActiveUser] = useState(null);

    useEffect(() => {
        if (!socket) return;
        socket.on("receive_message", (msg) => {
        console.log("incoming msg", msg);
        // basic handling: if chat with active user, append; else notify
        });
        return () => {
        socket.off("receive_message");
        };
    }, [socket, activeUser]);

    // For this starter, we'll allow manual entering of other user's id
    return (
        <div style={{ padding: 20 }}>
        <h2>Messages</h2>
        <div>
            <label>Chat with userId: </label>
            <input onChange={(e) => setActiveUser(e.target.value)} />
        </div>
        <ChatBox otherId={activeUser} />
        </div>
    );
}

export default function MessagesPage() {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div style={{ display: 'flex', height: '100%' }}>
        <ContactList onSelectUser={setSelectedUser} />
        {selectedUser ? (
            <ChatBox recipient={selectedUser} />
        ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Select a contact to start chatting</p>
            </div>
        )}
        </div>
    );
}
