const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Exists!" });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(400).json({ message: "Invalid Password !" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.status(200).json({
      message: "Login Successful !",
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login Failed", error: err.message });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const token = req.body.token;

    if (!token) {
      return res.status(400).json({ message: "Token Is Required !" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;

    res.status(200).json({ message: "Token is Valid !", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const {
      name,
      role,
      position,
      contactNumber,
      email,
      password,
      joiningDate,
      lastProjectId,
      lastProjectName,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new User({
      name,
      position,
      contactNumber,
      email,
      password: hashedPassword,
      joiningDate,
      role,
      lastProjectId,
      lastProjectName,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add employee", error: err.message });
  }
};
