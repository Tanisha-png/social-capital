// import React, { createContext, useContext, useState, useEffect } from "react";
// import socket from "../socket";
// import { useAuth } from "./AuthContext";

// const MessageContext = createContext();

// export const MessageProvider = ({ children }) => {
//     const { user } = useAuth();

//     // Restore unread count from localStorage on refresh
//     const [unreadCount, setUnreadCount] = useState(
//         () => Number(localStorage.getItem("unreadCount")) || 0
//     );

//     useEffect(() => {
//         if (!user?._id) return;

//         // Join socket room for the logged-in user
//         socket.emit("join", user._id);

//         // Listen for incoming messages
//         const handleNewMessage = (message) => {
//         // Only increment if the message is sent TO the current user
//         if (
//             message.recipient?._id === user._id ||
//             message.recipient === user._id
//         ) {
//             setUnreadCount((prev) => {
//             const updated = prev + 1;
//             localStorage.setItem("unreadCount", updated);
//             return updated;
//             });
//         }
//         };

//         socket.on("newMessage", handleNewMessage);

//         // Cleanup listener on unmount or user change
//         return () => {
//         socket.off("newMessage", handleNewMessage);
//         };
//     }, [user]);

//     // Clear unread count
//     const clearUnread = () => {
//         setUnreadCount(0);
//         localStorage.setItem("unreadCount", 0);
//     };

//     return (
//         <MessageContext.Provider
//         value={{ unreadCount, clearUnread, setUnreadCount }}
//         >
//         {children}
//         </MessageContext.Provider>
//     );
// };

// // Custom hook to use the context
// export const useMessageNotifications = () => useContext(MessageContext);

// import React, { createContext, useContext, useState, useEffect } from "react";
// import socket from "../socket";
// import { useAuth } from "./AuthContext";

// const MessageContext = createContext();

// export const MessageProvider = ({ children }) => {
//     const { user, token } = useAuth();
//     const [unreadCount, setUnreadCount] = useState(
//         () => Number(localStorage.getItem("unreadCount")) || 0
//     );

//     // ✅ Fetch unread count when the user logs in / page loads
//     useEffect(() => {
//         const fetchUnread = async () => {
//         if (!user?._id || !token) return;

//         try {
//             const res = await fetch(
//                 `http://localhost:3000/api/messages/unread-count`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );
//             const data = await res.json();
//             if (data?.count !== undefined) {
//             setUnreadCount(data.count);
//             localStorage.setItem("unreadCount", data.count);
//             }
//         } catch (err) {
//             console.error("Failed to load unread count:", err);
//         }
//         };

//         fetchUnread();
//     }, [user, token]);

//     // ✅ Socket real-time updates
//     useEffect(() => {
//         if (!user?._id) return;

//         socket.emit("join", user._id);

//         const handleNewMessage = (message) => {
//             const receiverId =
//             message.receiverId || message.recipient?._id || message.recipient;

//             if (receiverId?.toString() === user._id.toString()) {
//             setUnreadCount((prev) => {
//                 const updated = prev + 1;
//                 localStorage.setItem("unreadCount", updated);
//                 return updated;
//             });
//             }
//         };

//         const handleMessagesRead = ({ from }) => {
//             // Messages from `from` user are marked read → decrease intelligently
//             setUnreadCount((prev) => Math.max(prev - 1, 0));
//             localStorage.setItem("unreadCount", Math.max(unreadCount - 1, 0));
//         };

//         socket.on("newMessage", handleNewMessage);
//         socket.on("messagesRead", handleMessagesRead);

//         return () => {
//             socket.off("newMessage", handleNewMessage);
//             socket.off("messagesRead", handleMessagesRead);
//         };
//     }, [user]);



//     const clearUnread = () => {
//         setUnreadCount(0);
//         localStorage.setItem("unreadCount", 0);
//     };

//     return (
//         <MessageContext.Provider value={{ unreadCount, clearUnread }}>
//         {children}
//         </MessageContext.Provider>
//     );
// };

// export const useMessageNotifications = () => useContext(MessageContext);


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useSocket } from "./socketContext";
import { useAuth } from "./AuthContext";
import {
  sendMessage as apiSendMessage,
  markMessagesRead as apiMarkMessagesRead,
  getUnreadCount as apiGetUnreadCount,
  getUnreadCountsByUser,
} from "../api/messageApi";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [unreadByUser, setUnreadByUser] = useState({});
  const [unreadCount, setUnreadCount] = useState(
    () => Number(localStorage.getItem("unreadCount")) || 0
  );
  const socketInitialized = useRef(false);

  useEffect(() => {
    if (!user?._id) return;

    const fetchUnreadByUser = async () => {
      try {
        const res = await getUnreadCountsByUser();
        const map = {};
        (res.data || []).forEach(
          (item) => (map[item._id] = Number(item.count))
        );
        setUnreadByUser(map);
      } catch (err) {
        console.error("Failed to load per-user unread:", err);
      }
    };

    fetchUnreadByUser();
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id || !socket || socketInitialized.current) return;

    socketInitialized.current = true;

    socket.on("newMessage", (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;

        const receiverId = message.receiverId || message.recipient?._id;
        if (receiverId?.toString() === user._id.toString()) {
          setUnreadCount((prevCount) => {
            const updated = prevCount + 1;
            localStorage.setItem("unreadCount", updated);
            return updated;
          });
          setUnreadByUser((prev) => ({
            ...prev,
            [message.sender._id]: (prev[message.sender._id] || 0) + 1,
          }));
        }
        return [...prev, message];
      });
    });

    return () => socket.off("newMessage");
  }, [user?._id, socket]);

  const sendMessage = async (recipientId, text) => {
    if (!socket) return null;
    const sent = await apiSendMessage(recipientId, text);
    setMessages((prev) => [...prev, sent]);
    socket.emit("sendMessage", sent);
    return sent;
  };

  const markMessagesRead = async (senderId) => {
    try {
      await apiMarkMessagesRead(senderId);
      const updated = Number(await apiGetUnreadCount());
      setUnreadCount(updated);
      localStorage.setItem("unreadCount", updated);

      const res = await getUnreadCountsByUser();
      const map = {};
      (res.data || []).forEach((item) => (map[item._id] = Number(item.count)));
      setUnreadByUser(map);
    } catch (err) {
      console.error(err);
    }
  };

  const clearUnread = () => {
    setUnreadCount(0);
    setUnreadByUser({});
    localStorage.setItem("unreadCount", 0);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        unreadCount,
        unreadByUser,
        sendMessage,
        markMessagesRead,
        clearUnread,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageNotifications = () => useContext(MessageContext);
export const useMessages = () => useContext(MessageContext);
