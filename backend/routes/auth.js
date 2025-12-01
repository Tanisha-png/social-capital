
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

const router = express.Router();

// ---------------- SIGNUP ----------------
router.post("/signup", upload.single("avatarFile"), async (req, res) => {
    try {
        const { name, email, password } = req.body;

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

export default router;
