const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/add", authMiddleware.verifyAdmin, employeeController.addEmployee);
router.post("/apply-leave", employeeController.applyLeave);
router.get("/leaves/:id", employeeController.getAllLeaves);
router.get("/", authMiddleware.verifyAdmin, employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployee);
router.put(
  "/edit",
  authMiddleware.verifyAdmin,
  employeeController.editEmployee
);
module.exports = router;
