
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMessagesWithUser, sendMessage } from "../../services/messageApi";
import { getAllUsers } from "../../api/userApi";
import socket from "../../socket";
import "./messagesPage.css";

export default function MessagesPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch all users
  useEffect(() => {
    if (!token || !user?._id) return;
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers(token);
        setUsers(allUsers.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token, user]);

  // Socket setup
  useEffect(() => {
    if (!socket.connected) socket.connect();
    if (user?._id) socket.emit("join", user._id);

    socket.on("newMessage", (msg) => {
      if (
        selectedUser &&
        (msg.sender._id === selectedUser._id ||
          msg.recipient._id === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("newMessage");
  }, [selectedUser, user]);

  // Select user
  const handleSelectUser = async (u) => {
    setSelectedUser(u);
    setMessages([]);
    try {
      const msgs = await getMessagesWithUser(u._id, token);
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const msg = await sendMessage(selectedUser._id, newMessage.trim(), token);
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      socket.emit("sendMessage", msg);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="linkedin-messages">
      {/* Sidebar */}
      <div className="linkedin-sidebar">
        <div className="sidebar-header">
          <h3>Messaging</h3>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : users.length ? (
          users.map((u) => (
            <div
              key={u._id}
              className={`sidebar-user ${
                selectedUser?._id === u._id ? "active" : ""
              }`}
              onClick={() => handleSelectUser(u)}
            >
              <img
                src={
                  u.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                className="sidebar-avatar"
              />
              <div className="sidebar-user-info">
                <p className="sidebar-username">
                  {u.firstName} {u.lastName}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-users">No users found.</p>
        )}
      </div>

      {/* Chat section */}
      <div className="linkedin-chat">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <img
                  src={
                    selectedUser.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="avatar"
                  className="chat-header-avatar"
                />
                <h3>
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
              </div>
            </div>

            <div className="chat-body">
              {messages.length ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`chat-bubble ${
                      msg.sender._id === user._id ? "sent" : "received"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="chat-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="no-messages">No messages yet.</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-footer">
              <input
                type="text"
                placeholder="Write a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="empty-chat">
            <p>Select a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
