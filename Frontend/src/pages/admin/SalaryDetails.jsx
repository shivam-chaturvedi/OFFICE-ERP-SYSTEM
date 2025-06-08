import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const salarySummary = {
  totalEmployees: 152,
  totalSalary: 1245000,
  averageSalary: 8190,
};

const salaryData = [
  { name: "Jan", salary: 105000 },
  { name: "Feb", salary: 112000 },
  { name: "Mar", salary: 98000 },
  { name: "Apr", salary: 125000 },
  { name: "May", salary: 118000 },
];

const employeeSalaries = [
  { id: 1, name: "Ramesh Kumar", department: "IT", month: "May", amount: 45000, status: "Paid" },
  { id: 2, name: "Priya Sharma", department: "HR", month: "May", amount: 35000, status: "Paid" },
  { id: 3, name: "Amit Singh", department: "Finance", month: "May", amount: 40000, status: "Pending" },
  { id: 4, name: "Sneha Patel", department: "Marketing", month: "May", amount: 30000, status: "Paid" },
];

const SalaryDetails = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Salary Details</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-sm font-medium text-gray-500">Total Employees</h2>
          <p className="text-xl font-semibold text-gray-800">{salarySummary.totalEmployees}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-sm font-medium text-gray-500">Total Salary Processed</h2>
          <p className="text-xl font-semibold text-green-600">₹{salarySummary.totalSalary.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-sm font-medium text-gray-500">Average Salary</h2>
          <p className="text-xl font-semibold text-gray-800">₹{salarySummary.averageSalary.toLocaleString()}</p>
        </div>
      </div>

      {/* Salary Distribution Chart */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Salary Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salaryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="salary" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Employee Salary Table */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Employee Salaries</h2>
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">Amount (₹)</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {employeeSalaries.map(({ id, name, department, month, amount, status }) => (
              <tr key={id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{name}</td>
                <td className="px-4 py-2">{department}</td>
                <td className="px-4 py-2">{month}</td>
                <td className="px-4 py-2">₹{amount.toLocaleString()}</td>
                <td className={`px-4 py-2 font-semibold ${status === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
                  {status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryDetails;
