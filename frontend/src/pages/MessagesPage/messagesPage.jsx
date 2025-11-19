
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
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getConversations,
  getMessagesWithUser,
  sendMessage,
} from "../../api/messageApi";
import { getFriends } from "../../api/userApi";
import { useMessageNotifications } from "../../context/MessageContext";
import socketAPI from "../../socket";
import "./MessagesPage.css";

/*
  Notes:
  - messageApi and userApi already attach token from localStorage (per your files).
  - socketAPI must export initSocket(token, userId) and getSocket() (per your socket.js).
*/

export default function MessagesPage() {
  const { user, token, getToken, initialized } = useAuth();
  const authToken = token || getToken();

  const { markMessagesRead, unreadByUser = {} } = useMessageNotifications();

  const [conversations, setConversations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  // Wait until auth initialised
  useEffect(() => {
    if (!initialized) return;
    // if no auth, stop loading
    if (!user || !authToken) setLoading(false);
  }, [initialized, user, authToken]);

  // Init socket once when we have token + user id
  useEffect(() => {
    if (!authToken || !user?._id) return;
    const s = socketAPI.initSocket(authToken, user._id);
    // join handled by initSocket
    return () => {
      s?.disconnect?.();
    };
  }, [authToken, user?._id]);

  // Load conversations + friends
  useEffect(() => {
    if (!authToken) return;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadingError(null);

      try {
        const [convosRes, friendsRes] = await Promise.all([
          getConversations(),
          getFriends(),
        ]);

        if (cancelled) return;

        setConversations(Array.isArray(convosRes) ? convosRes : []);
        setFriends(Array.isArray(friendsRes) ? friendsRes : []);
      } catch (err) {
        console.error("Error loading friends/convos:", err);
        setLoadingError(err?.message || "Failed to load conversations/friends");
        setConversations([]);
        setFriends([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authToken]);

  // Merge friends + conversations into sidebar list
  // Guarantee: every friend appears; if a conversation exists with someone, use that lastMessage
  const getSidebarUsers = () => {
    const map = new Map();

    // Add friends first (ensures everyone appears)
    (friends || []).forEach((f) => {
      if (!f || !f._id) return;
      map.set(String(f._id), { otherUser: f, lastMessage: null });
    });

    // Merge conversations - overwrite lastMessage if present
    (conversations || []).forEach((c) => {
      const other = c?.otherUser;
      if (!other || !other._id) return;
      map.set(String(other._id), {
        otherUser: other,
        lastMessage: c.lastMessage || null,
      });
    });

    const merged = Array.from(map.values());

    // Sort: newest conversation lastMessage first, then friends without messages
    merged.sort((a, b) => {
      if (a.lastMessage && b.lastMessage)
        return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
      if (a.lastMessage) return -1;
      if (b.lastMessage) return 1;
      return 0;
    });

    return merged;
  };

  // Selecting a user -> load messages
  const handleSelectUser = async (otherUser) => {
    if (!otherUser || !otherUser._id) return;
    setSelectedUser(otherUser);

    try {
      const msgs = await getMessagesWithUser(otherUser._id);
      setMessages(Array.isArray(msgs) ? msgs : []);
      // Mark read locally/remote
      try {
        markMessagesRead?.(otherUser._id);
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser?. _id) return;

    try {
      const created = await sendMessage(selectedUser._id, newMessage.trim());

      // Append to chat
      setMessages((prev) => [...(prev || []), created]);
      setNewMessage("");

      // Update conversations (or add)
      const otherUser = created.sender?._id === user._id ? created.recipient : created.sender;
      setConversations((prev) => {
        const prevArr = Array.isArray(prev) ? prev : [];
        const exists = prevArr.some((c) => c?.otherUser?._id === otherUser?._id);
        if (!exists) return [...prevArr, { otherUser, lastMessage: created }];
        return prevArr.map((c) =>
          c.otherUser._id === otherUser._id ? { ...c, lastMessage: created } : c
        );
      });

      // Emit via socket to let other user(s) know
      const s = socketAPI.getSocket();
      s?.emit?.("sendMessage", created);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Live updates: messages and friend-added
  useEffect(() => {
    const s = socketAPI.getSocket();
    if (!s) return;

    const onMessage = (msg) => {
      const other = msg?.sender?._id === user._id ? msg.recipient : msg.sender;
      if (!other?. _id) return;

      // Update convos (add or update)
      setConversations((prev) => {
        const prevArr = Array.isArray(prev) ? prev.slice() : [];
        const idx = prevArr.findIndex((c) => c?.otherUser?._id === other._id);
        if (idx === -1) {
          prevArr.push({ otherUser: other, lastMessage: msg });
        } else {
          prevArr[idx] = { ...prevArr[idx], lastMessage: msg };
        }
        return prevArr;
      });

      // If currently selected, append to messages
      if (selectedUser?. _id === other._id) {
        setMessages((prev) => [...(prev || []), msg]);
        try {
          markMessagesRead?.(other._id);
        } catch (e) {}
      }
    };

    const onFriendAdded = (newFriend) => {
      if (!newFriend?. _id) return;
      // Add to friends list if missing
      setFriends((prev) => {
        const prevArr = Array.isArray(prev) ? prev : [];
        if (prevArr.some((f) => f._id === newFriend._id)) return prevArr;
        return [...prevArr, newFriend];
      });

      // Also update conversations map so sidebar shows them immediately
      setConversations((prev) => {
        const prevArr = Array.isArray(prev) ? prev : [];
        if (prevArr.some((c) => c?.otherUser?._id === newFriend._id)) return prevArr;
        return [...prevArr, { otherUser: newFriend, lastMessage: null }];
      });
    };

    s.on("newMessage", onMessage);
    s.on("friend-added", onFriendAdded);

    return () => {
      s.off("newMessage", onMessage);
      s.off("friend-added", onFriendAdded);
    };
  }, [selectedUser, user?._id, markMessagesRead]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sidebarUsers = getSidebarUsers();

  // Render
  return (
    <div className="linkedin-messages">
      {/* LEFT: SIDEBAR */}
      <div className="linkedin-sidebar">
        <div className="sidebar-header">
          <h3>Messaging</h3>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : loadingError ? (
          <p className="loading-error">Error: {loadingError}</p>
        ) : sidebarUsers.length ? (
          sidebarUsers.map((entry) => {
            const other = entry?.otherUser;
            if (!other?. _id) return null;

            return (
              <div
                key={other._id}
                className={`sidebar-user ${selectedUser?._id === other._id ? "active" : ""}`}
                onClick={() => handleSelectUser(other)}
              >
                <img
                  className="sidebar-avatar"
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${other._id}`}
                  alt={`${other.firstName} ${other.lastName}`}
                />
                <div className="sidebar-meta">
                  <div className="sidebar-row">
                    <div className="sidebar-name">{other.firstName} {other.lastName}</div>
                    {/* unread badge on right */}
                    {unreadByUser?.[other._id] > 0 && (
                      <span className="sidebar-unread">{unreadByUser[other._id] > 9 ? "9+" : unreadByUser[other._id]}</span>
                    )}
                  </div>
                  {/* small place to show a compact preview/time but not underlining the name — optional */}
                  <div className="sidebar-sub">
                    {entry.lastMessage ? (
                      <span className="preview">{entry.lastMessage.text?.slice(0, 60)}</span>
                    ) : (
                      <span className="muted">No messages yet</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-users">No connections found.</p>
        )}
      </div>

      {/* RIGHT: CHAT */}
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
              {Array.isArray(messages) && messages.length ? (
                messages.map((m) => (
                  <div key={m._id || `${m.createdAt}-${Math.random()}`} className={`chat-bubble ${m.sender?._id === user._id ? "sent" : "received"}`}>
                    <p>{m.text}</p>
                    <span className="chat-time">{m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
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
                  rows={1}
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
