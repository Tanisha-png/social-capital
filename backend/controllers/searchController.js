
import User from "../models/User.js";

export const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);
        const users = await User.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { occupation: { $regex: query, $options: "i" } },
            ],
        }).select("firstName lastName occupation avatar");
        res.json(users);
    } catch (err) {
        console.error("Error searching users:", err);
        res.status(500).json({ message: "Server error searching users" });
    }
};

