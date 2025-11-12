import React, { useEffect, useState } from "react";
import { getFriends, removeFriend } from "../../api/userApi";

const FriendList = ({ token, onMessage, onSelectUser }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFriends = async () => {
        try {
            const data = await getFriends(token);
            setFriends(data);
        } catch (err) {
            setError("Failed to fetch friends.");
        } finally {
            setLoading(false);
        }
        };
        fetchFriends();
    }, [token]);

    const handleRemove = async (id) => {
        await removeFriend(id, token);
        setFriends((prev) => prev.filter((f) => f._id !== id));
    };

    if (loading) return <p>Loading friends...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
      <div className="p-4 bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">My Friends</h2>
        {friends.length === 0 ? (
          <p className="text-gray-500">You don’t have any friends yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="p-3 flex justify-between items-center hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => onSelectUser && onSelectUser(friend)}
              >
                <div className="flex items-center gap-3">
                  <img
                    // src={friend.avatar || "/default-avatar.png"}
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
                    alt={friend.username || friend.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                  <div>
                    <p className="font-semibold">
                      {friend.name || friend.username}
                    </p>
                    <p className="text-sm text-gray-600">{friend.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {onMessage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMessage(friend);
                      }}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Message
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(friend._id);
                    }}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export default FriendList;
