import React, { useState } from "react";
import { X, ArrowLeft, Save, CheckCircle } from "lucide-react";
import { MonthlyFinanceAccountModal } from "../../../../components/FinanceAccountModal";

const ViewSalaryModal = ({ employee, onClose }) => {
  const [activeTab, setActiveTab] = useState("basic");

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

  const [viewMonthlyFinanceAccountModal, setViewMonthlyFinanceAccountModal] =
    useState(null);

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
              <h1 className="capitalize text-2xl font-bold text-gray-900">
                {employee?.user?.name || "N/A"}
              </h1>
              <p className="text-gray-600 uppercase">
                ID-{employee?._id} • {employee?.user?.position} •{" "}
                {employee?.department?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMonthlyFinanceAccountModal(employee)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              Process Salary
            </button>
          </div>
        </div>

        {(() => {
          const lastPaid = new Date(employee?.account?.lastPayedDateTime);
          const today = new Date();
          const diffInMs = today - lastPaid;
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

          const isProcessed = !isNaN(diffInDays) && diffInDays < 26;

          const monthName = lastPaid.toLocaleString("default", {
            month: "long",
          });
          const year = lastPaid.getFullYear();
          const netPay = employee?.account?.netPay || 0;

          return (
            <div className="bg-blue-50 p-4 flex flex-wrap items-center gap-2 border-b">
              <div
                className={`w-2 h-2 rounded-full ${
                  isProcessed ? "bg-green-600" : "bg-yellow-500"
                }`}
              ></div>
              <span className="text-blue-800 font-medium">
                Status: {isProcessed ? "Processed" : "Pending"}
              </span>
              <span className="text-blue-600">•</span>
              <span className="text-blue-800 font-medium">
                Net Pay: ₹{netPay}
              </span>
              <span className="text-blue-600">•</span>
              <span className="text-blue-800 font-medium">
                Month: {monthName} {year}
              </span>
            </div>
          );
        })()}

        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-80 border-r bg-gray-50 p-6 space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Salary Summary
              </h3>

              {/* Total Earnings */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-green-700">
                  ₹
                  {Object.values(employee?.account?.earnings || {})
                    .reduce((sum, val) => sum + (val || 0), 0)
                    .toLocaleString("en-IN")}
                </p>
              </div>

              {/* Total Deductions */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  Total Deductions
                </p>
                <p className="text-2xl font-bold text-red-700">
                  ₹
                  {Object.values(employee?.account?.deductions || {})
                    .reduce((sum, val) => sum + (val || 0), 0)
                    .toLocaleString("en-IN")}
                </p>
              </div>

              {/* Net Pay */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Net Pay</p>
                <p className="text-2xl font-bold text-blue-700">
                  ₹{(employee?.account?.netPay || 0).toLocaleString("en-IN")}
                </p>
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
                            {employee?._id}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-base font-medium text-gray-900">
                            {employee?.user?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="text-base font-medium text-gray-900">
                            {employee?.user?.gender}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="text-base font-medium text-gray-900">
                            {(() => {
                              return Object.values(
                                employee?.user?.address || {}
                              ).join(", ");
                            })()}
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
                            {new Date(employee?.date_of_joining).toDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Department</p>
                          <p className="text-base font-medium text-gray-900">
                            {employee?.department?.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Designation</p>
                          <p className="text-base font-medium text-gray-900">
                            {employee?.user?.position || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="text-base font-medium text-gray-900">
                            {employee?.experience || "N/A"} Years
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
                            {employee?.account?.bankName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Account Number
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {employee?.account?.bankAccountNo || "N/A"}
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
                            {employee?.account?.pan || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">PF No</p>
                          <p className="text-base font-medium text-gray-900">
                            {employee?.account?.pfNo || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">UAN</p>
                          <p className="text-base font-medium text-gray-900">
                            {employee?.account?.uan || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NOT USED FOR NOW   */}
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
                    {Object.entries(employee?.account?.earnings).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <span className="text-sm text-gray-700">{key}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-700">
                        Total Earnings
                      </span>
                      <span className="text-2xl font-bold text-green-700">
                        ₹{" "}
                        {Object.values(
                          employee?.account?.earnings || {}
                        ).reduce((sum, val) => {
                          return sum + (val || 0);
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "deductions" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Deductions Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(employee?.account?.deductions).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center py-2 border-b border-gray-100"
                        >
                          <span className="text-sm text-gray-700">{key}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-red-700">
                        Total Deductions
                      </span>
                      <span className="text-2xl font-bold text-red-700">
                        ₹{" "}
                        {Object.values(
                          employee?.account?.deductions || {}
                        ).reduce((sum, val) => {
                          return sum + (val || 0);
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-blue-700">
                        Net Pay
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        ₹ {employee?.account?.netPay || 0}
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
                        {Object.entries(employee?.account?.taxExemptions || {})
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
                        {Object.entries(
                          employee?.account?.taxStructure || {}
                        ).map(([key, value]) => (
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
                  </div>
                </div>
              )}
              {activeTab === "hra" &&
                employee?.account?.salaryRecords?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      HRA Exemption
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {[
                              "Month",
                              "Basic Paid",
                              "Rent Paid",
                              "Is Metro",
                              "HRA",
                              "Exemption",
                            ].map((head) => (
                              <th
                                key={head}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {head}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {employee.account.salaryRecords.map(
                            (record, index) => {
                              const hra = record?.hraExemption || {};
                              return (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {record.month} {record.year}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₹
                                    {hra.basicPaid?.toLocaleString("en-IN") ||
                                      0}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₹
                                    {hra.rentPaid?.toLocaleString("en-IN") || 0}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        hra.isMetro
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {hra.isMetro ? "Yes" : "No"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₹{hra.hra?.toLocaleString("en-IN") || 0}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₹
                                    {hra.exemption?.toLocaleString("en-IN") ||
                                      0}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {activeTab === "history" &&
                employee?.account?.salaryRecords?.length > 0 && (
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
                          {employee.account.salaryRecords
                            .flatMap(
                              (record) => record.taxDeductedBreakup || []
                            )
                            .filter((entry) => entry?.amount > 0)
                            .map((entry, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {entry.month || "—"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  ₹{entry.amount.toLocaleString("en-IN")}
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

      {viewMonthlyFinanceAccountModal && (
        <MonthlyFinanceAccountModal
          employee={viewMonthlyFinanceAccountModal}
          onClose={() => setViewMonthlyFinanceAccountModal(null)}
          onSuccess={() => {
            fetchEmployees();
            setAlert({
              type: "success",
              message: "Salary Info Updated Successfully ",
            });
            setViewMonthlyFinanceAccountModal(null);
          }}
        />
      )}
    </div>
  );
};

export default ViewSalaryModal;
