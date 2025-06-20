const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware=require('../middlewares/auth.middleware')
const authController=require('../controllers/auth.controller')

router.post('/login',authController.login);
router.post('/add-user',authMiddleware.verifyAdmin,userController.addUser);
router.post('/verify-token',authController.validateToken)
router.get('/users',userController.getAllUsers)

module.exports = router;
