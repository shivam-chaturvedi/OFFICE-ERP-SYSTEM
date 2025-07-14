import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  Activity,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Plus,
  X,
  Calendar,
  ChevronDown,
  Delete,
  Trash2,
  Edit2,
} from "lucide-react";
import config from "../../config";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";

const ManageTrainees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});
  const [trainees, setTrainees] = useState([]);

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    position: "",
    startDate: "",
    endDate: "",
    phone: "",
  });

  const fetchTrainees = async () => {
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/interns`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTrainees(data.interns || []);
      } else {
        setAlert({
          type: "error",
          message: data.message || "Failed to fetch interns",
        });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/interns/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", message: data.message });
        setShowAddModal(false);
        resetForm();
        fetchTrainees();
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoader(false);
    }
  };

  const handleCancel = () => {
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      position: "",
      startDate: "",
      endDate: "",
      phone: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 p-2";
      case "Completed":
        return "bg-blue-100 text-blue-800 p-2";
      case "On Hold":
        return "bg-orange-100 text-orange-800 p-2";
      default:
        return "bg-gray-100 text-gray-800 p-2";
    }
  };

  const filteredTrainees = trainees.filter((trainee) => {
    const today = new Date();
    const startDate = new Date(trainee.startDate);
    const endDate = new Date(trainee.endDate);

    let currentStatus = "";

    if (today < startDate) {
      currentStatus = "On Hold";
    } else if (today >= startDate && today <= endDate) {
      currentStatus = "Active";
    } else if (today > endDate) {
      currentStatus = "Completed";
    }
    trainee.status = currentStatus;

    const matchesSearch =
      trainee?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      trainee?.email?.toLowerCase()?.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || statusFilter === currentStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      {loader && <Loader />}
      <Alert alert={alert} setAlert={setAlert} />
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Trainees
          </h1>
          <p className="text-gray-600">
            Track and manage trainee progress and information
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Add Trainee
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">
              Total Trainees
            </h3>
            <Users className="text-gray-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{trainees.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Active</h3>
            <Activity className="text-gray-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {trainees.filter((t) => t.status === "Active").length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
            <CheckCircle className="text-gray-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {trainees.filter((t) => t.status === "Completed").length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">On Hold</h3>
            <Clock className="text-gray-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {trainees.filter((t) => t.status === "On Hold").length}
          </p>
        </div>
      </div>

      {/* Trainee List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Trainee List
          </h2>
          <p className="text-gray-600 mb-6">
            Manage and track all trainees in your organization
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search trainees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Completed</option>
              <option>On Hold</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  created At
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  Trainee
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  Start Date
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  End Date
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  Position
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  Phone
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTrainees.map((trainee) => (
                <tr
                  key={trainee._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-gray-900">
                    {new Date(trainee.createdAt).toDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {trainee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {trainee.name}
                        </p>
                        <p className="text-sm text-gray-500">{trainee.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-gray-900">
                    {new Date(trainee.startDate).toDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-900">
                    {new Date(trainee.endDate).toDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-900">
                    {trainee.position}
                  </td>

                  <td className="py-4 px-6 text-gray-900">{trainee.phone}</td>

                  <td className={`py-4 px-6 `}>
                    <span className={`${getStatusColor(trainee?.status)}`}>
                      {trainee?.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => {
                        setShowAddModal(true);
                        setFormData({
                          _id: trainee._id,
                          name: trainee.name,
                          email: trainee.email,
                          position: trainee.position,
                          startDate: trainee.startDate,
                          endDate: trainee.endDate,
                          phone: trainee.phone,
                        });
                      }}
                      className="ml-2 text-yellow-800 cursor-pointer scale-105 hover:text-gray-600 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Trainee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add New Trainee
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Enter the details for the new trainee.
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Full Name */}

              <Alert alert={alert} setAlert={setAlert} />
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Enter position title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Start Date and End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate?.slice(0, 10) || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate?.slice(0, 10) || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cursor-pointer px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {formData._id ? "Update Trainee" : "Add Trainee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTrainees;
