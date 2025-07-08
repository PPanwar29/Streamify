const app = require("./app");
const connectDB = require("./libs/db");

const PORT = process.env.PORT || 3000;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Failed to connect to database:", error);
		process.exit(1);
	});
