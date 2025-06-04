const express = require("express");

const router = express.Router();
const protectedRoute = require("../middleware/authMiddlware");
const {
	getRecommendedUsers,
	getMyFriends,
	sendFriendRequest,
	acceptFriendRequest,
	getFriendRequests,
	getOutgoingFriendRequests,
} = require("../Controllers/userControllers");

// Middleware to protect routes
router.use(protectedRoute);

// Define routes for user-related operations
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest); //:id is the user ID to whom the friend request is sent
router.put("/friend-request/:id/accept", acceptFriendRequest); //:id is the friend request ID

router.get("/friend-requests", getFriendRequests); // Get all friend requests for the logged-in user
router.get("/outgoing-friend-requests", getOutgoingFriendRequests); // Get all outgoing friend requests from the logged-in user

module.exports = router;
