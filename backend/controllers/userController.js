
// userController.js
import User from "../models/User.js";
import path from "path";

// GET current user profile
export const getMe = async (req, res) => {
    console.log("🔍 [getMe] Request received for user:", req.user); // <--- DEBUG LINE

    try {
        if (!req.user || !req.user._id) {
            console.log("❌ No req.user found");
            return res.status(401).json({ message: "Unauthorized - no user in token" });
        }

        const user = await User.findById(req.user._id)
            .populate("friends", "_id firstName lastName occupation avatar")
            .select("-password");

        if (!user) {
            console.log("❌ No user found in DB for ID:", req.user._id);
            return res.status(404).json({ message: "Profile not found" });
        }

        console.log("✅ Found user:", user.firstName, user.lastName);
        res.json(user);
    } catch (err) {
        console.error("🔥 Error in getMe:", err);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("friends", "_id firstName lastName profileImage occupation")
            .select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Error fetching user by id:", err);
        res.status(500).json({ message: "Server error fetching user" });
    }
};

// backend/controllers/userController.js
export const updateMe = async (req, res) => {
    try {
        // find user
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // If file was uploaded, set full URL
        if (req.file) {
            const avatarPath = `/uploads/avatars/${req.file.filename}`;
            user.avatar = `${req.protocol}://${req.get("host")}${avatarPath}`;

            
            console.log("Serving avatar URL:", user.avatar);
        }

        // If front-end sends avatar (rare), allow it but prefer file
        if (!req.file && req.body.avatar) {
            user.avatar = req.body.avatar;
        }

        // Update other fields (safe list)
        const fields = [
            "firstName",
            "lastName",
            "bio",
            "occupation",
            "education",
            "canHelpWith",
            "needHelpWith",
            "location",
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (["canHelpWith", "needHelpWith"].includes(field)) {
                    if (typeof req.body[field] === "string") {
                        user[field] = req.body[field]
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                    } else if (Array.isArray(req.body[field])) {
                        user[field] = req.body[field].map((s) => s.trim()).filter(Boolean);
                    } else {
                        user[field] = [];
                    }
                } else {
                    user[field] = req.body[field];
                }
            }
        });

        const updatedUser = await user.save();
        // ensure password isn't sent
        const userObj = updatedUser.toObject();
        delete userObj.password;
        res.json(userObj);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
};


// GET connections for a user
// GET connections for a user (fully safe)
export const getConnections = async (req, res) => {
    try {
        // Determine user ID: use :id param if present, otherwise logged-in user
        const userId = req.params.id || req.user?._id;

        if (!userId) {
            // No ID available; return empty array
            return res.json([]);
        }

        // Fetch user and populate friends
        const user = await User.findById(userId).populate("friends", "-password");

        if (!user || !Array.isArray(user.friends)) {
            // User not found or friends not an array; return empty array
            return res.json([]);
        }

        // Map friends to clean array
        const connections = user.friends.map((f) => ({
            _id: f._id,
            firstName: f.firstName || "",
            lastName: f.lastName || "",
            profileImage: f.avatar || "/default-avatar.png",
        }));

        res.json(connections);
    } catch (err) {
        console.error("Error fetching connections:", err);
        // Always return a safe empty array instead of crashing
        res.status(500).json([]);
    }
};

// Search users (exclude logged-in user, multi-word search)
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || !q.trim()) return res.json([]);

        const userId = req.user?._id || req.user?.id;

        // Split query into words
        const words = q.trim().split(/\s+/);

        // Build regex conditions for each word across fields
        const orConditions = words.map((word) => {
            const regex = new RegExp(word, "i");
            return {
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { name: regex },
                    { occupation: regex },
                    { location: regex },
                ],
            };
        });

        // Combine with exclusion of logged-in user
        const query = {
            $and: [
                userId ? { _id: { $ne: userId } } : {},
                ...orConditions,
            ],
        };

        const users = await User.find(query)
            .select("_id firstName lastName name occupation location avatar")
            .limit(20);

        console.log("Search results:", users);
        return res.json(users);
    } catch (err) {
        console.error("Error searching users:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Send Friend Request
export const sendFriendRequest = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const senderId = req.user._id;

        if (targetUserId === senderId.toString()) {
            return res.status(400).json({ message: "You cannot send a request to yourself." });
        }

        const targetUser = await User.findById(targetUserId);
        const sender = await User.findById(senderId);

        if (!targetUser || !sender) {
            return res.status(404).json({ message: "User not found." });
        }

        if (targetUser.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: "Request already sent." });
        }

        if (targetUser.friends.includes(senderId)) {
            return res.status(400).json({ message: "Already friends." });
        }

        // Add sender to target's pending friendRequests
        targetUser.friendRequests.push(senderId);
        await targetUser.save();

        res.json({ message: "Friend request sent!" });
    } catch (err) {
        console.error("Error sending friend request:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// ✅ Get incoming friend requests
export const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            "friendRequests",
            "_id firstName lastName avatar"
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        // Format data for the frontend
        const requests = user.friendRequests.map((r) => ({
            _id: r._id,
            firstName: r.firstName || "",
            lastName: r.lastName || "",
            avatar: r.avatar || "/default-avatar.png",
        }));

        console.log("📨 Incoming Friend Requests:", requests);
        res.json(requests);
    } catch (err) {
        console.error("Error fetching friend requests:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Accept request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params; // sender of request
        const currentUser = await User.findById(req.user._id);
        const sender = await User.findById(userId);

        if (!currentUser || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Must exist in requests
        if (!currentUser.friendRequests.includes(userId)) {
            return res.status(400).json({ message: "No request from this user" });
        }

        // Add each other as friends
        currentUser.friends.push(userId);
        sender.friends.push(req.user._id);

        // Remove from requests
        currentUser.friendRequests = currentUser.friendRequests.filter(
            (id) => String(id) !== userId
        );

        await currentUser.save();
        await sender.save();

        res.json({ message: "Friend request accepted" });
    } catch (err) {
        console.error("Error accepting friend request:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Decline request
export const declineFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUser = await User.findById(req.user._id);

        if (!currentUser.friendRequests.includes(userId)) {
            return res.status(400).json({ message: "No request from this user" });
        }

        currentUser.friendRequests = currentUser.friendRequests.filter(
            (id) => String(id) !== userId
        );

        await currentUser.save();

        res.json({ message: "Friend request declined" });
    } catch (err) {
        console.error("Error declining friend request:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// Remove Friend
export const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const currentUserId = req.user._id;

        const user = await User.findById(currentUserId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove each other
        user.friends = user.friends.filter((id) => String(id) !== String(friendId));
        friend.friends = friend.friends.filter((id) => String(id) !== String(currentUserId));

        await user.save();
        await friend.save();

        res.json({ message: "Connection removed successfully" });
    } catch (err) {
        console.error("Error removing connection:", err);
        res.status(500).json({ message: "Server error" });
    }
};


