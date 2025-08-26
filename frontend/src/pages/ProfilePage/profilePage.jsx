//
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import ProfilePage from "./pages/ProfilePage";
// import MessagesPage from "./pages/MessagesPage";
// import { useAuth } from "./contexts/AuthContext";

// export default function App() {
//     const { user, isLoading } = useAuth();

//     if (isLoading) return <p>Loading...</p>;

//     return (
//         <Routes>
//         {/* Public route */}
//         <Route
//             path="/login"
//             element={user ? <Navigate to={`/profile/${user.id}`} /> : <LoginPage />}
//         />

//         {/* Protected routes */}
//         <Route
//             path="/profile/:id"
//             element={user ? <ProfilePage /> : <Navigate to="/login" />}
//         />
//         <Route
//             path="/messages"
//             element={user ? <MessagesPage /> : <Navigate to="/login" />}
//         />
//         <Route
//             path="/posts"
//             element={user ? <div>Post List Page</div> : <Navigate to="/login" />}
//         />
//         <Route
//             path="/posts/new"
//             element={user ? <div>New Post Page</div> : <Navigate to="/login" />}
//         />

//         {/* Catch-all */}
//         <Route
//             path="*"
//             element={<Navigate to={user ? `/profile/${user.id}` : "/login"} />}
//         />
//         </Routes>
//     );
// }

// import React from "react";
// import { useParams } from "react-router-dom";

// export default function ProfilePage() {
//     const { id } = useParams();

//     return (
//         <div>
//         <h2>Profile Page</h2>
//         <p>User ID: {id}</p>
//         </div>
//     );
// }

// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import * as authService from "../../services/authService";
import ConnectionsList from "../../components/ConnectionsList/ConnectionsList";
import PotentialConnections from "../../components/PotentialConnections/PotentialConnections";
import HelpSections from "../../components/HelpSections/HelpSections";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

export default function ProfilePage() {
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        profileImage: "",
        occupation: "",
        education: "",
        canHelpWith: "",
        needHelpWith: "",
    });

    const handleSave = async (e) => {
        e.preventDefault();
        await fetch(`/api/users/${user._id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name, bio }),
        });
        alert("Profile updated!");
    };

    useEffect(() => {
        async function fetchProfile() {
        const profile = await authService.getProfile();
        setUser(profile);
        setFormData({
            profileImage: profile.profileImage || "",
            occupation: profile.occupation || "",
            education: profile.education || "",
            canHelpWith: profile.canHelpWith?.join(", ") || "",
            needHelpWith: profile.needHelpWith?.join(", ") || "",
        });
    }
        fetchProfile();
    }, []);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const updated = await authService.updateProfile({
        ...formData,
        canHelpWith: formData.canHelpWith.split(",").map((s) => s.trim()),
        needHelpWith: formData.needHelpWith.split(",").map((s) => s.trim()),
    });
    setUser(updated);
    }

    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="profile-page">
        <div className="profile-header">
            <img
            src={formData.profileImage || "/default-profile.png"}
            alt="Profile"
            className="profile-img"
        />
        <h2>
            {user.firstName} {user.lastName}
        </h2>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
            <label>Profile Image URL</label>
            <input
            type="text"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
        />

        <label>Occupation</label>
        <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
        />

        <label>Education</label>
        <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
        />

        <label>I can help with (comma separated)</label>
        <input
            type="text"
            name="canHelpWith"
            value={formData.canHelpWith}
            onChange={handleChange}
        />

        <label>I need help with (comma separated)</label>
        <input
            type="text"
            name="needHelpWith"
            value={formData.needHelpWith}
            onChange={handleChange}
        />

        <button type="submit">Save Profile</button>
    </form>

    <HelpSections
        canHelpWith={user.canHelpWith}
        needHelpWith={user.needHelpWith}
    />

    <div className="connections-section">
        <ConnectionsList />
        <PotentialConnections />
    </div>
    </div>
);
}
