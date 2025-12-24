// src/context/NotificationContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "./AuthContext";
// import { initSocket } from "../socket";
// import API from "../api/axios";

// const NotificationContext = createContext();

// export function NotificationProvider({ children }) {
//     const { user } = useAuth();
//     const [notifications, setNotifications] = useState([]);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const token = localStorage.getItem("token");

//     const fetchNotifications = async () => {
//         if (!token || !user) return;
//         try {
//         const { data } = await API.get("/notifications", {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         setNotifications(data);
//         setUnreadCount(
//             data.filter(
//             (n) => !n.read && ["post_like", "post_reply"].includes(n.type)
//             ).length
//         );
//         } catch (err) {
//         console.error("Failed to fetch notifications:", err);
//         }
//     };

//     useEffect(() => {
//         if (!user || !token) return;
//         fetchNotifications();

//         const socket = initSocket(token, user._id, (notif) => {
//         if (!notif) return;
//         if (notif.user?.toString() !== user._id.toString()) return;

//         setNotifications((prev) => [notif, ...prev]);
//         if (["post_like", "post_reply"].includes(notif.type)) {
//             setUnreadCount((prev) => prev + 1);
//         }
//         });

//         return () => {
//         if (socket) socket.off("notification");
//         };
//     }, [user, token]);

//     return (
//         <NotificationContext.Provider
//         value={{
//             notifications,
//             setNotifications,
//             unreadCount,
//             fetchNotifications,
//         }}
//         >
//         {children}
//         </NotificationContext.Provider>
//     );
//     }

//     export function useNotifications() {
//     return useContext(NotificationContext);
// }

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { initSocket } from "../socket";
import API from "../api/axios";

const NotificationContext = createContext();

const COUNTED_TYPES = ["post_like", "post_reply", "friend_request"];

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const token = localStorage.getItem("token");

    const fetchNotifications = async () => {
        if (!token || !user) return;

        try {
        const { data } = await API.get("/notifications", {
            headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(data);
        setUnreadCount(
            data.filter((n) => !n.read && COUNTED_TYPES.includes(n.type)).length
        );
        } catch (err) {
        console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        if (!user || !token) return;
        fetchNotifications();

        const socket = initSocket(token, user._id, (notif) => {
        if (!notif) return;
        if (notif.user?.toString() !== user._id.toString()) return;

        setNotifications((prev) => [notif, ...prev]);

        if (!notif.read && COUNTED_TYPES.includes(notif.type)) {
            setUnreadCount((prev) => prev + 1);
        }
        });

        return () => {
        if (socket) socket.off("notification");
        };
    }, [user, token]);

    return (
        <NotificationContext.Provider
        value={{
            notifications,
            setNotifications,
            unreadCount,
            fetchNotifications,
        }}
        >
        {children}
        </NotificationContext.Provider>
    );
    }

    export function useNotifications() {
    return useContext(NotificationContext);
}
