
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
                  // src={n.fromUser?.avatar || "/default-avatar.png"}
                  src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
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
