import React, { useEffect, useState } from "react";
import {
    getFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
} from "../../api/userApi";

const FriendRequests = ({ token }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
        try {
            const data = await getFriendRequests(token);
            setRequests(data);
        } catch (err) {
            setError("Failed to fetch requests.");
        } finally {
            setLoading(false);
        }
        };
        fetchRequests();
    }, [token]);

    const handleAccept = async (id) => {
        await acceptFriendRequest(id, token);
        setRequests((prev) => prev.filter((req) => req._id !== id));
    };

    const handleDecline = async (id) => {
        await declineFriendRequest(id, token);
        setRequests((prev) => prev.filter((req) => req._id !== id));
    };

    if (loading) return <p>Loading requests...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4 bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
        {requests.length === 0 ? (
            <p className="text-gray-500">No pending requests.</p>
        ) : (
            <ul className="divide-y divide-gray-200">
            {requests.map((req) => (
                <li key={req._id} className="p-3 flex justify-between items-center">
                <div>
                    <p className="font-semibold">{req.name}</p>
                    <p className="text-sm text-gray-600">{req.email}</p>
                </div>
                <div className="flex gap-2">
                    <button
                    onClick={() => handleAccept(req._id)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                    Accept
                    </button>
                    <button
                    onClick={() => handleDecline(req._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                    Decline
                    </button>
                </div>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
};

export default FriendRequests;
