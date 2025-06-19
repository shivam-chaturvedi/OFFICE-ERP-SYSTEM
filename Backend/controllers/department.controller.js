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
    } = req.body;

    if (head) {
      const headEmployee = await Employee.findById(head);
      if (!headEmployee) {
        return res
          .status(400)
          .json({ message: "No employee found for given head ID: " + head });
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
      name,
      description,
      employees,
      head,
      projects,
    });

    res.status(201).json({
      message: "Department created successfully!",
      department: dept,
    });
  } catch (err) {
    console.error("Error creating department:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllDepartments,
  addDepartment,
};
