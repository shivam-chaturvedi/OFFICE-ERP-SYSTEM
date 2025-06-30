const Leave = require("../models/leave.model");

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employee",
      select: "date_of_joining user department",
      populate: [{ path: "department", select: "name" }, { path: "user" }],
    });
    res.json({ leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const leave_id = req.params.id;
    const leave = await Leave.findByIdAndUpdate(
      leave_id,
      {
        $set: { status: "Approved" },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({ message: "Leave Approved Successfully", status: leave.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const leave_id = req.params.id;
    const leave = await Leave.findByIdAndUpdate(
      leave_id,
      {
        $set: { status: "Rejected" },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({ message: "Leave Rejected Successfully", status: leave.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllLeaves, approveRequest, rejectRequest };
