
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
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSocket } from "./socketContext";
import { useAuth } from "./AuthContext";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const {socket} = useSocket();

  const [unreadCounts, setUnreadCounts] = useState({}); // { senderId: count }
  const [unreadCount, setUnreadCount] = useState(0); // global total

  /* -----------------------------------------
     Normalize IDs so comparisons are consistent
  --------------------------------------------*/
  const normalizeId = (id) => String(id).trim().toLowerCase();

  /* -----------------------------------------
     Load initial unread counts from API
  --------------------------------------------*/
  useEffect(() => {
    if (!user) return;

    const loadUnread = async () => {
      try {
        const res = await fetch(`/api/messages/unread/${user._id}`);
        const data = await res.json();

        const normalizedObj = Object.fromEntries(
          Object.entries(data).map(([k, v]) => [normalizeId(k), v])
        );

        console.log("📊 Initial unread counts loaded:", normalizedObj);

        setUnreadCounts(normalizedObj);

        // Compute global total
        const total = Object.values(normalizedObj).reduce((a, b) => a + b, 0);
        setUnreadCount(total);
      } catch (err) {
        console.error("❌ Failed loading unread:", err);
      }
    };

    loadUnread();
  }, [user]);

  /* -----------------------------------------
     SOCKET LISTENER: new private message
  --------------------------------------------*/
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (payload) => {
      const senderRaw = payload?.senderId;
      const receiverRaw = payload?.receiverId;

      const sender = normalizeId(senderRaw);
      const receiver = normalizeId(receiverRaw);
      const me = normalizeId(user._id);

      console.log("📩 SOCKET new message event:", payload);
      console.log(
        `🧩 normalized → sender:${sender}  receiver:${receiver}  me:${me}`
      );

      // Only register unread if *I* am the receiver
      if (receiver !== me) {
        console.log("⏩ Ignoring message not intended for this user");
        return;
      }

      // Increment per-user
      setUnreadCounts((prev) => {
        const newCount = (prev[sender] || 0) + 1;
        console.log(`🔵 Increment unread for ${sender} → ${newCount}`);

        return {
          ...prev,
          [sender]: newCount,
        };
      });

      // Increment global
      setUnreadCount((prev) => {
        console.log(`🔵 Global unread increment: ${prev} → ${prev + 1}`);
        return prev + 1;
      });
    };

    socket.on("private_message", handleNewMessage);

    return () => socket.off("private_message", handleNewMessage);
  }, [socket, user]);

  /* -----------------------------------------
     Mark ALL unread messages as read
  --------------------------------------------*/
  const markMessagesRead = useCallback(async () => {
    if (!user) return;

    console.log("✅ Marking all messages read");

    try {
      await fetch(`/api/messages/mark-read/${user._id}`, { method: "PUT" });

      setUnreadCounts({});
      setUnreadCount(0);
    } catch (err) {
      console.error("❌ Failed marking messages read:", err);
    }
  }, [user]);

  return (
    <MessageContext.Provider
      value={{
        unreadCounts, // per-user unread counts (REQUIRED FOR SIDEBAR DOT)
        unreadCount, // total unread count (used by MessagesDropdown)
        markMessagesRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageNotifications = () => useContext(MessageContext);
