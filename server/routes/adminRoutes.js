const express = require("express");
const {
  getAllUsers,
  getAllListings,
  updateUser,
  addEvent,
  updateEvent,
  updateProductListing,
  getAllComments,
  inviteUser,
} = require("../controllers/adminController");
const adminProtect = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/users", adminProtect, getAllUsers);
router.get("/products", adminProtect, getAllListings);
router.put("/users/:uid", adminProtect, updateUser);
router.post("/event", adminProtect, addEvent);
router.put("/event/:eid", adminProtect, updateEvent);
router.put("/product/:pid", adminProtect, updateProductListing);
router.get("/comment/:eid", adminProtect, getAllComments);
router.post("/invite", adminProtect, inviteUser);

module.exports = router;
