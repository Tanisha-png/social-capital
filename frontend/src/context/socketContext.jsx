
// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useAuth } from "./AuthContext";

// const SocketContext = createContext();
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// export function SocketProvider({ children }) {
//   const { user } = useAuth();
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     if (!user?._id) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("[SocketContext] No token found. Socket will not connect.");
//       return;
//     }

//     console.log("[SocketContext] Initializing socket. Token:", token);
//     console.log("[SocketContext] Connecting to backend URL:", BACKEND_URL);

//     const newSocket = io(BACKEND_URL, {
//       transports: ["websocket"],
//       auth: { token },
//       reconnectionAttempts: 5,
//       reconnectionDelay: 2000,
//     });

//     newSocket.on("connect", () => {
//       console.log("[SocketContext] Socket connected:", newSocket.id);
//       if (user?._id) {
//         newSocket.emit("join", user._id);
//         console.log("[SocketContext] User joined room:", user._id);
//       }
//     });

//     newSocket.on("connect_error", (err) => {
//       console.error("[SocketContext] Socket connection error:", err.message);
//     });

//     newSocket.on("disconnect", (reason) => {
//       console.log("[SocketContext] Socket disconnected. Reason:", reason);
//     });

//     setSocket(newSocket);

//     return () => {
//       console.log("[SocketContext] Disconnecting socket:", newSocket.id);
//       newSocket.disconnect();
//       setSocket(null);
//     };
//   }, [user]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// }

// export function useSocket() {
//   const context = useContext(SocketContext);
//   if (!context)
//     throw new Error("useSocket must be used within a SocketProvider");
//   return context;
// }

// socketContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== "undefined" && window.location.origin) ||
  "http://localhost:5000";

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(BACKEND_URL, {
      transports: ["websocket"],
      auth: { token },
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 5000,
    });

    newSocket.on("connect", () => {
      newSocket.emit("join", user._id);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
