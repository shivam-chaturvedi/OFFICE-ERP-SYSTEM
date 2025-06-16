// src/components/CreateTaskDialog.jsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

export default function CreateTaskDialog({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("High");
  const [status, setStatus] = useState("In Progress");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    console.log({
      title,
      description,
      dueDate,
      priority,
      status,
      tags: tags.split(",").map(tag => tag.trim())
    });
    onClose(); // Close dialog after saving
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
     <DialogContent
  className="max-w-2xl max-h-[90vh] overflow-y-auto"
  overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-black/10"
>




        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full border px-3 py-2 rounded-md"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded-md"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Priority</label>
              <select
                className="w-full border px-3 py-2 rounded-md"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium">Status</label>
              <select
                className="w-full border px-3 py-2 rounded-md"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>In Progress</option>
                <option>Review</option>
                <option>Todo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Tags (comma separated)</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="text-right pt-2">
            <Button onClick={handleSubmit}>Save Task</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
