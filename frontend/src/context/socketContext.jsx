
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      if (user?._id) newSocket.emit("join", user._id);
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