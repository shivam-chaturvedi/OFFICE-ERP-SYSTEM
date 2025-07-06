const Permission = require("../models/permission.model");

const createPermission = async (req, res) => {
  try {
    const { role, permissions } = req.body;

    if (!role || !Array.isArray(permissions)) {
      return res.status(400).json({ error: "Role and permissions are required" });
    }

    const existing = await Permission.findOne({ role });
    if (existing) {
      return res.status(409).json({ error: "Permission for this role already exists" });
    }

    const newPermission = new Permission({ role, permissions });
    await newPermission.save();
    res.status(201).json({ message: "Permission created", data: newPermission });
  } catch (err) {
    console.error("Error in createPermission:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ data: permissions });
  } catch (err) {
    console.error("Error in getAllPermissions:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getPermissionByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const permission = await Permission.findOne({ role });

    if (!permission) {
      return res.status(404).json({ error: "Permission for this role not found" });
    }

    res.status(200).json({ data: permission });
  } catch (err) {
    console.error("Error in getPermissionByRole:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const updatePermission = async (req, res) => {
  try {
    const { role } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ error: "Permissions must be an array" });
    }

    const updated = await Permission.findOneAndUpdate(
      { role },
      { permissions },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Permission for this role not found" });
    }

    res.status(200).json({ message: "Permission updated", data: updated });
  } catch (err) {
    console.error("Error in updatePermission:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const deletePermission = async (req, res) => {
  try {
    const { role } = req.params;
    const deleted = await Permission.findOneAndDelete({ role });

    if (!deleted) {
      return res.status(404).json({ error: "Permission for this role not found" });
    }

    res.status(200).json({ message: "Permission deleted", data: deleted });
  } catch (err) {
    console.error("Error in deletePermission:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createPermission,
  getAllPermissions,
  getPermissionByRole,
  updatePermission,
  deletePermission,
};
