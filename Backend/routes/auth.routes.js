const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware=require('../middlewares/auth.middleware')

router.post('/login',authController.login);
router.post('/add-user',authMiddleware.verifyAdmin,authController.addUser);
router.post('/verify-token',authController.validateToken)

module.exports = router;
