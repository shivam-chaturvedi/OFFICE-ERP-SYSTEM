import React, { useEffect, useState } from "react";
import config from "../../config";
import AddEmployeeModal from "../../components/AddEmployeeModal";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import EditEmployeeModal from "../../components/EditEmployeeModal";

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

  const saveEdit = async () => {
    try {
      const res = await fetch(
        `${config.BACKEND_URL}/api/employees/edit/${selectedEmployee._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedEmployee),
        }
      );

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
      {editModal && (
        <EditEmployeeModal
          selectedEmployee={selectedEmployee}
          onClose={() => {
            setEditModal(false);
          }}
          onSuccess={() => {
            setAlert({
              type: "success",
              message: "Employee Edited Successfully !",
            });

            fetchEmployees();
          }}
        />
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
