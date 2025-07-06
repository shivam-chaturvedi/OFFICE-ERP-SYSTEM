import React, { useState, useEffect } from "react";
import TaskCreationForm from "../../components/TaskCreationForm";
import {
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Users,
} from "lucide-react";
import config from "../../config";

const ManageTasks = () => {
  const [activeView, setActiveView] = useState("List View");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const handleCreateTask = (task) => {
    setTasks((prev) => [...prev, task]);
    setIsModalOpen(false);
  };

  useEffect(() => {
    let filtered = tasks;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task._id.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter((task) =>
        task.tags.includes(statusFilter.toLowerCase())
      );
    }

    if (priorityFilter !== "All Priority") {
      filtered = filtered.filter(
        (task) => task.priority.toLowerCase() == priorityFilter.toLowerCase()
      );
    }

    setFilteredTasks(filtered);
  }, [searchQuery, statusFilter, priorityFilter, tasks]);

  // Export functionality
  const exportToCSV = () => {
    const tasksToExport =
      selectedTasks.length > 0
        ? filteredTasks.filter((task) => selectedTasks.includes(task.id))
        : filteredTasks;

    if (tasksToExport.length === 0) {
      alert("No tasks to export!");
      return;
    }

    // Create CSV headers
    const headers = [
      "ID",
      "Title",
      "Description",
      "Date",
      "Comments",
      "Attachments",
      "Subtasks",
      "Progress (%)",
      "Status",
      "Priority",
      "Categories",
    ];

    // Convert tasks to CSV format
    const csvContent = [
      headers.join(","),
      ...tasksToExport.map((task) => {
        const status =
          task.tags.find((tag) =>
            ["todo", "in progress", "review", "completed"].includes(tag)
          ) || "";
        const priority =
          task.tags.find((tag) => ["high", "medium", "low"].includes(tag)) ||
          "";
        const categories = task.tags
          .filter(
            (tag) =>
              ![
                "todo",
                "in progress",
                "review",
                "completed",
                "high",
                "medium",
                "low",
              ].includes(tag)
          )
          .join(";");

        return [
          task.id,
          `"${task.title}"`,
          `"${task.description}"`,
          task.date,
          task.comments,
          task.attachments,
          task.subtasks,
          task.progress,
          status,
          priority,
          `"${categories}"`,
        ].join(",");
      }),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    const timestamp = new Date().toISOString().split("T")[0];
    const fileName =
      selectedTasks.length > 0
        ? `selected-tasks-${timestamp}.csv`
        : `all-tasks-${timestamp}.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      change: "+0% from last month",
      changeType: "positive",
    },
    {
      title: "In Progress",
      value: tasks.filter((task) => task.progress < 100).length,
      change: "+0% from last month",
      changeType: "positive",
    },
    {
      title: "Overdue",
      value: tasks.filter((task) => {
        return task.deadline && new Date(task.deadline) < new Date();
      }).length,
      change: "-0% from last month",
      changeType: "negative",
    },
    {
      title: "Team Members",
      value: tasks.reduce((acc, task) => {
        return acc + (task?.team?.members?.length || 0);
      }, 0),
      change: "+0% from last month",
      changeType: "positive",
    },
  ];

  const getTagStyle = (tag) => {
    const styles = {
      "in progress": "bg-blue-100 text-blue-800",
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
      review: "bg-purple-100 text-purple-800",
      todo: "bg-gray-100 text-gray-800",
      completed: "bg-green-100 text-green-800",
      Backend: "bg-slate-100 text-slate-800",
      Security: "bg-slate-100 text-slate-800",
      Design: "bg-slate-100 text-slate-800",
      Mobile: "bg-slate-100 text-slate-800",
      Database: "bg-slate-100 text-slate-800",
      Performance: "bg-slate-100 text-slate-800",
    };
    return styles[tag] || "bg-gray-100 text-gray-800";
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task._id));
    }
  };

  const handleTaskSelect = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/tasks`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const KanbanColumn = ({ title, tasks }) => (
    <div className="bg-gray-100 p-4 rounded-lg w-full min-w-[250px] max-w-[300px]">
      <h2 className="font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-3 rounded-lg shadow border">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
              <span>Subtasks: {task.subtasks}</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
              <div
                className="bg-blue-600 h-1 rounded-full"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagStyle(
                    tag
                  )}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-gray-500 text-sm text-center">No tasks</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Task Management
          </h1>
          <p className="text-gray-600">
            Manage and track tasks across your organization
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title={
              selectedTasks.length > 0
                ? `Export ${selectedTasks.length} selected tasks`
                : `Export all ${filteredTasks.length} tasks`
            }
          >
            <Download className="w-4 h-4" />
            Export {selectedTasks.length > 0 && `(${selectedTasks.length})`}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>

      {isModalOpen && (
        <TaskCreationForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleCreateTask}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                {stat.title}
              </h3>
              {stat.title === "Team Members" && (
                <Users className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div
              className={`text-sm ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option>All Status</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Todo</option>
            <option>Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
            <option>Critical</option>
          </select>
        </div>
        <button className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
        {["List View", "Kanban Board", "Analytics"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`cursor-pointer pb-3 px-1 border-b-2 font-medium text-sm ${
              activeView === view
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* View Content */}
      {activeView === "List View" ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedTasks.length === filteredTasks.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="font-medium text-gray-900">Select All</span>
            </label>
          </div>
          <div className=" divide-gray-200 p-2 rounded-xl overflow-auto  shadow-lg shadow-purple-200 ">
            {filteredTasks.map((task, idx) => (
              <div
                key={task._id + idx}
                className="p-2 mt-4 shadow-[0_4px_20px_6px_rgba(168,85,247,0.2)] hover:bg-gray-50 rounded-xl transition"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task._id)}
                    onChange={() => handleTaskSelect(task._id)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="uppercase text-lg sm:text-xl font-semibold text-indigo-600 tracking-wide">
                          {task.title}
                        </h3>
                        <h3 className=" uppercase text-sm sm:text-md font-medium text-gray-500 break-all">
                          task ID : {task._id}
                        </h3>

                        <p className="text-sm text-gray-600 mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(task.createdAt).toLocaleDateString()}
                          </div>

                          <div className="flex items-center gap-1">
                            <Paperclip className="w-4 h-4" />
                            {task.attachments?.length}
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Progress
                            </span>
                            <span className="text-sm text-gray-600">
                              {task.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {task.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getTagStyle(
                                tag
                              )}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="cursor-pointer p-1 hover:bg-gray-200 rounded">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No tasks found for selected filters.
              </div>
            )}
          </div>
        </div>
      ) : activeView === "Kanban Board" ? (
        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-full">
            <KanbanColumn
              title="To Do"
              tasks={filteredTasks.filter((task) => task.tags.includes("todo"))}
            />
            <KanbanColumn
              title="In Progress"
              tasks={filteredTasks.filter((task) => task.progress < 100)}
            />
            <KanbanColumn
              title="Review"
              tasks={filteredTasks.filter((task) =>
                task.tags.includes("review")
              )}
            />
            <KanbanColumn
              title="Completed"
              tasks={filteredTasks.filter((task) => task.progress >= 100)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Analytics Cards */}
          <div className="grid grid-cols-4 gap-6">
            {[
              {
                title: "Completion Rate",
                value: "76%",
                color: "bg-green-100 text-green-800",
              },
              {
                title: "Avg. Task Duration",
                value: "5.4 days",
                color: "bg-yellow-100 text-yellow-800",
              },
              {
                title: "Overdue Tasks",
                value: "89",
                color: "bg-red-100 text-red-800",
              },
              {
                title: "Team Efficiency",
                value: "82%",
                color: "bg-blue-100 text-blue-800",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {card.title}
                </h3>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Charts (Use your real chart components if using Recharts/Chart.js etc.) */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 h-64 flex items-center justify-center text-gray-400">
              Tasks by Status (Bar Chart)
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 h-64 flex items-center justify-center text-gray-400">
              Tasks by Priority (Pie Chart)
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 h-64 flex items-center justify-center text-gray-400">
              Weekly Progress (Line Chart)
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-3">
              <h3 className="text-sm font-medium text-gray-500">
                Team Performance
              </h3>
              {[
                { name: "Frontend Team", value: 78 },
                { name: "Backend Team", value: 91 },
                { name: "Design Team", value: 66 },
                { name: "QA Team", value: 84 },
              ].map((team, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{team.name}</span>
                    <span>{team.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${team.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
