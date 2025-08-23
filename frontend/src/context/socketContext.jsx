import React, { createContext, useContext, useEffect } from "react";
import socket from "../socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.id) {
        socket.connect();
        socket.emit("identify", user.id);
        } else {
        socket.disconnect();
        }
        return () => socket.disconnect();
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
        {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
