import React, { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

const ManageTrainee = () => {
  const [trainees, setTrainees] = useState([
    {
      id: 1,
      name: "Amit Sharma",
      email: "amit.sharma@example.com",
      phone: "9876543210",
      department: "Development",
      joiningDate: "2024-04-15",
    },
    {
      id: 2,
      name: "Neha Verma",
      email: "neha.verma@example.com",
      phone: "9123456789",
      department: "HR",
      joiningDate: "2024-03-10",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState(null);
  const [deletePopupId, setDeletePopupId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    joiningDate: "",
  });

  const handleAddClick = () => {
    setShowForm(true);
    setEditingTrainee(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      joiningDate: "",
    });
  };

  const handleEditClick = (trainee) => {
    setEditingTrainee(trainee);
    setFormData(trainee);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingTrainee) {
      const updated = trainees.map((t) =>
        t.id === editingTrainee.id ? formData : t
      );
      setTrainees(updated);
    } else {
      const newTrainee = { ...formData, id: Date.now() };
      setTrainees([...trainees, newTrainee]);
    }

    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      joiningDate: "",
    });
    setEditingTrainee(null);
  };

  const filteredTrainees = trainees.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-black-600">Manage Trainees</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-md w-64 focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <Plus size={18} />
            Add New Trainee
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm relative">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Joining Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainees.length > 0 ? (
              filteredTrainees.map((trainee) => (
                <tr key={trainee.id} className="hover:bg-gray-100 transition relative">
                  <td className="p-3 border">{trainee.name}</td>
                  <td className="p-3 border">{trainee.email}</td>
                  <td className="p-3 border">{trainee.phone}</td>
                  <td className="p-3 border">{trainee.department}</td>
                  <td className="p-3 border">{trainee.joiningDate}</td>
                  <td className="p-3 border">
                    <div className="relative flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(trainee)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setDeletePopupId(
                            deletePopupId === trainee.id ? null : trainee.id
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* Inline Delete Popup */}
                     {deletePopupId === trainee.id && (
  <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-lg rounded-lg z-50 w-96 max-w-full p-5">
    <p className="text-gray-800 font-semibold mb-4 text-center">
      Are you sure you want to delete this trainee?
    </p>
    <div className="flex justify-center gap-4">
      <button
        onClick={() => {
          setTrainees(trainees.filter((t) => t.id !== trainee.id));
          setDeletePopupId(null);
        }}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Yes
      </button>
      <button
        onClick={() => setDeletePopupId(null)}
        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  </div>
)}



                     
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No trainees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-white p-6 mt-8 rounded-lg shadow-md space-y-4 max-w-xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-gray-700">
            {editingTrainee ? "Edit Trainee" : "Add New Trainee"}
          </h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full Name"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            placeholder="Department"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={(e) =>
              setFormData({ ...formData, joiningDate: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            required
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingTrainee(null);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingTrainee ? "Update" : "Add"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageTrainee;
