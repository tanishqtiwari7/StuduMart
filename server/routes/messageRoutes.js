const express = require("express");
const {
  getMessages,
  sendMessage,
  sendEmailToBuyerController,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMessages);
router.post("/email", protect, sendEmailToBuyerController);
router.post("/:pid", protect, sendMessage);

module.exports = router;
