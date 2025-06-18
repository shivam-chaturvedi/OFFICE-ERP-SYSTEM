const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const Department=require("../models/department.model")



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
      const existingEmployee = await Employee.findOne({ user: existingUser._id });
      if (existingEmployee) {
        return res.status(400).json({ message: "Employee already exists for this email." });
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
    const dept=await Department.findOne({name:new String(department).toLowerCase()});
    if(department.toLowerCase()!=='na' && !dept){
        return res.status(400).json({message:"No Such Department Exist."});
    }

    // Step 3: Create Employee entry
    const employee = new Employee({
      _id:user._id,
      user: user._id,
      department:dept?._id,
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
    });

    await employee.save();

    res.status(201).json({
      message: "Employee added successfully",
      user,
      employee,
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: "Failed to add employee", error: err.message });
  }
};


const getAllEmployees = async (req, res) => {
  const employees = await Employee.find()
    .populate("user")
    .populate("department");
  res.json({ employees });
};


const editEmployee=(req,res)=>{
  
}

module.exports = { addEmployee ,getAllEmployees,editEmployee};
