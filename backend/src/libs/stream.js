const { StreamChat } = require("stream-chat");
const dotenv = require("dotenv");

dotenv.config();

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

console.log("Backend STEAM_API_KEY exists:", !!apiKey);
console.log("Backend STEAM_API_SECRET exists:", !!apiSecret);

if (!apiKey || !apiSecret) {
	throw new Error("STEAM_API_KEY and STEAM_API_SECRET are missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

const upsertStreamUser = async (userData) => {
	try {
		await streamClient.upsertUsers([userData]);
		return userData;
	} catch (error) {
		console.error("Error upserting Stream user:", error);
		throw error;
	}
};

const generateStreamToken = (userId) => {
	try {
		//ensure id is string
		const userIdStr = userId.toString();
		return streamClient.createToken(userIdStr);
	} catch (error) {
		console.error("Error generating Stream token:", error);
		throw error;
	}
};

module.exports = {
	upsertStreamUser,
	generateStreamToken,
};
