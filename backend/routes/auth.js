
// import express from "express";
// import User from "../models/user.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import upload from "../middleware/upload.js";

// const router = express.Router();

// // SIGNUP
// router.post("/signup", upload.single("avatarFile"), async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         const existing = await User.findOne({ email });
//         if (existing) return res.status(400).json({ error: "Email already in use" });

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             avatar: req.file
//                 ? `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`
//                 : "/default-avatar.png",
//         });

//         await newUser.save();

//         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//             expiresIn: "7d",
//         });

//         res.json({ user: newUser, token });
//     } catch (err) {
//         console.error("Signup error:", err);
//         res.status(500).json({ error: "Signup failed" });
//     }
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
//     res.json({ user, token });
// });

// export default router;

import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import upload from "../middleware/upload.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

// ---------------- SIGNUP ----------------
router.post("/signup", upload.single("avatarFile"), async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            firstName,
            lastName,
            occupation,
            education,
            bio,
        } = req.body;

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // ✅ IMPORTANT: Do NOT hash here. Model pre-save middleware will hash it once.
        const newUser = new User({
            name,
            email,
            password,

            // ✅ Optional profile fields
            firstName: firstName || "",
            lastName: lastName || "",
            occupation: occupation || "",
            education: education || "",
            bio: bio || "",

            avatar: req.file
                ? `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`
                : "/default-avatar.png",
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ user: newUser, token });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Signup failed" });
    }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Use the model method so bcrypt version mismatch never breaks anything
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ user, token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed" });
    }
});

// ---------------- FORGOT PASSWORD ----------------
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        // Always return success for security
        if (!user) {
            return res.json({ message: "If that email exists, a reset link was sent." });
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before saving
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour

        await user.save();

        // Create reset URL
        const resetURL = `${process.env.HEROKU_APP_URL}/reset-password/${resetToken}`;

        // Send email
        await sendEmail({
            to: user.email,
            subject: "Password Reset - Social Capital",
            html: `
                <h3>Password Reset Request</h3>
                <p>You requested a password reset.</p>
                <p>Click below to reset your password:</p>
                <a href="${resetURL}">${resetURL}</a>
                <p>This link expires in 1 hour.</p>
            `,
        });

        res.json({ message: "Reset email sent" });

    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Error sending reset email" });
    }
});

// ---------------- RESET PASSWORD ----------------
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Hash token to compare with DB
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Set new password
        user.password = password;

        // Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Password reset failed" });
    }
});

export default router;
