const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const Department = require("../models/department.model");
const Leave = require("../models/leave.model");

function convertToSalaryObject(arr) {
  const salaryObj = {};
  arr.forEach(({ type, amount }) => {
    if (type && amount !== "") {
      salaryObj[type] = Number(amount);
    }
  });
  return salaryObj;
}

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      position,
      address,
      emergency_contact,
      date_of_birth,
      gender,

      // Employee-specific fields
      department,
      manager_id,
      date_of_joining,
      experience,
      skills,
      domain,
      certifications,
      projects,
      salary,
      bonuses,
      shift,
      work_location,
      status,
      documents,
    } = req.body;

    // Step 1: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const existingEmployee = await Employee.findOne({
        user: existingUser._id,
      });
      if (existingEmployee) {
        return res
          .status(400)
          .json({ message: "Employee already exists for this email." });
      }
    }

    // Step 2: Create new user if doesn't exist
    let user;
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        name,
        roles: ["employee"],
        position,
        phone,
        email,
        password: hashedPassword,
        address,
        emergency_contact,
        date_of_birth,
        gender,
      });

      await user.save();
    } else {
      user = existingUser;
    }
    const dept = await Department.findOne({
      name: new String(department).toLowerCase(),
    });
    if (department.toLowerCase() !== "na" && !dept) {
      return res.status(400).json({ message: "No Such Department Exist." });
    }
    // Step 3: Create Employee entry
    const employee = new Employee({
      _id: user._id,
      user: user._id,
      department: dept?._id,
      manager_id,
      date_of_joining,
      experience,
      skills,
      domain,
      certifications,
      projects,
      salary: convertToSalaryObject(salary),
      bonuses,
      shift,
      work_location,
      status,
      documents,
    });

    await employee.save();

    res.status(201).json({
      message: "Employee added successfully",
      user,
      employee,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Failed to add employee", error: err.message });
  }
};

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find()
    .populate("user")
    .populate("department", "name");
  res.json({ employees });
};

const editEmployee = async (req, res) => {
  try {
    const {
      _id, // employee id (same as user id)
      name,
      email,
      phone,
      password,
      position,
      address,
      emergency_contact,
      date_of_birth,
      gender,

      department,
      manager_id,
      date_of_joining,
      experience,
      skills,
      domain,
      certifications,
      projects,
      salary,
      bonuses,
      shift,
      work_location,
      status,
      documents,
    } = req.body;

    if (!_id) {
      return res
        .status(400)
        .json({ message: "Employee ID is required for update." });
    }

    const user = await User.findById(_id);
    if (user.email !== email) {
      const userWithGivenEmail = await User.findOne({ email });
      if (userWithGivenEmail) {
        return res
          .status(400)
          .json({ message: "This Email is already in use !" });
      }
    }

    const employee = await Employee.findById(_id);
    const oldDeptId = employee.department?.toString();

    if (!user || !employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.position = position || user.position;
    user.address = address || user.address;
    user.emergency_contact = emergency_contact || user.emergency_contact;
    user.date_of_birth = date_of_birth || user.date_of_birth;
    user.gender = gender || user.gender;

    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Validate department if changed
    let dept = null;
    if (department && department.toLowerCase() !== "na") {
      dept = await Department.findOne({ name: department.toLowerCase() });
      if (!dept) {
        return res.status(400).json({ message: "No such department exists." });
      }
    }

    // Update employee fields
    employee.department = dept?._id || employee.department;
    employee.manager_id = manager_id || employee.manager_id;
    employee.date_of_joining = date_of_joining || employee.date_of_joining;
    employee.experience = experience || employee.experience;
    employee.skills = skills || employee.skills;
    employee.domain = domain || employee.domain;
    employee.certifications = certifications || employee.certifications;
    employee.projects = projects || employee.projects;
    employee.salary = salary ? convertToSalaryObject(salary) : employee.salary;
    employee.bonuses = bonuses || employee.bonuses;
    employee.shift = shift || employee.shift;
    employee.work_location = work_location || employee.work_location;
    employee.status = status || employee.status;
    employee.documents = documents || employee.documents;

    await employee.save();

    // Remove from old department if changed
    if (dept && oldDeptId && oldDeptId !== dept._id.toString()) {
      await Department.findByIdAndUpdate(oldDeptId, {
        $pull: { employees: employee._id },
      });
    }

    res.json({ message: "Employee updated successfully", user, employee });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Failed to update employee", error: err.message });
  }
};

const getEmployee = async (req, res) => {
  const id = req.params.id;
  const employee = await Employee.findById(id)
    .populate({
      path: "user",
      select: "name profile_image",
    })
    .populate({
      path: "department",
      select: "name",
    })
    .populate({
      path: "tasks",
      populate: {
        path: "team",
      },
    });

  res.json({ employee });
};

const applyLeave = async (req, res) => {
  try {
    const { emp_id, startDateTime, endDateTime, type, reason } = req.body;

    if (!emp_id || !startDateTime || !endDateTime || !reason) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const leave = new Leave({
      employee: emp_id,
      startDateTime,
      endDateTime,
      type,
      reason,
    });

    await leave.save();

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json({ leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const withdrawLeave = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    await Leave.findByIdAndDelete(id);
    res.status(200).json({ message: "Leave Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  editEmployee,
  getEmployee,
  applyLeave,
  getAllLeaves,
  withdrawLeave,
};
