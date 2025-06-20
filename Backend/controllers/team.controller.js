const Team = require("../models/team.model");
const Department = require("../models/department.model");

const createTeam = async (req, res) => {
  try {
    const { name, department, members, leader, active_project, active } =
      req.body;

    if (!name || !department || !leader) {
      return res
        .status(400)
        .json({ message: "Name and Department are required." });
    }

    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(400).json({ message: "No Such Department Exist." });
    }

    let newTeam = new Team({
      name: name.toLowerCase(),
      department,
      members,
      leader,
      active_project,
      active,
    });

    newTeam = await newTeam.save();

    const populatedTeam = await Team.findById(newTeam._id)
      .populate("department")
      .populate("members")
      .populate("leader")
      .populate("active_project");

    res
      .status(201)
      .json({ message: "Team created successfully", team: populatedTeam });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      res
        .status(500)
        .json({ message: "Team Name is not available", error: err.message });
    } else {
      res
        .status(500)
        .json({ message: "Error creating team", error: err.message });
    }
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate({
        path: "department",
        select: "name",
      })
      .populate({
        path: "members",
        select: "-_id user",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate({
        path: "leader",
        select: "-_id user",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate("active_project");

    res.json({ teams });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching teams", error: err.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Team.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error deleting team", error: err.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const team = await Team.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ message: "Team updated successfully", team });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating team", error: err.message });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  deleteTeam,
  updateTeam,
};
