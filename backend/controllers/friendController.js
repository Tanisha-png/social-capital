// backend/controllers/friendController.js

export const sendFriendRequest = (req, res) => {
    res.json({ message: "Friend request sent (stub)" });
};

export const acceptFriendRequest = (req, res) => {
    res.json({ message: "Friend request accepted (stub)" });
};

export const declineFriendRequest = (req, res) => {
    res.json({ message: "Friend request declined (stub)" });
};

export const removeFriend = (req, res) => {
    res.json({ message: "Friend removed (stub)" });
};

export const listFriends = (req, res) => {
    res.json([
        { id: 1, name: "Alice Example" },
        { id: 2, name: "Bob Example" }
    ]);
};