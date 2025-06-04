const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { upsertStreamUser } = require("../libs/stream");

const Signup = async (req, res) => {
	try {
		const { fullname, email, password } = req.body;

		// Validate input fields
		// Ensure all fields are provided
		if (!fullname || !email || !password) {
			return res.status(400).send("All fields are required");
		}

		// Check if the user already exists
		const existingUser = await userModel.findOne({ email });
		if (existingUser) {
			return res.status(400).send("User already exists");
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email format" });
		}

		const idx = Math.floor(Math.random() * 100) + 1;
		const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

		// Create a new user
		const user = await userModel.create({
			fullname,
			email,
			password,
			profilePic: randomAvatar,
		});
		if (!user) {
			return res.status(500).send("User registration failed");
		}

		// Creating user in Stream
		// Ensure Stream user creation is successful
		try {
			await upsertStreamUser({
				id: user._id.toString(),
				name: user.fullname,
				image: user.profilePic || "",
			});
			console.log(`Stream user upserted successfully for ${user.fullname}`);
		} catch (error) {
			console.error("Error upserting Stream user:", error);
		}

		// Optionally, you can generate a JWT token for the user
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d", // Token expiration time
		});

		res.cookie("jwt", token, {
			httpOnly: true, //prevent XSS attacks
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
			secure: process.env.NODE_ENV === "production", // Use secure cookies in production
			sameSite: "Strict", // Prevent CSRF attacks
		});

		res
			.status(201)
			.send({
				success: true,
				user: { fullname, email, profilePic: randomAvatar },
			});
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
};

const Login = async (req, res) => {
	try {
		// Check if the user exists
		const { email, password } = req.body;

		// Validate input fields
		if (!email || !password) {
			return res.status(400).send("Email and password are required");
		}

		// Check if the user exists
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.status(400).send("User doesn't exists, please register first");
		}

		// Verify password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).send("Password is incorrect");
		}

		// Generate JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.cookie("jwt", token, {
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
		});

		res
			.status(200)
			.send({
				success: true,
				user: {
					fullname: user.fullname,
					email: user.email,
					profilePic: user.profilePic,
				},
			});
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
};

const Logout = (req, res) => {
	// Clear the JWT cookie to log out the user
	res.clearCookie("jwt", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Strict",
	});
	res.status(200).send({ success: true, message: "Logged out successfully" });
};

const onboarding = async (req, res) => {
	try {
		const userId = req.user._id;
		const { fullname, bio, nativeLanguage, learningLanguage, location } =
			req.body;
		// Validate input fields
		if (
			!fullname ||
			!bio ||
			!nativeLanguage ||
			!learningLanguage ||
			!location
		) {
			return res.status(400).send("All fields are required");
		}

		// Find the user by ID and update their profile
		const updatedUser = await userModel.findByIdAndUpdate(
			userId,
			{
				fullname,
				bio,
				nativeLanguage,
				learningLanguage,
				location,
				isOnboarded: true, // Set isOnboarded to true
			},
			{ new: true, runValidators: true },
		);

		if (!updatedUser) {
			return res.status(404).send("User not found");
		}

		// Upsert the user in Stream
		try {
			await upsertStreamUser({
				id: updatedUser._id.toString(),
				name: updatedUser.fullname,
				image: updatedUser.profilePic || "",
			});
			console.log(
				`Stream user updated successfully for ${updatedUser.fullname}`,
			);
		} catch (error) {
			console.error("Error updating Stream user:", error);
		}

		res.status(200).send({
			success: true,
			user: {
				fullname: updatedUser.fullname,
				bio: updatedUser.bio,
				nativeLanguage: updatedUser.nativeLanguage,
				learningLanguage: updatedUser.learningLanguage,
				location: updatedUser.location,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal server error");
	}
};

module.exports = {
	Signup,
	Login,
	Logout,
	onboarding,
};
