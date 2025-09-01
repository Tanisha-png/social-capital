
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function FriendsPage() {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        if (!user) return;
        async function fetchFriends() {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/friends", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFriends(data);
        }
        fetchFriends();
    }, [user]);

    if (!user) return <p>Loading friends...</p>;

    return (
        <div>
        <h2>Friends</h2>
        {friends.map((friend) => (
            <div key={friend._id}>{friend.name}</div>
        ))}
        </div>
    );
}


