// context/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        // Fetch stored notifications
        const fetchNotifs = async () => {
            const res = await fetch("/api/notifications", {
            headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setNotifications(data);
        };
        fetchNotifs();

        // Socket connection
        const socket = io("/", { auth: { token } });

        // 👉 Ask backend to put this user in their room
        const user = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
        socket.emit("join", user.id);

        socket.on("notification", (notif) => {
            setNotifications((prev) => [notif, ...prev]);
        });

        return () => socket.disconnect();
    }, [token]);

    const markAsRead = async (id) => {
        await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <NotificationContext.Provider value={{ notifications, markAsRead }}>
        {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
