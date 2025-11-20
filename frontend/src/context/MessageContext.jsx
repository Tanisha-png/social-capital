
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useRef,
// } from "react";
// import { useSocket } from "./socketContext";
// import { useAuth } from "./AuthContext";
// import {
//   sendMessage as apiSendMessage,
//   markMessagesRead as apiMarkMessagesRead,
//   getUnreadCountsByUser,
// } from "../api/messageApi";

// const MessageContext = createContext();

// export const MessageProvider = ({ children }) => {
//   const { user } = useAuth();
//   const { socket } = useSocket();
//   const [messages, setMessages] = useState([]);
//   const [unreadByUser, setUnreadByUser] = useState({});
//   const [unreadCount, setUnreadCount] = useState(0);
//   const socketInitialized = useRef(false);

//   const fetchUnreadCounts = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("[MessageContext] No token for API request.");
//       return;
//     }

//     console.log("[MessageContext] Fetching unread counts. Token:", token);

//     try {
//       const rawRes = await getUnreadCountsByUser(token);
//       console.log(
//         "[MessageContext] Raw API response for unread counts:",
//         rawRes
//       );

//       const data = Array.isArray(rawRes) ? rawRes : [];
//       const map = {};
//       data.forEach((item) => (map[item._id] = Number(item.count)));

//       setUnreadByUser(map);
//       const total = Object.values(map).reduce((sum, val) => sum + val, 0);
//       setUnreadCount(total);

//       console.log(
//         "[MessageContext] Initial unread counts:",
//         map,
//         "Total:",
//         total
//       );
//     } catch (err) {
//       console.error("[MessageContext] Failed to fetch unread counts:", err);
//     }
//   };

//   // Initial fetch of unread counts
//   useEffect(() => {
//     if (!user?._id) return;
//     fetchUnreadCounts();
//   }, [user?._id]);

//   // Socket listener for new messages
//   useEffect(() => {
//     if (!user?._id || !socket || socketInitialized.current) return;
//     console.log(
//       "[MessageContext] Waiting for socket to initialize for user:",
//       user._id
//     );

//     socketInitialized.current = true;

//     const onNewMessage = (message) => {
//       console.log("[MessageContext] New message received via socket:", message);

//       setMessages((prev) => {
//         if (prev.some((m) => m._id === message._id)) return prev;

//         const receiverId = message.receiverId || message.recipient?._id;
//         const senderId = message.sender?._id;

//         if (receiverId?.toString() === user._id.toString()) {
//           setUnreadByUser((prev) => {
//             const updated = { ...prev, [senderId]: (prev[senderId] || 0) + 1 };
//             const total = Object.values(updated).reduce((a, b) => a + b, 0);
//             setUnreadCount(total);

//             console.log("[MessageContext] Updated unreadByUser:", updated);
//             console.log("[MessageContext] Updated total unread count:", total);

//             return updated;
//           });
//         }

//         return [...prev, message];
//       });
//     };

//     socket.on("newMessage", onNewMessage);

//     return () => {
//       socket.off("newMessage", onNewMessage);
//       console.log("[MessageContext] Socket listener removed for new messages.");
//     };
//   }, [user?._id, socket]);

//   const sendMessage = async (recipientId, text) => {
//     const token = localStorage.getItem("token");
//     if (!socket || !token) {
//       console.warn(
//         "[MessageContext] Socket or token not ready. Cannot send message."
//       );
//       return null;
//     }

//     const sent = await apiSendMessage(recipientId, text, token);
//     setMessages((prev) => [...prev, sent]);
//     socket.emit("sendMessage", sent);

//     console.log("[MessageContext] Message sent:", sent);
//     return sent;
//   };

//   const markMessagesRead = async (senderId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       await apiMarkMessagesRead(senderId, token);

//       // Reset per-user unread
//       setUnreadByUser((prev) => ({ ...prev, [senderId]: 0 }));

//       // Re-fetch unread counts to sync total
//       await fetchUnreadCounts();
//       console.log(
//         "[MessageContext] Marked messages read for sender:",
//         senderId
//       );
//     } catch (err) {
//       console.error("[MessageContext] Failed to mark messages read:", err);
//     }
//   };

//   const clearUnread = () => {
//     setUnreadByUser({});
//     setUnreadCount(0);
//     console.log("[MessageContext] Cleared all unread counts.");
//   };

//   return (
//     <MessageContext.Provider
//       value={{
//         messages,
//         unreadByUser,
//         unreadCount,
//         setUnreadByUser,
//         setUnreadCount,
//         sendMessage,
//         markMessagesRead,
//         clearUnread,
//       }}
//     >
//       {children}
//     </MessageContext.Provider>
//   );
// };

// export const useMessageNotifications = () => useContext(MessageContext);
// export const useMessages = () => useContext(MessageContext);

