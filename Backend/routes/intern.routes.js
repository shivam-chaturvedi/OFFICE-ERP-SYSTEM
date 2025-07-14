const express = require("express");
const router = express.Router();
const internCtrl = require("../controllers/intern.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/add", authMiddleware.verifyHrOrAdmin, internCtrl.createOrUpdateIntern);
router.get("/", authMiddleware.verifyHrOrAdmin, internCtrl.getAllInterns);
module.exports = router;
