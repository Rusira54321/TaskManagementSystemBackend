const express = require("express")
const router = express.Router()
const {authMiddleware} = require("../authMiddlewares/authMiddleware")
const {updateUser} = require("../controllers/userController")
router.post("/update",authMiddleware,updateUser)
module.exports = router