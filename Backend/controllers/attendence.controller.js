const Attendance = require("../models/attendance.model");

const markPresent = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId)
      return res.status(400).json({ message: "Employee ID is required" });

    const today = new Date().toUTCString();

    let attendance = await Attendance.findOne({ employee: employeeId });

    if (!attendance) {
      attendance = new Attendance({
        employee: employeeId,
        records: [{ date: today, status: "present" }],
      });
    } else {
      attendance.records.push({ date: today, status: "present" });
    }

    await attendance.save();
    res.status(200).json({ message: "Attendance marked as present", today });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getAttendanceByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId)
      return res.status(400).json({ message: "Employee ID is required" });

    const attendance = await Attendance.findOne({ employee: employeeId });

    if (!attendance) {
      return res.status(404).json({ message: "No attendance record found" });
    }

    res.status(200).json({
      success: true,
      message: "Attendance records fetched successfully",
      attendance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { markPresent, getAttendanceByEmployeeId };
