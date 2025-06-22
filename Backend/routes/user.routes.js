const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware=require('../middlewares/auth.middleware')

router.post('/add',authMiddleware.verifyAdmin,userController.addUser);
router.get('/',userController.getAllUsers)
router.put('/edit',authMiddleware.verifyAdmin,userController.editUser)
router.delete('/delete/:id',authMiddleware.verifyAdmin,userController.removeUser)


module.exports = router;
