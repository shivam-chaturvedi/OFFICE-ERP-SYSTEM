import React, { useState } from "react";
import config from "../config";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import SalaryInput from "../components/SalaryInput";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function AddToPayrollFinanceAccountModal({
  onClose,
  employee,
  onSuccess,
}) {
  const [form, setForm] = useState({
    employee: employee._id,
    bankName: employee.account?.bankName || "",
    bankAccountNo: employee.account?.bankAccountNo || "",
    bankIfscCode: employee.account?.bankIfscCode || "",
    pan: employee.account?.pan || "",
    aadhar: employee.account?.aadhar || "",
    pfNo: employee.account?.pfNo || "",
    uan: employee.account?.uan || "",
    esiNo: employee.account?.esiNo || "",
    bank_location: employee.account?.bank_location || "",

    taxExemptions: {
      sec10: employee?.account?.taxExemptions?.sec10 || 0,
      sec16: employee?.account?.taxExemptions?.sec16 || 0,
      sec80C: employee?.account?.taxExemptions?.sec80C || 0,
      sec80CCE: employee?.account?.taxExemptions?.sec80CCE || 0,
      sec6A: employee?.account?.taxExemptions?.sec6A || 0,
    },
    projectedIncomeTax: employee.account.projectedIncomeTax || 0,
    grossSalary: employee.account.grossSalary || 0,
    totalIncome: employee.account.totalIncome || 0,
    taxStructure: {
      base: employee?.account?.taxStructure?.base || 0,
      educationCess: employee?.account?.taxStructure?.educationCess || 0,
    },
  });

  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/accounts/add`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", message: data.message });
        onSuccess?.();
        onClose();
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Something went wrong" });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
      {loader && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <Alert alert={alert} setAlert={setAlert} />
        <h2 className="text-xl font-bold mb-4 text-center">
          Finance Account Entry
        </h2>

        {/* Static Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "pan",
            "aadhar",
            "bankName",
            "bankAccountNo",
            "bankIfscCode",
            "pfNo",
            "uan",
            "esiNo",
            "bank_location",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-500">
                {field.replace(/([A-Z])/g, " $1").toUpperCase()}
              </label>
              <input
                type="text"
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                className="employee-form"
              />
            </div>
          ))}
        </div>

        {/* Tax Exemptions & Structure */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Tax Exemptions</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(form.taxExemptions).map(([key, val]) => (
            <div key={key}>
              <label className="text-sm text-gray-600">{key}</label>
              <input
                type="number"
                className="employee-form"
                value={val}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    taxExemptions: {
                      ...prev.taxExemptions,
                      [key]: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Income Tax Structure
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {["projectedIncomeTax", "grossSalary", "totalIncome"].map((key) => (
            <div key={key}>
              <label className="text-sm text-gray-600">{key}</label>
              <input
                type="number"
                className="employee-form"
                value={form[key] || 0}
                onChange={handleChange}
                name={key}
              />
            </div>
          ))}
          {Object.entries(form.taxStructure).map(([key, val]) => (
            <div key={key}>
              <label className="text-sm text-gray-600">{key}</label>
              <input
                type="number"
                className="employee-form"
                value={val}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    taxStructure: {
                      ...prev.taxStructure,
                      [key]: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export const MonthlyFinanceAccountModal = ({
  onClose,
  employee,
  onSuccess,
}) => {
  const defaultEarnings = [
    "basic",
    "hra",
    "conveyance",
    "lunch",
    "specialAllowance",
    "medicalReimbursement",
    "vehicleWheelerAllowance",
    "lta",
    "vehicleMaintenance",
    "otherAllowance",
    "cityCompensation",
    "fuelReimbursement",
  ];

  const defaultDeductions = ["pf", "vpf", "gtli", "tds", "other"];

  const getDefaultComponents = (fields, salaryObj = {}) =>
    fields.map((key) => ({ type: key, amount: salaryObj[key] || 0 }));

  const [form, setForm] = useState({
    salaryRecord: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      paidDays: 0,
      lopDays: 0,
      arrearDays: 0,
      daysInMonth: 30,
      earnings: getDefaultComponents(defaultEarnings, employee.salary),
      deductions: getDefaultComponents(defaultDeductions),
      netPay: 0,
      incomeTax: {
        tillDate: 0,
        deductedTillDate: 0,
        currentMonth: 0,
        balancePayable: 0,
      },
      hraExemption: {
        basicPaid: 0,
        rentPaid: 0,
        isMetro: false,
        hra: 0,
        rentLess10Percent: 0,
        percentOfBasic: 0,
        exemption: 0,
      },
      taxDeductedBreakup: [{ month: "", amount: 0 }],
    },
  });

  const handleSalaryRecordChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      salaryRecord: {
        ...prev.salaryRecord,
        [name]: name === "month" ? value : Number(value),
      },
    }));
  };

  return (
    <>
      {/* Monthly Inputs */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Monthly Salary Inputs</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">
            Month
          </label>
          <select
            name="month"
            value={form.salaryRecord.month}
            onChange={handleSalaryRecordChange}
            className="employee-form"
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        {[
          "year",
          "paidDays",
          "lopDays",
          "arrearDays",
          "daysInMonth",
          "netPay",
        ].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-500">
              {field.replace(/([A-Z])/g, " $1").toUpperCase()}
            </label>
            <input
              type="number"
              name={field}
              value={form.salaryRecord[field]}
              onChange={handleSalaryRecordChange}
              className="employee-form"
            />
          </div>
        ))}
      </div>

      <SalaryInput
        title="Earnings"
        salary={form.salaryRecord.earnings}
        setSalary={(components) =>
          setForm((prev) => ({
            ...prev,
            salaryRecord: { ...prev.salaryRecord, earnings: components },
          }))
        }
      />

      <SalaryInput
        title="Deductions"
        salary={form.salaryRecord.deductions}
        setSalary={(components) =>
          setForm((prev) => ({
            ...prev,
            salaryRecord: { ...prev.salaryRecord, deductions: components },
          }))
        }
      />

      {/* Submit */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </>
  );
};
