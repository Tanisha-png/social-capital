import express from 'express';


import checkToken from '../middleware/checkToken.js';
import ensureLoggedIn from '../middleware/ensureLoggedIn.js';

import { someController } from '../controllers/posts.js';



const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');

// All paths start with '/api/posts'

// POST /api/posts
router.post('/', postsCtrl.create);
// GET /api/posts
router.get('/', postsCtrl.index);
router.get("/some-route", checkToken, ensureLoggedIn, someController);

module.exports = router;
export default router;