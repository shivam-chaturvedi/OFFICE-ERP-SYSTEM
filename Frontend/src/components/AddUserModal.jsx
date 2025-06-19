import React, { useState } from "react";
import config from "../config";

const AddUserModal = ({ onClose, onSuccess,employees }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "employee",
    position: "",
    phone: "",
    email: "",
    password: "",
    salary:0.00,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${config.BACKEND_URL}/api/users/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      // console.log(data)
      if (!res.ok) throw new Error(data.message);

      // alert("User added successfully!");
      onSuccess();
      onClose();
    } catch (err) { 
      alert("Failed to add user: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 backdrop:blur-2xl bg-opacity-50 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-lg shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold">Add New User</h2>

        <input name="name" placeholder="Name" required onChange={handleChange} className="input" />
        <input name="email" placeholder="Email" required onChange={handleChange} className="input" />
        <input name="phone" placeholder="Phone" required onChange={handleChange} className="input" />
        <input name="position" placeholder="Position" required onChange={handleChange} className="input" />
                <input name="salary" placeholder="Salary" required onChange={handleChange} className="input" />

        <input name="password" placeholder="Password" type="password" required onChange={handleChange} className="input" />

        <select name="role" onChange={handleChange} className="input">
          <option value="employee">Employee</option>
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
          <option value="project_manager">Project Manager</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserModal;
