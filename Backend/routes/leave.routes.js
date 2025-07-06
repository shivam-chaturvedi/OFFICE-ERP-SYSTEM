const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const leaveController = require("../controllers/leave.controller");

router.get("/", authMiddleware.verifyHrOrAdmin, leaveController.getAllLeaves);

router.put(
  "/approve/:id",
  authMiddleware.verifyHrOrAdmin,
  leaveController.approveRequest
);

router.put(
  "/reject/:id",
  authMiddleware.verifyHrOrAdmin,
  leaveController.rejectRequest
);

module.exports = router;
