// import User from "../models/User.js";

// export const sendFriendRequest = async (req, res) => {
//     const receiverId = req.params.id;
//     if (receiverId === String(req.user._id)) return res.status(400).json({ message: "Can't send request to yourself" });

//     const receiver = await User.findById(receiverId);
//     if (!receiver) return res.status(404).json({ message: "Receiver not found" });

//     // avoid duplicates
//     const exists = receiver.friendRequests.some(fr => String(fr.from) === String(req.user._id) && fr.status === "pending");
//     if (exists) return res.status(400).json({ message: "Request already sent" });

//     receiver.friendRequests.push({ from: req.user._id, status: "pending" });
//     await receiver.save();
//     res.json({ message: "Request sent" });
// };

// export const respondToRequest = async (req, res) => {
//     const { id } = req.params; // request id (the user who sent the request)
//     const { action } = req.body; // 'accept' or 'decline'
//     const current = await User.findById(req.user._id);
//     const requester = await User.findById(id);
//     if (!current || !requester) return res.status(404).json({ message: "User not found" });

//     const reqIndex = current.friendRequests.findIndex(fr => String(fr.from) === String(id) && fr.status === "pending");
//     if (reqIndex === -1) return res.status(400).json({ message: "No pending request from that user" });

//     if (action === "accept") {
//         // add each other as connections
//         current.connections.push(requester._id);
//         requester.connections.push(current._id);
//         current.friendRequests[reqIndex].status = "accepted";
//         await current.save();
//         await requester.save();
//         return res.json({ message: "Friend request accepted" });
//     } else {
//         current.friendRequests[reqIndex].status = "declined";
//         await current.save();
//         return res.json({ message: "Friend request declined" });
//     }
// };

import User from "../models/user.js";

// Send a friend request
export const sendFriendRequest = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        if (targetUser.friendRequests.includes(req.user._id)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        targetUser.friendRequests.push(req.user._id);
        await targetUser.save();

        res.status(200).json({ message: "Friend request sent" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Respond to friend request
export const respondToRequest = async (req, res) => {
    try {
        const { action } = req.body;
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        if (action === "accept") {
            targetUser.friends.push(req.user._id);
            const me = await User.findById(req.user._id);
            me.friends.push(targetUser._id);
            await me.save();
        }

        targetUser.friendRequests = targetUser.friendRequests.filter(
            (id) => id.toString() !== req.user._id.toString()
        );

        await targetUser.save();
        res.status(200).json({ message: `Friend request ${action}ed` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all connections
export const getConnections = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("friends", "name email");
        res.status(200).json(user.friends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

