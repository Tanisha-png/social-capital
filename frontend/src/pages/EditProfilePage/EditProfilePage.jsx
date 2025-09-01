import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import "../ProfilePage/ProfilePage.css"; // reuse ProfilePage styles

export default function EditProfilePage() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        profileImage: "",
        firstName: "",
        lastName: "",
        bio: "",
        occupation: "",
        education: "",
        canHelpWith: "",
        needHelpWith: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
        if (!user) return;
        try {
            const token = localStorage.getItem("token");
            const profile = await authService.getProfile(token);

            setFormData({
            profileImage: profile.profileImage || "",
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            bio: profile.bio || "",
            occupation: profile.occupation || "",
            education: profile.education || "",
            canHelpWith: profile.canHelpWith?.join(", ") || "",
            needHelpWith: profile.needHelpWith?.join(", ") || "",
            });
        } catch (err) {
            console.error("Failed to load profile:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchProfile();
    }, [user]);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
        const token = localStorage.getItem("token");
        const updated = await authService.updateProfile(token, {
            ...formData,
            canHelpWith: formData.canHelpWith.split(",").map((s) => s.trim()),
            needHelpWith: formData.needHelpWith.split(",").map((s) => s.trim()),
        });

        // Update context with new user data
        login(updated, token);
        alert("Profile updated!");
        } catch (err) {
        console.error("Failed to update profile:", err);
        alert("Profile update failed");
        }
    }

    if (!user || loading) return <p>Loading form...</p>;

    return (
        <form className="profile-form" onSubmit={handleSubmit}>
        <label>Profile Image URL</label>
        <input
            type="text"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
        />

        <label>First Name</label>
        <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
        />

        <label>Last Name</label>
        <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
        />

        <label>Bio</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} />

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
    );
}
