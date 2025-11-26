
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
  const [unreadByUser, setUnreadByUser] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  // REFS
  const seenMessageIds = useRef(new Set());
  const initialFetchDone = useRef(false);
  const socketBuffer = useRef([]);

  // Utility: normalize ID-ish values
  const normalizeId = (val) => {
    if (!val) return null;
    if (typeof val === "string") return val;
    if (typeof val === "object") return val._id || val.id || null;
    return null;
  };

  // Add message to local store (avoids duplicates)
  const addMessageToState = (msg) => {
    if (!msg?._id) return;
    setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
  };

  // MAIN incoming-message handler (used by socket and local send)
  const handleIncomingMessage = (msg) => {
    if (!msg || !msg._id) {
      console.log("[MessageContext] incoming message missing _id, ignoring:", msg);
      return;
    }

    if (seenMessageIds.current.has(msg._id)) {
      // duplicate
      // console.log("[MessageContext] duplicate message ignored:", msg._id);
      return;
    }
    seenMessageIds.current.add(msg._id);

    // Determine sender/receiver robustly
    const senderId =
      normalizeId(msg.sender) ||
      msg.senderId ||
      msg.from ||
      msg.fromId ||
      (msg.sender && (msg.sender._id || msg.sender.id)) ||
      null;

    const receiverId =
      normalizeId(msg.recipient) ||
      msg.recipientId ||
      msg.receiverId ||
      msg.to ||
      msg.toId ||
      (msg.recipient && (msg.recipient._id || msg.recipient.id)) ||
      null;

    console.log("[MessageContext] handleIncomingMessage:", { msgId: msg._id, senderId, receiverId, userId });

    // Always keep message in local state
    addMessageToState(msg);

    // If this message was delivered to *this* user, increment unread counter for sender
    if (receiverId && userId && receiverId.toString() === userId.toString()) {
      setUnreadByUser((prev) => {
        const prevCount = Number(prev[senderId]) || 0;
        const updated = { ...prev, [senderId]: prevCount + 1 };

        const total = Object.values(updated).reduce((s, v) => s + v, 0);
        setUnreadCount(total);

        console.log(`[MessageContext] unread incremented for ${senderId}: ${prevCount} → ${updated[senderId]}`);
        return updated;
      });
    }
  };

  function computeUnreadCounts(convos, currentUserId) {
    const result = {};

    convos.forEach((c) => {
      if (!c.lastMessage) return;

      const otherId = c.otherUser?._id;
      const senderId = c.lastMessage?.sender?._id;
      const readBy = c.lastMessage?.readBy || [];

      const fromOther = senderId && senderId !== currentUserId;
      const isUnread = !readBy.includes(currentUserId);

      if (fromOther && isUnread) {
        result[otherId] = 1; // lastMessage unread = 1
      }
    });

    return result;
  }


  // Fetch initial unread counts (from API)
  const fetchUnreadCounts = async () => {
    if (!userId) return;
    try {
      const convos = await getUnreadCountsByUser(userId);

      // If backend returned conversations instead of counts, compute them
      const map = computeUnreadCounts(convos, userId);

      console.log("📊 Initial unread counts loaded:", map);

      setUnreadByUser(map);
      setUnreadCount(Object.values(map).reduce((s, v) => s + v, 0));

      initialFetchDone.current = true;

      if (socketBuffer.current.length) {
        socketBuffer.current.forEach((m) => handleIncomingMessage(m));
        socketBuffer.current = [];
      }
    } catch (err) {
      console.error("[MessageContext] fetchUnreadCounts failed:", err);
    }
  };


  // Reset on logout / user switch
  useEffect(() => {
    if (!userId) {
      console.log("[MessageContext] resetting state for logout/user switch");
      setMessages([]);
      setUnreadByUser({});
      setUnreadCount(0);
      seenMessageIds.current.clear();
      socketBuffer.current = [];
      initialFetchDone.current = false;
      return;
    }
    fetchUnreadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Socket listeners (attach once per socket instance)
  useEffect(() => {
    if (!socket) {
      // If socket went away, ensure variables are safe
      console.log("[MessageContext] socket not available yet");
      return;
    }

    console.log("[MessageContext] attaching socket listeners (socket id)", socket.id);

    const onConnect = () => {
      console.log(`[MessageContext] socket connected: ${socket.id} — join room ${userId}`);
      if (userId) socket.emit("join", userId);
    };

    const onNewMessage = (msg) => {
      console.log("[MessageContext] socket.on newMessage:", msg && msg._id ? msg._id : msg);
      // If we haven't loaded initial unread counts yet, buffer messages
      if (!initialFetchDone.current) {
        console.log("[MessageContext] buffering message until unread counts finish loading:", msg && msg._id);
        socketBuffer.current.push(msg);
      } else {
        handleIncomingMessage(msg);
      }
    };

    // optional server-side unread update event (if you later emit it)
    const onUnreadUpdate = (payload) => {
      // payload: { senderId, unreadCount }
      if (!payload) return;
      const sid = String(payload.senderId);
      const count = Number(payload.unreadCount) || 0;
      console.log("[MessageContext] socket.on unreadUpdate:", sid, count);
      setUnreadByUser((prev) => {
        const updated = { ...prev, [sid]: count };
        const total = Object.values(updated).reduce((s, v) => s + v, 0);
        setUnreadCount(total);
        return updated;
      });
    };

    socket.on("connect", onConnect);
    socket.on("newMessage", onNewMessage);
    socket.on("message:received", onUnreadUpdate); // keep this if server later emits it
    socket.on("unread:update", onUnreadUpdate); // alternate event name

    // Cleanup: remove listeners when socket changes or component unmounts
    return () => {
      try {
        socket.off("connect", onConnect);
        socket.off("newMessage", onNewMessage);
        socket.off("message:received", onUnreadUpdate);
        socket.off("unread:update", onUnreadUpdate);
        console.log("[MessageContext] socket listeners removed");
      } catch (err) {
        console.warn("[MessageContext] error removing socket listeners:", err);
      }
    };
    // re-run when socket or userId changes
  }, [socket, userId]);

  // Public send message wrapper
  const sendMessage = async (recipientId, text) => {
    if (!recipientId || !text) return;
    try {
      const savedMsg = await apiSendMessage(recipientId, text);

      // treat saved message the same as an incoming message (so UI updates instantly)
      handleIncomingMessage(savedMsg);

      // notify server through socket as well
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

  // Mark messages read (optionally for a single sender)
  const markMessagesRead = async (senderId = null) => {
    // try {
    //   await markMessagesRead; // (no-op if function name shadowing)
    // } catch (e) {
    //   /* noop */
    // }

    try {
      await apiMarkMessagesRead(senderId);

      console.log(`✅ Marked messages read for ${senderId || "ALL"}`);

      if (!senderId) {
        setUnreadByUser({});
        setUnreadCount(0);
      } else {
        setUnreadByUser((prev) => {
          const updated = { ...prev, [String(senderId)]: 0 };
          const total = Object.values(updated).reduce((s, v) => s + v, 0);
          setUnreadCount(total);
          return updated;
        });
      }

      // re-sync to be safe
      await fetchUnreadCounts();
    } catch (err) {
      console.error("[MessageContext] markMessagesRead failed:", err);
    }
  };

  // Helper to ask whether a sender has unread
  const hasUnreadFrom = (senderId) => {
    const count = unreadByUser[String(senderId)] || 0;
    console.log(`DOT CHECK → sender: ${senderId} unread: ${count}`);
    return count > 0;
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
