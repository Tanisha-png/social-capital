
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

  const userId = user?._id || user?.id || null;

  // State
  const [messages, setMessages] = useState([]);
  const [unreadByUser, setUnreadByUser] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs
  const seenMessageIds = useRef(new Set());
  const initialFetchDone = useRef(false);
  const socketBuffer = useRef([]);
  const installedOnce = useRef(false);

  /** ------------------------------------------------------
   * Handle NEW incoming message
   * ------------------------------------------------------ */
  const handleIncomingMessage = (msg) => {
    if (!msg?._id) return;

    if (seenMessageIds.current.has(msg._id)) return;
    seenMessageIds.current.add(msg._id);

    const senderId = msg.sender?._id || msg.senderId;
    const receiverId = msg.receiver?._id || msg.receiverId;

    // If message is for THIS user -> increase unread count
    if (receiverId === userId) {
      setUnreadByUser((prev) => {
        const updated = {
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        };

        setUnreadCount(Object.values(updated).reduce((s, v) => s + v, 0));
        return updated;
      });
    }

    setMessages((prev) =>
      prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
    );
  };

  /** ------------------------------------------------------
   * Load unread counts
   * ------------------------------------------------------ */
  const fetchUnreadCounts = async () => {
    if (!userId) return;

    try {
      const data = await getUnreadCountsByUser();

      const map = {};
      data.forEach((item) => {
        map[item._id] = Number(item.count) || 0;
      });

      setUnreadByUser(map);
      const total = Object.values(map).reduce((s, v) => s + v, 0);
      setUnreadCount(total);

      initialFetchDone.current = true;

      // now process buffered socket messages
      socketBuffer.current.forEach((msg) => handleIncomingMessage(msg));
      socketBuffer.current = [];
    } catch (err) {
      console.error("[MessageContext] fetchUnreadCounts failed:", err);
    }
  };

  /** ------------------------------------------------------
   * Reset on logout or user switch
   * ------------------------------------------------------ */
  useEffect(() => {
    if (!userId) {
      setMessages([]);
      setUnreadByUser({});
      setUnreadCount(0);
      seenMessageIds.current.clear();
      socketBuffer.current = [];
      initialFetchDone.current = false;
      return;
    }

    fetchUnreadCounts();
  }, [userId]);

  /** ------------------------------------------------------
   * Socket listeners
   * ------------------------------------------------------ */
  useEffect(() => {
    if (!socket || !userId) return;
    if (installedOnce.current) return;

    installedOnce.current = true;
    console.log("%c[MessageContext] Socket listeners installed", "color:#4fa");

    const onConnect = () => {
      console.log(
        `%c[Socket Connected]%c ID: ${socket.id}`,
        "color: #0f0; font-weight: bold;",
        "color: #fff"
      );
      socket.emit("join", userId);
    };

    const onNewMessage = (msg) => {
      if (!initialFetchDone.current) {
        socketBuffer.current.push(msg);
      } else {
        handleIncomingMessage(msg);
      }
    };

    socket.on("connect", onConnect);
    socket.on("newMessage", onNewMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("newMessage", onNewMessage);
    };
  }, [socket, userId]);

  /** ------------------------------------------------------
   * Send message
   * ------------------------------------------------------ */
  const sendMessage = async (recipientId, text) => {
    if (!recipientId || !text) return;

    try {
      const savedMsg = await apiSendMessage(recipientId, text);

      handleIncomingMessage(savedMsg);

      socket?.emit("send_message", {
        senderId: userId,
        receiverId: recipientId,
        content: text,
      });

      return savedMsg;
    } catch (err) {
      console.error("[MessageContext] sendMessage failed:", err);
      throw err;
    }
  };

  /** ------------------------------------------------------
   * Mark messages as read
   * ------------------------------------------------------ */
  const markMessagesRead = async (senderId = null) => {
    try {
      await apiMarkMessagesRead(senderId);

      if (!senderId) {
        setUnreadByUser({});
        setUnreadCount(0);
      } else {
        setUnreadByUser((prev) => {
          const updated = { ...prev, [senderId]: 0 };
          setUnreadCount(Object.values(updated).reduce((s, v) => s + v, 0));
          return updated;
        });
      }

      await fetchUnreadCounts();
    } catch (err) {
      console.error("[MessageContext] markMessagesRead failed:", err);
    }
  };

  /** ------------------------------------------------------
   * HELPER: does a specific user have unread messages?
   * ------------------------------------------------------ */
  const hasUnreadFrom = (senderId) => {
    return unreadByUser[senderId] > 0;
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        unreadByUser,
        unreadCount,
        sendMessage,
        markMessagesRead,
        hasUnreadFrom,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
export const useMessageNotifications = () => useContext(MessageContext);
