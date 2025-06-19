const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    description: { type: String },

    employees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }
    ],

    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },

    status: { type: Boolean, default: true }, 

    projects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Project" }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
