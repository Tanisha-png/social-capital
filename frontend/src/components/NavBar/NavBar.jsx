
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useMessageNotifications } from "../../context/MessageContext";
// import MessagesDropdown from "../MessagesDropdown/MessagesDropdown";
// import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";
// import { useNotifications } from "../../context/NotificationContext";
// import "./NavBar.css";

// export default function NavBar() {
//   const { user, logOut } = useAuth();
//   const { unreadByUser } = useMessageNotifications();
//   const { unreadCount } = useNotifications();
//   const navigate = useNavigate();

//   const totalUnread = Object.values(unreadByUser).reduce(
//     (sum, val) => sum + val,
//     0
//   );

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
//                 src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
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

//             <div className="nav-icon-wrapper" style={{ position: "relative" }}>
//               <NotificationsDropdown />
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

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMessageNotifications } from "../../context/MessageContext";
import MessagesDropdown from "../MessagesDropdown/MessagesDropdown";
import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";
import "./NavBar.css";

export default function NavBar() {
  const { user, logOut } = useAuth();
  const { unreadByUser } = useMessageNotifications();
  const navigate = useNavigate();

  const totalUnread = Object.values(unreadByUser || {}).reduce(
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
                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
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
                <span className="message-badge">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
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
