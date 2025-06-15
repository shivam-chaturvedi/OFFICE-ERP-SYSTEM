import React, { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, CalendarDays, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

export default function HRNotices() {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Office Closed on Friday",
      description: "Due to maintenance work, the office will remain closed this Friday.",
      date: "2025-06-10",
    },
    {
      id: 2,
      title: "New Leave Policy",
      description: "Updated leave policy has been published. Please review it in the HR portal.",
      date: "2025-06-05",
    },
  ]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddNotice = () => {
    if (!title.trim() || !description.trim()) return;
    const newNotice = {
      id: notices.length + 1,
      title,
      description,
      date: format(new Date(), "yyyy-MM-dd"),
    };
    setNotices([newNotice, ...notices]);
    setTitle("");
    setDescription("");
  };

  const handleDeleteNotice = (id) => {
    setNotices(notices.filter((notice) => notice.id !== id));
  };

  return (
    <div className="p-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        HR Notices
      </motion.h1>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:flex-1"
        />
        <button
          onClick={handleAddNotice}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.map((notice, index) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow border p-4 relative"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-1 flex gap-2 items-center">
              <Megaphone className="w-5 h-5 text-orange-500" /> {notice.title}
            </h2>
            <p className="text-sm text-gray-700 mb-2">{notice.description}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <CalendarDays className="w-4 h-4" /> {format(new Date(notice.date), "dd MMM yyyy")}
            </p>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
              onClick={() => handleDeleteNotice(notice.id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}