const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  date: Date,
  check_in_time: Date,
  check_out_time: Date,
  status: { type: String, enum: ['present', 'absent', 'on_leave', 'remote'] }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
