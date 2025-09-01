import React, { useState, useEffect } from "react";

import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileCard({ profile, currentUser }) {
    const { token } = useAuth();

    const sendRequest = async () => {
        try {
        await axios.post(
            `http://localhost:5000/api/connections/${profile._id}/send-request`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Request sent");
        } catch (e) {
        alert(e.response?.data?.message || e.message);
        }
    };

    return (
        <div style={{ border: "1px solid #ddd", padding: 12, width: 400 }}>
        <img
            src={profile.avatar || "https://via.placeholder.com/80"}
            alt="avatar"
            style={{ width: 80, height: 80, borderRadius: 40 }}
        />
        <h2>{profile.username}</h2>
        <p>{profile.bio}</p>
        {String(profile._id) !== String(currentUser.id) && (
            <button onClick={sendRequest}>Add Friend</button>
        )}
        </div>
    );
}
