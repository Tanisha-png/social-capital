
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MessagesDropdown from "../MessagesDropdown/MessagesDropdown";
import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";
import socket from "../../socket";
import "./NavBar.css";

export default function NavBar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);

      socket.on("newMessage", (msg) => {
        if (msg.recipient?._id === user._id) {
          setHasNewMessage(true);
        }
      });
    }

    return () => {
      socket.off("newMessage");
    };
  }, [user]);

  const handleMessagesClick = () => {
    setHasNewMessage(false);
    navigate("/messages");
  };

  const displayName = user?.firstName || user?.name || user?.email || "User";

  return (
    <nav className="navbar">
      {/* LEFT SIDE */}
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          Social Capital
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">
        {user ? (
          <>
            {/* 👤 Avatar + Name */}
            <Link to="/profile" className="nav-user-info">
              <img
                src={user.avatar || user.profileImage || "/default-avatar.png"}
                alt={user.firstName || user.name}
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

            {/* 🔔 Notifications */}
            <div className="nav-icon-wrapper">
              <NotificationsDropdown />
            </div>

            {/* ✉️ Messages */}
            <div
              className="nav-icon-wrapper nav-message-icon"
              onClick={handleMessagesClick}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <MessagesDropdown />
              {hasNewMessage && (
                <span
                  className="message-notification-dot"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#d93025",
                    border: "2px solid white",
                  }}
                ></span>
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
