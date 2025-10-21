
// controllers/friendController.js
import User from "../models/User.js";

/**
 * GET /api/connections
 * Return an array of the logged-in user's friends with a clean shape:
 *  { _id, firstName, lastName, occupation, profileImage }
 */
export const getConnections = async (req, res) => {
    try {
        const userId = req.user?._id; // use _id (matches checkToken)
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findById(userId).populate(
            "friends",
            "firstName lastName occupation avatar"
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        // map to the frontend-friendly shape (profileImage expected by UI)
        const connections = (user.friends || []).map((f) => ({
            _id: f._id,
            firstName: f.firstName || "",
            lastName: f.lastName || "",
            occupation: f.occupation || "",
            profileImage: f.avatar || "/default-avatar.png",
        }));

        return res.json(connections);
    } catch (err) {
        console.error("Error fetching connections:", err);
        return res.status(500).json({ message: "Server error fetching connections" });
    }
};

/**
 * DELETE /api/connections/:friendId
 * Remove friend from both users' `friends` arrays and return updated current user's friends.
 */
export const removeConnection = async (req, res) => {
    try {
        const friendId = req.params.friendId;
        const userId = req.user?._id;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        if (!friendId) return res.status(400).json({ message: "Missing friend id" });

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) return res.status(404).json({ message: "User not found" });

        // Remove friend from both users
        user.friends = (user.friends || []).filter((f) => f.toString() !== friendId.toString());
        friend.friends = (friend.friends || []).filter((f) => f.toString() !== userId.toString());

        await user.save();
        await friend.save();

        // Return updated connections for the current user, normalized
        const updatedUser = await User.findById(userId).populate("friends", "firstName lastName occupation avatar");
        const connections = (updatedUser.friends || []).map((f) => ({
            _id: f._id,
            firstName: f.firstName || "",
            lastName: f.lastName || "",
            occupation: f.occupation || "",
            profileImage: f.avatar || "/default-avatar.png",
        }));

        return res.json(connections);
    } catch (err) {
        console.error("Error removing connection:", err);
        return res.status(500).json({ message: "Server error removing connection" });
    }
};
