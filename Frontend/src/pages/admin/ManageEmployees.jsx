import React, { useEffect, useState } from "react";
import config from "../../config";
import AddEmployeeModal from "../../components/AddEmployeeModal";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});

  const fetchEmployees = async () => {
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/employees`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error("Error fetching employees", err);
    } finally {
      setLoader(false);
    }
  };

  const handleEditClick = (emp) => {
    setSelectedEmployee(emp);
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/employees/${selectedEmployee._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedEmployee),
      });

      if (!res.ok) throw new Error("Failed to update employee");

      setEditModal(false);
      fetchEmployees();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-4 md:p-6">
      {loader && <Loader />}
      <Alert alert={alert} setAlert={setAlert} />
      <h1 className="text-2xl font-semibold mb-4">Manage Employees</h1>

      <div className="flex justify-end mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddModal(true)}
        >
          Add Employee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 md:px-4 py-2">Name</th>
              <th className="px-2 md:px-4 py-2">Email</th>
              <th className="px-2 md:px-4 py-2">Phone</th>
              <th className="px-2 md:px-4 py-2">Position</th>
              <th className="px-2 md:px-4 py-2">Department</th>
              <th className="px-2 md:px-4 py-2">Salary</th>
              <th className="px-2 md:px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="px-2 md:px-4 py-2">{emp.user?.name}</td>
                <td className="px-2 md:px-4 py-2">{emp.user?.email}</td>
                <td className="px-2 md:px-4 py-2">{emp.user?.phone}</td>
                <td className="px-2 md:px-4 py-2">{emp.user?.position}</td>
                <td className="px-2 md:px-4 py-2">
                  {emp.department?.name || "N/A"}
                </td>
                <td className="px-2 md:px-4 py-2">₹{emp.salary}</td>
                <td className="px-2 md:px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEditClick(emp)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-lg mx-2">
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                name="salary"
                value={selectedEmployee.salary}
                onChange={handleEditChange}
                placeholder="Salary"
                className="border p-2"
              />
              <input
                type="text"
                name="work_location"
                value={selectedEmployee.work_location}
                onChange={handleEditChange}
                placeholder="Work Location"
                className="border p-2"
              />
              <select
                name="status"
                value={selectedEmployee.status}
                onChange={handleEditChange}
                className="border p-2"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
                <option value="Terminated">Terminated</option>
              </select>
              <input
                type="text"
                name="domain"
                value={selectedEmployee.domain}
                onChange={handleEditChange}
                placeholder="Domain"
                className="border p-2"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setEditModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setAlert({
              type: "success",
              message: "Employee Added Successfully !",
            });
            fetchEmployees();
          }}
        />
      )}
    </div>
  );
}
