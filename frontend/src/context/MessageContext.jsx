
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
  const { user, token } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [unreadByUser, setUnreadByUser] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const socketInitialized = useRef(false);

  /** -------------------------------
   *  Load initial unread counts
   *  -------------------------------
   */
  useEffect(() => {
    if (!user?._id) return;

    const fetchUnreadByUser = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        console.log("[MessageContext] Using token:", authToken);

        const res = await getUnreadCountsByUser(authToken);
        console.log(
          "[MessageContext] API response for unread counts:",
          res.data
        );

        const map = {};
        (res.data || []).forEach((item) => {
          map[item._id] = Number(item.count);
        });

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

    fetchUnreadByUser();
  }, [user?._id, token]);

  /** -------------------------------
   *  Socket listener for incoming messages
   *  -------------------------------
   */
  useEffect(() => {
    if (!user?._id || !socket || socketInitialized.current) return;
    socketInitialized.current = true;

    console.log("[MessageContext] Socket initialized, socket id:", socket.id);

    const onNewMessage = (message) => {
      console.log("[Socket] New message received:", message);

      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;

        const receiverId = message.receiverId || message.recipient?._id;
        const senderId = message.sender?._id;

        if (receiverId?.toString() === user._id.toString()) {
          setUnreadByUser((prev) => {
            const updated = { ...prev, [senderId]: (prev[senderId] || 0) + 1 };
            const total = Object.values(updated).reduce((a, b) => a + b, 0);
            setUnreadCount(total);
            console.log(
              "[MessageContext] Updated unreadByUser:",
              updated,
              "Total unread:",
              total
            );
            return updated;
          });
        }

        return [...prev, message];
      });
    };

    socket.on("connect", () => console.log("[Socket] Connected:", socket.id));
    socket.on("connect_error", (err) =>
      console.error("[Socket] Connection error:", err)
    );
    socket.on("disconnect", (reason) =>
      console.warn("[Socket] Disconnected:", reason)
    );

    socket.on("newMessage", onNewMessage);
    return () => socket.off("newMessage", onNewMessage);
  }, [user?._id, socket]);

  /** -------------------------------
   *  Send message
   *  -------------------------------
   */
  const sendMessage = async (recipientId, text) => {
    if (!socket) {
      console.warn("[MessageContext] Socket not initialized yet.");
      return null;
    }

    const sent = await apiSendMessage(recipientId, text);
    setMessages((prev) => [...prev, sent]);
    socket.emit("sendMessage", sent);
    console.log("[MessageContext] Sent message:", sent);
    return sent;
  };

  /** -------------------------------
   *  Mark messages read for a sender
   *  -------------------------------
   */
  const markMessagesRead = async (senderId) => {
    try {
      await apiMarkMessagesRead(senderId);
      console.log(
        "[MessageContext] Marked messages read for sender:",
        senderId
      );

      // Reset per-user unread
      const updated = { ...unreadByUser, [senderId]: 0 };
      setUnreadByUser(updated);

      // Fetch updated counts from backend
      const res = await getUnreadCountsByUser(token);
      const map = {};
      (res.data || []).forEach((item) => (map[item._id] = Number(item.count)));
      setUnreadByUser(map);
      const total = Object.values(map).reduce((a, b) => a + b, 0);
      setUnreadCount(total);
      console.log(
        "[MessageContext] Updated unread counts after reading:",
        map,
        "Total:",
        total
      );
    } catch (err) {
      console.error("[MessageContext] Failed to mark messages read:", err);
    }
  };

  const clearUnread = () => {
    setUnreadByUser({});
    setUnreadCount(0);
    console.log("[MessageContext] Cleared all unread counts");
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
