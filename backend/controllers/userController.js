
// GET /api/users/me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/users/me
export const updateMe = async (req, res) => {
    try {
        const allowed = ["name", "bio", "location", "avatar"];
        const updates = {};
        for (const key of allowed) {
            if (key in req.body) updates[key] = req.body[key];
        }
        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
            select: "-password",
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        const users = await User.find({
            name: { $regex: query, $options: "i" },
        }).select("name email");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error searching users" });
    }
};

// GET /api/users/friends
export const getFriendList = async (req, res) => {
    try {
        const me = await User.findById(req.user.id)
            .populate("friends", "name email avatar")
            .select("friends");
        res.json(me?.friends || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


