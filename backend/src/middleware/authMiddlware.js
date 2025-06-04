const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

protectedRoute= async (req, res, next) => {
    // Check if the JWT token is present in the request cookies
    const token = req.cookies.jwt;
    
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        
        const user= await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).send("Unauthorized: User not found");    
        }


        // Attach user information to the request object
        req.user = user;
        
        // Call the next middleware or route handler
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).send("Unauthorized: Invalid token");
    }
}

module.exports = protectedRoute;