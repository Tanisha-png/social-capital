
export function ensureLoggedIn(req, res, next) {
  console.log("🧩 ensureLoggedIn: req.user =", req.user);
  if (req.user && req.user._id) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

// export function ensureLoggedIn(req, res, next) {
//   if (req.user && (req.user._id || req.user.id)) {
//     req.user.id = req.user.id || req.user._id; // normalize
//     return next();
//   }
//   return res.status(401).json({ message: "Unauthorized" });
// }
