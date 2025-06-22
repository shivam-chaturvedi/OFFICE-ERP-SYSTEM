import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import Loader from "./Loader";
import Alert from "./Alert";
import config from "../config";

const AddUserModal = ({ onClose, onSuccess, employees }) => {
  const [step, setStep] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState({}); // { employeeId: ["admin", "hr"] }
  const [alert, setAlert] = useState({});
  const [loader, setLoader] = useState(false);

  const handleCheckboxChange = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleRoleToggle = (empId, role) => {
    setRoles((prev) => {
      const currentRoles = new Set(prev[empId] || []);
      if (currentRoles.has(role)) {
        currentRoles.delete(role);
      } else {
        currentRoles.add(role);
      }
      return {
        ...prev,
        [empId]: Array.from(currentRoles),
      };
    });
  };

  const handleAssignUsers = async () => {
    try {
      setLoader(true);
      const payload = selectedEmployees.map((empId) => ({
        [empId]: roles[empId] || [],
      }));

      const res = await fetch(`${config.BACKEND_URL}/api/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ emps: payload }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
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

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      {loader && <Loader />}
      <Alert alert={alert} setAlert={setAlert} />
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-xl p-6 space-y-4">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold">Select Employees</h2>
            <input
              type="text"
              placeholder="Search employees by name, email, or department..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto divide-y border rounded-md">
              {filteredEmployees.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  No employees found.
                </div>
              ) : (
                filteredEmployees.map((emp, idx) => (
                  <div
                    key={emp._id + idx}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                    onClick={() => handleCheckboxChange(emp._id)}
                  >
                    <label className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp._id)}
                        onChange={() => handleCheckboxChange(emp._id)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                          {emp.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {emp.user?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {emp.user?.email}
                          </p>
                        </div>
                      </div>
                    </label>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {emp.department?.name}
                      </p>
                      {emp.experience && (
                        <p className="text-xs text-gray-500">
                          {emp.experience} years
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedEmployees.length === 0}
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold">Assign Roles</h2>
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-md text-sm">
              Assign roles to {selectedEmployees.length} selected{" "}
              {selectedEmployees.length > 1 ? "employees" : "employee"}
            </div>

            <div className="space-y-4">
              {selectedEmployees.map((empId) => {
                const emp = employees.find((e) => e._id === empId);
                return (
                  <div
                    key={emp._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        {emp.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{emp.user?.name}</p>
                        <p className="text-sm text-gray-500">
                          {emp.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {["Admin", "HR", "Project_Manager"].map((role) => (
                        <label key={role} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={(roles[emp._id] || []).includes(
                              role.toLowerCase()
                            )}
                            onChange={() =>
                              handleRoleToggle(emp._id, role.toLowerCase())
                            }
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm">{role}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-100"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleAssignUsers}
                className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Assign Roles & Add Users
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddUserModal;
