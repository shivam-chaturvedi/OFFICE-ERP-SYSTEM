

import React, { useState } from 'react';
import { Bell, AlertCircle, Calendar, Users, Plus, X, DollarSign, FileText, User, Search, ChevronDown, Eye, Edit, Copy, Trash2 } from 'lucide-react';

const NotificationsDashboard = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All');

  // Sample data
  const notifications = [
    {
      id: 1,
      type: 'salary',
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Salary processed for Vikas Tandan',
      description: 'Monthly salary of ₹45,000 has been processed successfully',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
      time: '2 hours ago',
      employee: 'Vikas Tandan'
    },
    {
      id: 2,
      type: 'leave',
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Leave request from Priya Sharma',
      description: 'Requesting 3 days leave from Dec 25-27 for personal work',
      status: 'Action Required',
      statusColor: 'bg-red-100 text-red-800',
      time: '4 hours ago',
      employee: 'Priya Sharma'
    },
    {
      id: 3,
      type: 'permission',
      icon: User,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Permission request from Ravi Kumar',
      description: 'Requesting early leave today at 4:00 PM for medical appointment',
      status: 'Action Required',
      statusColor: 'bg-red-100 text-red-800',
      time: '6 hours ago',
      employee: 'Ravi Kumar'
    },
    {
      id: 4,
      type: 'info',
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'New employee joined - Welcome Aman Verma',
      description: 'Aman Verma has joined as Senior Developer in the Tech team',
      status: 'Info',
      statusColor: 'bg-blue-100 text-blue-800',
      time: '1 day ago',
      employee: 'Aman Verma'
    },
    {
      id: 5,
      type: 'payroll',
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Payroll processing completed',
      description: 'December payroll has been processed for all 45 employees',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
      time: '2 days ago',
      employee: 'All Employees'
    }
  ];

  const pastAnnouncements = [
    {
      id: 1,
      title: 'Independence Day Holiday',
      description: 'Office will remain closed on August 15th for Independence Day celebration',
      audience: 'All Employees',
      sent: '2024-08-10',
      status: 'expired'
    },
    {
      id: 2,
      title: 'Overtime Schedule - Q4',
      description: 'Optional overtime available for Q4 project completion',
      audience: 'Development Team',
      sent: '2024-12-01',
      status: 'active'
    },
    {
      id: 3,
      title: 'Annual Performance Review',
      description: 'Performance review cycle starts from January 2025',
      audience: 'All Employees',
      sent: '2024-12-15',
      status: 'active'
    }
  ];

  const [formData, setFormData] = useState({
    type: '',
    audience: 'All Employees',
    title: '',
    description: '',
    dateRange: '',
    attachFile: false
  });

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    console.log('Creating announcement:', formData);
    setShowCreateModal(false);
    setFormData({
      type: '',
      audience: 'All Employees',
      title: '',
      description: '',
      dateRange: '',
      attachFile: false
    });
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.employee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All Types' || notification.type === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'All' || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications & Announcements</h1>
            <p className="text-gray-600 mt-1">Manage system notifications and broadcast announcements</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Create Announcement
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Notifications</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-gray-500 text-sm">+2 from yesterday</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Actions</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
                <p className="text-gray-500 text-sm">Require your attention</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming Holidays</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-gray-500 text-sm">Next 30 days</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Employee Requests</p>
                <p className="text-3xl font-bold text-gray-900">18</p>
                <p className="text-gray-500 text-sm">This week</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-4 font-medium ${activeTab === 'live' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Live Notifications
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-4 font-medium ${activeTab === 'past' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Past Announcements
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            {/* Filter & Search */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter & Search</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by employee name or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All Types</option>
                    <option>Salary</option>
                    <option>Leave</option>
                    <option>Permission</option>
                    <option>Info</option>
                    <option>Payroll</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All</option>
                    <option>Completed</option>
                    <option>Action Required</option>
                    <option>Info</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div key={notification.id} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`${notification.iconBg} p-3 rounded-full flex-shrink-0`}>
                        <IconComponent className={`${notification.iconColor} w-6 h-6`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{notification.title}</h3>
                            <p className="text-gray-600 mb-2">{notification.description}</p>
                            <div className="flex items-center gap-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.statusColor}`}>
                                {notification.status}
                              </span>
                              <span className="text-sm text-gray-500">{notification.time}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleViewDetails(notification)}
                              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'past' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Past Announcements</h3>
              <p className="text-gray-600">Manage your previously sent announcements</p>
            </div>
            <div className="divide-y">
              {pastAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{announcement.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {announcement.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{announcement.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Audience: {announcement.audience}</span>
                        <span>Sent: {announcement.sent}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors">
                        <Copy size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Announcement Modal */}
        {showCreateModal && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Announcement</h2>
                  <p className="text-gray-600 text-sm">Broadcast important information to your employees</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                    <div className="relative">
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="announcement">Announcement</option>
                        <option value="holiday">Holiday</option>
                        <option value="meeting">Meeting</option>
                        <option value="policy">Policy Update</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <div className="relative">
                      <select
                        value={formData.audience}
                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>All Employees</option>
                        <option>Development Team</option>
                        <option>HR Team</option>
                        <option>Management</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Independence Day Holiday"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Enter detailed description..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range (Optional)</label>
                  <input
                    type="date"
                    value={formData.dateRange}
                    onChange={(e) => setFormData({...formData, dateRange: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="attachFile"
                    checked={formData.attachFile}
                    onChange={(e) => setFormData({...formData, attachFile: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="attachFile" className="ml-2 text-sm text-gray-700">
                    Attach file or image
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Send Notification
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notification Details Modal */}
        {selectedNotification && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Notification Details</h3>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${selectedNotification.iconBg} p-2 rounded-full`}>
                    <selectedNotification.icon className={`${selectedNotification.iconColor} w-5 h-5`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedNotification.title}</h4>
                    <p className="text-sm text-gray-500">{selectedNotification.time}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Employee:</label>
                    <p className="text-gray-900">{selectedNotification.employee}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description:</label>
                    <p className="text-gray-900">{selectedNotification.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${selectedNotification.statusColor} ml-2`}>
                      {selectedNotification.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDashboard;
