
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
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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

  // Prevent duplicate listener registration
  const socketListenerInstalled = useRef(null); // stores socket id for which listener is installed

  // Helper: read token from storage and warn if missing
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) console.warn("[MessageContext] No token found in localStorage.");
    return token;
  };

  // Fetch unread counts from API and sync state (raw-respectful)
  const fetchUnreadCounts = async () => {
    const token = getToken();
    if (!token) return;

    console.log("[MessageContext] Fetching unread counts. Token:", token.slice ? token.slice(0, 40) + "..." : token);

    try {
      // messageApi has an interceptor that attaches token, but we still call it directly
      const raw = await getUnreadCountsByUser();
      console.log("[MessageContext] Raw API response for unread counts:", raw);

      // raw may be { data: [...] } or [...] depending on how helper returns; try both
      const data = raw?.data ?? raw ?? [];
      if (!Array.isArray(data)) {
        console.warn("[MessageContext] Unexpected unread counts payload; coercing to empty array.");
      }
      const arr = Array.isArray(data) ? data : [];

      const map = {};
      arr.forEach((it) => {
        if (it?._id) map[it._id] = Number(it.count) || 0;
      });

      setUnreadByUser(map);
      const total = Object.values(map).reduce((s, v) => s + (Number(v) || 0), 0);
      setUnreadCount(total);

      console.log("[MessageContext] Initial unread counts:", map, "Total:", total);
    } catch (err) {
      console.error("[MessageContext] Failed to fetch unread counts:", err);
    }
  };

  // Initial load whenever user logs in
  useEffect(() => {
    if (!user?._id) {
      setUnreadByUser({});
      setUnreadCount(0);
      return;
    }
    fetchUnreadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Install socket listeners once per socket instance (and re-install on socket change)
  useEffect(() => {
    if (!user?._id) return;
    if (!socket) {
      console.log("[MessageContext] Socket not ready yet — waiting.");
      return;
    }

    // avoid re-registering on same socket
    if (socketListenerInstalled.current === socket.id) {
      // already registered for this socket id
      console.log("[MessageContext] Listener already installed for socket id:", socket.id);
      return;
    }

    // If previously registered on another socket, remove it first.
    if (socketListenerInstalled.current && socketListenerInstalled.current !== socket.id) {
      console.log(
        "[MessageContext] Socket instance changed, will (re)install listeners. previous socket id:",
        socketListenerInstalled.current,
        "new:",
        socket.id
      );
    }

    // Register handlers
    const onConnect = () => {
      console.log("[MessageContext] Socket connected (inside MessageContext):", socket.id);
      // ensure server room join — join emitted by SocketProvider as well, but safe to re-emit
      try {
        if (user?._id) {
          socket.emit("join", user._id);
          console.log("[MessageContext] Emitted join for user:", user._id);
        }
      } catch (e) {
        console.warn("[MessageContext] Failed to emit join:", e);
      }
    };

    const onNewMessage = (message) => {
      console.log("[MessageContext] newMessage event payload:", message);

      setMessages((prev) => {
        // dedupe by _id
        if (prev.some((m) => m._id === message._id)) {
          console.log("[MessageContext] message already exists, skipping:", message._id);
          return prev;
        }

        // if the message is for this user (recipient is this user), increment unread
        const receiverId = message.receiverId ?? message.recipient?._id;
        const senderId = message.sender?._id;

        if (receiverId && user && receiverId.toString() === user._id.toString()) {
          setUnreadByUser((prevMap) => {
            const next = { ...prevMap, [senderId]: (prevMap[senderId] || 0) + 1 };
            const total = Object.values(next).reduce((s, v) => s + (Number(v) || 0), 0);
            setUnreadCount(total);
            console.log("[MessageContext] unreadByUser updated:", next, "total:", total);
            return next;
          });
        } else {
          console.log("[MessageContext] Incoming message not for this user (ignored for unread):", receiverId);
        }

        return [...prev, message];
      });
    };

    // Wire up
    socket.on("connect", onConnect);
    socket.on("newMessage", onNewMessage);

    // mark installed
    socketListenerInstalled.current = socket.id;
    console.log("[MessageContext] Installed listeners on socket id:", socket.id);

    // cleanup: remove these exact handlers
    return () => {
      try {
        socket.off("connect", onConnect);
        socket.off("newMessage", onNewMessage);
        console.log("[MessageContext] Removed listeners from socket id:", socket.id);
      } catch (e) {
        console.warn("[MessageContext] Error removing socket listeners:", e);
      } finally {
        socketListenerInstalled.current = null;
      }
    };
  }, [socket, user?._id]);

  // Send a message (uses messageApi which attaches token automatically)
  const sendMessage = async (recipientId, text) => {
    const token = getToken();
    if (!token) {
      console.warn("[MessageContext] No token - cannot send message");
      return null;
    }
    try {
      const sent = await apiSendMessage(recipientId, text);
      setMessages((prev) => [...prev, sent]);
      // emit through socket so recipient gets notified immediately
      try {
        socket?.emit?.("sendMessage", sent);
      } catch (e) {
        console.warn("[MessageContext] emit sendMessage failed:", e);
      }
      console.log("[MessageContext] Sent message (API + emit):", sent);
      return sent;
    } catch (err) {
      console.error("[MessageContext] sendMessage failed:", err);
      throw err;
    }
  };

  // Mark messages read. If senderId omitted (null/undefined), backend should mark all read.
  const markMessagesRead = async (senderId = null) => {
    const token = getToken();
    if (!token) {
      console.warn("[MessageContext] No token - cannot mark messages read");
      return;
    }
    try {
      // backend expects { senderId } body; messageApi.markMessagesRead uses that
      await apiMarkMessagesRead(senderId);
      console.log("[MessageContext] markMessagesRead API call successful. senderId:", senderId);

      // If marking all read (A), clear local state quickly for instant UI feedback
      if (!senderId) {
        setUnreadByUser({});
        setUnreadCount(0);
      } else {
        // zero that one sender, keep others, then re-sync total via fetch
        setUnreadByUser((prev) => ({ ...prev, [senderId]: 0 }));
      }

      // Re-sync with server to be safe (ensures consistency)
      await fetchUnreadCounts();
      console.log("[MessageContext] Resynced unread counts after markMessagesRead.");
    } catch (err) {
      console.error("[MessageContext] markMessagesRead failed:", err);
    }
  };

  const clearUnread = async () => {
    // convenience: marks all read both client and server
    try {
      await markMessagesRead(null);
    } catch (e) {
      console.warn("[MessageContext] clearUnread encountered error:", e);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        unreadByUser,
        unreadCount,
        setUnreadByUser,
        setUnreadCount,
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
