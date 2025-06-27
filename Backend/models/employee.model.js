const mongoose = require("mongoose");
const Department = require("../models/department.model");

const employeeSchema = new mongoose.Schema(
  {
    // Basic Details
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    date_of_joining: { type: Date, default: Date.now, required: true },

    // Professional Details
    experience: { type: Number, default: 0 }, // in years
    skills: [{ type: String }],
    domain: { type: String },
    certifications: [{ name: String, issued_by: String, date: Date }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],

    // Compensation
    salary: {
      type: Map,
      of: Number,
      required: true,
    },

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

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    payroll: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

employeeSchema.post("save", async function (doc, next) {
  if (doc.department) {
    await Department.findByIdAndUpdate(doc.department, {
      $addToSet: { employees: doc._id },
    });
  }
  next();
});

module.exports = mongoose.model("Employee", employeeSchema);
