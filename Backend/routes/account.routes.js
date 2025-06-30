const express = require("express");
const accountController = require("../controllers/account.controller");

const router = express.Router();

router.post("/add-update", accountController.addOrUpdateAccount);
router.delete(
  "/remove-payroll/:emp_id",
  accountController.removeEmployeeFromPayroll
);
router.put(
  "/add-monthly-salary/:emp_id",
  accountController.addMonthlySalaryOfEmployee
);
module.exports = router;
