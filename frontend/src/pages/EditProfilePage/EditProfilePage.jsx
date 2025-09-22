// frontend/src/pages/EditProfilePage/EditProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import Avatar from "../../components/Avatar/Avatar";
// import { getAvatarPreview, cleanupPreview } from "../../utils/avatar";
import {
  getAvatarPreview,
  cleanupPreview,
  getSafeAvatarUrl,
} from "../../utils/avatar";

import "./EditProfilePage.css";

export default function EditProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    occupation: "",
    education: "",
    canHelpWith: "",
    needHelpWith: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/default-avatar.png");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        occupation: user.occupation || "",
        education: user.education || "",
        canHelpWith: (user.canHelpWith || []).join(", "),
        needHelpWith: (user.needHelpWith || []).join(", "),
      });
      setAvatarPreview(user.avatar || "/default-avatar.png");
    }
  }, [user]);

  useEffect(() => () => cleanupPreview(avatarPreview), [avatarPreview]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "avatarFile" && files?.[0]) {
      const f = files[0];
      setAvatarFile(f);
      setAvatarPreview(getAvatarPreview(f));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (avatarFile) data.append("avatarFile", avatarFile);

    try {
      const token = localStorage.getItem("token");
      const updated = await authService.updateProfile(data, token);

      // ✅ Normalize avatar URL immediately
      const safeAvatar = getSafeAvatarUrl(updated.avatar);

      setUser({
        ...updated,
        avatar: safeAvatar,
      });

      // ✅ Update local preview immediately
      setAvatarPreview(safeAvatar);

      navigate("/profile");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed — see console");
    }
  }

  return (
    <form
      className="edit-profile-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First name"
      />
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last name"
      />
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Bio"
      />
      <input
        name="occupation"
        value={formData.occupation}
        onChange={handleChange}
        placeholder="Occupation"
      />
      <input
        name="education"
        value={formData.education}
        onChange={handleChange}
        placeholder="Education"
      />
      <input
        name="canHelpWith"
        value={formData.canHelpWith}
        onChange={handleChange}
        placeholder="I can help with (comma separated)"
      />
      <input
        name="needHelpWith"
        value={formData.needHelpWith}
        onChange={handleChange}
        placeholder="I need help with (comma separated)"
      />
      <input
        type="file"
        name="avatarFile"
        accept="image/png,image/jpeg"
        onChange={handleChange}
      />
      <Avatar
        src={avatarPreview}
        alt="Avatar Preview"
        className="avatar-preview"
      />
      <button type="submit">Save Changes</button>
    </form>
  );
}
