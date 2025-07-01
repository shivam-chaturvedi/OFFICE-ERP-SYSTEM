import React, { useEffect, useState } from "react";
import {
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit2,
  Check,
  Clock,
  FileText,
  X,
  Trash2,
} from "lucide-react";
import ViewSalaryModal from "./components/ViewSalaryModal";
import {
  AddToPayrollFinanceAccountModal,
  MonthlyFinanceAccountModal,
} from "../../../components/FinanceAccountModal";
import config from "../../../config";
import Loader from "../../../components/Loader";
import Alert from "../../../components/Alert";

const EmployeeSalaryDashboard = () => {
  const [employees, setEmployees] = useState([]);

  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(null);
  const [loader, setLoader] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [alert, setAlert] = useState({});
  const [viewMonthlyFinanceAccountModal, setViewMonthlyFinanceAccountModal] =
    useState(null);

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

  const fetchDepartments = async () => {
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/departments/names`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setDepartments(data.names || []);
    } catch (err) {
      console.error("Error fetching Departments", err);
    } finally {
      setLoader(false);
    }
  };

  const handlePayrollRemove = async (emp) => {
    let confirmed = confirm(
      `Are you Sure you want to remove ${emp?.user?.name} from payroll?`
    );
    if (!confirmed) {
      return;
    }

    try {
      setLoader(true);
      const res = await fetch(
        `${config.BACKEND_URL}/api/accounts/remove-payroll/${emp._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAlert({
          type: "success",
          message: data.message,
        });
        fetchEmployees();
      } else {
        setAlert({
          type: "error",
          message: data.message,
        });
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message,
      });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };
  // available emp means those who are not added to payrole but available for getting added
  const availableEmployees = employees.filter((emp) => emp.payroll == false);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp?._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      emp.department?.name?.toLowerCase() === selectedDepartment.toLowerCase();
    return emp.payroll && matchesSearch && matchesDepartment;
  });

  const filteredAvailableEmployees = availableEmployees.filter((emp) => {
    const matchesSearch =
      emp?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp?._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      emp?.department?.name === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddEmployeeToPayroll = (employee) => {
    setShowEmployeeList(false);
    setShowAccountModal(employee);
  };

  const updateEmployeeStatus = (employeeId, newStatus) => {
    setEmployees(
      employees.map((emp) =>
        emp._id === employeeId ? { ...emp, status: newStatus } : emp
      )
    );
  };

  const getStatusStats = () => {
    const today = new Date();

    let processed = 0;
    let pending = 0;
    let totalPayroll = 0;

    filteredEmployees.forEach((emp) => {
      const lastPaid = new Date(emp?.account?.lastPayedDateTime);
      const diffInMs = today - lastPaid;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (!isNaN(diffInDays) && diffInDays < 26) {
        processed++;
      } else {
        pending++;
      }
      totalPayroll += emp?.account?.netPay || 0;
    });

    return { processed, pending, totalPayroll };
  };

  const stats = getStatusStats();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processed":
        return <Check className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Draft":
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      IT: "bg-blue-100 text-blue-800",
      Finance: "bg-purple-100 text-purple-800",
      HR: "bg-pink-100 text-pink-800",
      Marketing: "bg-orange-100 text-orange-800",
      Operations: "bg-teal-100 text-teal-800",
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      {loader && <Loader />}
      <Alert alert={alert} setAlert={setAlert} />
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Salary Processing
          </h1>
          <p className="text-gray-600">
            Accounts Dashboard - Manage employee salaries and payroll
          </p>
        </div>
        <div className="flex gap-3">
          <button className="cursor-pointer flex items-center gap-2 px-4 py-2   rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button
            onClick={() => setShowEmployeeList(true)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredEmployees.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Processed</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.processed}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Payroll</p>
              <p className="text-3xl font-bold text-purple-600">
                ₹{stats.totalPayroll || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Records Section */}
      <div className="bg-white rounded-xl shadow-sm ">
        <div className="p-6 -b">
          <h2 className="text-xl font-semibold text-gray-900">
            Employee Salary Records
          </h2>
        </div>

        {/* Search and Filters */}
        <div className="p-6 -b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or employee code..."
                className="w-full pl-10 pr-4 py-2  border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase text-purple-400 text-lg font-semibold"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option>All Departments</option>
              {departments.map((dept, idx) => (
                <option key={dept._id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            {/* <button className="flex items-center gap-2 px-4 py-2   rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </button> */}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 -b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">
                  Employee
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Department
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Designation
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Net Pay (Current)
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee._id} className="-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {employee?.user?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee._id}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-md font-medium rounded-md uppercase text-purple-400 ${getDepartmentColor(
                        employee?.department?.name
                      )}`}
                    >
                      {employee?.department?.name || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-900">
                    {employee?.user?.position}
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    ₹{employee?.account?.netPay || 0}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const lastPaid = new Date(
                          employee?.account?.lastPayedDateTime
                        );
                        const today = new Date();
                        const diffInMs = today - lastPaid;
                        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

                        if (!isNaN(diffInDays) && diffInDays < 26) {
                          const month = lastPaid.toLocaleString("default", {
                            month: "long",
                          });
                          const year = lastPaid.getFullYear();
                          return (
                            <span className="text-md font-bold   text-green-800 bg-green-200 p-1 font-mono">
                              Processed for {month} {year}
                            </span>
                          );
                        }

                        return (
                          <button
                            onClick={() =>
                              setViewMonthlyFinanceAccountModal(employee)
                            }
                            className="cursor-pointer bg-green-400 text-black rounded-xl p-2 font-light font-sans hover:bg-green-500"
                          >
                            Mark Payed
                          </button>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-col">
                      <button
                        onClick={() => handleView(employee)}
                        className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm   rounded hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => setShowAccountModal(employee)}
                        className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm   rounded hover:bg-gray-50"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handlePayrollRemove(employee)}
                        className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm text-red-600 rounded hover:bg-gray-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee List Modal */}
      {showEmployeeList && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 -b">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Employee to Add
              </h3>
              <button
                onClick={() => setShowEmployeeList(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Filter for Available Employees */}
            <div className="p-6 -b bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full pl-10 pr-4 py-2   rounded-lg focus:ring-2 focus:ring-blue-500 focus:-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 text-lg uppercase text-purple-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option>All Departments</option>
                  {departments.map((dept, idx) => (
                    <option key={dept._id + idx} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Available Employees Table */}
            <div className="overflow-auto max-h-96">
              <table className="w-full">
                <thead className="bg-gray-50 -b sticky top-0">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Employee
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Department
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Designation
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Salary
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAvailableEmployees.map((employee) => (
                    <tr key={employee._id} className="-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {employee?.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee._id}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-lg text-purple-400 font-medium rounded-md uppercase ${getDepartmentColor(
                            employee.department.name
                          )}`}
                        >
                          {employee.department.name}
                        </span>
                      </td>
                      <td className="p-4 text-gray-900">
                        {employee.user.position}
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        ₹{employee?.account?.netPay || 0}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleAddEmployeeToPayroll(employee)}
                          className="cursor-pointer px-4 py-2 bg-green-400 text-black rounded-md hover:text-white hover:bg-green-700 text-sm"
                        >
                          Add to Payroll
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAvailableEmployees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No employees found matching your criteria
                </div>
              )}
            </div>

            <div className="p-6 -t bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {filteredAvailableEmployees.length} employees available
                </span>
                <button
                  onClick={() => setShowEmployeeList(false)}
                  className="cursor-pointer px-4 py-2   rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isViewModalOpen && selectedEmployee && (
        <ViewSalaryModal
          employee={selectedEmployee}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {showAccountModal && (
        <AddToPayrollFinanceAccountModal
          employee={showAccountModal}
          onClose={() => setShowAccountModal(null)}
          onSuccess={() => {
            fetchEmployees();
            setAlert({
              type: "success",
              message: "Employee Payroll Info Updated Successfully",
            });
            setShowAccountModal(null);
          }}
        />
      )}

      {viewMonthlyFinanceAccountModal && (
        <MonthlyFinanceAccountModal
          employee={viewMonthlyFinanceAccountModal}
          onClose={() => setViewMonthlyFinanceAccountModal(null)}
          onSuccess={() => {
            fetchEmployees();
            setAlert({
              type: "success",
              message: "Salary Info Updated Successfully ",
            });
            setViewMonthlyFinanceAccountModal(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeSalaryDashboard;
