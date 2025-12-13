const express = require("express");
const {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  getUserProfile,
  getBranches,
  privateController,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.get("/branches", getBranches);
router.get("/profile/:id", getUserProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

// Protected routes
router.get("/private", protect, privateController);

module.exports = router;
