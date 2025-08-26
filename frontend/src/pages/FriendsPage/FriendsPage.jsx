import { useEffect, useState } from "react";

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);

    const fetchFriends = () => {
        fetch("/api/friends", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => res.json())
        .then((data) => {
            setFriends(data.friends);
            setRequests(data.requests);
        });
    };

    useEffect(fetchFriends, []);

    const handleAction = async (type, id) => {
        await fetch(`/api/friends/${type}/${id}`, {
        method: type === "remove" ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        fetchFriends();
    };

    return (
        <div>
        <h2>Friends</h2>
        <ul>
            {friends.map((f) => (
            <li key={f._id}>
                {f.name}{" "}
                <button onClick={() => handleAction("remove", f._id)}>
                Remove
                </button>
            </li>
            ))}
        </ul>

        <h3>Friend Requests</h3>
        <ul>
            {requests.map((r) => (
            <li key={r._id}>
                {r.name}
                <button onClick={() => handleAction("accept", r._id)}>
                Accept
                </button>
                <button onClick={() => handleAction("decline", r._id)}>
                Decline
                </button>
            </li>
            ))}
        </ul>
        </div>
    );
}


