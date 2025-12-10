
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function LogInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await authService.login(formData);
      console.log(user, token)
      login(user, token);
      navigate("/"); // keep homepage
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <>
    <h2>Log In!</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Login</button>
        <button type="submit">Forgot Password</button>
      </form>
    </>
  );
}
