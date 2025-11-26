const express = require('express')
const {authMiddleware} = require("../authMiddlewares/authMiddleware")
const router = express.Router()
const {taskCreate,getTasks,changeTaskStatus,deleteTask} = require("../controllers/taskController")
router.post('/create',authMiddleware,taskCreate)
router.get('/getAllTasks',authMiddleware,getTasks)
router.put('/updateStatus/:id',authMiddleware,changeTaskStatus)
router.delete('/delete/:id',authMiddleware,deleteTask)
module.exports = router