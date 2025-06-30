const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const leaveController = require("../controllers/leave.controller");

router.get("/", authMiddleware.verifyAdmin, leaveController.getAllLeaves);

router.put(
  "/approve/:id",
  authMiddleware.verifyAdmin,
  leaveController.approveRequest
);

router.put(
  "/reject/:id",
  authMiddleware.verifyAdmin,
  leaveController.rejectRequest
);

module.exports = router;
