const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["Casual Leave", "Sick Leave", "Other"],
      default: "Casual Leave",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: {
      type: String,
      lowercase: true,
      trim: true,
    },
    notes: {
      type: String,
      lowercase: true,
      default: "",
    },
  },
  { timestamps: true }
);

leaveSchema.pre("save", function (next) {
  if (
    this.startDateTime.toDateString() === this.endDateTime.toDateString() &&
    this.startDateTime >= this.endDateTime
  ) {
    return next(
      new Error("For same-day leaves, end time must be after start time")
    );
  }
  next();
});

module.exports = mongoose.model("Leave", leaveSchema);
