import React, {  useState, useEffect , useContext } from "react";
import { getFriendList } from "../api/userApi";
import { AuthContext } from "../contexts/AuthContext";

export default function ContactList({ onSelectUser }) {
    const { user } = useContext(AuthContext);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
        try {
            const data = await getFriendList(user.token);
            setFriends(data);
        } catch (error) {
            console.error("Error fetching friend list", error);
        }
        };
        fetchFriends();
    }, [user.token]);

    return (
        <div style={styles.container}>
        <h3 style={styles.header}>Contacts</h3>
        {friends.map((friend) => (
            <div
            key={friend._id}
            style={styles.friendItem}
            onClick={() => onSelectUser(friend)}
            >
            <img
                // src={friend.avatar || "/default-avatar.png"}
                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
                alt={friend.username}
                style={styles.avatar}
            />
            <span>{friend.username}</span>
            </div>
        ))}
        </div>
    );
}

const styles = {
    container: {
        padding: "10px",
        borderRight: `1px solid var(--color-light-gray)`,
        width: "250px",
        backgroundColor: "var(--color-white)",
        height: "100vh",
        boxSizing: "border-box",
    },
    header: {
        marginBottom: "10px",
        color: "var(--color-primary-blue)",
        borderBottom: `2px solid var(--color-accent-light-blue)`,
        paddingBottom: "5px",
    },
    friendItem: {
        display: "flex",
        alignItems: "center",
        padding: "8px",
        cursor: "pointer",
        borderRadius: "5px",
        transition: "background 0.2s",
        backgroundColor: "transparent",
    },
    friendItemHover: {
        backgroundColor: "var(--color-accent-light-blue)",
    },
    avatar: {
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        marginRight: "10px",
        border: `2px solid var(--color-primary-blue)`,
    },
};
