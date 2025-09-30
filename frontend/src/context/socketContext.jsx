

// src/context/socketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io as socketIOClient } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const API_WS = import.meta.env.VITE_API_BASE || "http://localhost:3000";
    const newSocket = socketIOClient(API_WS, {
      auth: { token },
    });

    // If you want to join user-specific room, decode the token carefully
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload._id || payload.id || payload.userId || null;
      if (userId) newSocket.emit("join", userId);
    } catch (err) {
      console.warn("Socket: couldn't decode token to join room", err);
    }

    newSocket.on("notification", (notif) => setNotifications((prev) => [notif, ...prev]));
    newSocket.on("newMessage", (msg) => {
      // you can also setMessages here if you want to expose, but keep minimal
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return <SocketContext.Provider value={{ socket, notifications, setNotifications }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
