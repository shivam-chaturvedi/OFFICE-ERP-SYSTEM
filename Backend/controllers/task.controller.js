const Task = require("../models/task.model");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("team").sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: err.message });
  }
};

const addTask = async (req, res) => {
  try {
    const {
      title,
      description,
      instructions,
      attachments,
      progress,
      tags,
      team,
      status,
      priority,
      deadline,
      completed_at,
    } = req.body;

    if (!title || !team) {
      return res.status(400).json({ message: "Title and Team are required" });
    }

    const newTask = new Task({
      title,
      description: description || "",
      instructions: instructions || "",
      attachments: attachments || [],
      progress: typeof progress === "number" ? progress : 0,
      tags: tags || [],
      team,
      status: status || "pending",
      priority: priority || "medium",
      deadline: deadline || null,
      completed_at: completed_at || null,
    });

    const savedTask = await newTask.save();
    const task = await Task.findById(savedTask._id).populate("team");
    res.status(201).json({ task });
  } catch (err) {
    console.error("Add Task Error:", err.message);
    res.status(400).json({ message: "Error adding task", error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating task", error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: err.message });
  }
};

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
};
