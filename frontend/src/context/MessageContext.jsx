
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

  // Load initial unread counts
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
        const total = Object.values(map).reduce((sum, val) => sum + val, 0);
        setUnreadCount(total);
      } catch (err) {
        console.error("Failed to fetch unread counts:", err);
      }
    };
    fetchUnreadByUser();
  }, [user?._id]);

  // Socket listener for new messages
  useEffect(() => {
    if (!user?._id || !socket || socketInitialized.current) return;

    socketInitialized.current = true;

    const onNewMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;

        const receiverId = message.receiverId || message.recipient?._id;
        const senderId = message.sender?._id;

        if (receiverId?.toString() === user._id.toString()) {
          setUnreadByUser((prev) => {
            const updated = { ...prev, [senderId]: (prev[senderId] || 0) + 1 };
            setUnreadCount(Object.values(updated).reduce((a, b) => a + b, 0));
            return updated;
          });
        }

        return [...prev, message];
      });
    };

    socket.on("newMessage", onNewMessage);
    return () => socket.off("newMessage", onNewMessage);
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
      // Reset per-user unread
      const updated = { ...unreadByUser, [senderId]: 0 };
      setUnreadByUser(updated);

      // Recalculate total
      const res = await getUnreadCountsByUser();
      const map = {};
      (res.data || []).forEach((item) => (map[item._id] = Number(item.count)));
      setUnreadByUser(map);
      setUnreadCount(Object.values(map).reduce((a, b) => a + b, 0));
    } catch (err) {
      console.error(err);
    }
  };

  const clearUnread = () => {
    setUnreadByUser({});
    setUnreadCount(0);
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
