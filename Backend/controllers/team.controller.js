const Team = require("../models/team.model");

const createTeam = async (req, res) => {
  try {
    const { name, department, members, leader, active_project, active } =
      req.body;

    if (!name || !department) {
      return res
        .status(400)
        .json({ message: "Name and Department are required." });
    }

    const newTeam = await Team.create({
      name,
      department,
      members,
      leader,
      active_project,
      active,
    });

    res
      .status(201)
      .json({ message: "Team created successfully", team: newTeam });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating team", error: err.message });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("department", "name")
      .populate("members", "name")
      .populate("leader", "name")
      .populate("active_project", "name");

    res.json({ teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching teams", error: err.message });
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
    res.status(500).json({ message: "Error deleting team", error: err.message });
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
    res.status(500).json({ message: "Error updating team", error: err.message });
  }
};



module.exports = {
  createTeam,
  getAllTeams,
  deleteTeam,
  updateTeam,
};
