const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  records: [
    {
      _id:false,
      date: Date,
      status: {
        type: String,
        enum: ["present", "absent", "on_leave"],
        default: "absent",
      },
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
