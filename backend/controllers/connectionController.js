

import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";


/* ===========================
GET FRIENDS
=========================== */
export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("friends", "firstName lastName email avatar")
            .populate("friendRequests", "firstName lastName email avatar");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            friends: user.friends || [],
            requests: user.friendRequests || [],
        });

    } catch (err) {
        console.error("Error fetching friends:", err);
        res.status(500).json({ message: "Error fetching friends" });
    }
};



/* ===========================
SEND CONNECTION REQUEST
=========================== */
export const sendRequest = async (req, res) => {
    try {
        const target = await User.findById(req.params.id);
        const sender = await User.findById(req.user._id);

        if (!target) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!sender) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Prevent duplicate request
        const alreadyRequested = target.friendRequests.some(
            (id) => id.toString() === sender._id.toString()
        );

        const alreadyFriends = target.friends.some(
            (id) => id.toString() === sender._id.toString()
        );

        if (alreadyRequested || alreadyFriends) {
            return res.json({ message: "Request already sent or already friends" });
        }

        target.friendRequests.push(sender._id);
        await target.save();


        /* ===========================
        EMAIL: New Connection Request
        =========================== */

        try {
            if (target.email) {
                sendEmail({
                    to: target.email,
                    subject: "New connection request on Social Capital",
                    html: `
                        <p>Hello ${target.firstName || ""},</p>

                        <p>
                            ${sender.firstName || ""} ${sender.lastName || ""}
                            sent you a connection request.
                        </p>

                        <p>
                            <a href="${process.env.HEROKU_APP_URL}">
                                Open Social Capital
                            </a>
                        </p>

                        <p>— Social Capital</p>
                    `,
                });
            }
        } catch (emailErr) {
            console.error("Connection request email error:", emailErr.message);
        }


        res.json({ message: "Friend request sent" });

    } catch (err) {
        console.error("Error sending request:", err);
        res.status(500).json({ message: "Error sending request" });
    }
};



/* ===========================
ACCEPT CONNECTION REQUEST
=========================== */
export const acceptRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const requester = await User.findById(req.params.id);

        if (!user || !requester) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent duplicate friendship
        const alreadyFriends = user.friends.some(
            (id) => id.toString() === requester._id.toString()
        );

        if (!alreadyFriends) {
            user.friends.push(requester._id);
            requester.friends.push(user._id);
        }

        // Remove request
        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== requester._id.toString()
        );

        await user.save();
        await requester.save();


        /* ===========================
        EMAIL: Connection Accepted
        =========================== */

        try {
            if (requester.email) {
                sendEmail({
                    to: requester.email,
                    subject: "Your connection request was accepted",
                    html: `
                        <p>Hello ${requester.firstName || ""},</p>

                        <p>
                            ${user.firstName || ""} ${user.lastName || ""}
                            accepted your connection request.
                        </p>

                        <p>
                            <a href="${process.env.HEROKU_APP_URL}">
                                Open Social Capital
                            </a>
                        </p>

                        <p>— Social Capital</p>
                    `,
                });
            }
        } catch (emailErr) {
            console.error("Connection accepted email error:", emailErr.message);
        }


        res.json({ message: "Friend request accepted" });

    } catch (err) {
        console.error("Error accepting request:", err);
        res.status(500).json({ message: "Error accepting request" });
    }
};



/* ===========================
DECLINE REQUEST
=========================== */
export const declineRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== req.params.id
        );

        await user.save();

        res.json({ message: "Friend request declined" });

    } catch (err) {
        console.error("Error declining request:", err);
        res.status(500).json({ message: "Error declining request" });
    }
};



/* ===========================
REMOVE FRIEND
=========================== */
export const removeFriend = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const friend = await User.findById(req.params.id);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        user.friends = user.friends.filter(
            (id) => id.toString() !== friend._id.toString()
        );

        friend.friends = friend.friends.filter(
            (id) => id.toString() !== user._id.toString()
        );

        await user.save();
        await friend.save();

        res.json({ message: "Friend removed" });

    } catch (err) {
        console.error("Error removing friend:", err);
        res.status(500).json({ message: "Error removing friend" });
    }
};