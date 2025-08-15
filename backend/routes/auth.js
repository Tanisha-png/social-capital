// const express = require('express');
// const router = express.Router();
// const authCtrl = require('../controllers/auth');

// // All paths start with '/api/auth'

// // POST /api/auth/signup
// router.post('/signup', authCtrl.signUp);
// // POST /api/auth/login
// router.post('/login', authCtrl.logIn);

// module.exports = router;

// backend/routes/auth.js
import express from "express";
import * as authCtrl from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", authCtrl.signUp);
router.post("/login", authCtrl.logIn);

export default router;

