const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permission.controller");

router.post("/add", permissionController.createPermission);

router.get("/", permissionController.getAllPermissions);

router.get("/get-by-role/:role", permissionController.getPermissionByRole);

router.put("/update/:role", permissionController.updatePermission);

router.delete("/delete/:role", permissionController.deletePermission);

module.exports = router;
