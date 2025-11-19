
// import React, { useState, useEffect, useRef } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { getMessagesWithUser, sendMessage } from "../../api/messageApi";
// import { useMessageNotifications } from "../../context/MessageContext";
// import { getAllUsers } from "../../api/userApi";
// import socket from "../../socket";
// import "./MessagesPage.css";

// export default function MessagesPage() {
//   const { user } = useAuth();
//   const { markMessagesRead, unreadByUser } = useMessageNotifications();
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef(null);
//   const token = localStorage.getItem("token");

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Fetch users on load
//   useEffect(() => {
//     if (!token || !user?._id) return;

//     const fetchUsers = async () => {
//       try {
//         const allUsers = await getAllUsers(token);
//         setUsers(allUsers.filter((u) => u._id !== user._id));
//       } catch (err) {
//         console.error("Error loading users:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [token, user]);

//   // Load messages when selecting a conversation
//   const handleSelectUser = async (u) => {
//     setSelectedUser(u);
//     setMessages([]);

//     try {
//       const msgs = await getMessagesWithUser(u._id, token);
//       setMessages(Array.isArray(msgs) ? msgs : []);

//       // Mark messages from this user as read
//       markMessagesRead(u._id);
//     } catch (err) {
//       console.error("Failed to load messages:", err);
//     }
//   };

//   // Send a message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !selectedUser) return;

//     try {
//       const msg = await sendMessage(selectedUser._id, newMessage.trim(), token);

//       setMessages((prev) => [...prev, msg]);
//       setNewMessage("");

