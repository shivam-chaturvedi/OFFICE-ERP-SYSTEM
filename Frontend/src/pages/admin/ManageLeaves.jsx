import React, { useState } from "react";

const dummyLeaves = [
  {
    id: 1,
    employee: "Aman Verma",
    date: "2025-06-07",
    reason: "Medical Leave",
    status: "Pending",
  },
  {
    id: 2,
    employee: "Priya Sharma",
    date: "2025-06-08",
    reason: "Family Function",
    status: "Pending",
  },
  {
    id: 3,
    employee: "Ravi Kumar",
    date: "2025-06-05",
    reason: "Personal",
    status: "Approved",
  },
];

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState(dummyLeaves);

  const updateStatus = (id, newStatus) => {
    const updated = leaves.map((leave) =>
      leave.id === id ? { ...leave, status: newStatus } : leave
    );
    setLeaves(updated);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Leaves</h1>
      <p className="text-gray-600 mb-6">
        Review and take action on employee leave requests.
      </p>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-2 px-4 border-b">Employee</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Reason</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{leave.employee}</td>
                <td className="py-2 px-4 border-b">{leave.date}</td>
                <td className="py-2 px-4 border-b">{leave.reason}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      leave.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : leave.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  {leave.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(leave.id, "Approved")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(leave.id, "Rejected")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {leave.status !== "Pending" && (
                    <span className="text-gray-400">No Actions</span>
                  )}
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td
                  className="text-center text-gray-500 py-4"
                  colSpan={5}
                >
                  No leave requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLeaves;
