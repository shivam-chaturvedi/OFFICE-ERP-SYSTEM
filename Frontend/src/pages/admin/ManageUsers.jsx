import React, { useEffect, useState } from "react";
import AddUserModal from "../../components/AddUserModal";
import config from "../../config";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/users`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setUsers([...data.users, ...data.employees]);
    } catch (err) {
      console.error("Failed to load users:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        <p className="text-gray-600">View, edit, or remove users from the system.</p>
      </div>

      <div className="mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          + Add New User
        </button>
      </div>

      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchUsers}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Role</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{user.name}</td>
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">{user.role}</td>
                <td className="px-6 py-3 space-x-2">
                  <button className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
                    Edit
                  </button>
                  <button className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
