const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token provided" });

  // Handle "Bearer <token>" format
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    req.userId = decoded.id;
    req.userRole = user.role;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
