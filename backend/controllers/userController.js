

// userController.js
import User from "../models/User.js";
import path from "path";

// GET current user profile
export const getMe = async (req, res) => {
    try {
        // Use _id from checkToken
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
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