//       // Emit message to socket (no listener here)
//       socket.emit("sendMessage", msg);
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   return (
//     <div className="linkedin-messages">
//       {/* Sidebar */}
//       <div className="linkedin-sidebar">
//         <div className="sidebar-header">
//           <h3>Messaging</h3>
//         </div>

//         {loading ? (
//           <p className="loading">Loading...</p>
//         ) : users.length ? (
//           users.map((u) => (
//             <div
//               key={u._id}
//               className={`sidebar-user ${
//                 selectedUser?._id === u._id ? "active" : ""
//               }`}
//               onClick={() => handleSelectUser(u)}
//             >
//               {/* <img
//                 src={
//                   u.avatar ||
//                   "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                 }
//                 alt="avatar"
//                 className="sidebar-avatar"
//               /> */}

//               <img
//                 // Direct DiceBear URL, ensuring a working image every time
//                 src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${u._id}`}
//                 alt="avatar"
//                 className="sidebar-avatar"
//               />

//               <div className="sidebar-user-info">
//                 <p className="sidebar-username">
//                   {u.firstName} {u.lastName}
//                 </p>

//                 {unreadByUser[u._id] > 0 && (
//                   <span className="sidebar-unread-badge">
//                     {unreadByUser[u._id] > 9 ? "9+" : unreadByUser[u._id]}
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-users">No users found.</p>
//         )}
//       </div>

//       {/* Chat section */}
//       <div className="linkedin-chat">
//         {selectedUser ? (
//           <>
//             <div className="chat-header">
//               <div className="chat-user-info">
//                 {/* <img
//                   src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
//                   alt="avatar"
//                   className="chat-header-avatar"
//                 /> */}
//                 <img
//                   src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${selectedUser._id}`}
//                   alt="avatar"
//                   className="chat-header-avatar"
//                 />
//                 <h3>
//                   {selectedUser.firstName} {selectedUser.lastName}
//                 </h3>
//               </div>
//             </div>

//             <div className="chat-body">
//               {messages.length ? (
//                 messages.map((msg) => (
//                   <div
//                     key={msg._id}
//                     className={`chat-bubble ${
//                       msg.sender._id === user._id ? "sent" : "received"
//                     }`}
//                   >
//                     <p>{msg.text}</p>
//                     <span className="chat-time">
//                       {new Date(msg.createdAt).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <p className="no-messages">No messages yet.</p>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             <form onSubmit={handleSendMessage} className="chat-footer">
//               <div className="chat-input-wrapper">
//                 <textarea
//                   placeholder="Write a message..."
//                   value={newMessage}
//                   onChange={(e) => {
//                     setNewMessage(e.target.value);
//                     e.target.style.height = "auto";
//                     e.target.style.height = `${e.target.scrollHeight}px`;
//                   }}
//                   rows="1"
//                   className="chat-textarea"
//                 />
//                 <button
//                   type="submit"
//                   className={`chat-send-btn ${
//                     newMessage.trim() ? "active" : ""
//                   }`}
//                   disabled={!newMessage.trim()}
//                 >
//                   <i className="fas fa-paper-plane"></i>
//                 </button>
//               </div>
//             </form>
//           </>
//         ) : (
//           <div className="empty-chat">
//             <p>Select a user to start chatting.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/pages/MessagesPage/MessagesPage.jsx
// src/pages/MessagesPage/MessagesPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMessagesWithUser, sendMessage, getConversations } from "../../api/messageApi";
import { getFriends } from "../../api/userApi";
import { useMessageNotifications } from "../../context/MessageContext";
import socketAPI from "../../socket";
import "./MessagesPage.css";

export default function MessagesPage() {
  const { user, token, getToken, initialized } = useAuth();
  const authToken = token || getToken();

  const { markMessagesRead } = useMessageNotifications();

  const [conversations, setConversations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  const messagesEndRef = useRef(null);

  // Wait until auth context is fully initialized
  useEffect(() => {
    if (!initialized) return;
    if (!user || !authToken) setLoading(false);
  }, [initialized, user, authToken]);

  // Initialize socket
  useEffect(() => {
    if (!authToken || !user?._id) return;
    const s = socketAPI.initSocket(authToken, user._id);
    return () => s?.disconnect();
  }, [authToken, user?._id]);

  // Load friends + conversations
  useEffect(() => {
    if (!authToken) return;

    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      setLoadingError(null);
      try {
        const [convos, friendList] = await Promise.all([getConversations(), getFriends()]);
        if (cancelled) return;
        setConversations(Array.isArray(convos) ? convos : []);
        setFriends(Array.isArray(friendList) ? friendList : []);
      } catch (err) {
        console.error("Error loading friends/convos:", err);
        setLoadingError(err?.message || "Failed to load conversations");
        setConversations([]);
        setFriends([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [authToken]);

  // Merge friends + conversations for sidebar
  const getSidebarUsers = () => {
    const mergedMap = {};

    // Add friends (all connections)
    (friends || []).forEach((f) => {
      if (!f?._id) return;
      mergedMap[f._id] = { otherUser: f, lastMessage: null };
    });

    // Merge in conversations (update lastMessage if exists)
    (conversations || []).forEach((c) => {
      const id = c?.otherUser?._id;
      if (!id) return;
      mergedMap[id] = { otherUser: c.otherUser, lastMessage: c.lastMessage || null };
    });

    // Convert to array
    const merged = Object.values(mergedMap);

    // Sort: newest lastMessage first, then friends without messages
    merged.sort((a, b) => {
      if (a.lastMessage && b.lastMessage) return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
      if (a.lastMessage) return -1;
      if (b.lastMessage) return 1;
      return 0;
    });

    return merged;
  };

  // Select user and load messages
  const handleSelectUser = async (otherUser) => {
    if (!otherUser?._id) return;
    setSelectedUser(otherUser);
    try {
      const msgs = await getMessagesWithUser(otherUser._id);
      setMessages(Array.isArray(msgs) ? msgs : []);
      markMessagesRead(otherUser._id);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser?._id) return;

    try {
      const msg = await sendMessage(selectedUser._id, newMessage.trim());
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");

      const otherUser = msg.sender?._id === user._id ? msg.recipient : msg.sender;

      setConversations((prev) => {
        const exists = prev.some((c) => c.otherUser._id === otherUser._id);
        if (!exists) return [...prev, { otherUser, lastMessage: msg }];
        return prev.map((c) => (c.otherUser._id === otherUser._id ? { ...c, lastMessage: msg } : c));
      });

      socketAPI.getSocket()?.emit("sendMessage", msg);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Live updates
  useEffect(() => {
    const s = socketAPI.getSocket();
    if (!s) return;

    const onMessage = (msg) => {
      const other = msg.sender?._id === user._id ? msg.recipient : msg.sender;
      if (!other?._id) return;

      setConversations((prev) => {
        const exists = prev.some((c) => c.otherUser._id === other._id);
        if (!exists) return [...prev, { otherUser: other, lastMessage: msg }];
        return prev.map((c) => (c.otherUser._id === other._id ? { ...c, lastMessage: msg } : c));
      });

      if (selectedUser?._id === other._id) {
        setMessages((prev) => [...prev, msg]);
        markMessagesRead(other._id);
      }
    };

    const onFriendAdded = (newFriend) => {
      if (!newFriend?._id) return;
      setFriends((prev) => (prev.some((f) => f._id === newFriend._id) ? prev : [...prev, newFriend]));
    };

    s.on("newMessage", onMessage);
    s.on("friend-added", onFriendAdded);

    return () => {
      s.off("newMessage", onMessage);
      s.off("friend-added", onFriendAdded);
    };
  }, [selectedUser, user?._id, markMessagesRead]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sidebarUsers = getSidebarUsers();

  return (
    <div className="linkedin-messages">
      {/* Sidebar */}
      <div className="linkedin-sidebar">
        <div className="sidebar-header">
          <h3>Messaging</h3>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : loadingError ? (
          <p className="loading-error">{loadingError}</p>
        ) : sidebarUsers.length ? (
          sidebarUsers.map((c) => {
            const other = c?.otherUser;
            if (!other?._id) return null;
            return (
              <div
                key={other._id}
                className={`sidebar-user ${selectedUser?._id === other._id ? "active" : ""}`}
                onClick={() => handleSelectUser(other)}
              >
                <img
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${other._id}`}
                  alt="avatar"
                  className="sidebar-avatar"
                />
                <p className="sidebar-username">{other.firstName} {other.lastName}</p>
              </div>
            );
          })
        ) : (
          <p className="no-users">No connections found.</p>
        )}
      </div>

      {/* Chat area */}
      <div className="linkedin-chat">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <img
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${selectedUser._id}`}
                  alt="avatar"
                  className="chat-header-avatar"
                />
                <h3>{selectedUser.firstName} {selectedUser.lastName}</h3>
              </div>
            </div>

            <div className="chat-body">
              {messages.length ? (
                messages.map((msg) => (
                  <div key={msg._id} className={`chat-bubble ${msg.sender?._id === user._id ? "sent" : "received"}`}>
                    <p>{msg.text}</p>
                    <span className="chat-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                ))
              ) : (
                <p className="no-messages">No messages yet.</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-footer">
              <div className="chat-input-wrapper">
                <textarea
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows="1"
                  className="chat-textarea"
                />
                <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
                  <i className="fas fa-paper-plane" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="empty-chat">
            <p>Select a connection to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
