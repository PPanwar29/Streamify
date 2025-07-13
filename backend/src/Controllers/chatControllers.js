const { generateStreamToken } = require("../libs/stream");

function getStreamToken(req, res) {
	try {
		const token = generateStreamToken(req.user._id);
		res.status(200).json({ token });
	} catch (error) {
		console.error("Error in getStreamToken:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
}

module.exports = getStreamToken;
