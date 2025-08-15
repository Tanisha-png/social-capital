// module.exports = function (req, res, next) {
//   if (req.user) return next();
//   res.status(401).json({ message: 'Unauthorized' });
// };

// // backend/middleware/ensureLoggedIn.js
// export default function ensureLoggedIn(req, res, next) {
//   // check if user is logged in
//   next();
// }

export default function ensureLoggedIn(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  next();
}

