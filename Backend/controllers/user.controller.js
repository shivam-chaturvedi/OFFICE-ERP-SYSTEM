const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const Busboy = require("busboy");

const addUser = async (req, res) => {
  try {
    const { emps } = req.body;
    // emps=[{emp1_id:["admin","hr"]},{emp2_id:[]}]

    emps.map(async (emp, idx) => {
      let emp_id = Object.keys(emp)[0];
      let roles = emp[emp_id];
      if (roles.length < 1) {
        roles = ["employee"]; //user default role
      }
      let user = await User.findByIdAndUpdate(
        emp_id,
        {
          $set: { roles },
        },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res
          .status(400)
          .json({ message: "No employee exist with id " + emp_id });
      }
    });

    res.status(201).json({ message: `user added successfully.` });
  } catch (err) {
    res.status(500).json({
      message: "Failed to add user",
      error: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ $nor: [{ roles: ["employee"] }] })
      .select("-password")
      .lean();

    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const {
      emp_id,
      roles, // "admin", "hr", "employee", "project_manager"
    } = req.body;
    if (!emp_id) {
      return res.status(400).json({ message: "employee id is required" });
    }
    const user = await User.findByIdAndUpdate(
      emp_id,
      { $set: { roles } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return res
        .status(400)
        .json({ message: "No employee exist with id " + emp_id });
    }
    res.status(201).json({ message: `user added successfully.`, user });
    res
      .status(200)
      .json({ message: "User updated successfully", user: userData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: err.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "/{id} is required !" });
    }
    let user = await User.findById(id);
    if (user.roles?.includes("admin")) {
      return res.status(400).json({
        message: "Admin can't be removed , You can edit info only for admin!",
      });
    }
    user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { roles: ["employee"] } },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ message: "User Removed !", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "/{id} is required!" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const busboy = Busboy({ headers: req.headers });

    let uploadPath = "";
    let fileName = "";

    const profilesDir = path.join(__dirname, "../profiles");

    if (!fs.existsSync(profilesDir)) {
      fs.mkdirSync(profilesDir);
    }

    busboy.on("file", (fieldname, file, originalFilename) => {
      fileName = user._id + "_profile.png";
      uploadPath = path.join(profilesDir, fileName);

      const writeStream = fs.createWriteStream(uploadPath);
      file.pipe(writeStream);

      writeStream.on("close", async () => {
        user.profile_image = `/profiles/${fileName}`;
        await user.save();

        return res.status(200).json({
          message: "Profile picture updated",
          profile_image: user.profile_image,
        });
      });
    });

    busboy.on("error", (err) => {
      console.error(err);
      return res.status(500).json({ message: "Upload failed" });
    });

    req.pipe(busboy);
  } catch (err) { 
    console.log(err.message)
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  editUser,
  removeUser,
  uploadProfilePicture,
};
