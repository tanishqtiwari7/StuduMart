const express = require('express')
const { getMessages, sendMessage } = require('../controllers/messageController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get("/", protect, getMessages)
router.post("/:pid", protect, sendMessage)


module.exports = router