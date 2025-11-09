
import React, { useState } from "react";
import { useSocket } from "../context/socketContext";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
    const { notifications, markAsRead } = useSocket();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleClick = async (notif) => {
        // ✅ Update notification as read in DB + state
        await markAsRead(notif._id);

        // ✅ Navigate based on notification type
        if (notif.type === "post_reply" || notif.type === "post_like") {
        navigate(`/posts/${notif.post}`);
        } else if (notif.type === "message") {
        navigate(`/messages/${notif.messageRef}`);
        }

        setOpen(false);
    };

    return (
        <div className="relative">
        <button onClick={() => setOpen(!open)} className="relative">
            🔔
            {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
            </span>
            )}
        </button>

        {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2">
            {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications</p>
            ) : (
                notifications.map((n) => (
                <div
                    key={n._id}
                    onClick={() => handleClick(n)}
                    className={`p-2 cursor-pointer rounded ${
                    n.read ? "bg-gray-100" : "bg-blue-100"
                    }`}
                >
                    {n.message}
                </div>
                ))
            )}
            </div>
        )}
        </div>
    );
}