import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  Plus,
  User,
  Download,
  Upload,
  FileText,
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import TeamManagementPage from "./components/TeamManagementPage";

const Tasks = ({ user }) => {
  const [activeTab, setActiveTab] = useState("My Tasks");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalProgress, setModalProgress] = useState(0);
  const [modalStatus, setModalStatus] = useState("");
  const [modalComments, setModalComments] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [employee, setEmployee] = useState({});
  const [isLeader, setIsLeader] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Tasks",
      value: "3",
      subtitle: "Completed",
      icon: "🎯",
    },
    {
      title: "In Progress",
      value: "1",
      subtitle: "Active tasks",
      icon: "⏳",
    },
    {
      title: "Team Members",
      value: "3",
      subtitle: "Active members",
      icon: "👥",
    },
    {
      title: "Completion Rate",
      value: "33%",
      subtitle: "This month",
      icon: "📈",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      role: "Marketing Specialist",
      experience: "3 years",
      email: "john.doe@company.com",
      currentTasks: 2,
      completedTasks: 15,
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Content Writer",
      experience: "2 years",
      email: "jane.smith@company.com",
      currentTasks: 3,
      completedTasks: 12,
    },
    {
      id: 3,
      name: "Mike Wilson",
      role: "Graphic Designer",
      experience: "4 years",
      email: "mike.wilson@company.com",
      currentTasks: 1,
      completedTasks: 18,
    },
  ];

  const resources = [
    {
      id: 1,
      name: "Marketing Guidelines 2024",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "Sarah Johnson",
      date: "1/15/2024",
      icon: "📄",
    },
    {
      id: 2,
      name: "Brand Assets Collection",
      type: "ZIP",
      size: "15.2 MB",
      uploadedBy: "Mike Wilson",
      date: "1/12/2024",
      icon: "🗂️",
    },
    {
      id: 3,
      name: "Q4 Strategy Document",
      type: "DOCX",
      size: "1.8 MB",
      uploadedBy: "Sarah Johnson",
      date: "1/10/2024",
      icon: "📝",
    },
  ];

  const upcomingDeadlines = [
    {
      task: "Customer Feedback Analysis",
      dueDate: "1/30/2024",
      daysOverdue: -510,
      status: "overdue",
    },
    {
      task: "Q4 Marketing Campaign Strategy",
      dueDate: "2/15/2024",
      daysOverdue: -494,
      status: "overdue",
    },
  ];

  const tabs = ["My Tasks", "Team Management", "Resources", "Analytics"];
  const statusOptions = ["To Do", "In Progress", "Done"];

  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setModalProgress(task.progress);
    setModalStatus(task.status);
    setModalComments("");
    setShowUpdateModal(true);
    setShowStatusDropdown(false);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedTask(null);
    setShowStatusDropdown(false);
  };

  const handleUpdateProgress = () => {
    if (selectedTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id
          ? { ...task, progress: modalProgress, status: modalStatus }
          : task
      );
      setTasks(updatedTasks);
      closeUpdateModal();
    }
  };

  const fetchEmployee = async () => {
    try {
      const res = await fetch(
        `${config.BACKEND_URL}/api/employees/${user._id}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEmployee(data.employee);
        if (data.employee?.tasks?.length > 0) {
          setTasks(data.employee.tasks);
          if (data.employee.tasks[0].team.leader == user._id) {
            setIsLeader(true);
          }
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [user]);

  // useEffect(() => {
  //   if (employee?.tasks?.length > 0) {
  //     setMembers(employee?.tasks[0]?.team?.members);
  //   }
  // }, [employee]);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "To Do":
        return "bg-blue-100 text-blue-800";
      case "Done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const UpdateProgressModal = () => {
    if (!showUpdateModal || !selectedTask) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Update Task Progress
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Update the progress for "{selectedTask.title}"
              </p>
            </div>
            <button
              onClick={closeUpdateModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Progress Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={modalProgress}
                  onChange={(e) =>
                    setModalProgress(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col">
                  <button
                    type="button"
                    onClick={() =>
                      setModalProgress(Math.min(100, modalProgress + 1))
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setModalProgress(Math.max(0, modalProgress - 1))
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between"
                >
                  <span>{modalStatus}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showStatusDropdown ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setModalStatus(status);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                value={modalComments}
                onChange={(e) => setModalComments(e.target.value)}
                placeholder="Add any comments about the progress..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={closeUpdateModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProgress}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Update Progress
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMyTasks = () => (
    <>
      {/* Search and Filter */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="ml-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>All Status</option>
              <option>In Progress</option>
              <option>To Do</option>
              <option>Done</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tasks.map((task, idx) => (
            <div
              title="Select Task"
              onClick={() => {
                if (selectedTask?._id == task._id) {
                  setSelectedTask(null);
                } else {
                  setSelectedTask(task);
                }
              }}
              key={task._id + idx}
              className={`cursor-pointer rounded-lg shadow-sm border border-gray-200 p-6 ${
                selectedTask?._id == task._id
                  ? "bg-green-200 text-green-900"
                  : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="uppercase text-lg font-semibold text-gray-900">
                  {task.title}
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <p className="capitalize text-sm mb-4">{task.description}</p>

              <div className="capitalize flex items-center space-x-2 mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-400 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Due: {new Date(task.deadline).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {(() => {
                      const dueDate = new Date(task.deadline);
                      const today = new Date();
                      dueDate.setHours(0, 0, 0, 0);
                      today.setHours(0, 0, 0, 0);
                      const msInDay = 1000 * 60 * 60 * 24;
                      const daysOverdue = Math.floor(
                        (today - dueDate) / msInDay
                      );
                      return daysOverdue > 0
                        ? `${daysOverdue} days overdue`
                        : "On time";
                    })()}
                  </span>
                </div>
              </div>

              {task?.subtasks?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Subtasks ({task.subtasks.length})
                  </p>
                  {task.subtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm text-gray-600 mb-1"
                    >
                      <span>{subtask.name}</span>
                      <span>{subtask.progress}%</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => openUpdateModal(task)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  Update Progress
                </span>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderResources = () => (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Team Resources & Documents
        </h2>
        <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {resource.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {resource.type} • {resource.size}
                </p>
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <p className="text-sm text-gray-600">
                Uploaded by: {resource.uploadedBy}
              </p>
              <p className="text-sm text-gray-600">Date: {resource.date}</p>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">
                  Download
                </span>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="px-6 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Task Analytics & Performance
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Task Completion Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Task Completion Overview
          </h3>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Completed Tasks</span>
            <span className="text-sm font-medium text-gray-900">1/3</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-gray-900 h-2 rounded-full"
              style={{ width: "33%" }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600">To Do</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Done</div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Deadlines
          </h3>

          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{deadline.task}</p>
                  <p className="text-sm text-gray-600">
                    Due: {deadline.dueDate}
                  </p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  {deadline.daysOverdue} days
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Team Performance Summary
        </h3>

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {member.completedTasks} completed
                </p>
                <p className="text-sm text-gray-600">
                  {member.currentTasks} active
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "My Tasks":
        return renderMyTasks();
      case "Team Management":
        return (
          <TeamManagementPage employee={employee} selectedTask={selectedTask} />
        );
      case "Resources":
        return renderResources();
      case "Analytics":
        return renderAnalytics();
      default:
        return renderMyTasks();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Tasks & Team Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, Employee</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              title="View Profile "
              onClick={() => {
                navigate("/profile");
              }}
              className="cursor-pointer hover:scale-105 p-2 text-gray-500 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Always show */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {renderContent()}

      {/* Update Progress Modal */}
      <UpdateProgressModal />
    </div>
  );
};

export default Tasks;
