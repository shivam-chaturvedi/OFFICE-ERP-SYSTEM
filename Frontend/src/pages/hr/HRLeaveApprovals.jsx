// Enhanced HR Leave Approvals Page with Filters, Modals, Search, etc.

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, User, FileText, Search, Filter, Download } from "lucide-react";
import { Dialog } from "@headlessui/react";

const dummyLeaveRequests = [
  {
    id: 1,
    name: "Ravi Kumar",
    type: "Sick Leave",
    from: "2025-06-10",
    to: "2025-06-12",
    reason: "Fever and rest advised",
    status: "Pending",
    balance: { Sick: 4, Casual: 2, Earned: 10 },
    history: [
      { type: "Casual", from: "2025-05-10", to: "2025-05-11" },
      { type: "Sick", from: "2025-04-03", to: "2025-04-04" }
    ]
  },
  // ... add more dummy data
];

export default function HRLeaveApprovals() {
  const [requests, setRequests] = useState(dummyLeaveRequests);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [viewHistory, setViewHistory] = useState(null);

  const handleAction = (id, status, reason = "") => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status, rejectReason: reason } : req
    );
    setRequests(updated);
    setRejectModal(false);
    setRejectReason("");
  };

  const filtered = requests.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    (!filterStatus || r.status === filterStatus)
  );

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800"
        >
          Leave Approvals
        </motion.h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((req, i) => (
          <motion.div
            key={req.id}
            className="bg-white rounded-xl p-4 border shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-1 flex gap-2 items-center cursor-pointer" onClick={() => setViewHistory(req)}>
              <User className="w-5 h-5" /> {req.name}
            </h2>
            <p className="text-sm mb-1"><CalendarCheck className="inline w-4 h-4 mr-1" /> {req.from} → {req.to}</p>
            <p className="text-sm mb-1">Type: {req.type}</p>
            <p className="text-sm mb-2">Reason: {req.reason}</p>
            <p className={`text-xs font-semibold inline-block px-3 py-1 rounded-full mb-3 ${
              req.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
              req.status === "Approved" ? "bg-green-100 text-green-800" :
              "bg-red-100 text-red-800"}`}>{req.status}</p>

            <div className="text-xs text-gray-600 mb-2">
              Leave Balance: Sick {req.balance.Sick}, Casual {req.balance.Casual}, Earned {req.balance.Earned}
            </div>

            {req.status === "Pending" && (
              <div className="flex gap-2">
                <button onClick={() => handleAction(req.id, "Approved")} className="flex-1 bg-green-500 text-white rounded py-1">Approve</button>
                <button onClick={() => { setSelectedEmployee(req); setRejectModal(true); }} className="flex-1 bg-red-500 text-white rounded py-1">Reject</button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Reject Reason Modal */}
      <Dialog open={rejectModal} onClose={() => setRejectModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl shadow max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-3">Reject Leave</Dialog.Title>
            <textarea
              rows="4"
              placeholder="Enter reason for rejection..."
              className="w-full border px-3 py-2 rounded mb-4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRejectModal(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button onClick={() => handleAction(selectedEmployee.id, "Rejected", rejectReason)} className="px-4 py-2 bg-red-600 text-white rounded">Reject</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* History Modal */}
      {viewHistory && (
        <Dialog open={true} onClose={() => setViewHistory(null)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Panel className="bg-white p-6 rounded-xl shadow max-w-md w-full">
              <Dialog.Title className="text-lg font-bold mb-3">{viewHistory.name}'s Leave History</Dialog.Title>
              <ul className="space-y-2 text-sm text-gray-700">
                {viewHistory.history.map((h, i) => (
                  <li key={i}>• {h.type} from {h.from} to {h.to}</li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <button onClick={() => setViewHistory(null)} className="px-4 py-2 rounded bg-blue-500 text-white">Close</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}