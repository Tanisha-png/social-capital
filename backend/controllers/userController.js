import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").populate("connections", "username avatar");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, bio, avatar } = req.body;
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.json(user);
};

// Get friend list
export const getFriendList = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('connections', 'username avatar') // Only get username & avatar
            .select('connections');

        res.json(user.connections);
    } catch (error) {
        res.status(500).json({ message: 'Server error getting friend list' });
    }
};

