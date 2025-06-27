const express = require("express");
const accountController = require("../controllers/account.controller");

const router = express.Router();

router.post("/add", accountController.addOrUpdateAccount);
router.delete("/remove-payroll/:emp_id",accountController.removeEmployeeFromPayroll)
module.exports = router;
