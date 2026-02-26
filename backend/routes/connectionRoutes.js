
// routes/connectionRoutes.jsx
// import express from "express";
// import checkToken from "../middleware/checkToken.js";
// import User from "../models/user.js";

// const router = express.Router();

// // ==============================
// // 🔹 CONNECTION / FRIEND ROUTES
// // ==============================

// // ✅ Get all friends/connections for logged-in user
// router.get("/", checkToken, async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id).populate(
//             "friends",
//             "_id firstName lastName avatar occupation"
//         );

//         if (!user) return res.status(404).json({ message: "User not found" });

//         res.json(user.friends);
//     } catch (err) {
//         console.error("Error fetching connections:", err);
//         res.status(500).json({ message: "Server error fetching connections" });
//     }
// });

// // ✅ Remove a connection
// router.delete("/remove", checkToken, async (req, res) => {
//     try {
//         const { userId: friendId } = req.data || req.body; // support axios delete body
//         const userId = req.user._id;

//         const user = await User.findById(userId);
//         const friend = await User.findById(friendId);

//         if (!user || !friend)
//             return res.status(404).json({ message: "User not found" });

//         user.friends = user.friends.filter((f) => f.toString() !== friendId);
//         friend.friends = friend.friends.filter((f) => f.toString() !== userId);

//         await user.save();
//         await friend.save();

//         const updatedUser = await User.findById(userId).populate(
//             "friends",
//             "_id firstName lastName avatar occupation"
//         );

//         res.json(updatedUser.friends);
//     } catch (err) {
//         console.error("Error removing connection:", err);
//         res.status(500).json({ message: "Server error removing connection" });
//     }
// });

// // ✅ Send friend request
// router.post("/request", checkToken, async (req, res) => {
//     try {
//         const { userId: friendId } = req.body;
//         const user = await User.findById(req.user._id);
//         const friend = await User.findById(friendId);

//         if (!user || !friend) return res.status(404).json({ message: "User not found" });
//         if (friend.friendRequests.includes(user._id))
//             return res.status(400).json({ message: "Request already sent" });

//         friend.friendRequests.push(user._id);
//         await friend.save();

//         res.json({ message: "Friend request sent" });
//     } catch (err) {
//         console.error("Error sending friend request:", err);
//         res.status(500).json({ message: "Server error sending request" });
//     }
// });

// // ✅ Accept friend request
// router.post("/accept", checkToken, async (req, res) => {
//     try {
//         const { requestId } = req.body;
//         const user = await User.findById(req.user._id);
//         const requester = await User.findById(requestId);

//         if (!user || !requester) return res.status(404).json({ message: "User not found" });

//         // Add each other to friends
//         user.friends.push(requester._id);
//         requester.friends.push(user._id);

//         // Remove request
//         user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requestId);

//         await user.save();
//         await requester.save();

//         res.json({ message: "Friend request accepted" });
//     } catch (err) {
//         console.error("Error accepting friend request:", err);
//         res.status(500).json({ message: "Server error accepting request" });
//     }
// });

// // ✅ Reject/decline friend request
// router.post("/reject", checkToken, async (req, res) => {
//     try {
//         const { requestId } = req.body;
//         const user = await User.findById(req.user._id);

//         if (!user) return res.status(404).json({ message: "User not found" });

//         user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requestId);
//         await user.save();

//         res.json({ message: "Friend request rejected" });
//     } catch (err) {
//         console.error("Error rejecting friend request:", err);
//         res.status(500).json({ message: "Server error rejecting request" });
//     }
// });

// // ✅ Get incoming friend requests
// router.get("/requests", checkToken, async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id).populate(
//             "friendRequests",
//             "_id firstName lastName avatar occupation"
//         );

//         if (!user) return res.status(404).json({ message: "User not found" });

//         res.json(user.friendRequests);
//     } catch (err) {
//         console.error("Error fetching friend requests:", err);
//         res.status(500).json({ message: "Server error fetching requests" });
//     }
// });

// export default router;

import Notification from "../models/Notification.js";
import { notifyUser } from "../server.js";
import express from "express";
import checkToken from "../middleware/checkToken.js";
import User from "../models/user.js";

const router = express.Router();

// ==============================
// 🔹 CONNECTION / FRIEND ROUTES
// ==============================

// ✅ Get all friends/connections for logged-in user
router.get("/", checkToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            "friends",
            "_id firstName lastName avatar occupation"
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.friends);
    } catch (err) {
        console.error("Error fetching connections:", err);
        res.status(500).json({ message: "Server error fetching connections" });
    }
});

