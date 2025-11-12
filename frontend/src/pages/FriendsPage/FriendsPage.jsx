
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { removeFriend } from "../../api/userApi";
import { MoreHorizontal } from "lucide-react";

export default function FriendsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState(null); // dropdown tracker
    const menuRefs = useRef({}); // store refs for dropdowns
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    // Fetch user's connections
    useEffect(() => {
        if (!user) return;

        async function fetchFriends() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BACKEND_URL}/api/connections`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch connections");

            const data = await res.json();
            // Normalize avatar to profileImage for consistency in frontend
            const normalized = Array.isArray(data)
            ? data.map((f) => ({ ...f, profileImage: f.avatar }))
            : [];
            setFriends(normalized);
        } catch (err) {
            console.error("Error fetching connections:", err);
            setFriends([]);
        } finally {
            setLoading(false);
        }
        }

        fetchFriends();
    }, [user]);

    // Remove a connection
    const handleRemove = async (friendId) => {
        if (!window.confirm("Are you sure you want to remove this connection?"))
        return;

        try {
        const token = localStorage.getItem("token");
        await removeFriend(friendId, token);
        setFriends((prev) => prev.filter((f) => f._id !== friendId));
        setOpenMenuId(null);
        } catch (err) {
        console.error("Error removing connection:", err);
        }
    };

    // Toggle dropdown
    const toggleMenu = (friendId) => {
        setOpenMenuId((prev) => (prev === friendId ? null : friendId));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
        if (openMenuId && menuRefs.current[openMenuId]) {
            if (!menuRefs.current[openMenuId].contains(e.target)) {
            setOpenMenuId(null);
            }
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId]);

    if (!user || loading) return <p>Loading connections...</p>;

    return (
      <div className="friends-page" style={{ padding: "20px" }}>
        <h2 style={{ marginBottom: "20px" }}>Your Connections</h2>

        {friends.length === 0 ? (
          <p>You don’t have any connections yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {friends.map((friend) => (
              <li
                key={friend._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  padding: "10px 14px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  position: "relative",
                  backgroundColor: "#fff",
                  transition: "box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 5px rgba(0,0,0,0.1)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Friend info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/profile/${friend._id}`)}
                >
                  <img
                    // src={friend.profileImage || "/default-avatar.png"}
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
                    alt={`${friend.firstName} ${friend.lastName}`}
                    style={{
                      width: 55,
                      height: 55,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: 12,
                      border: "1px solid #ccc",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        margin: 0,
                        color: "#0073b1",
                      }}
                    >
                      {friend.firstName} {friend.lastName}
                    </p>
                    {friend.occupation && (
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#555",
                          marginTop: "3px",
                        }}
                      >
                        {friend.occupation}
                      </p>
                    )}
                  </div>
                </div>

                {/* More button + dropdown */}
                <div
                  ref={(el) => (menuRefs.current[friend._id] = el)}
                  style={{ position: "relative" }}
                >
                  <button
                    onClick={() => toggleMenu(friend._id)}
                    style={{
                      backgroundColor: "#f3f2ef",
                      border: "1px solid #ccc",
                      borderRadius: "20px",
                      padding: "6px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "#333",
                      fontSize: "0.9rem",
                    }}
                  >
                    <MoreHorizontal size={16} /> More
                  </button>

                  {openMenuId === friend._id && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "120%",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        zIndex: 100,
                        minWidth: "160px",
                        padding: "6px 0",
                      }}
                    >
                      <button
                        onClick={() => handleRemove(friend._id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 14px",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          color: "#333",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f3f2ef")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        Remove Connection
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}
