import React, { useState } from 'react';
import { Plus, Download, Filter, Search, Eye, Edit2, Check, Clock, FileText, X } from 'lucide-react';
import ViewSalaryModal from './Components/ViewSalaryModal';

const EmployeeSalaryDashboard = () => {
  const [employees, setEmployees] = useState([
    {
      id: 'EMP001',
      name: 'John Smith',
      department: 'IT',
      designation: 'Senior Developer',
      netPay: 85000,
      status: 'Processed'
    },
    {
      id: 'EMP002',
      name: 'Sarah Johnson',
      department: 'Finance',
      designation: 'Finance Manager',
      netPay: 95000,
      status: 'Pending'
    },
    {
      id: 'EMP003',
      name: 'Michael Brown',
      department: 'HR',
      designation: 'HR Executive',
      netPay: 65000,
      status: 'Draft'
    }
  ]);

  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleView = (employee) => {
  setSelectedEmployee(employee);
  setIsViewModalOpen(true);
};

  
  const availableEmployees = [
    {
      id: 'EMP004',
      name: 'Rahul Kumar',
      department: 'IT',
      designation: 'Software Engineer',
      netPay: 75000,
      status: 'Available'
    },
    {
      id: 'EMP005',
      name: 'Priya Sharma',
      department: 'Marketing',
      designation: 'Marketing Executive',
      netPay: 55000,
      status: 'Available'
    },
    {
      id: 'EMP006',
      name: 'Amit Singh',
      department: 'Finance',
      designation: 'Accountant',
      netPay: 60000,
      status: 'Available'
    },
    {
      id: 'EMP007',
      name: 'Neha Gupta',
      department: 'HR',
      designation: 'HR Assistant',
      netPay: 50000,
      status: 'Available'
    },
    {
      id: 'EMP008',
      name: 'Vikash Yadav',
      department: 'Operations',
      designation: 'Operations Manager',
      netPay: 80000,
      status: 'Available'
    },
    {
      id: 'EMP009',
      name: 'Sunita Devi',
      department: 'IT',
      designation: 'QA Tester',
      netPay: 65000,
      status: 'Available'
    }
  ];

  const departments = ['IT', 'Finance', 'HR', 'Marketing', 'Operations'];

  const getStatusStats = () => {
    const processed = employees.filter(emp => emp.status === 'Processed').length;
    const pending = employees.filter(emp => emp.status === 'Pending').length;
    const totalPayroll = employees.reduce((sum, emp) => sum + emp.netPay, 0);
    
    return { processed, pending, totalPayroll };
  };

  const stats = getStatusStats();

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || 
                             emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const filteredAvailableEmployees = availableEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || 
                             emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddEmployeeToPayroll = (employee) => {
    const updatedEmployee = { ...employee, status: 'Draft' };
    setEmployees([...employees, updatedEmployee]);
    setShowEmployeeList(false);
  };

  const updateEmployeeStatus = (employeeId, newStatus) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId ? { ...emp, status: newStatus } : emp
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processed': return <Check className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Draft': return <FileText className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'IT': 'bg-blue-100 text-blue-800',
      'Finance': 'bg-purple-100 text-purple-800',
      'HR': 'bg-pink-100 text-pink-800',
      'Marketing': 'bg-orange-100 text-orange-800',
      'Operations': 'bg-teal-100 text-teal-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
       
     
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Salary Processing</h1>
            <p className="text-gray-600">Accounts Dashboard - Manage employee salaries and payroll</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button 
              onClick={() => setShowEmployeeList(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Processed</p>
                <p className="text-3xl font-bold text-green-600">{stats.processed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Payroll</p>
                <p className="text-3xl font-bold text-purple-600">₹{stats.totalPayroll.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Records Section */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Employee Salary Records</h2>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or employee code..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option>All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Employee</th>
                  <th className="text-left p-4 font-medium text-gray-900">Department</th>
                  <th className="text-left p-4 font-medium text-gray-900">Designation</th>
                  <th className="text-left p-4 font-medium text-gray-900">Net Pay (Current)</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(employee => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.id}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-md ${getDepartmentColor(employee.department)}`}>
                        {employee.department}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900">{employee.designation}</td>
                    <td className="p-4 font-medium text-gray-900">₹{employee.netPay.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateEmployeeStatus(employee.id, 'Processed')}
                          className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(employee.status)}`}
                        >
                          {getStatusIcon(employee.status)}
                          {employee.status}
                        </button>
                        {employee.status !== 'Processed' && (
                          <div className="flex gap-1">
                            {employee.status !== 'Pending' && (
                              <button
                                onClick={() => updateEmployeeStatus(employee.id, 'Pending')}
                                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                                title="Mark as Pending"
                              >
                                <Clock className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => updateEmployeeStatus(employee.id, 'Processed')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                              title="Mark as Processed"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
  onClick={() => handleView(employee)}
  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
>
  <Eye className="w-4 h-4" />
  View
</button>
                        <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                          <Edit2 className="w-4 h-4" />
                          Edit
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
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Select Employee to Add</h3>
                <button 
                  onClick={() => setShowEmployeeList(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search and Filter for Available Employees */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select 
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option>All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Available Employees Table */}
              <div className="overflow-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Employee</th>
                      <th className="text-left p-4 font-medium text-gray-900">Department</th>
                      <th className="text-left p-4 font-medium text-gray-900">Designation</th>
                      <th className="text-left p-4 font-medium text-gray-900">Salary</th>
                      <th className="text-left p-4 font-medium text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAvailableEmployees.map(employee => (
                      <tr key={employee.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.id}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-md ${getDepartmentColor(employee.department)}`}>
                            {employee.department}
                          </span>
                        </td>
                        <td className="p-4 text-gray-900">{employee.designation}</td>
                        <td className="p-4 font-medium text-gray-900">₹{employee.netPay.toLocaleString()}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleAddEmployeeToPayroll(employee)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
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
              
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {filteredAvailableEmployees.length} employees available
                  </span>
                  <button
                    onClick={() => setShowEmployeeList(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
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

      </div>
  
  );
};

export default EmployeeSalaryDashboard;