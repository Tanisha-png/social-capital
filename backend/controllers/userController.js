
// // GET /api/users/me
// export const getMe = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select("-password");
//         if (!user) return res.status(404).json({ message: "User not found" });
//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // PUT /api/users/me
// export const updateMe = async (req, res) => {
//     try {
//         const allowed = ["name", "bio", "location", "avatar"];
//         const updates = {};
//         for (const key of allowed) {
//             if (key in req.body) updates[key] = req.body[key];
//         }

//         // If user doesn't exist, create one automatically (upsert)
//         const user = await User.findOneAndUpdate(
//             { _id: req.user.id },
//             { $set: updates },
//             {
//                 new: true,
//                 runValidators: true,
//                 upsert: true,     // create if not exists
//                 setDefaultsOnInsert: true,
//             }
//         ).select("-password");

//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };



// export const searchUsers = async (req, res) => {
//     try {
//         const query = req.query.q;
//         const users = await User.find({
//             name: { $regex: query, $options: "i" },
//         }).select("name email");
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ message: "Error searching users" });
//     }
// };

// // GET /api/users/friends
// export const getFriendList = async (req, res) => {
//     try {
//         const me = await User.findById(req.user.id)
//             .populate("friends", "name email avatar")
//             .select("friends");
//         res.json(me?.friends || []);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

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
