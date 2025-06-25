const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      lowercase: true,
    },
    instructions: {
      type: String,
      trim: true,
      lowercase: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    tags: {
      type: [String],
      lowercase: true,
      default: [],
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed", "on hold", "cancelled"],
      default: "pending",
      lowercase: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      lowercase: true,
    },
    deadline: {
      type: Date,
    },
    completed_at: {
      type: Date,
    },
    subtasks: [
      {
        employee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
          required: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        progress: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
        description: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
