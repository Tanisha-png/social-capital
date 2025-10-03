
import User from "../models/User.js";

// Search users controller
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || !q.trim()) return res.json([]);

        const regex = new RegExp(q.trim(), "i"); // case-insensitive search
        const userId = req.user?._id || req.user?.id;

        // Search across firstName, lastName, name, occupation, location
        const query = {
            $and: [
                userId ? { _id: { $ne: userId } } : {}, // exclude logged-in user
                {
                    $or: [
                        { firstName: regex },
                        { lastName: regex },
                        { name: regex },
                        { occupation: regex },
                        { location: regex },
                    ],
                },
            ],
        };

        const users = await User.find(query)
            .select("_id firstName lastName name occupation location avatar")
            .limit(20);

        console.log("Search results:", users); // debug
        return res.json(users);
    } catch (err) {
        console.error("Error searching users:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
