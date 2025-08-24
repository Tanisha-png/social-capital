// import User from "../models/User.js";

// export const getUserProfile = async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findById(id).select("-password").populate("connections", "username avatar");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
// };

// export const updateUserProfile = async (req, res) => {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const { username, bio, avatar } = req.body;
//     if (username) user.username = username;
//     if (bio !== undefined) user.bio = bio;
//     if (avatar !== undefined) user.avatar = avatar;

//     await user.save();
//     res.json(user);
// };

// // Get friend list
// export const getFriendList = async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id)
//             .populate('connections', 'username avatar') // Only get username & avatar
//             .select('connections');

//         res.json(user.connections);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error getting friend list' });
//     }
// };

import User from "../models/user.js";

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update current user profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.location = req.body.location || user.location;

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get friend list
export const getFriendList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("friends", "name email");
        res.status(200).json(user.friends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
