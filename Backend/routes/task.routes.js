const express = require("express");
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/add", authMiddleware.verifyHrOrAdmin, taskController.addTask);
router.get("/", authMiddleware.verifyHrOrAdmin, taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);

router.put("/:id", authMiddleware.verifyHrOrAdmin, taskController.updateTask);
router.delete(
  "/:id",
  authMiddleware.verifyHrOrAdmin,
  taskController.deleteTask
);

module.exports = router;
