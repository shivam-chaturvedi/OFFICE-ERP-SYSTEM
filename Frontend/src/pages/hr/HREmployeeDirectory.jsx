import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone } from "lucide-react";

// Dummy data with status added
const dummyEmployees = [
  {
    id: 1,
    name: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    phone: "9876543210",
    department: "Engineering",
    status: "Active",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "9123456780",
    department: "HR",
    status: "On Leave",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Amit Singh",
    email: "amit.singh@example.com",
    phone: "9988776655",
    department: "Sales",
    status: "Resigned",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const statusColor = {
  Active: "text-green-600 bg-green-100",
  "On Leave": "text-yellow-700 bg-yellow-100",
  Resigned: "text-red-600 bg-red-100",
};

export default function HREmployeeDirectory() {
  const [employees] = useState(dummyEmployees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "All" || emp.status === statusFilter)
  );

  const handleViewProfile = (emp) => setSelectedEmployee(emp);
  const closeModal = () => setSelectedEmployee(null);

  return (
    <div className="p-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Employee Directory
      </motion.h1>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-40 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="All"> Status:</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Resigned">Resigned</option>
        </select>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp, index) => (
          <motion.div
            key={emp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-3">
              <img
                src={emp.image}
                alt={emp.name}
                className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-sm"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" /> {emp.name}
                </h2>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-400" /> {emp.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-400" /> {emp.phone}
                </p>
                <p className="text-sm text-gray-700 mt-1">Dept: {emp.department}</p>
                <span
                  className={`inline-block text-xs font-semibold mt-1 px-2 py-1 rounded-xl ${statusColor[emp.status]}`}
                >
                  {emp.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleViewProfile(emp)}
              className="w-full mt-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white rounded-xl py-2"
            >
              View Profile
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ×
            </button>

            <div className="flex flex-col items-center">
              <img
                src={selectedEmployee.image}
                alt={selectedEmployee.name}
                className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedEmployee.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <Mail className="inline w-4 h-4 mr-1" /> {selectedEmployee.email}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <Phone className="inline w-4 h-4 mr-1" /> {selectedEmployee.phone}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                Department: {selectedEmployee.department}
              </p>
              <p className={`text-sm font-medium mt-2 ${statusColor[selectedEmployee.status]} px-3 py-1 rounded-full`}>
                Status: {selectedEmployee.status}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}