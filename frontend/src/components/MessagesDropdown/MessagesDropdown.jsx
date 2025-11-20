
// import React, { useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useMessageNotifications } from "../../context/MessageContext";
// import { Mail } from "lucide-react";
// import "./MessagesDropdown.css";

// export default function MessagesDropdown() {
//   const { unreadCount, markMessagesRead } = useMessageNotifications();
//   const location = useLocation();

//   // Clear unread when visiting /messages
//   useEffect(() => {
//     if (location.pathname === "/messages" && unreadCount > 0) {
//       markMessagesRead();
//     }
//   }, [location.pathname, unreadCount, markMessagesRead]);

//   const handleClick = () => {
//     if (unreadCount > 0) markMessagesRead();
//   };

//   return (
//     <div className="nav-icon-wrapper" style={{ position: "relative" }}>
//       <Link to="/messages" onClick={handleClick}>
//         <div className="nav-envelope-icon">
//           <Mail size={22} />
//           {unreadCount > 0 && (
//             <span className="nav-envelope-badge">
//               {unreadCount > 9 ? "9+" : unreadCount}
//             </span>
//           )}
//         </div>
//       </Link>
//     </div>
//   );
// }

import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMessageNotifications } from "../../context/MessageContext";
import { Mail } from "lucide-react";
import "./MessagesDropdown.css";

export default function MessagesDropdown() {
  const { unreadCount, markMessagesRead } = useMessageNotifications();
  const location = useLocation();
  const clearedOnPath = useRef(false);

  // Clear unread only once when visiting /messages
  useEffect(() => {
    if (
      location.pathname === "/messages" &&
      unreadCount > 0 &&
      !clearedOnPath.current
    ) {
      console.log("[MessagesDropdown] Clearing unread on /messages route");
      markMessagesRead();
      clearedOnPath.current = true;
    } else if (location.pathname !== "/messages") {
      clearedOnPath.current = false; // reset when leaving /messages
    }
  }, [location.pathname, unreadCount, markMessagesRead]);

  const handleClick = () => {
    if (unreadCount > 0) {
      console.log("[MessagesDropdown] Envelope clicked, clearing unread");
      markMessagesRead();
    }
  };

  return (
    <div className="nav-icon-wrapper" style={{ position: "relative" }}>
      <Link to="/messages" onClick={handleClick}>
        <div className="nav-envelope-icon">
          <Mail size={22} />
          {unreadCount > 0 && (
            <span className="nav-envelope-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
