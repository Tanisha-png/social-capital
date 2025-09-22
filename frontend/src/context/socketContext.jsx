

import React, { createContext, useContext, useEffect, useState } from "react";
import { io as socketIOClient } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = socketIOClient("http://localhost:3001", {
      auth: { token },
    });

    // Join the user-specific room
    newSocket.emit("join", JSON.parse(atob(token.split(".")[1]))._id);

    // Listen for new notifications
    newSocket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

