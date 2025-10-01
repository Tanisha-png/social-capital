import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar/NavBar";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import PostListPage from "./pages/PostListPage/PostListPage";
import NewPostPage from "./pages/NewPostPage/NewPostPage";
import MessagesPage from "./pages/MessagesPage/MessagesPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import FriendsPage from "./pages/FriendsPage/FriendsPage";
import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import PostDetailPage from "./pages/Posts/PostDetailPage";

import "./App.css";

// Private Route
function PrivateRoute({ children }) {
    const { user, initialized } = useAuth();

    // Show nothing (or a spinner) until AuthContext finishes initializing
    if (!initialized) return <p>Loading...</p>;

    return user ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <div className="page-container">
        <NavBar />
        <div className="content-wrap">
            <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

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
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />

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
