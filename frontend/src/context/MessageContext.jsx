
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

// context/MessageContext.jsx
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

  // STATE
  const [messages, setMessages] = useState([]);
  const [unreadByUser, setUnreadByUser] = useState({}); // { senderId: count }
  const [unreadCount, setUnreadCount] = useState(0);

  // REFS
  const seenMessageIds = useRef(new Set());
  const initialFetchDone = useRef(false);
  const socketBuffer = useRef([]);

  const normalizeId = (val) =>
    val ? (typeof val === "string" ? val : val._id || val.id || null) : null;

  const addMessageToState = (msg) => {
    if (!msg?._id) return;
    setMessages((prev) =>
      prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
    );
  };

  // MAIN message handler
  const handleIncomingMessage = (msg) => {
    if (!msg?._id) return;
    if (seenMessageIds.current.has(msg._id)) return;
    seenMessageIds.current.add(msg._id);

    const senderId = normalizeId(msg.sender) || msg.senderId || null;
    const receiverId =
      normalizeId(msg.recipient) || msg.recipientId || msg.toId || null;

    addMessageToState(msg);

    // Increment unread for the current user
    if (receiverId && userId && receiverId.toString() === userId.toString()) {
      setUnreadByUser((prev) => {
        const prevCount = Number(prev[senderId]) || 0;
        const updated = { ...prev, [senderId]: prevCount + 1 };
        setUnreadCount(
          Object.values(updated).reduce((sum, val) => sum + val, 0)
        );
        return updated;
      });
    }
  };

  const fetchUnreadCounts = async () => {
    if (!userId) return;
    try {
      const data = await getUnreadCountsByUser(); // [{ _id: senderId, count }]
      const map = {};
      (data || []).forEach((item) => {
        map[String(item._id)] = Number(item.count) || 0;
      });
      setUnreadByUser(map);
      setUnreadCount(Object.values(map).reduce((sum, val) => sum + val, 0));

      initialFetchDone.current = true;

      if (socketBuffer.current.length) {
        socketBuffer.current.forEach(handleIncomingMessage);
        socketBuffer.current = [];
      }
    } catch (err) {
      console.error("[MessageContext] fetchUnreadCounts failed:", err);
    }
  };

  // RESET on logout or user switch
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

  // SOCKET listeners
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      if (userId) socket.emit("join", userId);
    };

    const onNewMessage = (msg) => {
      if (!initialFetchDone.current) {
        socketBuffer.current.push(msg);
      } else {
        handleIncomingMessage(msg);
      }
    };

    const onUnreadUpdate = (payload) => {
      if (!payload) return;
      const sid = String(payload.senderId);
      const count = Number(payload.unreadCount) || 0;
      setUnreadByUser((prev) => {
        const updated = { ...prev, [sid]: count };
        setUnreadCount(
          Object.values(updated).reduce((sum, val) => sum + val, 0)
        );
        return updated;
      });
    };

    socket.on("connect", onConnect);
    socket.on("newMessage", onNewMessage);
    socket.on("message:received", onUnreadUpdate);
    socket.on("unread:update", onUnreadUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("newMessage", onNewMessage);
      socket.off("message:received", onUnreadUpdate);
      socket.off("unread:update", onUnreadUpdate);
    };
  }, [socket, userId]);

  // SEND a new message
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

  // MARK messages read
  const markMessagesRead = async (senderId = null) => {
    try {
      // 1️⃣ Call the backend API
      await apiMarkMessagesRead(senderId);

      // 2️⃣ Immediately update local unread state
      setUnreadByUser((prev) => {
        const updated = { ...prev };

        if (senderId) {
          // Clear only for this sender
          updated[String(senderId)] = 0;
        } else {
          // Clear all
          Object.keys(updated).forEach((key) => {
            updated[key] = 0;
          });
        }

        // Update total count
        setUnreadCount(Object.values(updated).reduce((s, v) => s + v, 0));
        return updated;
      });

      // 3️⃣ Optional: re-fetch unread counts to be safe (keeps context synced)
      await fetchUnreadCounts();

      console.log(`✅ Marked messages read for ${senderId || "ALL"}`);
    } catch (err) {
      console.error("[MessageContext] markMessagesRead failed:", err);
    }
  };


  // HELPER for sidebar dot
  const hasUnreadFrom = (senderId) => {
    return (unreadByUser[String(senderId)] || 0) > 0;
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
