import React, { useState } from "react";

const initialTasks = [
  { id: 1, title: "Develop User Management Module", assignedTo: "Ramesh Kumar", status: "In Progress", dueDate: "2025-06-20" },
  { id: 2, title: "Prepare Monthly Report", assignedTo: "Priya Sharma", status: "Completed", dueDate: "2025-06-10" },
  { id: 3, title: "Fix Login Bug", assignedTo: "Amit Singh", status: "Pending", dueDate: "2025-06-18" },
  { id: 4, title: "Design New UI Mockups", assignedTo: "Sneha Patel", status: "In Progress", dueDate: "2025-06-22" },
];

const statuses = ["All", "Pending", "In Progress", "Completed"];

const Tasks = () => {
  const [filter, setFilter] = useState("All");

  const filteredTasks = filter === "All" ? initialTasks : initialTasks.filter(t => t.status === filter);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Tasks / Projects</h1>

      {/* Status Filter */}
      <div className="mb-6 flex space-x-4">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto bg-white rounded shadow p-4">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-4 py-2">Task</th>
              <th className="px-4 py-2">Assigned To</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(({ id, title, assignedTo, status, dueDate }) => (
                <tr
                  key={id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{title}</td>
                  <td className="px-4 py-2">{assignedTo}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      status === "Completed"
                        ? "text-green-600"
                        : status === "In Progress"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {status}
                  </td>
                  <td className="px-4 py-2">{dueDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
