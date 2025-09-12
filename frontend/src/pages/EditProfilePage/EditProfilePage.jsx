

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    avatar: "",
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
          avatar: profile.avatar || "",
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          bio: profile.bio || "",
          occupation: profile.occupation || "",
          education: profile.education || "",
          canHelpWith: Array.isArray(profile.canHelpWith)
            ? profile.canHelpWith.join(", ")
            : "",
          needHelpWith: Array.isArray(profile.needHelpWith)
            ? profile.needHelpWith.join(", ")
            : "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // Cleanly convert comma-separated strings into arrays, ignoring empty strings
      const updatedProfile = {
        ...formData,
        canHelpWith: formData.canHelpWith
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        needHelpWith: formData.needHelpWith
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const updatedUser = await authService.updateProfile(updatedProfile);

      // Ensure _id exists for posts context
      if (!updatedUser._id && updatedUser.id) {
        updatedUser._id = updatedUser.id;
      }

      login(updatedUser, token); // update AuthContext
      navigate("/profile");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Try again.");
    }
  };

  if (!user || loading) return <p>Loading form...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Profile Image URL</label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
          {formData.avatar && (
            <img
              src={formData.avatar}
              alt="Preview"
              style={{
                width: "100px",
                height: "100px",
                marginTop: "10px",
                borderRadius: "50%",
              }}
            />
          )}
        </div>

        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>
            Bio:
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
            />
          </label>
        </div>

        <div>
          <label>Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Education</label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>I can help with (comma separated)</label>
          <input
            type="text"
            name="canHelpWith"
            value={formData.canHelpWith}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>I need help with (comma separated)</label>
          <input
            type="text"
            name="needHelpWith"
            value={formData.needHelpWith}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={{ marginTop: "20px" }}>
          Save Profile
        </button>
      </form>
    </div>
  );
}


