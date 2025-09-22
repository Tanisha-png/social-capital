

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown"; // ✅ import the dropdown
import "./NavBar.css";

export default function NavBar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const displayName = user?.firstName || user?.name || user?.email;

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
            <span className="nav-username">{displayName}</span>
            <Link to="/posts" className="nav-button">Posts</Link>
            <Link to="/posts/new" className="nav-button">New Post</Link>
            <Link to="/messages" className="nav-button">Messages</Link>
            <Link to="/friends" className="nav-button">Friends</Link>
            <Link to="/search" className="nav-button">Search</Link>

            {/* ✅ Notifications bell */}
            <NotificationsDropdown />

            <Link to="/profile" className="nav-button">Profile</Link>
            <button className="nav-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/signup" className="nav-button">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
