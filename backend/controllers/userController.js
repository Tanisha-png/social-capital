

// userController.js
import User from "../models/User.js";

// GET current user profile
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};


// PUT update current user profile
export const updateMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (req.file) {
            // If a file was uploaded, set avatar to its path
            user.avatar = `/uploads/avatars/${req.file.filename}`;
        } else if (req.body.avatar) {
            user.avatar = req.body.avatar; // fallback to URL
        }

        const fields = [
            "avatar",
            "firstName",
            "lastName",
            "bio",
            "occupation",
            "education",
            "canHelpWith",
            "needHelpWith",
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (["canHelpWith", "needHelpWith"].includes(field)) {
                    // Always normalize to array
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
        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
};
