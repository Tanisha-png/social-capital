
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar/NavBar";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LogInPage/LogInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ProfilePage from "./pages/ProfilePage/profilePage";
import PostListPage from "./pages/PostListPage/PostListPage";
import NewPostPage from "./pages/NewPostPage/NewPostPage";
import MessagesPage from "./pages/MessagesPage/messagesPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import PostDetailPage from "./pages/Posts/PostDetailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";

import { initSocket } from "./socket"; // ✅ Import socket init
import "./app.css";



// Private Route
function PrivateRoute({ children }) {
  const { user, initialized } = useAuth();
  if (!initialized) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Initialize socket for notifications
  useEffect(() => {
    if (user?._id) {
      initSocket(user._id, (notif) => {
        // Add new notifications to state (so UI can update immediately)
        setNotifications((prev) => [notif, ...prev]);
      });
    }
  }, [user]);

  // Optional: existing click listener
  useEffect(() => {
    const handleClick = () => {}; // no-op
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="page-container">
      <NavBar notifications={notifications} />{" "}
      {/* Pass notifications to NavBar */}
      <div className="content-wrap">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* Private */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <PostListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/new"
            element={
              <PrivateRoute>
                <NewPostPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <MessagesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <PrivateRoute>
                <FriendsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfilePage />
              </PrivateRoute>
            }
          />

          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/messages/:id" element={<MessagesPage />} />
          <Route
            path="/messages/:userId"
            element={
              <PrivateRoute>
                <MessagesPage />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Social Capital. All rights reserved.</p>
      </footer>
    </div>
  );
}
