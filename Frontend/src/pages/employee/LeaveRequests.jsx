import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import config from "../../config";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";

const LeaveRequests = ({ user }) => {
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({
    startDate: null,
    endDate: null,
    type: "Casual Leave",
    reason: "",
  });
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});

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

  const fetchLeaves = async () => {
    try {
      const res = await fetch(
        `${config.BACKEND_URL}/api/employees/leaves/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) setLeaves(data.leaves);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleApply = async () => {
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      setAlert({ type: "error", message: "Please fill all required fields." });
      return;
    }

    if (
      newLeave.startDate.toDateString() === newLeave.endDate.toDateString() &&
      newLeave.endDate <= newLeave.startDate
    ) {
      setAlert({
        type: "error",
        message: "End time must be after start time on the same day.",
      });
      return;
    }

    try {
      setLoader(true);

      const body = {
        emp_id: user._id,
        startDateTime: newLeave.startDate,
        endDateTime: newLeave.endDate,
        type: newLeave.type,
        reason: newLeave.reason,
      };

      const res = await fetch(
        `${config.BACKEND_URL}/api/employees/apply-leave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setNewLeave({
          startDate: null,
          endDate: null,
          type: "Casual Leave",
          reason: "",
        });
        setAlert({
          type: "success",
          message: data.message,
        });
        fetchLeaves();
      } else {
        setAlert({
          type: "error",
          message: data.message,
        });
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message,
      });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loader && <Loader />}
      <Alert alert={alert} setAlert={setAlert} />
      <div className="max-w-6xl  bg-white p-6 rounded-xl shadow-md">
        {/* Title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            🗓️ My Leave Requests
          </h2>
          <span className="text-sm text-gray-500">Employee Panel</span>
        </div>

        {/* Apply for Leave Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Apply for Leave
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Start Date & Time
              </label>
              <DatePicker
                selected={newLeave.startDate}
                onChange={(date) =>
                  setNewLeave({ ...newLeave, startDate: date })
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd h:mm aa"
                minDate={new Date()}
                placeholderText="Select start datetime"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                End Date & Time
              </label>
              <DatePicker
                selected={newLeave.endDate}
                onChange={(date) => setNewLeave({ ...newLeave, endDate: date })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd h:mm aa"
                minDate={newLeave.startDate || new Date()}
                placeholderText="Select end datetime"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Leave Type
              </label>
              <select
                value={newLeave.type}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, type: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Other</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Reason
              </label>
              <input
                type="text"
                value={newLeave.reason}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, reason: e.target.value })
                }
                placeholder="Reason for leave"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 text-right">
              <button
                onClick={handleApply}
                disabled={loader}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                {loader ? "Applying..." : "Apply Leave"}
              </button>
            </div>
          </div>
        </div>

        {/* Leave History Table */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Leave History
          </h3>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3 border-b">From</th>
                  <th className="px-6 py-3 border-b">To</th>
                  <th className="px-6 py-3 border-b">Type</th>
                  <th className="px-6 py-3 border-b">Reason</th>
                  <th className="px-6 py-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">
                      {new Date(leave.startDateTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {new Date(leave.endDateTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 border-b">{leave.type}</td>

                    <td className="px-6 py-4 border-b">{leave.reason}</td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No leave records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;
