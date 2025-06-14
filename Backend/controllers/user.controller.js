const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const addUser = async (req, res) => {
  try {
    const {
      name,
      role, // "admin", "hr", "employee", "project_manager"
      position,
      phone,
      email,
      password,
      salary
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
      salary,
    });

    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: `${role} added successfully.`, user: savedUser });
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

    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { _id, name, role, position, phone, email, password,salary } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== _id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.name = name || user.name;
    user.role = role || user.role;
    user.position = position || user.position;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.salary=salary || user.salary

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    const { password: _, ...userData } = updatedUser.toObject();

    res
      .status(200)
      .json({ message: "User updated successfully", user: userData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: err.message });
  }
};

const removeUser=async (req,res)=>{
  try{
    const id=req.params.id;
    if(!id){
      res.status(400).json({message:"/{id} is required !"})
    }
    await User.deleteOne({_id:id})
    res.status(200).json({message:"User Removed !"})
  }catch(err){
    res.status(400).json({message:err.message})
  }
}

module.exports = {
  addUser,
  getAllUsers,
  editUser,
  removeUser,
};
