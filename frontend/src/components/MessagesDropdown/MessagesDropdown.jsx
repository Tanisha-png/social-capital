
// src/components/MessagesDropdown/MessagesDropdown.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/socketContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export default function MessagesDropdown() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  // Fetch messages when user logs in
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok)
          throw new Error(`Failed to fetch messages (${res.status})`);
        const data = await res.json();

        setMessages(data.messages || data || []);
        setUnreadCount(data.unreadCount ?? 0);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [user]);

  // Listen for live incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      setMessages((prev) => [msg, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) setUnreadCount(0); // mark messages as read when opened
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none"
      >
        📩
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="dropdown-menu w-72 bg-white shadow-md rounded-md">
          <div className="max-h-80 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm text-center">
                No messages
              </p>
            ) : (
              messages.slice(0, 5).map((msg) => (
                <div
                  key={msg._id || msg.id}
                  className={`dropdown-item ${
                    msg.read ? "bg-white" : "bg-blue-50"
                  } p-2 border-b last:border-b-0 cursor-pointer`}
                  onClick={() => navigate("/messages")}
                >
                  <p
                    className={`text-sm ${
                      msg.read
                        ? "font-normal text-gray-700"
                        : "font-semibold text-black"
                    }`}
                  >
                    <strong>
                      {msg.sender?.firstName
                        ? `${msg.sender.firstName} ${msg.sender.lastName}`
                        : "Someone"}
                      :
                    </strong>{" "}
                    {msg.text || msg.content || "Sent a message"}
                  </p>
                  <span className="text-xs text-gray-400">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : "Just now"}
                  </span>
                </div>
              ))
            )}
          </div>
          <div
            className="p-2 text-blue-600 text-sm text-center cursor-pointer hover:underline"
            onClick={() => navigate("/messages")}
          >
            View all messages
          </div>
        </div>
      )}
    </div>
  );
}
