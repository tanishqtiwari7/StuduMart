const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const adminProtect = require("../middleware/adminMiddleware");
const {
  createOrder,
  verifyPayment,
  getMyPayments,
  getPaymentById,
  getAllPayments,
  getRazorpayKey,
} = require("../controllers/paymentController");

const router = express.Router();

// Get Razorpay key (for frontend)
router.get("/key", protect, getRazorpayKey);

// Payment operations
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/my", protect, getMyPayments);
router.get("/:id", protect, getPaymentById);

// Admin routes
router.get("/admin/all", adminProtect, getAllPayments);

module.exports = router;
