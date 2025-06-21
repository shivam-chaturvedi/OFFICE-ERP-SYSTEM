const express = require("express");
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/add", authMiddleware.verifyAdmin, taskController.addTask);
router.get("/", authMiddleware.verifyAdmin, taskController.getAllTasks);
router.put("/:id", authMiddleware.verifyAdmin, taskController.updateTask);
router.delete("/:id", authMiddleware.verifyAdmin, taskController.deleteTask);

module.exports = router;
