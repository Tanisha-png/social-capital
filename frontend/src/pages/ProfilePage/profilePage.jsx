import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../../api/userApi";
import { useAuth } from "../../contexts/AuthContext";
import FriendRequestList from "../components/FriendRequestList";
import ProfileCard from "../components/ProfileCard";

export default function ProfilePage() {
    const { id } = useParams();
    const { token, user } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!token) return;
        (async () => {
        try {
            const data = await getProfile(id, token);
            setProfile(data);
        } catch (err) {
            console.error(err);
        }
        })();
    }, [id, token]);

    if (!profile) return <div>Loading...</div>;

    return (
        <div style={{ padding: 20 }}>
        <ProfileCard profile={profile} currentUser={user} />
        <div style={{ marginTop: 20 }}>
            <h3>Friend Requests (to you)</h3>
            <FriendRequestList requests={profile.friendRequests} />
        </div>
        </div>
    );
}
