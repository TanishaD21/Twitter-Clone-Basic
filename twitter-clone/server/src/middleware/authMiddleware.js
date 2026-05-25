const jwt = require("jsonwebtoken");

// Middleware function to authenticate requests using JWT
const authMiddleware = (req,res,next) => {
    try{
        // Get the Authorization header from the request
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(" ")[1];

        // Verify the token using the secret key and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Attach the decoded user information to the request object for use in subsequent middleware or route handlers
        req.user = decoded;

        next();
    }catch(error) {
        res.status(401).json({ message: "Invalid token"});
    }
};

module.exports = authMiddleware;