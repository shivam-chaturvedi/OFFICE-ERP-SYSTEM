import React, { useState } from "react";
import { X, ArrowLeft, Save, CheckCircle } from "lucide-react";

const ViewSalaryModal = ({ employee, onClose }) => {
  const [activeTab, setActiveTab] = useState("basic");

  const earningsData = {
    "Basic Salary": 45000,
    HRA: 18000,
    Conveyance: 2400,
    "Lunch Allowance": 2000,
    "Special Allowance": 5000,
    "Vehicle Wheeler Allowance": 0,
    LTA: 2000,
    "Vehicle Maintenance": 0,
    "Other Allowance": 3000,
    "City Compensation": 5000,
  };

  const deductionsData = {
    "Provident Fund (PF)": 5400,
    "Voluntary PF (VPF)": 0,
    GTLI: 0,
    "Tax Deducted at Source (TDS)": 8500,
    "Other Deductions": 500,
  };

  const salaryInputData = {
    Month: "December",
    Year: "2024",
    "Paid Days": 31,
    "LOP Days": 0,
    "Arrear Days": 0,
    "Days in Month": 31,
  };

  const taxSummaryData = {
    "Income Till Date": "₹8,50,000",
    "Projected Income": "₹10,20,000",
    "Base Tax": "₹95,000",
    "Education Cess": "₹2,850",
    "Total Tax": "₹97,850",
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-y-auto rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to List</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                John Smith - Salary Processing
              </h1>
              <p className="text-gray-600">EMP001 • Senior Developer • IT</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <CheckCircle className="w-4 h-4" />
              Process Salary
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-blue-50 p-4 flex items-center gap-2 border-b">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span className="text-blue-800 font-medium">Status: Processed</span>
          <span className="text-blue-600">•</span>
          <span className="text-blue-800 font-medium">Net Pay: ₹70,750</span>
          <span className="text-blue-600">•</span>
          <span className="text-blue-800 font-medium">
            Month: December 2024
          </span>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-80 border-r bg-gray-50 p-6 space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Salary Summary
              </h3>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-green-700">₹85,150</p>
              </div>

              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  Total Deductions
                </p>
                <p className="text-2xl font-bold text-red-700">₹14,400</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Net Pay</p>
                <p className="text-2xl font-bold text-blue-700">₹70,750</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">
                Quick Actions
              </h4>
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-md hover:bg-white hover:shadow-sm">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  📄
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Generate Payslip
                </span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-md hover:bg-white hover:shadow-sm">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  ✈️
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Send to Payroll
                </span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-md hover:bg-white hover:shadow-sm">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  📥
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Download Summary
                </span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
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
                  className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "basic" && (
                <div>
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Employee Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Employee Code</p>
                          <p className="text-base font-medium text-gray-900">
                            EMP001
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-base font-medium text-gray-900">
                            John Smith
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="text-base font-medium text-gray-900">
                            Male
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="text-base font-medium text-gray-900">
                            Mumbai
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Job Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Date of Joining
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            2020-01-15
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Department</p>
                          <p className="text-base font-medium text-gray-900">
                            IT
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Designation</p>
                          <p className="text-base font-medium text-gray-900">
                            Senior Developer
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Grade</p>
                          <p className="text-base font-medium text-gray-900">
                            L3
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Bank Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Bank Name</p>
                          <p className="text-base font-medium text-gray-900">
                            HDFC Bank
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Account Number
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            50100123456789
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Statutory Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">PAN</p>
                          <p className="text-base font-medium text-gray-900">
                            ABCDE1234F
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">PF No</p>
                          <p className="text-base font-medium text-gray-900">
                            MH/12345/67890
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">UAN</p>
                          <p className="text-base font-medium text-gray-900">
                            123456789012
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "salary" && (
                <div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Period Details
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Month</p>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                              <option>December</option>
                            </select>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Year</p>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                              <option>2024</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Attendance Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Paid Days
                          </p>
                          <p className="text-base font-medium">31</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">LOP Days</p>
                          <p className="text-base font-medium">0</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Arrear Days
                          </p>
                          <p className="text-base font-medium">0</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Days in Month
                          </p>
                          <p className="text-base font-medium">31</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "earnings" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Earnings Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(earningsData).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <span className="text-sm text-gray-700">{key}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "deductions" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Deductions Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(deductionsData).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <span className="text-sm text-gray-700">{key}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-red-700">
                        Total Deductions
                      </span>
                      <span className="text-2xl font-bold text-red-700">
                        ₹14,400
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-blue-700">
                        Net Pay
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        ₹70,750
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tax" && (
                <div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Income Details
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(taxSummaryData)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between items-center py-2 border-b border-gray-100"
                            >
                              <span className="text-sm text-gray-700">
                                {key}
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {value}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Tax Calculation
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(taxSummaryData)
                          .slice(2)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between items-center py-2 border-b border-gray-100"
                            >
                              <span className="text-sm text-gray-700">
                                {key}
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {value}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "hra" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    HRA Exemption
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Basic Paid
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rent Paid
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Is Metro
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            HRA
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Exemption
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {["Jan", "Feb", "Mar"].map((month) => (
                          <tr key={month}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹45,000
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹20,000
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                Yes
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹18,000
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹15,500
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tax History
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tax Deducted
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹8,500
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
