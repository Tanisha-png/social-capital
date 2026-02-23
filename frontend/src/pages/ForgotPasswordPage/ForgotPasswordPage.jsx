import React, { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setMessage(data.message || "Email sent");
    };

    return (
        <div>
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />

            <button type="submit">Send Reset Link</button>
        </form>

        <p>{message}</p>
        </div>
    );
}
