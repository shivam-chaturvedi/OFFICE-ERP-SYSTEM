const Department = require("../models/department.model");
const Employee = require("../models/employee.model");
const Project = require("../models/project.model");

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate({
        path: "head",
        select: "user",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate({
        path: "employees",
        select: "user",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate("projects");

    res.status(200).json({ departments });
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ message: err.message });
  }
};

const addDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      employees = [],
      head = null,
      projects = [],
      status,
    } = req.body;

    let headEmployee = null;
    if (head) {
      headEmployee = await Employee.findById(head);
      if (!headEmployee) {
        return res
          .status(400)
          .json({ message: "No employee found for given head ID: " + head });
      } else {
        employees.push(headEmployee._id);
      }
    }

    for (let emp_id of employees) {
      const emp = await Employee.findById(emp_id);
      if (!emp) {
        return res
          .status(400)
          .json({ message: "No employee found for ID: " + emp_id });
      }
    }

    for (let p_id of projects) {
      const project = await Project.findById(p_id);
      if (!project) {
        return res
          .status(400)
          .json({ message: "No project found for ID: " + p_id });
      }
    }

    const dept = await Department.create({
      name: name.toLowerCase(),
      description,
      employees,
      head: head.length > 0 ? head : null,
      status,
      projects,
    });
    if (headEmployee) {
      headEmployee.department = dept._id;
      await headEmployee.save();
    }
    res.status(201).json({
      message: "Department created successfully!",
      department: dept,
    });
  } catch (err) {
    console.error("Error creating department:", err);
    if ((err.code = 11000)) {
      res
        .status(400)
        .json({ message: "Department With Given Name Already Exists" });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required for deletion" });
    }
    await Department.deleteOne({ _id: id });

    res.status(200).json({ message: "Department Successfully Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Id is required for status updation" });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const updatedDept = await Department.updateOne(
      { _id: id },
      { $set: { status: !department.status } }
    );

    res.status(200).json({
      message: "Status updated successfully",
      status: updatedDept.status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDepartmentNames = async (req, res) => {
  try {
    const names = await Department.find().select("name");

    res.status(200).json({ names });
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllDepartments,
  addDepartment,
  deleteDepartment,
  getDepartmentNames,
  toggleStatus,
};
