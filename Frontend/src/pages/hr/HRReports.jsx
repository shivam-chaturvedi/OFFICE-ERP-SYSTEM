import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Download, BarChart3 } from "lucide-react";
import { format } from "date-fns";

const dummyReports = [
  {
    id: 1,
    title: "Monthly Attendance Summary",
    date: "2025-06-01",
    type: "Attendance",
    file: "monthly_attendance_june.pdf"
  },
  {
    id: 2,
    title: "Leave Analysis - Q2",
    date: "2025-06-10",
    type: "Leave",
    file: "leave_q2_analysis.pdf"
  },
  {
    id: 3,
    title: "Performance Review - May",
    date: "2025-06-05",
    type: "Performance",
    file: "may_performance_review.pdf"
  }
];

export default function HRReports() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredReports = dummyReports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filterType || r.type === filterType)
  );

  return (
    <div className="p-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        HR Reports
      </motion.h1>

      <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-64"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Types</option>
          <option value="Attendance">Attendance</option>
          <option value="Leave">Leave</option>
          <option value="Performance">Performance</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border p-4 shadow hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex gap-2 items-center">
              <BarChart3 className="w-5 h-5 text-blue-500" /> {report.title}
            </h2>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
              <CalendarDays className="w-4 h-4" /> {format(new Date(report.date), "dd MMM yyyy")}
            </p>
            <p className="text-sm text-gray-600 mb-3">Type: {report.type}</p>
            <a
              href={`/${report.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-all"
            >
              <Download className="w-4 h-4" /> Download Report
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}