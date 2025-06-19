import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AddDepartmentModal from "../../components/AddDepartmentModal";
import config from "../../config";

const ManageDepartments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [departments, setDepartments] = useState([
    {
      id: "DEPT001",
      name: "Human Resources",
      description:
        "Manages employee relations, recruitment, and organizational development",
      employees: 12,
      head: "Sarah Johnson",
      created: "1/15/2023",
      status: "Active",
      projects: 8,
    },
  ]);

  const fetchDepartments = async () => {
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/departments`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setDepartments(data.departments || []);
      console.log(data)
    } catch (err) {
      console.error("Error fetching Departments", err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const toggleDepartmentStatus = (id) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === id
          ? {
              ...dept,
              status: dept.status === "Active" ? "Inactive" : "Active",
            }
          : dept
      )
    );
  };

  const handleAddDepartment = (newDept) => {
    const newId = `DEPT${String(departments.length + 1).padStart(3, "0")}`;
    const created = new Date().toLocaleDateString();
    setDepartments((prev) => [
      ...prev,
      { id: newId, created, employees: 0, projects: 0, ...newDept },
    ]);
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head?.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(
    (d) => d.status === "Active"
  ).length;
  const inactiveDepartments = departments.filter(
    (d) => d.status === "Inactive"
  ).length;
  const totalEmployees = departments.reduce((sum, d) => sum + d.employees, 0);

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p
            className={`text-3xl font-bold mt-2 ${
              color === "green"
                ? "text-green-600"
                : color === "red"
                ? "text-red-600"
                : "text-gray-900"
            }`}
          >
            {value}
          </p>
        </div>
        <div
          className={`p-3 rounded-full ${
            color === "green"
              ? "bg-green-100"
              : color === "red"
              ? "bg-red-100"
              : "bg-gray-100"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              color === "green"
                ? "text-green-600"
                : color === "red"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          {trend === "up" ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 ">
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Departments
            </h1>
            <p className="text-gray-600 mt-1">
              Organize and manage your company departments
            </p>
          </div>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Departments"
            value={totalDepartments}
            icon={Building2}
          />
          <StatCard
            title="Active Departments"
            value={activeDepartments}
            icon={TrendingUp}
            color="green"
            trend="up"
          />
          <StatCard
            title="Inactive Departments"
            value={inactiveDepartments}
            icon={TrendingDown}
            color="red"
            trend="down"
          />
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            icon={Users}
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments or heads..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Departments Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Department
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Department ID
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Employees
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Department Head
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Created
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Projects
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDepartments.map((dept) => (
                  <tr key={dept._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">
                          {dept.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {dept.description}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{dept.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{dept.employees?.length}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            dept.head?.user?.name === "Not assigned"
                              ? "bg-gray-200 text-gray-500"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {dept.head?.user?.name === "Not assigned"
                            ? "?"
                            : dept.head?.user?.name?.charAt(0)}
                        </div>
                        <span
                          className={
                            dept.head?.user?.name === "Not assigned"
                              ? "text-gray-500"
                              : "text-gray-900"
                          }
                        >
                          {dept.head?.user?.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{dept.created}</td>
                    <td className="py-4 px-6">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={dept.status === "Active"}
                          onChange={() => toggleDepartmentStatus(dept.id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          dept.status === "Active"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-medium">
                      {dept.projects}
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              No departments found matching your search criteria.
            </div>
          </div>
        )}

        {/* Modal */}
        <AddDepartmentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={handleAddDepartment}
        />
      </div>
    </div>
  );
};

export default ManageDepartments;
