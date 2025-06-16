const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/add", authMiddleware.verifyAdmin, employeeController.addEmployee);

router.get("/", authMiddleware.verifyAdmin, employeeController.getAllEmployees);
module.exports = router;
