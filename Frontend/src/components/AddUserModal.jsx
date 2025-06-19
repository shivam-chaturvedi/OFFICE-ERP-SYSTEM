import React, { useState } from "react";
import { UserPlus } from "lucide-react";

const AddUserModal = ({ onClose, onSuccess, employees }) => {
const [step, setStep] = useState(1);
const [selectedEmployees, setSelectedEmployees] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [roles, setRoles] = useState({}); // { employeeId: "admin" }

const handleCheckboxChange = (id) => {
setSelectedEmployees((prev) =>
prev.includes(id)
? prev.filter((empId) => empId !== id)
: [...prev, id]
);
};

const handleRoleToggle = (empId, role) => {
setRoles((prev) => ({
...prev,
[empId]: prev[empId] === role ? null : role,
}));
};

const handleAssignUsers = async () => {
const usersToAdd = selectedEmployees.map((id) => {
const emp = employees.find((e) => e.id === id);
return {
name: emp.name,
email: emp.email,
phone: emp.phone || "",
position: emp.position || "",
salary: emp.salary || 0,
password: "123456", // Default or random
role: roles[id] || "employee",
};
});

javascript
Copy
Edit
try {
  const res = await fetch(`/api/users/add-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(usersToAdd),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  onSuccess();
  onClose();
} catch (err) {
  alert("Failed to add users: " + err.message);
}
};

const filteredEmployees = employees.filter(
(emp) =>
emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
(emp.department?.toLowerCase?.() || "").includes(searchTerm.toLowerCase())
);

return (
<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
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
filteredEmployees.map((emp) => (
<div key={emp.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition" >
<label className="flex items-center gap-4">
<input
type="checkbox"
checked={selectedEmployees.includes(emp.id)}
onChange={() => handleCheckboxChange(emp.id)}
className="w-4 h-4 accent-blue-600"
/>
<div className="flex items-center gap-3">
<div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
{emp.name?.charAt(0).toUpperCase()}
</div>
<div>
<p className="font-medium text-gray-900">{emp.name}</p>
<p className="text-sm text-gray-500">{emp.email}</p>
</div>
</div>
</label>
<div className="text-right">
<p className="text-sm font-medium text-gray-800">
{emp.department}
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
<button type="button" onClick={onClose} className="px-5 py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-100" >
Cancel
</button>
<button
type="button"
disabled={selectedEmployees.length === 0}
onClick={() => setStep(2)}
className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
>
Next
<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" >
<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
            const emp = employees.find((e) => e.id === empId);
            return (
              <div
                key={emp.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    {emp.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-gray-500">{emp.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {["Admin", "HR", "Project Manager"].map((role) => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => handleRoleToggle(emp.id, role.toLowerCase())}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        roles[emp.id] === role.toLowerCase()
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {role}
                    </button>
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