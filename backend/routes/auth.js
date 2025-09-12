
// backend/routes/auth.js
// import express from "express";
// import * as authCtrl from "../controllers/auth.js";
// import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js"; // ✅ correct
// import User from "../models/User.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";


// const router = express.Router();

// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: "Invalid email or password" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.json({ token, user });
// });

// export const logIn = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         if (!user) return res.status(401).json({ message: "Invalid email or password" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//         res.json({ user, token });
//     } catch (err) {
//         console.error("Login error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };


// router.post("/signup", ensureLoggedIn, authCtrl.signUp);
// router.post("/login", ensureLoggedIn, authCtrl.logIn);



// export default router;



// backend/routes/auth.js
import express from "express";
import * as authCtrl from "../controllers/auth.js";

const router = express.Router();

// No ensureLoggedIn here
router.post("/signup", authCtrl.signUp);
router.post("/login", authCtrl.logIn);

export default router;
