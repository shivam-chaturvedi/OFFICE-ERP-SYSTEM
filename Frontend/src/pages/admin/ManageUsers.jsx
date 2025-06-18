import React, { useEffect, useState } from "react";
import AddUserModal from "../../components/AddUserModal";
import config from "../../config";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [alert, setAlert] = useState({});
  const [loader, setLoader] = useState(false);

  const fetchUsers = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/users`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Failed to load users:", err.message);
      setAlert({
        type: "error",
        message: err.message,
      });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    const confirmed = confirm(
      "Are you Sure You want to remove user with id " + id + " ?"
    );
    if (!confirmed) {
      return;
    }
    setLoader(true);
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", message: data.message });
        fetchUsers();
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoader(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/users/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(editUser),
      });
      if (res.ok) {
        fetchUsers();
        setEditUser(null);
        setAlert({
          type: "success",
          message: "User Updated Successfully !",
        });
      } else {
        console.error("Edit failed");
        setAlert({
          type: "error",
          message: "Edit Failed",
        });
      }
    } catch (err) {
      console.error("Error editing user:", err.message);
      setAlert({
        type: "error",
        message: "Edit Failed",
      });
    } finally {
      setLoader(false);
    }
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <Alert alert={alert} setAlert={setAlert} />
      {loader && <Loader />}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        <p className="text-gray-600">
          View, edit, or remove users from the system.
        </p>
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

      {editUser && (
        <div className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-lg shadow-md space-y-4"
          >
            <h2 className="text-xl font-semibold">Edit User</h2>
            <input
              name="name"
              value={editUser.name}
              onChange={handleEditChange}
              placeholder="Name"
              className="input"
              required
            />
            <input
              name="email"
              value={editUser.email}
              onChange={handleEditChange}
              placeholder="Email"
              className="input"
              required
            />
            <input
              name="phone"
              value={editUser.phone}
              onChange={handleEditChange}
              placeholder="Phone"
              className="input"
              required
            />
            <input
              name="position"
              value={editUser.position}
              onChange={handleEditChange}
              placeholder="Position"
              className="input"
              required
            />

            <input
              name="salary"
              value={editUser.salary}
              onChange={handleEditChange}
              placeholder="Salary"
              className="input"
              required
            />

            <input
              name="password"
              type="password"
              onChange={handleEditChange}
              placeholder="New Password"
              className="input"
            />

            <select
              name="role"
              value={editUser.role}
              onChange={handleEditChange}
              className="input"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
              <option value="project_manager">Project Manager</option>
            </select>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-2 py-3">Created At</th>
              <th className="text-left px-2 py-3">E-Id</th>
              <th className="text-left px-2 py-3">Name</th>
              <th className="text-left px-2 py-3">Role</th>

              <th className="text-left px-2 py-3">Position</th>
              <th className="text-left px-2 py-3">Phone</th>
              <th className="text-left px-2 py-3">Email</th>

              <th className="text-left px-2 py-3">Salary</th>
              <th className="text-left px-2 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-2 py-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-2 py-3">{user._id}</td>
                <td className="px-2 py-3 capitalize">{user.name}</td>
                <td className="px-2 py-3 text-purple-600 uppercase">
                  {user.roles[0]}
                </td>
                <td className="px-2 py-3 capitalize">{user.position}</td>
                <td className="px-2 py-3">{user.phone}</td>
                <td className="px-2 py-3 text-blue-800">
                  <a href={`mailto:${user.email}`} className="hover:underline">
                    {user.email}
                  </a>
                </td>

                <td className="px-2 py-3">{user.salary}</td>
                <td className="px-2 py-3 space-x-2">
                  <button
                    onClick={() => setEditUser(user)}
                    className="cursor-pointer text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                  >
                    Edit
                  </button>
                  {user &&
                    user.role !==
                      "admin" && (
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="cursor-pointer text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
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
