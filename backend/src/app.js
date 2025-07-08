const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const rootDir = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(rootDir, "frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(rootDir, "frontend", "dist", "index.html"));
	});
}

app.use((req, res, next) => {
	console.log("404 handler:", req.method, req.path);
	res
		.status(404)
		.json({ error: "Not Found", path: req.path, method: req.method });
});

module.exports = app;
