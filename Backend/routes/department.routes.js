const express=require('express')
const authMiddleware=require('../middlewares/auth.middleware')
const deptController=require('../controllers/department.controller')

const router=express.Router();

router.get('/',authMiddleware.verifyAdmin,deptController.getAllDepartments)
router.post('/add',authMiddleware.verifyAdmin,deptController.addDepartment)
module.exports=router