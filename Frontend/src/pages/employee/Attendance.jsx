import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Minus,
  Download,
} from "lucide-react";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import config from "../../config";

const AttendanceTracker = ({ user }) => {
  const [currentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});

  let absent = 0;
  const fetchAttendance = async () => {
    try {
      setLoader(true);
      const res = await fetch(
        `${config.BACKEND_URL}/api/attendence/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok && data?.attendance?.records?.length > 0) {
        const formatted = {};
        data.attendance.records.forEach((rec) => {
          const date = new Date(rec.date).toISOString().split("T")[0];
          formatted[date] = rec.status;
        });
        setAttendanceData(formatted);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchAttendance();
  }, [user?._id]);

  const markAttendance = async () => {
    try {
      setLoader(true);
      const res = await fetch(
        `${config.BACKEND_URL}/api/attendence/mark-present`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ employeeId: user._id }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", message: data.message });
        fetchAttendance();
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoader(false);
    }
  };

  const getCalendarDays = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() || 7;
    const days = [];
    for (let i = 1; i < startingDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const dateObj = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let status = "no-record";

      if (attendanceData[dateStr]) {
        status = attendanceData[dateStr];
      } else if (dateObj <= today) {
        status = "absent";
        absent++;
      }

      days.push({
        day,
        date: dateStr,
        status,
      });
    }
    return days;
  };

  const getTodayStatus = () => {
    const today = currentDate.toISOString().split("T")[0];
    return attendanceData[today] || null;
  };

  const getAttendanceStats = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const entries = Object.entries(attendanceData);
    const present = entries.filter(
      ([_, status]) => status === "present"
    ).length;
    const leave = entries.filter(([_, status]) => status === "leave").length;

    const total = daysInMonth;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, leave, total, rate };
  };

  const getAttendanceHistory = () => {
    return Object.entries(attendanceData)
      .map(([date, status]) => ({
        date,
        status,
        day: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const stats = getAttendanceStats();
  const calendarDays = getCalendarDays();
  const attendanceHistory = getAttendanceHistory();
  const todayStatus = getTodayStatus();

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "absent":
        return "bg-red-500";
      case "leave":
        return "bg-yellow-500";
      case "half-day":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loader && <Loader />}
      <Alert alert={alert} setAlert={setAlert} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
            <p className="text-gray-600">
              Track and manage your daily attendance
            </p>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Daily Attendance Section */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Daily Attendance
            </h2>
          </div>
          <p className="text-gray-600 mb-4">Mark your attendance for today</p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium text-gray-900">
                Today:{" "}
                {currentDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600 mr-2">Status:</span>
                {todayStatus ? (
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                      todayStatus === "present" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {todayStatus === "present"
                      ? "Marked as Present"
                      : "Marked as Absent"}
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">Not marked yet</span>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => markAttendance()}
                disabled={todayStatus === "present"}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  todayStatus === "present"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                }`}
              >
                Mark Present
              </button>
            </div>
          </div>

          {todayStatus && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Attendance marked successfully for today!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Attendance Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.rate}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Present Days</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.present}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Absent Days</p>
                <p className="text-2xl font-bold text-orange-600">
                  {absent}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Days</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.total}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Attendance Overview Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Attendance Overview
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Distribution of your attendance status
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Donut Chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg
                  className="w-64 h-64 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  {/* Present days (green) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${
                      (stats.present / stats.total) * 251.2
                    } 251.2`}
                    strokeDashoffset="0"
                    className="transition-all duration-1000"
                  />
                  {/* Absent days (red) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeDasharray={`${
                      (stats.absent / stats.total) * 251.2
                    } 251.2`}
                    strokeDashoffset={`-${
                      (stats.present / stats.total) * 251.2
                    }`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {stats.rate}%
                    </div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend and Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Present Days
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-green-600 mr-2">
                    {stats.present}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({Math.round((stats.present / stats.total) * 100)}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Absent Days
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-red-600 mr-2">
                    {absent}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({Math.round((absent / stats.total) * 100)}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-t-2 border-gray-300">
                <span className="text-sm font-medium text-gray-700">
                  Total Days Tracked
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {stats.total}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar View */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Monthly Calendar View
              </h3>
              <div className="flex space-x-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                  <option value={2029}>2029</option>
                  <option value={2030}>2030</option>
                  <option value={2031}>2031</option>
                  <option value={2032}>2032</option>
                </select>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {monthNames[selectedMonth]} {selectedYear} - Color coded
              attendance status
            </p>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <span>Leave</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span>Half Day</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <span>No Record</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}

              {calendarDays.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day ? (
                    <div
                      className={`w-full h-full rounded flex items-center justify-center text-sm font-medium text-white ${getStatusColor(
                        day.status
                      )}`}
                    >
                      {day.day}
                    </div>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-lg shadow-sm p-6 overflow-auto max-h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Attendance History
                </h3>
                <p className="text-sm text-gray-600">
                  View and filter your attendance records
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="cursor-pointer flex items-center px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-1" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Day
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceHistory.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.day}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {getStatusIcon(record.status)}
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === "present"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {record.status === "present" ? "Present" : "Absent"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
