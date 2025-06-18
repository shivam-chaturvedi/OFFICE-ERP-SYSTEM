const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  // Basic Details
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date_of_joining: { type: Date, default: Date.now, required: true },

  // Professional Details
  experience: { type: Number, default: 0 }, // in years
  skills: [{ type: String }],
  domain: { type: String },
  certifications: [{ name: String, issued_by: String, date: Date }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],

  // Compensation
  salary: {
    type: Map,
    of: Number,
    required: true,
  },

  bonuses: [{ amount: Number, reason: String, date: Date }],

  // Work Details
  shift: { type: String, enum: ["Morning", "Evening", "Night", "General"] },
  work_location: { type: String },
  status: {
    type: String,
    enum: ["Active", "On Leave", "Resigned", "Terminated"],
    default: "Active",
  },

  // Documents
  documents: [
    {
      name: String,
      url: String,
      uploaded_at: { type: Date, default: Date.now },
    },
  ],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

employeeSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model("Employee", employeeSchema);
