
// src/components/NotificationsDropdown/NotificationsDropdown.jsx
// import { useState, useEffect, useCallback, useRef } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useSocket } from "../../context/socketContext";
// import API from "../../api/axios";
// import { useNavigate } from "react-router-dom";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

// export default function NotificationsDropdown() {
//   const { user } = useAuth();
//   const { socket } = useSocket();
//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [fade, setFade] = useState(false); // ✅ for fade animation
//   const dropdownRef = useRef(null);

//   const styles = {
//     dropdownMenu: {
//       position: "absolute",
//       right: 0,
//       marginTop: "0.5rem",
//       width: "20rem",
//       maxHeight: "24rem",
//       overflowY: "auto",
//       backgroundColor: "#ffffff",
//       color: "#000000",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//       borderRadius: "0.5rem",
//       zIndex: 50,
//       opacity: fade ? 1 : 0,
//       transform: fade ? "translateY(0)" : "translateY(-10px)",
//       transition: "opacity 0.25s ease, transform 0.25s ease",
//       pointerEvents: fade ? "auto" : "none",
//     },
//     dropdownItem: {
//       padding: "0.5rem",
//       borderBottom: "1px solid #e5e7eb",
//       cursor: "pointer",
//     },
//     unread: {
//       backgroundColor: "#eff6ff",
//       fontWeight: "bold",
//       color: "#000000",
//     },
//     timestamp: {
//       display: "block",
//       fontSize: "0.75rem",
//       color: "#6b7280",
//     },
//     badge: {
//       position: "absolute",
//       top: "-0.25rem",
//       right: "-0.5rem",
//       backgroundColor: "#dc2626",
//       color: "#ffffff",
//       borderRadius: "9999px",
//       padding: "0 0.4rem",
//       fontSize: "0.65rem",
//     },
//   };

//   const fetchNotifications = useCallback(async () => {
//     if (!user) return;
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await fetch(`${API_BASE}/api/notifications`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok)
//         throw new Error(`Failed to fetch notifications (${res.status})`);

//       const data = await res.json();
//       setNotifications(Array.isArray(data) ? data : data.notifications || []);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   useEffect(() => {
//     if (!socket) return;
//     const handleNotification = (notification) => {
//       setNotifications((prev) => [notification, ...prev]);
//     };
//     socket.on("notification", handleNotification);
//     return () => socket.off("notification", handleNotification);
//   }, [socket]);

//   const handleToggle = () => {
//     if (!open) {
//       setOpen(true);
//       setTimeout(() => setFade(true), 10); // ✅ fade in
//     } else {
//       setFade(false);
//       setTimeout(() => setOpen(false), 250); // ✅ fade out duration matches transition
//     }
//   };

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const renderNotificationText = (n) => {
//     if (n.message) return n.message;
//     if (n.post?.content) return `Post: ${n.post.content}`;
//     if (n.messageRef?.content) return `Message: ${n.messageRef.content}`;
//     if (n.text) return n.text;
//     if (n.content) return n.content;
//     return "New notification";
//   };

//   const handleNotificationClick = async (n) => {
//     setFade(false); // start fade out
//     setTimeout(() => setOpen(false), 250); // close after animation

//     if (!user) return;

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       if (!n.read) {
//         await fetch(`${API_BASE}/api/notifications/${n._id}/read`, {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setNotifications((prev) =>
//           prev.map((notif) =>
//             notif._id === n._id ? { ...notif, read: true } : notif
//           )
//         );
//       }

//       if (n.post?._id) navigate(`/posts/${n.post._id}`);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setFade(false);
//         setTimeout(() => setOpen(false), 250);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative inline-block" ref={dropdownRef}>
//       <button onClick={handleToggle} className="nav-notifications relative">
//         🔔
//         {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
//       </button>

//       <div style={styles.dropdownMenu}>
//         {notifications.length === 0 ? (
//           <p className="p-4 text-gray-500 text-sm text-center">
//             No notifications
//           </p>
//         ) : (
//           notifications.map((n, idx) => (
//             <div
//               key={n._id || idx}
//               style={{
//                 ...styles.dropdownItem,
//                 ...(!n.read ? styles.unread : {}),
//               }}
//               onClick={() => handleNotificationClick(n)}
//             >
//               <p>{renderNotificationText(n)}</p>
//               <span style={styles.timestamp}>
//                 {n.createdAt
//                   ? new Date(n.createdAt).toLocaleString()
//                   : "Just now"}
//               </span>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function NotificationsDropdown() {
  const { notifications, unreadCount, fetchNotifications, setNotifications } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen(!open);
    if (!open) fetchNotifications();
  };

  const handleNotificationClick = async (notif) => {
    if (!token) return;
    try {
      if (!notif.read) {
        await API.put(`/notifications/${notif._id}/read`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
      }
      if (notif.post?._id) navigate(`/posts/${notif.post._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="nav-notifications relative flex items-center justify-center"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notifications-dropdown">
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm text-center">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`dropdown-item ${
                  !n.read ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => handleNotificationClick(n)}
              >
                <img
                  src={n.fromUser?.avatar || "/default-avatar.png"}
                  alt={n.fromUser?.firstName || "User"}
                />
                <div className="notification-text">
                  <span>
                    <strong>
                      {n.fromUser?.firstName || "Someone"}{" "}
                      {n.fromUser?.lastName || ""}
                    </strong>{" "}
                    {n.type === "post_like"
                      ? "liked"
                      : n.type === "post_reply"
                      ? "commented on"
                      : "interacted with"}{" "}
                    your post
                  </span>
                  {n.post?.content && (
                    <span className="post-preview">
                      {n.post.content.length > 70
                        ? n.post.content.substring(0, 67) + "..."
                        : n.post.content}
                    </span>
                  )}
                  <span className="timestamp">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
