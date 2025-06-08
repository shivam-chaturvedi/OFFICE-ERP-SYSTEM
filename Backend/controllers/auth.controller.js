const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
  const { email, password } = req.body;
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
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.status(200).json({
      message: "Login Successful !",
      token,
      user,
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    
    const user=req.user
    
    res.status(200).json({ message: "Token is Valid !", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
