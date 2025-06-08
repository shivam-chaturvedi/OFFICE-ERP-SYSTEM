const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const bcrypt = require("bcryptjs");
const Department = require("../models/department.model");
const Company = require("../models/company.model");

const addUser = async (req, res) => {
  try {
    const {
      name,
      role, // "admin", "hr", "employee", "project_manager"
      position,
      phone,
      email,
      password,
      designation,
      date_of_joining,
      department, // department ObjectId
      manager_id, // manager ObjectId (optional)
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      role,
      position,
      phone,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // If user is not a super admin, and is an employee/hr/project_manager, create corresponding employee document
    if (["employee", "hr", "project_manager"].includes(role)) {
      const newEmployee = new Employee({
        user: savedUser._id,
        designation,
        date_of_joining,
        department,
        manager_id,
      });
      await newEmployee.save();
    }

    res.status(201).json({ message: `${role} added successfully.` });
  } catch (err) {
    res.status(500).json({
      message: "Failed to add user",
      error: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    const employees = await Employee.find()
      .populate("user", "-password")
      .populate("department")
      .populate({
        path: "department",
        populate: { path: "company" },
      })
      .populate("manager_id")
      .lean();

    res.status(200).json({ users, employees });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

module.exports = {
  addUser,
  getAllUsers,
};
