// Load environment variables from .env BEFORE anything else
require('dotenv').config();

const path = require('path');
const express = require('express');
const logger = require('morgan');

const app = express();

// Connect to the database (this uses process.env.MONGO_URI)
require('./db');

// ...rest of your app setup...

app.use(logger('dev'));
// Serve static assets from the frontend's built code folder (dist)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
// Note that express.urlencoded middleware is not needed
// because forms are not submitted!
app.use(express.json());

// Check & verify token.  If so, add user payload to req.user
app.use(require('./middleware/checkToken'));

// API Routes
app.use('/api/auth', require('./routes/auth'));

// All routers below will have all routes protected
app.use(require('./middleware/ensureLoggedIn'));

app.use('/api/posts', require('./routes/posts'));

// Use a "catch-all" route to deliver the frontend's production index.html
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The express app is listening on ${port}`);
});