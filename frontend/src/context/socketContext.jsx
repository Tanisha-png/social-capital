
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[SocketContext] No token found, socket will not connect.");
      return;
    }

    console.log("[SocketContext] Initializing socket. Token:", token);
    console.log("[SocketContext] Connecting to backend URL:", BACKEND_URL);

    const newSocket = io(BACKEND_URL, {
      transports: ["websocket"],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      console.log("[SocketContext] Socket connected:", newSocket.id);
      if (user?._id) {
        newSocket.emit("join", user._id);
        console.log("[SocketContext] User joined room:", user._id);
      }
    });

    newSocket.on("connect_error", (err) => {
      console.error("[SocketContext] Socket connection error:", err.message);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      console.log("[SocketContext] Disconnecting socket:", newSocket.id);
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
