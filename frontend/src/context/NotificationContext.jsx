// context/NotificationContext.jsx
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "./socketContext";

export default function NotificationsDropdown() {
    const { notifications: socketNotifications, setNotifications } = useSocket();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const BACKEND_URL = "http://localhost:3000"; // backend base URL

    // Fetch initial notifications on mount
    useEffect(() => {
        if (!token) return;

        const fetchNotifications = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch notifications");
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchNotifications();
    }, [token, setNotifications]);

    const unreadCount = socketNotifications.filter((n) => !n.read).length;

    const markAsRead = async (id) => {
        try {
        await fetch(`${BACKEND_URL}/api/notifications/${id}/read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        } catch (err) {
        console.error("Error marking notification read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
        await fetch(`${BACKEND_URL}/api/notifications/read-all`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (err) {
        console.error("Error marking all notifications read:", err);
        }
    };

    // Toggle dropdown and auto-clear unread
    const toggleDropdown = () => {
        const newOpen = !open;
        setOpen(newOpen);
        if (newOpen && unreadCount > 0) {
        markAllAsRead();
        }
    };

    return (
        <div className="relative">
        <button
            onClick={toggleDropdown}
            className="relative p-2 rounded-full hover:bg-gray-100"
        >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
            </span>
            )}
        </button>

        <AnimatePresence>
            {open && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50"
            >
                <div className="p-3 border-b font-semibold">Notifications</div>
                <div className="max-h-80 overflow-y-auto">
                {loading ? (
                    <p className="p-3 text-gray-500">Loading...</p>
                ) : socketNotifications.length === 0 ? (
                    <p className="p-3 text-gray-500">No notifications</p>
                ) : (
                    socketNotifications.map((n) => (
                    <div
                        key={n._id}
                        onClick={() => markAsRead(n._id)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        !n.read ? "bg-gray-100" : ""
                        }`}
                    >
                        <p className="text-sm">{n.message}</p>
                        <small className="text-gray-500">
                        {new Date(n.createdAt).toLocaleString()}
                        </small>
                    </div>
                    ))
                )}
                </div>
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
}
