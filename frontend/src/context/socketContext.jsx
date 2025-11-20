
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const retryRef = useRef(0);

  useEffect(() => {
    if (!user?._id) return;

    const token = localStorage.getItem("token");
    console.log("[SocketContext] Initializing socket. Token:", token);
    if (!token)
      return console.warn(
        "[SocketContext] No token found, cannot connect socket."
      );

    const connectSocket = () => {
      console.log("[SocketContext] Connecting to backend URL:", BACKEND_URL);

      const newSocket = io(BACKEND_URL, {
        transports: ["websocket"],
        auth: { token },
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      newSocket.on("connect", () => {
        console.log("[SocketContext] Socket connected:", newSocket.id);
        if (user?._id) newSocket.emit("join", user._id);
        retryRef.current = 0; // reset retry counter
      });

      newSocket.on("connect_error", (err) => {
        console.error("[SocketContext] Socket connection error:", err.message);
      });

      newSocket.on("disconnect", (reason) => {
        console.warn("[SocketContext] Socket disconnected. Reason:", reason);
        if (reason !== "io client disconnect" && retryRef.current < 5) {
          retryRef.current += 1;
          console.log(
            `[SocketContext] Retrying connection (#${retryRef.current})...`
          );
          setTimeout(() => connectSocket(), 2000);
        }
      });

      setSocket(newSocket);
    };

    connectSocket();

    return () => {
      console.log("[SocketContext] Disconnecting socket...");
      socket?.disconnect();
      setSocket(null);
    };
  }, [user?._id, BACKEND_URL]);

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
