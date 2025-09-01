// import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";

// export default function FriendsPage() {
//     const [friends, setFriends] = useState([]);
//     const [requests, setRequests] = useState([]);

//     const fetchFriends = () => {
//         fetch("/api/friends", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         })
//         .then((res) => res.json())
//         .then((data) => {
//             setFriends(data.friends);
//             setRequests(data.requests);
//         });
//     };

//     useEffect(fetchFriends, []);

//     const handleAction = async (type, id) => {
//         await fetch(`/api/friends/${type}/${id}`, {
//         method: type === "remove" ? "DELETE" : "POST",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         fetchFriends();
//     };

//     return (
//         <div>
//         <h2>Friends</h2>
//         <ul>
//             {friends.map((f) => (
//             <li key={f._id}>
//                 {f.name}{" "}
//                 <button onClick={() => handleAction("remove", f._id)}>
//                 Remove
//                 </button>
//             </li>
//             ))}
//         </ul>

//         <h3>Friend Requests</h3>
//         <ul>
//             {requests.map((r) => (
//             <li key={r._id}>
//                 {r.name}
//                 <button onClick={() => handleAction("accept", r._id)}>
//                 Accept
//                 </button>
//                 <button onClick={() => handleAction("decline", r._id)}>
//                 Decline
//                 </button>
//             </li>
//             ))}
//         </ul>
//         </div>
//     );
// }

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


