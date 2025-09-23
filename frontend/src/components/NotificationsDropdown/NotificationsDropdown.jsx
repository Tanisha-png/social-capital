// components/NotificationsDropdown/NotificationsDropdown.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/socketContext";

export default function NotificationsDropdown() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetch existing notifications from API when user logs in
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [user]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      // Prepend new notification
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  // Toggle dropdown & mark all as read
  const handleToggle = async () => {
    const newState = !open;
    setOpen(newState);

    if (newState) {
      try {
        const token = localStorage.getItem("token");
        await fetch("/api/notifications/read-all", {
          method: "PUT", // match your backend route method
          headers: { Authorization: `Bearer ${token}` },
        });

        // Mark notifications as read locally
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button onClick={handleToggle}>
        🔔 {unreadCount > 0 && <span>({unreadCount})</span>}
      </button>

      {open && (
        <div className="absolute bg-white border rounded shadow-md mt-2 p-2 w-64">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className="p-2 border-b last:border-b-0 text-sm">
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
