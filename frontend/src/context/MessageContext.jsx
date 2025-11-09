
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
