// import React, { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { useSocket } from "../contexts/SocketContext";
// import { getConversation, saveMessage } from "../api/messageApi";
// import "../styles/chatBox.css"; // make sure this path matches your setup

// export default function ChatBox({ otherId }) {
//     const { user, token } = useAuth();
//     const { socket } = useSocket();
//     const [messages, setMessages] = useState([]);
//     const [text, setText] = useState("");

//     useEffect(() => {
//         if (!otherId) return;
//         (async () => {
//         const conv = await getConversation(user.id, otherId, token);
//         setMessages(conv);
//         })();
//     }, [otherId, user, token]);

//     useEffect(() => {
//         if (!socket) return;
//         const handler = (msg) => {
//         if (
//             String(msg.sender) === String(otherId) ||
//             String(msg.receiver) === String(otherId)
//         ) {
//             setMessages((prev) => [...prev, msg]);
//         }
//         };
//         socket.on("receive_message", handler);
//         socket.on("message_saved", (msg) => {
//         setMessages((prev) => [...prev.filter((m) => m._id !== msg._id), msg]);
//         });
//         return () => {
//         socket.off("receive_message", handler);
//         socket.off("message_saved");
//         };
//     }, [socket, otherId]);

//     const handleSend = async () => {
//         if (!text.trim() || !otherId) return;

//         const payload = { senderId: user.id, receiverId: otherId, content: text };

//         // Send via socket only; do NOT add locally
//         socket.emit("send_message", payload);

//         // Clear input
//         setText("");

//         // Save to server for persistence (optional fallback)
//         try {
//             const token = localStorage.getItem("token");
//             await saveMessage(payload, token);
//         } catch (e) {
//             console.error("Failed to save message via API:", e);
//         }
//     };



//     return (
//         <div className="chat-section">
//         <div className="chat-messages">
//             {messages.length === 0 ? (
//             <div className="no-messages">No messages yet</div>
//             ) : (
//             messages.map((m) => (
//                 <div
//                 key={m._id}
//                 className={`message-bubble ${
//                     String(m.sender) === String(user.id) ? "sent" : "received"
//                 }`}
//                 >
//                 {m.content}
//                 <span className="timestamp">
//                     {new Date(m.createdAt).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     })}
//                 </span>
//                 </div>
//             ))
//             )}
//         </div>

//         <div className="chat-input">
//             <input
//             type="text"
//             placeholder="Write a message..."
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button onClick={handleSend}>Send</button>
//         </div>
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMessages } from "../contexts/MessageContext";
import { getConversation } from "../api/messageApi";
import "../styles/chatBox.css";

export default function ChatBox({ otherId }) {
    const { user, token } = useAuth();
    const { messages: globalMessages, sendMessage } = useMessages();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const userId = user._id || user.id;

    useEffect(() => {
        if (!otherId) return;

        (async () => {
        const conv = await getConversation(userId, otherId, token);
        setMessages(conv);
        })();
    }, [otherId, userId, token]);

    // Sync with global MessageContext messages
    useEffect(() => {
        setMessages(
        globalMessages.filter(
            (m) =>
            String(m.sender?._id || m.senderId) === String(otherId) ||
            String(m.receiver?._id || m.receiverId) === String(otherId)
        )
        );
    }, [globalMessages, otherId]);

    const handleSend = async () => {
        if (!text.trim()) return;

        await sendMessage(otherId, text.trim());
        setText("");
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
                className={
                    String(m.sender?._id || m.senderId) === String(userId)
                    ? "message-bubble sent"
                    : "message-bubble received"
                }
                >
                {m.text || m.content}
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
