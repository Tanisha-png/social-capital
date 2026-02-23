import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        });

        const data = await res.json();

        alert(data.message);

        if (res.ok) navigate("/login");
    };

    return (
        <div>
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
            <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            <button type="submit">Reset Password</button>
        </form>
        </div>
    );
}
