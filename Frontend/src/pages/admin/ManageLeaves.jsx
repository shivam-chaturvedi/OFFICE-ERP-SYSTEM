import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Download,
  Search,
  Eye,
  Check,
  X,
  ChevronDown,
  User,
  Calendar,
  Building,
  MapPin,
} from "lucide-react";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import config from "../../config";

const LeaveManagementSystem = () => {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [activeTab, setActiveTab] = useState("employee"); // New state for active tab
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);

  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  const fetchLeaves = async () => {
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/leaves`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();

      setLeaveRequests(data.leaves || []);

      const leaves = data.leaves;
      const leaveTypeCounts = {};
      const departmentCounts = {};
      const departmentColors = [
        "#8B5CF6",
        "#06B6D4",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#3B82F6",
      ];
      const departmentColorMap = {};

      leaves.forEach((leave) => {
        const type = leave.type;
        const dept = leave.employee?.department?.name;

        // Count leave types
        if (type) {
          leaveTypeCounts[type] = (leaveTypeCounts[type] || 0) + 1;
        }

        // Count department-wise leaves
        if (dept) {
          departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
        }
      });

      const typesChart = Object.entries(leaveTypeCounts).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      // Generate department chart data with colors
      const deptsChart = Object.entries(departmentCounts).map(
        ([name, value], index) => {
          if (!departmentColorMap[name]) {
            departmentColorMap[name] =
              departmentColors[index % departmentColors.length];
          }
          return {
            name,
            value,
            color: departmentColorMap[name],
          };
        }
      );
      setLeaveTypesData(typesChart);
      setDepartmentData(deptsChart);
    } catch (err) {
      console.error("Error fetching leaves", err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this leave?"
    );
    if (!confirmed) return;

    try {
      setLoader(true);
      const res = await fetch(
        `${config.BACKEND_URL}/api/leaves/approve/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", message: data.message });
        setLeaveRequests((prev) =>
          prev.map((leave) =>
            leave._id === id ? { ...leave, status: data.status } : leave
          )
        );
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoader(false);
    }
  };

  const handleReject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this leave?"
    );
    if (!confirmed) return;
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/leaves/reject/${id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();

      if (res.ok) {
        setAlert({ type: "success", message: data.message });
        setLeaveRequests((prev) =>
          prev.map((leave) =>
            leave._id === id ? { ...leave, status: data.status } : leave
          )
        );
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoader(false);
    }
  };

  const handleView = (leave) => {
    const employee = leave?.employee;
    console.log(employee);
    setSelectedEmployee(employee);
    setSelectedLeave(leave);
    setActiveTab("employee"); // Reset to first tab when opening sidebar
    setSidebarOpen(true);
  };

  const handleExport = () => {
    alert("Exporting leave data...");
  };

  const handleSelectRequest = (id) => {
    setSelectedRequests((prev) =>
      prev.includes(id) ? prev.filter((reqId) => reqId !== id) : [...prev, id]
    );
  };

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request?.employee?.user?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request?.employee?._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All Departments" ||
      request?.employee?.department?.name === departmentFilter;
    const matchesStatus =
      statusFilter === "All Status" || request.status === statusFilter;
    const matchesType =
      typeFilter === "All Types" || request.type === typeFilter;

    return matchesSearch && matchesDepartment && matchesStatus && matchesType;
  });

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "employee":
        return (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Employee Information
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Employee Code
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEmployee?._id}
                  </p>
                </div>
                <div>
                  <label className="text-sm ml-12 font-medium text-gray-500">
                    Department
                  </label>
                  <p className="text-md uppercase ml-12  text-purple-400">
                    {selectedEmployee?.department?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Designation
                  </label>
                  <p className="text-sm text-gray-900 uppercase">
                    {selectedEmployee?.user?.roles[0]}
                  </p>
                </div>
                <div>
                  <label className="text-sm ml-12 font-medium text-gray-500">
                    Date of Joining
                  </label>
                  <p className="text-sm ml-12 text-gray-900">
                    {new Date(
                      selectedEmployee.date_of_joining
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEmployee?.user?.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm ml-12 font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-sm ml-12 text-gray-900">
                    {selectedEmployee?.user?.phone}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="text-sm uppercase  text-orange-500">
                  {Object.keys(selectedEmployee?.user?.address).map(
                    (key) => selectedEmployee?.user?.address[key] + " , "
                  )}
                </p>
              </div>
            </div>
          </div>
        );

      case "leave":
        return (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Leave Request Details
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Leave Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedLeave?.startDateTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Leave Type
                  </label>
                  <p className="text-sm text-gray-900">{selectedLeave?.type}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Reason
                </label>
                <p className="text-sm text-gray-900">{selectedLeave?.reason}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedLeave?.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedLeave?.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedLeave?.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Applied On
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedLeave.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Days Requested
                  </label>
                  <p className="text-sm text-gray-900">
                    {(() => {
                      if (
                        !selectedLeave?.startDateTime ||
                        !selectedLeave?.endDateTime
                      )
                        return "-";

                      const start = new Date(selectedLeave.startDateTime);
                      const end = new Date(selectedLeave.endDateTime);

                      const isSameDay =
                        start.toDateString() === end.toDateString();

                      if (isSameDay) return "Half Day";

                      const diffTime = end.getTime() - start.getTime();
                      const diffDays =
                        Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                      return `${diffDays} Days`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "current":
        return (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Current Request Status
            </h4>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <h5 className="font-medium text-blue-900 mb-2">
                  Request Timeline
                </h5>
                <div className="space-y-4">
                  {/* Step 1: Request Submitted */}
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        Request Submitted
                      </p>
                      <p className="text-xs text-blue-700">
                        {new Date(selectedLeave?.createdAt).toDateString()}
                        {"  ,  "}
                        {new Date(selectedLeave?.createdAt).toTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Under Review (Pending Only) */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${
                        selectedLeave?.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          selectedLeave?.status === "Pending"
                            ? "text-yellow-700"
                            : "text-gray-600"
                        }`}
                      >
                        Under Review
                      </p>
                      <p
                        className={`text-xs ${
                          selectedLeave?.status === "Pending"
                            ? "text-yellow-600"
                            : "text-gray-500"
                        }`}
                      >
                        {selectedLeave?.status === "Pending"
                          ? "Pending manager approval"
                          : "Reviewed"}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Final Decision */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${
                        selectedLeave?.status === "Approved"
                          ? "bg-green-500"
                          : selectedLeave?.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          selectedLeave?.status === "Approved"
                            ? "text-green-700"
                            : selectedLeave?.status === "Rejected"
                            ? "text-red-700"
                            : "text-gray-600"
                        }`}
                      >
                        Final Decision
                      </p>
                      <p
                        className={`text-xs ${
                          selectedLeave?.status === "Approved"
                            ? "text-green-600"
                            : selectedLeave?.status === "Rejected"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {selectedLeave?.status === "Approved"
                          ? "Leave approved by manager"
                          : selectedLeave?.status === "Rejected"
                          ? "Leave rejected by manager"
                          : "Awaiting final approval"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Leave Balance
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Annual Leave</span>
                    <span className="text-sm font-medium">
                      15 days remaining
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sick Leave</span>
                    <span className="text-sm font-medium">
                      8 days remaining
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Personal Leave</span>
                    <span className="text-sm font-medium">
                      3 days remaining
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Manager Comments
                </label>
                <p className="text-sm text-gray-900 italic">No comments yet</p>
              </div> */}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {loader && <Loader />}
      {alert.message && <Alert alert={alert} setAlert={setAlert} />}

      <div className=" ">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Leaves
            </h1>
            <p className="text-gray-600">
              Review and manage employee leave requests
            </p>
          </div>
          <button
            onClick={handleExport}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Total Requests
            </h3>
            <div className="text-3xl font-bold text-gray-900">
              {leaveRequests.length}
            </div>
            <p className="text-sm text-green-600 mt-1">+0% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pending</h3>
            <div className="text-3xl font-bold text-orange-500">
              {
                leaveRequests.filter((l) => {
                  return l.status == "Pending";
                }).length
              }
            </div>

            <p className="text-sm text-gray-500 mt-1">Requires attention</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Approved</h3>
            <div className="text-3xl font-bold text-green-500">
              {
                leaveRequests.filter((l) => {
                  return l.status == "Approved";
                }).length
              }
            </div>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Rejected</h3>
            <div className="text-3xl font-bold text-red-500">
              {
                leaveRequests.filter((l) => {
                  return l.status == "Rejected";
                }).length
              }
            </div>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department-wise Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Department-wise Leave Requests
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Distribution of leave requests by department
            </p>
            <div className="h-64">
              {departmentData && departmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <h1 className="text-2xl text-center text-yellow-800">
                  No Record Found{" "}
                </h1>
              )}
            </div>
          </div>

          {/* Leave Types Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Leave Types
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Breakdown of leave types requested
            </p>
            <div className="h-64">
              {leaveTypesData && leaveTypesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveTypesData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <h1 className="text-2xl text-center text-yellow-800">
                  No Record Found{" "}
                </h1>
              )}
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Leave Requests
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Departments</option>{" "}
                {departmentData.map((dept) => (
                  <option key={dept.name} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Types</option>
                {leaveTypesData.map((leave) => (
                  <option key={leave.name} value={leave.name}>
                    {leave.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRequests(
                            filteredRequests.map((req) => req._id)
                          );
                        } else {
                          setSelectedRequests([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests && filteredRequests.length > 0 ? (
                  <>
                    {filteredRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedRequests.includes(request._id)}
                            onChange={() => handleSelectRequest(request._id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="capitalize text-sm font-medium text-blue-600">
                              {request?.employee?.user?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request?.employee?._id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-lg text-purple-400 uppercase font-semibold">
                          {request?.employee?.department?.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(request.startDateTime).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(request.endDateTime).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="bg-yellow-200 p-1 rounded-2xl ">
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                          {request.reason}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                              request.status === "Pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : request.status === "Approved"
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {request.status === "Pending" ? (
                              <>
                                <button
                                  onClick={() => handleApprove(request._id)}
                                  className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                >
                                  <Check size={14} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(request._id)}
                                  className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleView(request)}
                                className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              >
                                <Eye size={14} />
                                View
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-10 text-xl text-yellow-800"
                    >
                      No Record Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar with Tabs */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="capitalize font-semibold text-gray-900">
                      {selectedEmployee?.user?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedEmployee?.user?.position}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("employee")}
                  className={`cursor-pointer flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === "employee"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Employee Info
                </button>
                <button
                  onClick={() => setActiveTab("leave")}
                  className={`cursor-pointer flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === "leave"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Leave Request
                </button>
                <button
                  onClick={() => setActiveTab("current")}
                  className={`cursor-pointer flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === "current"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Current Status
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {renderTabContent()}
              </div>

              {/* Action Buttons - Only show for pending requests */}
              {selectedLeave?.status === "Pending" && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleApprove(selectedLeave._id);
                        setSidebarOpen(false);
                      }}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedLeave._id);
                        setSidebarOpen(false);
                      }}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagementSystem;
