const express = require("express");
const router = express.Router();

const protectedRoute = require("../middleware/authMiddlware");

const getStreamToken = require("../Controllers/chatControllers");

router.get("/token", protectedRoute, getStreamToken);

module.exports = router;
