// components/NotificationsDropdown/NotificationsDropdown.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/socketContext";

export default function NotificationsDropdown() {
  const { user } = useAuth();
  const { socket } = useSocket(); // <-- ✅ destructure correctly
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetch existing notifications from API when user logs in
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  // Listen for real-time notifications from socket
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  return (
    <div className="relative">
      <button onClick={() => setOpen((prev) => !prev)}>
        🔔 {notifications.length > 0 && <span>({notifications.length})</span>}
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
