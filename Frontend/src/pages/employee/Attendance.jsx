import React from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const Attendance = () => {
  // Dummy data
  const attendanceSummary = [
    { name: "Present", value: 220 },
    { name: "Absent", value: 15 },
    { name: "Leaves", value: 10 },
    { name: "Half Days", value: 5 },
  ];

  const monthlyAttendance = [
    { month: "Jan", present: 20, absent: 1, leaves: 1 },
    { month: "Feb", present: 19, absent: 0, leaves: 1 },
    { month: "Mar", present: 21, absent: 2, leaves: 0 },
    { month: "Apr", present: 18, absent: 1, leaves: 1 },
    { month: "May", present: 22, absent: 0, leaves: 0 },
  ];

  const COLORS = ["#34D399", "#EF4444", "#FBBF24", "#60A5FA"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">My Attendance</h1>
      <p className="text-gray-600 mb-6">
        Here's a visual summary of your attendance records.
      </p>

      {/* Pie Chart Summary */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Yearly Attendance Summary</h2>
        <div className="flex justify-center">
          <PieChart width={300} height={250}>
            <Pie
              data={attendanceSummary}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {attendanceSummary.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Bar Chart for Monthly Attendance */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Attendance</h2>
        <div className="overflow-x-auto">
          <BarChart width={600} height={300} data={monthlyAttendance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" fill="#34D399" name="Present" />
            <Bar dataKey="absent" fill="#EF4444" name="Absent" />
            <Bar dataKey="leaves" fill="#FBBF24" name="Leaves" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
