

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    avatar: "",
    avatarFile: null,
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
          avatarFile: null,
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG and PNG images are allowed!");
        e.target.value = ""; // reset the file input
        return;
      }

      setFormData({ ...formData, avatarFile: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const payload = new FormData();
      if (formData.avatarFile)
        payload.append("avatarFile", formData.avatarFile);
      else payload.append("avatar", formData.avatar); // fallback to URL

      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("bio", formData.bio);
      payload.append("occupation", formData.occupation);
      payload.append("education", formData.education);
      payload.append(
        "canHelpWith",
        formData.canHelpWith
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
      payload.append(
        "needHelpWith",
        formData.needHelpWith
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );

      const updatedUser = await authService.updateProfile(payload, token, true);

      // Ensure _id exists for posts context
      if (!updatedUser._id && updatedUser.id) updatedUser._id = updatedUser.id;

      login(updatedUser, token);
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
        {/* Profile Image Upload */}
        <div>
          <label>Profile Image Upload</label>
          <input
            type="file"
            name="avatarFile"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
          />
          {formData.avatarFile && (
            <img
              src={URL.createObjectURL(formData.avatarFile)}
              alt="Preview"
              style={{
                width: "100px",
                height: "100px",
                marginTop: "10px",
                borderRadius: "50%",
              }}
            />
          )}
          {!formData.avatarFile && formData.avatar && (
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

        {/* Personal Info */}
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

        {/* Help Fields */}
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



