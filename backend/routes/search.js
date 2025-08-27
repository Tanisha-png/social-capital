import express from "express";
import { searchUsers } from "../controllers/searchController.js"; 
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js"; // ✅ correct


const router = express.Router();

router.get("/", ensureLoggedIn, searchUsers);

// Search users by name (stubbed)
router.get("/", ensureLoggedIn, (req, res) => {
    const { q } = req.query;
    res.json([
        { id: 1, name: "Alice Example" },
        { id: 2, name: "Bob Example" }
    ].filter(u => u.name.toLowerCase().includes(q?.toLowerCase() || "")));
});

export default router