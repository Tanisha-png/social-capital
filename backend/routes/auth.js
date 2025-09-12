

// backend/routes/auth.js
import express from "express";
import * as authCtrl from "../controllers/auth.js";

const router = express.Router();

// No ensureLoggedIn here
router.post("/signup", authCtrl.signUp);
router.post("/login", authCtrl.logIn);

export default router;
