const express = require("express");
const teamController = require("../controllers/team.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/add", authMiddleware.verifyAdmin, teamController.createTeam);
router.get("/", authMiddleware.verifyAdmin, teamController.getAllTeams);
router.put("/:id", authMiddleware.verifyAdmin, teamController.updateTeam);
router.delete("/:id", authMiddleware.verifyAdmin, teamController.deleteTeam);
module.exports = router;
