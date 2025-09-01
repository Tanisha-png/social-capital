

import User from "../models/User.js";

export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("friends", "name email")
            .populate("friendRequests", "name email");
        res.json({
            friends: user.friends,
            requests: user.friendRequests,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching friends" });
    }
};

export const sendRequest = async (req, res) => {
    try {
        const target = await User.findById(req.params.id);
        if (!target) return res.status(404).json({ message: "User not found" });

        if (!target.friendRequests.includes(req.user._id)) {
            target.friendRequests.push(req.user._id);
            await target.save();
        }
        res.json({ message: "Friend request sent" });
    } catch (err) {
        res.status(500).json({ message: "Error sending request" });
    }
};

export const acceptRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const requester = await User.findById(req.params.id);

        user.friends.push(requester._id);
        requester.friends.push(user._id);

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== requester._id.toString()
        );

        await user.save();
        await requester.save();

        res.json({ message: "Friend request accepted" });
    } catch (err) {
        res.status(500).json({ message: "Error accepting request" });
    }
};

export const declineRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== req.params.id
        );
        await user.save();
        res.json({ message: "Friend request declined" });
    } catch (err) {
        res.status(500).json({ message: "Error declining request" });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.friends = user.friends.filter((id) => id.toString() !== req.params.id);
        await user.save();
        res.json({ message: "Friend removed" });
    } catch (err) {
        res.status(500).json({ message: "Error removing friend" });
    }
};

