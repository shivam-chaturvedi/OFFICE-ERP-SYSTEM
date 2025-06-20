const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  leader: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  active_project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Team", teamSchema);
