const express=require('express')
const authMiddleware=require('../middlewares/auth.middleware')
const deptController=require('../controllers/department.controller')

const router=express.Router();

router.get('/',authMiddleware.verifyAdmin,deptController.getAllDepartments)
router.post('/add',authMiddleware.verifyAdmin,deptController.addDepartment)
router.delete('/delete/:id',authMiddleware.verifyAdmin,deptController.deleteDepartment)
router.patch('/toggle/:id',authMiddleware.verifyAdmin,deptController.toggleStatus)

module.exports=router