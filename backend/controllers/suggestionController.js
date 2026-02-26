import User from "../models/user.js";

/*
================================================
GET MUTUAL FRIEND SUGGESTIONS
================================================
Returns users sorted by number of mutual friends
================================================
*/
export const getMutualFriendSuggestions = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select(
            "friends friendRequests"
        );

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentUserId = currentUser._id;

        // Users to exclude
        const excludeIds = new Set([
            currentUserId.toString(),
            ...currentUser.friends.map(id => id.toString()),
            ...currentUser.friendRequests.map(id => id.toString()),
        ]);

        // Find friend-of-friends
        const friends = await User.find({
            _id: { $in: currentUser.friends }
        }).select("friends");

        const mutualCountMap = new Map();

        friends.forEach(friend => {
            friend.friends.forEach(friendOfFriendId => {
                const idStr = friendOfFriendId.toString();

                if (!excludeIds.has(idStr)) {
                    mutualCountMap.set(
                        idStr,
                        (mutualCountMap.get(idStr) || 0) + 1
                    );
                }
            });
        });

        const suggestionIds = Array.from(mutualCountMap.keys());

        if (suggestionIds.length === 0) {
            return res.json([]);
        }

        const suggestions = await User.find({
            _id: { $in: suggestionIds }
        }).select(
            "firstName lastName avatar occupation location"
        );

        const suggestionsWithMutualCount = suggestions
            .map(user => ({
                ...user.toObject(),
                mutualFriends: mutualCountMap.get(user._id.toString()) || 0,
            }))
            .sort((a, b) => b.mutualFriends - a.mutualFriends);

        res.json(suggestionsWithMutualCount);

    } catch (err) {
        console.error("Suggestion error:", err);
        res.status(500).json({ message: "Error fetching suggestions" });
    }
};