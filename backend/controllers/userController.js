// import User from "../models/User.js";

// export const getUserProfile = async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findById(id).select("-password").populate("connections", "username avatar");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
// };

// export const updateUserProfile = async (req, res) => {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const { username, bio, avatar } = req.body;
//     if (username) user.username = username;
//     if (bio !== undefined) user.bio = bio;
//     if (avatar !== undefined) user.avatar = avatar;

//     await user.save();
//     res.json(user);
// };

// // Get friend list
// export const getFriendList = async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id)
//             .populate('connections', 'username avatar') // Only get username & avatar
//             .select('connections');

//         res.json(user.connections);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error getting friend list' });
//     }
// };

import User from "../models/user.js";

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update current user profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.location = req.body.location || user.location;

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get friend list
export const getFriendList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("friends", "name email");
        res.status(200).json(user.friends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Search users by name or email
export const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ message: "Query required" });

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("-password");

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body; // recipient
        const senderId = req.user._id; // from middleware

        if (userId === senderId.toString()) {
            return res.status(400).json({ message: "You cannot add yourself." });
        }

        const recipient = await User.findById(userId);
        const sender = await User.findById(senderId);

        if (!recipient) return res.status(404).json({ message: "User not found" });

        // Already friends?
        if (recipient.friends.includes(senderId)) {
            return res.status(400).json({ message: "Already friends." });
        }

        // Already requested?
        if (recipient.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: "Request already sent." });
        }

        recipient.friendRequests.push(senderId);
        await recipient.save();

        res.status(200).json({ message: "Friend request sent." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get pending friend requests
export const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("friendRequests", "name email");
        res.status(200).json(user.friendRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { requesterId } = req.body;
        const user = await User.findById(req.user._id);
        const requester = await User.findById(requesterId);

        if (!user || !requester)
            return res.status(404).json({ message: "User not found" });

        // Remove from pending requests
        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== requesterId
        );

        // Add to friends list
        if (!user.friends.includes(requesterId)) user.friends.push(requesterId);
        if (!requester.friends.includes(user._id)) requester.friends.push(user._id);

        await user.save();
        await requester.save();

        res.status(200).json({ message: "Friend request accepted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Decline a friend request
export const declineFriendRequest = async (req, res) => {
    try {
        const { requesterId } = req.body;
        const user = await User.findById(req.user._id);

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== requesterId
        );

        await user.save();

        res.status(200).json({ message: "Friend request declined" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get all accepted friends
export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("friends", "name email");
        res.status(200).json(user.friends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove a friend
export const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;

        const user = await User.findById(req.user._id);
        const friend = await User.findById(friendId);

        if (!user || !friend) return res.status(404).json({ message: "User not found" });

        user.friends = user.friends.filter((id) => id.toString() !== friendId);
        friend.friends = friend.friends.filter((id) => id.toString() !== user._id.toString());

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Friend removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



