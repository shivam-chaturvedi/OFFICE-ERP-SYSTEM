import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Eye, Plus, Download } from "lucide-react";
import { format } from "date-fns";

export default function HRRecruitment() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      postedOn: "2025-06-10",
      applicants: 2,
      status: "Open",
      applicantsList: [
        {
          name: "Aman Singh",
          email: "aman@example.com",
          phone: "9876543210",
          resume: "https://example.com/resume/aman.pdf"
        },
        {
          name: "Simran Kaur",
          email: "simran@example.com",
          phone: "9123456780",
          resume: "https://example.com/resume/simran.pdf"
        },
      ],
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      postedOn: "2025-06-08",
      applicants: 1,
      status: "Open",
      applicantsList: [
        {
          name: "Rahul Verma",
          email: "rahul@example.com",
          phone: "9001234567",
          resume: "https://example.com/resume/rahul.pdf"
        }
      ],
    },
    {
      id: 3,
      title: "HR Executive",
      department: "Human Resources",
      postedOn: "2025-06-09",
      applicants: 0,
      status: "Open",
      applicantsList: [],
    }
  ]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDept, setNewJobDept] = useState("");

  return (
    <div className="p-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Recruitment
      </motion.h1>

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowPostJobModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow border p-4"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-1 flex gap-2 items-center">
              <Briefcase className="w-5 h-5 text-blue-500" /> {job.title}
            </h2>
            <p className="text-sm text-gray-700 mb-1">Department: {job.department}</p>
            <p className="text-sm text-gray-600 mb-2">Posted On: {job.postedOn}</p>
            <p className="text-sm text-gray-500 mb-2">Status: {job.status}</p>
            <p className="text-sm font-medium text-gray-800">Applicants: {job.applicants}</p>
            <button
              onClick={() => setSelectedJob(job)}
              className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
            >
              <Eye className="inline w-4 h-4 mr-1" /> View Applicants
            </button>
          </motion.div>
        ))}
      </div>

      {/* Applicants Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Applicants for {selectedJob.title}
            </h2>
            <ul className="divide-y">
              {selectedJob.applicantsList.map((app, idx) => (
                <li key={idx} className="py-2">
                  <p className="font-medium text-gray-800">{app.name}</p>
                  <p className="text-sm text-gray-600">{app.email}</p>
                  <p className="text-sm text-gray-600">{app.phone}</p>
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-blue-600 hover:underline text-sm"
                  >
                    <Download className="w-4 h-4" /> Download Resume
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedJob(null)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Post New Job</h2>
            <input
              type="text"
              placeholder="Job Title"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Department"
              value={newJobDept}
              onChange={(e) => setNewJobDept(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPostJobModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newJobTitle.trim() || !newJobDept.trim()) return;
                  const newJob = {
                    id: jobs.length + 1,
                    title: newJobTitle,
                    department: newJobDept,
                    postedOn: format(new Date(), "yyyy-MM-dd"),
                    applicants: 0,
                    status: "Open",
                    applicantsList: [],
                  };
                  setJobs([newJob, ...jobs]);
                  setNewJobTitle("");
                  setNewJobDept("");
                  setShowPostJobModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post Job
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}