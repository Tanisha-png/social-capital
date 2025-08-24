import express from 'express';
import postsCtrl from "../controllers/posts.js";
import checkToken from "../middleware/checkToken.js";
import ensureLoggedIn from "../middleware/ensureLoggedIn.js";



import checkToken from '../middleware/checkToken.js';
import ensureLoggedIn from '../middleware/ensureLoggedIn.js';

import { someController } from '../controllers/posts.js';



const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');

// All paths start with '/api/posts'

// POST /api/posts
router.post("/", checkToken, ensureLoggedIn, postsCtrl.create);
// GET /api/posts
router.get("/", checkToken, ensureLoggedIn, postsCtrl.index);
router.get("/some-route", checkToken, ensureLoggedIn, someController);
router.delete("/:id", checkToken, ensureLoggedIn, postsCtrl.remove);

module.exports = router;
export default router;