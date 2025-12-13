const express = require('express')
const { getAllUsers, updateUser, addEvent, updateEvent, updateProductListing, getAllComments } = require('../controllers/adminController')
const adminProtect = require('../middleware/adminMiddleware')


const router = express.Router()


router.get("/users", adminProtect, getAllUsers)
router.put("/users/:uid", adminProtect, updateUser)
router.post("/event", adminProtect, addEvent)
router.put("/event/:eid", adminProtect, updateEvent)
router.put("/product/:pid", adminProtect, updateProductListing)
router.get("/comment/:eid", adminProtect, getAllComments)



module.exports = router