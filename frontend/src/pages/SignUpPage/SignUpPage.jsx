// frontend/src/pages/SignUpPage/SignUpPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import Avatar from "../../components/Avatar/Avatar";
import { getAvatarPreview, cleanupPreview } from "../../utils/avatar";
import "./SignUpPage.css";

export default function SignUpPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/default-avatar.png");

  useEffect(() => () => cleanupPreview(avatarPreview), [avatarPreview]);

  const avatarUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
    formData.name || "user"
  )}`;

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
      const res = await authService.signup(data);
      login(res.user, res.token);
      navigate("/profile");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed — check console");
    }
  }

  return (
    <form
      className="signup-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        type="password"
        required
      />
      <input
        type="file"
        name="avatarFile"
        accept="image/png,image/jpeg"
        onChange={handleChange}
      />
      <Avatar
        src={avatarUrl}
        alt="Avatar preview"
        className="avatar-preview"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
