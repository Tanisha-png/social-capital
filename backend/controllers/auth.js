import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SIGNUP
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // If multer stored a file, create an absolute URL.
    const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : "/default-avatar.png";
    const fullAvatarUrl = `${req.protocol}://${req.get("host")}${avatarPath}`;

    // Create user (password will be hashed by schema pre-save)
    const user = new User({
      name,
      email,
      password,
      avatar: fullAvatarUrl,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return token and user (user should include avatar as full URL)
    res.status(201).json({ user, token });
  } catch (error) {
    console.error("SignUp error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // ✅ Standard JWT field: userId
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};
