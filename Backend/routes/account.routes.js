const express = require("express");
const accountController = require("../controllers/account.controller");

const router = express.Router();

router.post("/add", accountController.addAccount);

module.exports = router;
