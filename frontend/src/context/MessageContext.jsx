
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
  const socketInitialized = useRef(false);

  const fetchUnreadCounts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[MessageContext] No token for API request.");
      return;
    }

    console.log("[MessageContext] Fetching unread counts. Token:", token);

    try {
      const rawRes = await getUnreadCountsByUser(token);
      console.log(
        "[MessageContext] Raw API response for unread counts:",
        rawRes
      );

      const data = Array.isArray(rawRes) ? rawRes : [];
      const map = {};
      data.forEach((item) => (map[item._id] = Number(item.count)));

      setUnreadByUser(map);
      const total = Object.values(map).reduce((sum, val) => sum + val, 0);
      setUnreadCount(total);

      console.log(
        "[MessageContext] Initial unread counts:",
        map,
        "Total:",
        total
      );
    } catch (err) {
      console.error("[MessageContext] Failed to fetch unread counts:", err);
    }
  };

  // Initial fetch of unread counts
  useEffect(() => {
    if (!user?._id) return;
    fetchUnreadCounts();
  }, [user?._id]);

  // Socket listener for new messages
  useEffect(() => {
    if (!user?._id || !socket || socketInitialized.current) return;
    console.log(
      "[MessageContext] Waiting for socket to initialize for user:",
      user._id
    );

    socketInitialized.current = true;

    const onNewMessage = (message) => {
      console.log("[MessageContext] New message received via socket:", message);

      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;

        const receiverId = message.receiverId || message.recipient?._id;
        const senderId = message.sender?._id;

        if (receiverId?.toString() === user._id.toString()) {
          setUnreadByUser((prev) => {
            const updated = { ...prev, [senderId]: (prev[senderId] || 0) + 1 };
            const total = Object.values(updated).reduce((a, b) => a + b, 0);
            setUnreadCount(total);

            console.log("[MessageContext] Updated unreadByUser:", updated);
            console.log("[MessageContext] Updated total unread count:", total);

            return updated;
          });
        }

        return [...prev, message];
      });
    };

    socket.on("newMessage", onNewMessage);

    return () => {
      socket.off("newMessage", onNewMessage);
      console.log("[MessageContext] Socket listener removed for new messages.");
    };
  }, [user?._id, socket]);

  const sendMessage = async (recipientId, text) => {
    const token = localStorage.getItem("token");
    if (!socket || !token) {
      console.warn(
        "[MessageContext] Socket or token not ready. Cannot send message."
      );
      return null;
    }

    const sent = await apiSendMessage(recipientId, text, token);
    setMessages((prev) => [...prev, sent]);
    socket.emit("sendMessage", sent);

    console.log("[MessageContext] Message sent:", sent);
    return sent;
  };

  const markMessagesRead = async (senderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await apiMarkMessagesRead(senderId, token);

      // Reset per-user unread
      setUnreadByUser((prev) => ({ ...prev, [senderId]: 0 }));

      // Re-fetch unread counts to sync total
      await fetchUnreadCounts();
      console.log(
        "[MessageContext] Marked messages read for sender:",
        senderId
      );
    } catch (err) {
      console.error("[MessageContext] Failed to mark messages read:", err);
    }
  };

  const clearUnread = () => {
    setUnreadByUser({});
    setUnreadCount(0);
    console.log("[MessageContext] Cleared all unread counts.");
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
