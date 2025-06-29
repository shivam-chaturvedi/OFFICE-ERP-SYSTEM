
import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Download, Search, Eye, Check, X, ChevronDown, User, Calendar, Building, MapPin } from 'lucide-react';

const LeaveManagementSystem = () => {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('employee'); // New state for active tab

  // Sample data
  const leaveRequests = [
    {
      id: 1,
      employee: 'Aman Verma',
      empId: 'EMP001',
      department: 'Engineering',
      date: '2025-06-07',
      type: 'Full Day',
      reason: 'Medical Leave',
      status: 'Pending'
    },
    {
      id: 2,
      employee: 'Priya Sharma',
      empId: 'EMP002',
      department: 'Marketing',
      date: '2025-06-08',
      type: 'Full Day',
      reason: 'Family Function',
      status: 'Pending'
    },
    {
      id: 3,
      employee: 'Ravi Kumar',
      empId: 'EMP003',
      department: 'HR',
      date: '2025-06-05',
      type: 'Half Day',
      reason: 'Personal',
      status: 'Approved'
    },
    {
      id: 4,
      employee: 'Sunita Patel',
      empId: 'EMP004',
      department: 'Finance',
      date: '2025-06-04',
      type: 'Full Day',
      reason: 'Vacation',
      status: 'Approved'
    },
    {
      id: 5,
      employee: 'Rajesh Singh',
      empId: 'EMP005',
      department: 'Engineering',
      date: '2025-06-03',
      type: 'Full Day',
      reason: 'Sick Leave',
      status: 'Rejected'
    },
    {
      id: 6,
      employee: 'Neha Gupta',
      empId: 'EMP006',
      department: 'Marketing',
      date: '2025-06-02',
      type: 'Half Day',
      reason: 'Personal',
      status: 'Approved'
    }
  ];

  // Department-wise data for pie chart
  const departmentData = [
    { name: 'Engineering', value: 8, color: '#8B5CF6' },
    { name: 'Marketing', value: 6, color: '#06B6D4' },
    { name: 'HR', value: 4, color: '#10B981' },
    { name: 'Finance', value: 6, color: '#F59E0B' }
  ];

  // Leave types data for bar chart
  const leaveTypesData = [
    { name: 'Sick Leave', value: 12 },
    { name: 'Personal', value: 8 },
    { name: 'Vacation', value: 16 }
  ];

  const handleApprove = (id) => {
    alert(`Leave request ${id} approved!`);
  };

  const handleReject = (id) => {
    alert(`Leave request ${id} rejected!`);
  };

  const handleView = (id) => {
    const employee = leaveRequests.find(req => req.id === id);
    setSelectedEmployee(employee);
    setActiveTab('employee'); // Reset to first tab when opening sidebar
    setSidebarOpen(true);
  };

  const handleExport = () => {
    alert('Exporting leave data...');
  };

  const handleSelectRequest = (id) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(reqId => reqId !== id)
        : [...prev, id]
    );
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'All Departments' || request.department === departmentFilter;
    const matchesStatus = statusFilter === 'All Status' || request.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || request.type === typeFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesType;
  });

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'employee':
        return (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee Code</label>
                  <p className="text-sm text-gray-900">{selectedEmployee?.empId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-sm text-gray-900">{selectedEmployee?.department}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Designation</label>
                  <p className="text-sm text-gray-900">HR Executive</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Joining</label>
                  <p className="text-sm text-gray-900">2023-03-20</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{selectedEmployee?.employee.toLowerCase().replace(' ', '.')}@company.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900">+91 98765 43210</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-sm text-gray-900">123 Main Street, Sector 12, New Delhi - 110001</p>
              </div>
            </div>
          </div>
        );

      case 'leave':
        return (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Leave Request Details</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Leave Date</label>
                  <p className="text-sm text-gray-900">{selectedEmployee?.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Leave Type</label>
                  <p className="text-sm text-gray-900">{selectedEmployee?.type}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Reason</label>
                <p className="text-sm text-gray-900">{selectedEmployee?.reason}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedEmployee?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedEmployee?.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedEmployee?.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Applied On</label>
                  <p className="text-sm text-gray-900">2025-06-01</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Days Requested</label>
                  <p className="text-sm text-gray-900">{selectedEmployee?.type === 'Full Day' ? '1' : '0.5'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Comments</label>
                <p className="text-sm text-gray-900">Need to attend medical checkup at hospital.</p>
              </div>
            </div>
          </div>
        );

      case 'current':
        return (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Request Status</h4>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Request Timeline</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Request Submitted</p>
                      <p className="text-xs text-blue-700">June 1, 2025 at 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Under Review</p>
                      <p className="text-xs text-gray-500">Pending manager approval</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Final Approval</p>
                      <p className="text-xs text-gray-400">Awaiting HR confirmation</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Leave Balance</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Annual Leave</span>
                    <span className="text-sm font-medium">15 days remaining</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sick Leave</span>
                    <span className="text-sm font-medium">8 days remaining</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Personal Leave</span>
                    <span className="text-sm font-medium">3 days remaining</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Manager Comments</label>
                <p className="text-sm text-gray-900 italic">No comments yet</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className=" ">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Leaves</h1>
            <p className="text-gray-600">Review and manage employee leave requests</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Requests</h3>
            <div className="text-3xl font-bold text-gray-900">24</div>
            <p className="text-sm text-green-600 mt-1">+12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pending</h3>
            <div className="text-3xl font-bold text-orange-500">8</div>
            <p className="text-sm text-gray-500 mt-1">Requires attention</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Approved</h3>
            <div className="text-3xl font-bold text-green-500">14</div>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Rejected</h3>
            <div className="text-3xl font-bold text-red-500">2</div>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department-wise Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Department-wise Leave Requests</h3>
            <p className="text-sm text-gray-600 mb-6">Distribution of leave requests by department</p>
            <div className="h-64">
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
            </div>
          </div>

          {/* Leave Types Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Leave Types</h3>
            <p className="text-sm text-gray-600 mb-6">Breakdown of leave types requested</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaveTypesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Leave Requests</h2>
            
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
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>HR</option>
                <option>Finance</option>
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
                <option>Full Day</option>
                <option>Half Day</option>
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
                          setSelectedRequests(filteredRequests.map(req => req.id));
                        } else {
                          setSelectedRequests([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-blue-600">{request.employee}</div>
                        <div className="text-sm text-gray-500">{request.empId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {request.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              <Check size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              <X size={14} />
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleView(request.id)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar with Tabs */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedEmployee?.employee}</h3>
                    <p className="text-sm text-gray-500">HR Executive • HR</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('employee')}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === 'employee'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Employee Info
                </button>
                <button
                  onClick={() => setActiveTab('leave')}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === 'leave'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Leave Request
                </button>
                <button
                  onClick={() => setActiveTab('current')}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === 'current'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
              {selectedEmployee?.status === 'Pending' && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleApprove(selectedEmployee.id);
                        setSidebarOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedEmployee.id);
                        setSidebarOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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