const jwt = require("jsonwebtoken");
require("dotenv").config();



exports.auth = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Token missing or invalid" });

    const token = authHeader.split(" ")[1].trim();

    // Verify token using the same secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_access_token_secret_here");

    // Attach decoded info to request
    req.Id = decoded.userId;
    req.role = decoded.role;
    req.userName = decoded.userName;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
