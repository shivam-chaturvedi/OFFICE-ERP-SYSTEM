const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const deptController = require("../controllers/department.controller");

const router = express.Router();

router.get(
  "/",
  authMiddleware.verifyHrOrAdmin,
  deptController.getAllDepartments
);
router.get(
  "/names",
  authMiddleware.verifyHrOrAdmin,
  deptController.getDepartmentNames
);
router.post(
  "/add",
  authMiddleware.verifyHrOrAdmin,
  deptController.addDepartment
);
router.delete(
  "/delete/:id",
  authMiddleware.verifyHrOrAdmin,
  deptController.deleteDepartment
);
router.patch(
  "/toggle/:id",
  authMiddleware.verifyHrOrAdmin,
  deptController.toggleStatus
);

module.exports = router;
