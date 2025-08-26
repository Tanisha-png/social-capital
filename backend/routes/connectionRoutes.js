// import express from "express";
// import { sendFriendRequest, respondToRequest } from "../controllers/connectionController.js";
// // import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/:id/send-request", protect, sendFriendRequest);
// router.post("/:id/respond", protect, respondToRequest); // body { action: 'accept' | 'decline' }

// export default router;

// // backend/routes/connectionRoutes.js
// import express from "express";
// import { sendFriendRequest, respondToRequest, getConnections } from "../controllers/connectionController.js";
// import checkToken from "../middleware/checkToken.js";
// import ensureLoggedIn from "../middleware/ensureLoggedIn.js";

// const router = express.Router();

// router.post("/:id/send-request", checkToken, ensureLoggedIn, sendFriendRequest);
// router.post("/:id/respond", checkToken, ensureLoggedIn, respondToRequest);
// router.get("/", checkToken, ensureLoggedIn, getConnections);


// // Example: Add a connection
// router.post("/", async (req, res) => {
//     res.status(200).json({ message: "Add connection - implement logic" });
// });

// // Example: Get connections
// router.get("/", async (req, res) => {
//     res.status(200).json({ message: "Get connections - implement logic" });
// });

// export default router;

import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import {
    getFriends,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
} from "../controllers/friendController.js";

const router = express.Router();

router.get("/", ensureLoggedIn, getFriends);
router.post("/request/:id", ensureLoggedIn, sendRequest);
router.post("/accept/:id", ensureLoggedIn, acceptRequest);
router.post("/decline/:id", ensureLoggedIn, declineRequest);
router.delete("/remove/:id", ensureLoggedIn, removeFriend);

export default router;
