import { createContext, useContext, useEffect, useState } from "react";
import {
    getFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
} from "../api/userApi";
import { useAuth } from "./AuthContext";

const FriendRequestContext = createContext();

export function FriendRequestProvider({ children }) {
    const { user } = useAuth();
    const token = localStorage.getItem("token");

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        if (!token || !user) return;
        setLoading(true);
        try {
        const data = await getFriendRequests(token);
        setRequests(data);
        } catch (err) {
        console.error("Failed to fetch friend requests", err);
        } finally {
        setLoading(false);
        }
    };

    const accept = async (id) => {
        await acceptFriendRequest(id, token);
        setRequests((prev) => prev.filter((r) => r._id !== id));
    };

    const decline = async (id) => {
        await declineFriendRequest(id, token);
        setRequests((prev) => prev.filter((r) => r._id !== id));
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    return (
        <FriendRequestContext.Provider
        value={{
            requests,
            loading,
            count: requests.length,
            fetchRequests,
            accept,
            decline,
        }}
        >
        {children}
        </FriendRequestContext.Provider>
    );
    }

    export function useFriendRequests() {
    return useContext(FriendRequestContext);
    }
