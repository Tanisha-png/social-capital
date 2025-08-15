import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
    const { user } = useAuth();

    return (
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
            path="/profile/:id"
            element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
            path="/messages"
            element={user ? <MessagesPage /> : <Navigate to="/login" />}
        />
        <Route
            path="*"
            element={<Navigate to={user ? `/profile/${user.id}` : "/login"} />}
        />
        </Routes>
    );
    }