// ✅ Remove a connection
router.delete("/remove", checkToken, async (req, res) => {
    try {
        const { userId: friendId } = req.body; // axios delete should send body
        const userId = req.user._id;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend)
            return res.status(404).json({ message: "User not found" });

        user.friends = user.friends.filter((f) => f.toString() !== friendId);
        friend.friends = friend.friends.filter((f) => f.toString() !== userId);

        await user.save();
        await friend.save();

        const updatedUser = await User.findById(userId).populate(
            "friends",
            "_id firstName lastName avatar occupation"
        );

        res.json(updatedUser.friends);
    } catch (err) {
        console.error("Error removing connection:", err);
        res.status(500).json({ message: "Server error removing connection" });
    }
});

// ✅ Send friend request
// router.post("/request", checkToken, async (req, res) => {
//     try {
//         const { userId: friendId } = req.body;
//         const user = await User.findById(req.user._id);
//         const friend = await User.findById(friendId);

//         if (!user || !friend) return res.status(404).json({ message: "User not found" });
//         if (friend.friendRequests.includes(user._id))
//             return res.status(400).json({ message: "Request already sent" });

//         friend.friendRequests.push(user._id);
//         await friend.save();

//         res.json({ message: "Friend request sent" });
//     } catch (err) {
//         console.error("Error sending friend request:", err);
//         res.status(500).json({ message: "Server error sending request" });
//     }
// });

router.post("/request", checkToken, async (req, res) => {
    try {
        const { userId: friendId } = req.body;
        const user = await User.findById(req.user._id);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        if (friend.friendRequests.includes(user._id)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        // ✅ Save friend request
        friend.friendRequests.push(user._id);
        await friend.save();

        // ✅ CREATE notification
        const notification = await Notification.create({
            user: friend._id,              // recipient
            fromUser: user._id,             // sender
            type: "friend_request",
            message: `${user.firstName} ${user.lastName} sent you a connection request`,
        });

        console.log("🔔 Friend request notification created:", notification._id);

        // ✅ EMIT notification in real-time
        notifyUser(friend._id, notification);

        res.json({ message: "Friend request sent" });
    } catch (err) {
        console.error("Error sending friend request:", err);
        res.status(500).json({ message: "Server error sending request" });
    }
});


// ✅ Accept friend request
router.post("/accept", checkToken, async (req, res) => {
    try {
        const { requestId } = req.body;
        const user = await User.findById(req.user._id);
        const requester = await User.findById(requestId);

        if (!user || !requester) return res.status(404).json({ message: "User not found" });

        // Add each other as friends if not already
        if (!user.friends.includes(requester._id)) user.friends.push(requester._id);
        if (!requester.friends.includes(user._id)) requester.friends.push(user._id);

        // Remove request
        user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requestId);

        await user.save();
        await requester.save();

        res.json({ message: "Friend request accepted" });
    } catch (err) {
        console.error("Error accepting friend request:", err);
        res.status(500).json({ message: "Server error accepting request" });
    }
});

// ✅ Reject friend request
router.post("/reject", checkToken, async (req, res) => {
    try {
        const { requestId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requestId);
        await user.save();

        res.json({ message: "Friend request rejected" });
    } catch (err) {
        console.error("Error rejecting friend request:", err);
        res.status(500).json({ message: "Server error rejecting request" });
    }
});

// ✅ Get incoming friend requests
router.get("/requests", checkToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            "friendRequests",
            "_id firstName lastName avatar occupation"
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.friendRequests);
    } catch (err) {
        console.error("Error fetching friend requests:", err);
        res.status(500).json({ message: "Server error fetching requests" });
    }
});

// ✅ Get "People You May Know" suggestions
router.get("/suggestions", checkToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const excludedIds = [
            user._id.toString(),
            ...user.friends.map((f) => f.toString()),
            ...user.friendRequests.map((f) => f.toString()),
        ];

        const suggestions = await User.find({
            _id: { $nin: excludedIds },
        }).select("_id firstName lastName name avatar occupation location friends");

        const formatted = suggestions.map((s) => {
            const mutualFriends = s.friends.filter((f) => user.friends.includes(f)).length;

            // Fallback: if firstName/lastName missing, try splitting "name"
            let firstName = s.firstName?.trim();
            let lastName = s.lastName?.trim();

            if (!firstName && !lastName && s.name) {
                const split = s.name.split(" ");
                firstName = split[0] || "Unknown";
                lastName = split.slice(1).join(" ") || "";
            }

            if (!firstName) firstName = "Unknown";

            return {
                _id: s._id,
                firstName,
                lastName,
                avatar: s.avatar,
                occupation: s.occupation,
                location: s.location,
                mutualFriends,
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error("Error fetching suggestions:", err);
        res.status(500).json({ message: "Server error fetching suggestions" });
    }
});

export default router;
