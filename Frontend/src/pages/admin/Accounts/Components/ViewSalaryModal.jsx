import React, { useState } from "react";
import { X } from "lucide-react";

const ViewSalaryModal = ({ employee, onClose }) => {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {employee?.user?.name} - Salary Processing
            </h2>
            <p className="text-gray-500">
              {employee._id} · {employee?.user?.position} ·{" "}
              {employee?.department?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Strip */}
        <div className="bg-blue-50 p-4 text-sm text-blue-800 font-medium border-b">
          Status: <span className="font-semibold">Processed</span> · Net Pay:
          ₹70,750 · Month: December 2024
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b">
          {/* Salary Summary */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-700">₹85,150</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Deductions</p>
              <p className="text-2xl font-bold text-red-600">₹14,400</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Net Pay</p>
              <p className="text-2xl font-bold text-blue-600">₹70,750</p>
            </div>

            <div className="space-y-2">
              <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-md py-2 text-sm font-medium">
                Generate Payslip
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-md py-2 text-sm font-medium">
                Send to Payroll
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 rounded-md py-2 text-sm font-medium">
                Download Summary
              </button>
            </div>
          </div>

          {/* Tabs & Content */}
          <div className="md:col-span-3">
            {/* Tabs */}
            <div className="flex border-b mb-4">
              {[
                { id: "basic", label: "Basic Info" },
                { id: "salary", label: "Salary Input" },
                { id: "earnings", label: "Earnings" },
                { id: "deductions", label: "Deductions" },
                { id: "tax", label: "Tax Summary" },
                { id: "hra", label: "HRA Exemption" },
                { id: "history", label: "Tax History" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "basic" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Employee Code</p>
                    <p className="text-base font-medium">{employee?._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Joining</p>
                    <p className="text-base font-medium">2020-01-15</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-base font-medium">
                      {employee?.department?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Designation</p>
                    <p className="text-base font-medium">
                      {employee?.user?.position}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-base font-medium">
                      {employee?.user?.address?.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="text-base font-medium">L3</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bank</p>
                    <p className="text-base font-medium">
                      {employee?.account?.bankName || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="text-base font-medium">
                      {employee?.account?.bankAccountNo || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PAN</p>
                    <p className="text-base font-medium">
                      {employee?.account?.pan || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PF No</p>
                    <p className="text-base font-medium">MH/12345/67890</p>
                  </div>
                </div>
              )}

              {activeTab === "hra" && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b text-left">Month</th>
                        <th className="px-4 py-2 border-b text-left">
                          Basic Paid
                        </th>
                        <th className="px-4 py-2 border-b text-left">
                          Rent Paid
                        </th>
                        <th className="px-4 py-2 border-b text-left">
                          Is Metro
                        </th>
                        <th className="px-4 py-2 border-b text-left">HRA</th>
                        <th className="px-4 py-2 border-b text-left">
                          Exemption
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {["Jan", "Feb", "Mar"].map((month) => (
                        <tr key={month}>
                          <td className="px-4 py-2 border-b">{month}</td>
                          <td className="px-4 py-2 border-b">₹45,000</td>
                          <td className="px-4 py-2 border-b">₹20,000</td>
                          <td className="px-4 py-2 border-b">
                            <span className="inline-block px-2 py-1 rounded bg-gray-200 text-xs">
                              Yes
                            </span>
                          </td>
                          <td className="px-4 py-2 border-b">₹18,000</td>
                          <td className="px-4 py-2 border-b">₹15,500</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "history" && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b text-left">Month</th>
                        <th className="px-4 py-2 border-b text-left">
                          Tax Deducted
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].map((month) => (
                        <tr key={month}>
                          <td className="px-4 py-2 border-b">{month}</td>
                          <td className="px-4 py-2 border-b">₹8,500</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Optional placeholders for remaining tabs */}
              {["salary", "earnings", "deductions", "tax"].includes(
                activeTab
              ) && (
                <div className="text-gray-500 text-sm italic">
                  Data for "{activeTab}" tab is not filled yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSalaryModal;
