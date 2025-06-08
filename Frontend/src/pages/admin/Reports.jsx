import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const salaryData = [
  { month: "Jan", salary: 105000 },
  { month: "Feb", salary: 112000 },
  { month: "Mar", salary: 98000 },
  { month: "Apr", salary: 125000 },
  { month: "May", salary: 118000 },
];

const leaveData = [
  { name: "Approved", value: 45 },
  { name: "Rejected", value: 10 },
  { name: "Pending", value: 15 },
];

const COLORS = ["#22c55e", "#ef4444", "#facc15"];

const Reports = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
      <p className="text-gray-600 mb-6">Visual overview of salary trends and leave analytics.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Bar Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Salary Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="salary" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Pie Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Leave Request Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leaveData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {leaveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
