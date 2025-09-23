
// NavBar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationsDropdown from "../NotificationsDropdown/NotificationsDropdown";
import "./NavBar.css";

export default function NavBar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const [counts, setCounts] = useState({ postCount: 0, messageCount: 0 });

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const displayName = user?.firstName || user?.name || user?.email;

  // ✅ Fetch notification + message counts
  useEffect(() => {
    if (!user) return;

    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:3000/api/notifications/counts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setCounts(data); // expected: { postCount, messageCount }
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();

    // Optional: poll every 30s for live updates
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [user]);

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

            {/* 🔔 Post activity notifications */}
            <div className="nav-icon-wrapper">
              <NotificationsDropdown />
              {counts.postCount > 0 && (
                <span className="nav-counter">{counts.postCount}</span>
              )}
            </div>

            {/* ✉️ Message notifications */}
            <div className="nav-icon-wrapper">
              <Link to="/messages" className="nav-button">
                📩
              </Link>
              {counts.messageCount > 0 && (
                <span className="nav-counter">{counts.messageCount}</span>
              )}
            </div>

            <Link to="/profile" className="nav-button">
              Profile
            </Link>
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
