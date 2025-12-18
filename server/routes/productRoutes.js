const express = require("express");
const {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
  markSold,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Approval routes (Admin only - middleware to be added if specific admin check needed, else rely on controller logic or generic protect+admin check)
router.put("/:id/approve", protect, approveProduct); // Ideally add admin check middleware
router.put("/:id/reject", protect, rejectProduct);

// Actions
router.put("/:id/sold", protect, markSold);

// CRUD
router.get("/", getProducts);
router.post("/", protect, addProduct);
router.get("/:id", getProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