// MessageContext.jsx
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
  getUnreadCountsByUser,
} from "../api/messageApi";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [unreadByUser, setUnreadByUser] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  const installedForSocketId = useRef(null);
  const seenMessageIds = useRef(new Set());

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) console.warn("[MessageContext] No token found.");
    return token;
  };

  // Fetch unread counts from API
  const fetchUnreadCounts = async () => {
    const token = getToken();
    if (!token) return;

    console.log(
      "[MessageContext] Fetching unread counts. Token:",
      token.slice(0, 40) + "..."
    );

    try {
      const raw = await getUnreadCountsByUser();
      console.log("[MessageContext] Raw API response:", raw);

      const data = raw?.data ?? raw ?? [];
      const arr = Array.isArray(data) ? data : [];

      const map = {};
      arr.forEach((item) => {
        if (item?._id) map[item._id] = Number(item.count) || 0;
      });

      setUnreadByUser(map);
      const total = Object.values(map).reduce((s, v) => s + v, 0);
      setUnreadCount(total);

      console.log(
        "[MessageContext] Initial unread counts:",
        map,
        "Total:",
        total
      );

      // Populate seenMessageIds so socket won't double-count these messages
      arr.forEach((item) => {
        if (item?._id) seenMessageIds.current.add(item._id);
      });
    } catch (err) {
      console.error("[MessageContext] Failed to fetch unread counts:", err);
    }
  };

  // Initial load whenever user logs in
  useEffect(() => {
    if (!user?._id) {
      setUnreadByUser({});
      setUnreadCount(0);
      seenMessageIds.current.clear();
      return;
    }
    fetchUnreadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Socket listener installation (once per socket.id)
  useEffect(() => {
    if (!user?._id) return;
    if (!socket) {
      console.log("[MessageContext] Socket not ready yet — waiting.");
      return;
    }
    if (!socket.id) {
      console.log("[MessageContext] Socket has no ID yet — waiting.");
      return;
    }
    if (installedForSocketId.current === socket.id) {
      console.log(
        "[MessageContext] Listener already installed for socket:",
        socket.id
      );
      return;
    }

    console.log("[MessageContext] Installing listeners for socket:", socket.id);

    const onConnect = () => {
      console.log(
        "[MessageContext] Socket connected inside MessageContext:",
        socket.id
      );
      socket.emit("join", user._id);
      console.log("[MessageContext] Emitted join for user:", user._id);
    };

    const onNewMessage = (msg) => {
      console.log("[MessageContext] newMessage event received:", msg);

      if (seenMessageIds.current.has(msg._id)) {
        console.log(
          "[MessageContext] Message already seen, skipping:",
          msg._id
        );
        return;
      }
      seenMessageIds.current.add(msg._id);

      const receiverId = msg.receiverId ?? msg.recipient?._id;
      const senderId = msg.sender?._id;

      // Increment unread if the message is for this user
      if (receiverId === user._id) {
        setUnreadByUser((prev) => {
          const next = { ...prev, [senderId]: (prev[senderId] || 0) + 1 };
          const total = Object.values(next).reduce((s, v) => s + v, 0);
          setUnreadCount(total);
          console.log(
            "[MessageContext] Updated unreadByUser:",
            next,
            "total:",
            total
          );
          return next;
        });
      }

      // Add to messages state, deduplicating by _id
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("connect", onConnect);
    socket.on("newMessage", onNewMessage);

    installedForSocketId.current = socket.id;

    return () => {
      console.log(
        "[MessageContext] Removing listeners from socket:",
        socket.id
      );
      socket.off("connect", onConnect);
      socket.off("newMessage", onNewMessage);
      installedForSocketId.current = null;
    };
  }, [socket, user?._id]);

  // --- Mutations ---
  const sendMessage = async (recipientId, text) => {
    const token = getToken();
    if (!token) return;

    try {
      const sent = await apiSendMessage(recipientId, text);
      setMessages((prev) => [...prev, sent]);
      socket?.emit?.("sendMessage", sent);
      console.log("[MessageContext] Sent message:", sent);
      return sent;
    } catch (err) {
      console.error("[MessageContext] sendMessage failed:", err);
      throw err;
    }
  };

  const markMessagesRead = async (senderId = null) => {
    const token = getToken();
    if (!token) return;

    try {
      await apiMarkMessagesRead(senderId);
      console.log(
        "[MessageContext] markMessagesRead API call successful. senderId:",
        senderId
      );

      if (!senderId) {
        setUnreadByUser({});
        setUnreadCount(0);
      } else {
        setUnreadByUser((prev) => ({ ...prev, [senderId]: 0 }));
      }

      await fetchUnreadCounts();
      console.log(
        "[MessageContext] Resynced unread counts after markMessagesRead."
      );
    } catch (err) {
      console.error("[MessageContext] markMessagesRead failed:", err);
    }
  };

  const clearUnread = async () => {
    try {
      await markMessagesRead(null);
    } catch (e) {
      console.warn("[MessageContext] clearUnread error:", e);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        unreadByUser,
        unreadCount,
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
