
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useMessageNotifications } from "../../context/MessageContext";
// import MessagesDropdown from "../MessagesDropdown/MessagesDropdown";
// import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";
// import { useNotifications } from "../../context/NotificationContext";
// import socket from "../../socket";
// import axios from "axios";
// import "./NavBar.css";

// export default function NavBar() {
//   const { user, logOut } = useAuth();
//   const { unreadByUser } = useMessageNotifications();
//   const { unreadCount } = useNotifications();
//   const navigate = useNavigate();
//   const [postNotifCount, setPostNotifCount] = useState(0);
//   const [unreadPostNotifs, setUnreadPostNotifs] = useState(0); // ✅ Add this

//   const totalUnread = Object.values(unreadByUser).reduce(
//     (sum, val) => sum + val,
//     0
//   );

//   // ✅ Load unread post notifications count when app loads
//   // useEffect(() => {
//   //   const fetchCounts = async () => {
//   //     if (!user?._id) return;
//   //     try {
//   //       const res = await axios.get("/api/notifications/counts", {
//   //         withCredentials: true,
//   //       });
//   //       setUnreadPostNotifs(res.data.postCount); // ✅ Store bell counter
//   //     } catch (err) {
//   //       console.error("Failed to load notification counts:", err);
//   //     }
//   //   };

//   //   fetchCounts();
//   // }, [user]);

//   useEffect(() => {
//     if (user?._id) {
//       axios
//         .get("/api/notifications/counts")
//         .then((res) => setPostNotifCount(res.data.postCount))
//         .catch((err) => console.error("Notif count error:", err));
//     }
//   }, [user]);

//   // ✅ Socket join + listen for new notifications
//   useEffect(() => {
//     if (!user?._id) return;

//     socket.emit("join", user._id);

//     socket.on("notification", (notif) => {
//       if (notif.type === "post_like" || notif.type === "post_reply") {
//         setUnreadPostNotifs((prev) => prev + 1); // ✅ Increment bell instantly
//       }
//     });

//     return () => socket.off("notification");
//   }, [user]);

//   const handleLogout = () => {
//     logOut();
//     navigate("/login");
//   };

//   const displayName = user?.firstName || user?.name || user?.email || "User";

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <Link to="/" className="nav-logo">
//           Social Capital
//         </Link>
//       </div>

//       <div className="navbar-right">
//         {user ? (
//           <>
//             <Link to="/profile" className="nav-user-info">
//               <img
//                 src={user.avatar || user.profileImage || "/default-avatar.png"}
//                 alt={displayName}
//                 className="nav-avatar"
//               />
//               <span className="nav-username">{displayName}</span>
//             </Link>

//             <Link to="/posts" className="nav-button">
//               Posts
//             </Link>
//             <Link to="/posts/new" className="nav-button">
//               New Post
//             </Link>
//             <Link to="/friends" className="nav-button">
//               Connections
//             </Link>
//             <Link to="/search" className="nav-button">
//               Search
//             </Link>

//             {/* ✅ Wrap bell with badge */}
//             {/* <div className="nav-icon-wrapper" style={{ position: "relative" }}>
//               <NotificationsDropdown />
//               {unreadPostNotifs > 0 && (
//                 <span className="notification-badge">{unreadPostNotifs}</span>
//               )}
//             </div> */}

//             <div className="nav-icon-wrapper" style={{ position: "relative" }}>
//               <NotificationsDropdown />

//               {postNotifCount > 0 && (
//                 <span className="notification-badge">{postNotifCount}</span>
//               )}
//             </div>

//             <div className="nav-icon-wrapper" style={{ position: "relative" }}>
//               <MessagesDropdown />
//               {totalUnread > 0 && (
//                 <span className="message-badge">{totalUnread}</span>
//               )}
//             </div>

//             <button className="nav-button" onClick={handleLogout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="nav-button">
//               Login
//             </Link>
//             <Link to="/signup" className="nav-button">
//               Sign Up
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// import React, { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMessageNotifications } from "../../context/MessageContext";
import MessagesDropdown from "../MessagesDropdown/MessagesDropdown";
import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";
import { useNotifications } from "../../context/NotificationContext";
import "./NavBar.css";

export default function NavBar() {
  const { user, logOut } = useAuth();
  const { unreadByUser } = useMessageNotifications();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const totalUnread = Object.values(unreadByUser).reduce(
    (sum, val) => sum + val,
    0
  );

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const displayName = user?.firstName || user?.name || user?.email || "User";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          Social Capital
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/profile" className="nav-user-info">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={displayName}
                className="nav-avatar"
              />
              <span className="nav-username">{displayName}</span>
            </Link>

            <Link to="/posts" className="nav-button">
              Posts
            </Link>
            <Link to="/posts/new" className="nav-button">
              New Post
            </Link>
            <Link to="/friends" className="nav-button">
              Connections
            </Link>
            <Link to="/search" className="nav-button">
              Search
            </Link>

            <div className="nav-icon-wrapper" style={{ position: "relative" }}>
              <NotificationsDropdown />
            </div>

            <div className="nav-icon-wrapper" style={{ position: "relative" }}>
              <MessagesDropdown />
              {totalUnread > 0 && (
                <span className="message-badge">{totalUnread}</span>
              )}
            </div>

            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">
              Login
            </Link>
            <Link to="/signup" className="nav-button">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
