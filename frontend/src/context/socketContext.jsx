import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user && user.id) {
        socket.connect();
        socket.emit("identify", user.id);

        // Listen for live notifications
        socket.on("newNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });
        } else {
        socket.disconnect();
        }

        return () => {
        socket.off("newNotification");
        socket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
        {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
