
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user?._id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    // Use dynamic origin fallback for production
    const newSocket = io(BACKEND_URL || window.location.origin, {
      transports: ["websocket"],
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("[Socket] Connected:", newSocket.id);
      if (user?._id) newSocket.emit("join", user._id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("[Socket] Disconnected:", reason);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
}
