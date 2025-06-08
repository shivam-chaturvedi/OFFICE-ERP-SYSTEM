import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialLeaves = [
  { id: 1, date: "2025-06-01 to 2025-06-02", type: "Sick Leave", status: "Approved" },
  { id: 2, date: "2025-06-15", type: "Half Day", status: "Pending" },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    case "Pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const EmployeeLeaveRequests = () => {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [newLeave, setNewLeave] = useState({
    startDate: null,
    endDate: null,
    type: "Casual Leave",
  });
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (newLeave.startDate && newLeave.endDate) {
      const formattedDate = `${newLeave.startDate.toISOString().split("T")[0]} to ${newLeave.endDate.toISOString().split("T")[0]}`;
      setLeaves([
        ...leaves,
        { id: Date.now(), date: formattedDate, type: newLeave.type, status: "Pending" },
      ]);
      setNewLeave({ startDate: null, endDate: null, type: "Casual Leave" });
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mt-6 text-sm">

        {/* Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">🗓️ My Leave Requests</h2>
          <span className="text-sm text-gray-500">Employee Panel</span>
        </div>
{/* Apply for Leave Form */}
<div className="mb-8">
  <h3 className="text-lg font-semibold text-gray-700 mb-4">Apply for Leave</h3>
  <div className="flex flex-col md:flex-row md:items-end gap-4">
    <DatePicker
      selected={newLeave.startDate}
      onChange={(dates) => {
        const [start, end] = dates;
        setNewLeave({ ...newLeave, startDate: start, endDate: end });
        if (start && end) setOpen(false);
        else setOpen(true);
      }}
      onClickOutside={() => setOpen(false)}
      open={open}
      onInputClick={() => setOpen(true)}
      startDate={newLeave.startDate}
      endDate={newLeave.endDate}
      selectsRange
      placeholderText="Select leave date range"
      className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-3/5"
    />

    <select
      value={newLeave.type}
      onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
      className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4"
    >
      <option>Casual Leave</option>
      <option>Sick Leave</option>
      <option>Half Day</option>
<option>Other</option>
    </select>

    <button
      onClick={handleApply}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full md:w-auto"
    >
      Apply
    </button>
  </div>
</div>


        {/* Leave History Table */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Leave History</h3>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3 border-b">Date</th>
                  <th className="px-6 py-3 border-b">Type</th>
                  <th className="px-6 py-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{leave.date}</td>
                    <td className="px-6 py-4 border-b">{leave.type}</td>
                    <td className="px-6 py-4 border-b">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeLeaveRequests;
