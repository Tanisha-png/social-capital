import express from 'express';
import postsCtrl from "../controllers/posts.js";
import checkToken from "../middleware/checkToken.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import { getPosts, createPost, deletePost } from "../controllers/postController.js";



import checkToken from '../middleware/checkToken.js';
import ensureLoggedIn from '../middleware/ensureLoggedIn.js';

import { someController } from '../controllers/posts.js';

router.get("/", ensureLoggedIn, (req, res) => {
    res.json({ message: "Posts fetched" });
});

router.post("/", ensureLoggedIn, (req, res) => {
    const { content } = req.body;
    res.json({ id: Date.now(), content, user: req.user.id });
});

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

router.get("/", ensureLoggedIn, getPosts);
router.post("/", ensureLoggedIn, createPost);
router.delete("/:id", ensureLoggedIn, deletePost);

router.get("/", getPosts);
router.post("/", createPost);

router.get("/", ensureLoggedIn, (req, res) => {
    res.json([{ id: 1, content: "First post!", user: req.user.id }]);
});

router.post("/", ensureLoggedIn, (req, res) => {
    const { content } = req.body;
    res.json({ id: Date.now(), content, user: req.user.id });
});

module.exports = router;
export default router;