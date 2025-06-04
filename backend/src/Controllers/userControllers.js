const userModel = require("../models/userModel");
const friendModel = require("../models/friendRequestModel");

const getMyFriends = async (req, res) => {
	try {
		const userId = req.user._id; // Assuming req.user is set by the auth middleware
		const user = await userModel
			.findById(userId)
			.select("friends")
			.populate(
				"friends",
				"fullname profilePic nativeLanguage learningLanguage",
			);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		res.status(200).json(user.friends);
	} catch (error) {
		console.error("Error fetching friends:", error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const getRecommendedUsers = async (req, res) => {
	try {
		const userId = req.user._id;
		const currentUser = req.user;
		// Fetch users who are not the current user and not already friends
		const recommendedUsers = await userModel.find({
			$and: [
				{ _id: { $ne: userId } }, // Exclude current user
				{ _id: { $nin: currentUser.friends } }, // Exclude already friends
				{ isOnboarded: true }, // Only include users who have completed onboarding
			],
		});
		res.status(200).json(recommendedUsers);
	} catch (error) {
		console.error("Error fetching recommended users:", error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const sendFriendRequest = async (req, res) => {
	try {
		const userId = req.user._id; // Assuming req.user is set by the auth middleware
		const friendId = req.params.id;

		console.log("Sending friend request:", { userId, friendId });

		if (userId === friendId) {
			return res.status(400).json({
				success: false,
				message: "You cannot send a friend request to yourself",
			});
		}

		const user = await userModel.findById(userId);
		const friend = await userModel.findById(friendId);

		console.log("Found users:", {
			user: user ? "exists" : "not found",
			friend: friend ? "exists" : "not found",
		});

		if (!friend) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		//check if user is already friends with the friend
		if (user.friends.includes(friendId)) {
			return res.status(400).json({
				success: false,
				message: "You are already friends with this user",
			});
		}

		// Check if the friend request already exists
		const existingRequest = await friendModel.findOne({
			$or: [
				{ sender: userId, recipient: friendId },
				{ sender: friendId, recipient: userId },
			],
		});

		console.log("Existing request check:", {
			exists: existingRequest ? "yes" : "no",
			request: existingRequest,
		});

		if (existingRequest) {
			return res
				.status(400)
				.json({ success: false, message: "Friend request already exists" });
		}

		// Add the friend to the user's friend requests
		const friendRequest = await friendModel.create({
			sender: userId,
			recipient: friendId,
		});

		console.log("Created friend request:", friendRequest);

		res.status(200).json(friendRequest);
	} catch (error) {
		console.error("Error sending friend request:", error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const acceptFriendRequest = async (req, res) => {
	try {
		const userId = req.user._id;
		const requestId = req.params.id;

		if (userId === requestId) {
			return res.status(400).json({
				success: false,
				message: "You cannot accept a friend request from yourself",
			});
		}

		// Check if the friend exists
		const friendRequest = await friendModel.findById(requestId);
		if (!friendRequest) {
			return res
				.status(404)
				.json({ success: false, message: "friendRequest not found" });
		}

		// Check if the friend request is valid (i.e., it was sent to the user)
		if (friendRequest.recipient.toString() !== userId.toString()) {
			return res.status(400).json({
				success: false,
				message: "This friend request was not sent to you",
			});
		}

		friendRequest.status = "accepted";
		await friendRequest.save();

		// Add each other to friends list
		await userModel.findByIdAndUpdate(userId, {
			$addToSet: { friends: friendRequest.sender },
		});
		await userModel.findByIdAndUpdate(friendRequest.sender, {
			$addToSet: { friends: userId },
		});

		res.status(200).json({ success: true, message: "Friend request accepted" });
	} catch (error) {
		console.error("Error accepting friend request:", error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const getFriendRequests = async (req, res) => {
	try {
		const userId = req.user._id;

		// Fetch all friend requests where the user is the recipient
		const incomingReq = await friendModel
			.find({ recipient: userId, status: "pending" })
			.populate(
				"sender",
				"fullname profilePic nativeLanguage learningLanguage",
			);

		const acceptedReq = await friendModel
			.find({ recipient: userId, status: "accepted" })
			.populate(
				"sender",
				"fullname profilePic nativeLanguage learningLanguage",
			);

		// Also get req where user is the sender
		const outgoingReq = await friendModel
			.find({ sender: userId, status: "pending" })
			.populate(
				"recipient",
				"fullname profilePic nativeLanguage learningLanguage",
			);

		res.status(200).json({
			incomingReq,
			acceptedReq,
			outgoingReq,
		});
	} catch (error) {
		console.error("Error fetching friend requests:", error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

const getOutgoingFriendRequests = async (req, res) => {
	try {
		const userId = req.user._id;
		// Fetch all friend requests where the user is the sender
		const outgoingRequests = await friendModel
			.find({ sender: userId, status: "pending" })
			.populate(
				"recipient",
				"fullname profilePic nativeLanguage learningLanguage",
			);

		res.status(200).json(outgoingRequests);
	} catch (error) {
		console.error("Error fetching outgoing friend requests:", error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

module.exports = {
	getMyFriends,
	getRecommendedUsers,
	sendFriendRequest,
	acceptFriendRequest,
	getFriendRequests,
	getOutgoingFriendRequests,
};
