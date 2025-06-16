import React, { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progressbar";
import { Search, Plus, Filter } from "lucide-react";
import CreateTaskDialog from "../../components/CreateTaskDialog"; // ✅ dialog component

const taskList = [
  {
    id: 1,
    title: "Implement user authentication system",
    description: "Create a secure login and registration system with JWT tokens",
    dueDate: "2024-01-15",
    comments: 8,
    attachments: 3,
    subtasks: "4/6",
    progress: 65,
    status: "in progress",
    priority: "high",
    tags: ["Backend", "Security"],
  },
  {
    id: 2,
    title: "Design mobile app interface",
    description: "Create wireframes and mockups for the mobile application",
    dueDate: "2024-01-20",
    comments: 12,
    attachments: 7,
    subtasks: "8/9",
    progress: 90,
    status: "review",
    priority: "medium",
    tags: ["Design", "Mobile"],
  },
  {
    id: 3,
    title: "Database optimization",
    description: "Optimize database queries and improve performance",
    dueDate: "2024-01-25",
    comments: 3,
    attachments: 1,
    subtasks: "0/4",
    progress: 0,
    status: "todo",
    priority: "low",
    tags: ["Database", "Performance"],
  },
];

export default function ManageTasks() {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // ✅ dialog state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showFilterNote, setShowFilterNote] = useState(false);

  const filteredTasks = taskList.filter((task) => {
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || task.status.toLowerCase() === statusFilter.toLowerCase();
    const matchPriority = priorityFilter === "All" || task.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Task Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Tasks" value="2,847" change="+12%" />
        <StatCard title="In Progress" value="1,234" change="+8%" />
        <StatCard title="Overdue" value="89" change="-5%" />
        <StatCard title="Team Members" value="156" change="+3%" />
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center border rounded-md px-2 py-1 w-full md:w-auto">
          <Search className="h-4 w-4 mr-2" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="outline-none bg-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="border rounded-md p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>in progress</option>
          <option>review</option>
          <option>todo</option>
        </select>

        <select
          className="border rounded-md p-2"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option>All</option>
          <option>high</option>
          <option>medium</option>
          <option>low</option>
        </select>

        <Button variant="outline" onClick={() => setShowFilterNote(!showFilterNote)}>
          <Filter className="h-4 w-4 mr-2" />More Filters
        </Button>

        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>

        {/* ✅ Create Task Dialog here */}
        <CreateTaskDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>

      {showFilterNote && (
        <div className="text-sm text-gray-500 mb-4">✨ More advanced filters coming soon!</div>
      )}

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <span className="text-sm text-muted-foreground">{task.dueDate}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-2">{task.description}</p>
            <div className="flex gap-4 text-sm text-muted-foreground mb-2">
              <span>🗓 {task.dueDate}</span>
              <span>💬 {task.comments}</span>
              <span>📎 {task.attachments}</span>
              <span>🧩 Subtasks: {task.subtasks}</span>
            </div>
            <div className="mb-2">
              <Progress value={task.progress} />
              <div className="text-right text-xs mt-1 font-medium">{task.progress}%</div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{task.status}</Badge>
              <Badge variant="destructive">{task.priority}</Badge>
              {task.tags.map((tag, i) => (
                <Badge key={i} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, change }) {
  const isPositive = change.startsWith("+");
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h4 className="text-sm text-muted-foreground">{title}</h4>
      <div className="text-xl font-semibold">{value}</div>
      <div className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {change} from last month
      </div>
    </div>
  );
}
