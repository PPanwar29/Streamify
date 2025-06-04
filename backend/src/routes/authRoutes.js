const express = require("express");
const router = express.Router();
const {
	Signup,
	Login,
	Logout,
	onboarding,
} = require("../Controllers/authControllers");
const protectedRoute = require("../middleware/authMiddlware");

// Define routes for authentication
router.post("/signup", Signup);

router.post("/login", Login);

router.post("/logout", Logout);

router.post("/onboarding", protectedRoute, onboarding);

// check if user is logged in
router.get("/me", protectedRoute, (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user,
	});
});

module.exports = router;
