const express = require("express");
const {
  getEvents,
  getEvent,
  createEvent,
  rsvpEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getEvents);
router.post("/", protect, createEvent);
router.get("/:eid", getEvent);
router.post("/:eid/rsvp", protect, rsvpEvent);

router.use("/:eid/comment", require("./commentRoutes"));

module.exports = router;
