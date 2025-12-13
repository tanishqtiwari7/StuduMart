const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const superAdminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401);
        throw new Error("Not authorized - User not found");
      }

      // Check if user is Super Admin
      if (user.role !== "superadmin") {
        res.status(403);
        throw new Error("Access denied - Super Admin only");
      }

      // Check if account is active
      if (!user.isActive) {
        res.status(401);
        throw new Error("Account has been deactivated");
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Super Admin Auth Error:", error.message);
      res.status(401);
      throw new Error("Not authorized - Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized - No token provided");
  }
};

module.exports = { superAdminProtect }
