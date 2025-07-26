const express = require("express");
const teamController = require("../controllers/team.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/add", authMiddleware.verifyHrOrAdmin, teamController.createTeam);
router.get("/", authMiddleware.verifyHrOrAdmin, teamController.getAllTeams);
router.put("/:id", authMiddleware.verifyHrOrAdmin, teamController.updateTeam);
router.delete(
  "/:id",
  authMiddleware.verifyHrOrAdmin,
  teamController.deleteTeam
);
module.exports = router;
