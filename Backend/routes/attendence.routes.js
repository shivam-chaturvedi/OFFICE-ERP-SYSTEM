const express = require("express");
const attendenceController = require("../controllers/attendence.controller");

const router = express.Router();

router.post("/mark-present", attendenceController.markPresent);
router.get("/:employeeId",attendenceController.getAttendanceByEmployeeId)
module.exports = router;
