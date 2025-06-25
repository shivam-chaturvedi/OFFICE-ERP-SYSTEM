import React, { useState } from "react";
import config from "../config";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import SalaryInput from "../components/SalaryInput";

export default function FinanceAccountModal({ onClose, employee, onSuccess }) {
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
    fields.map((key) => ({
      type: key,
      amount: salaryObj[key] || 0,
    }));

  const [form, setForm] = useState({
    employee: employee._id,
    bankName: "",
    bankAccountNo: "",
    bankIfscCode: "",
    pan: "",
    aadhar: "",
    pfNo: "",
    uan: "",
    esiNo: "",
    bank_location: "",
    month: "",
    year: new Date().getFullYear(),
    paidDays: 0,
    lopDays: 0,
    arrearDays: 0,
    daysInMonth: 0,

    earnings: getDefaultComponents(defaultEarnings, employee.salary),
    deductions: getDefaultComponents(defaultDeductions),

    netPay: 0,
    incomeTax: {
      tillDate: 0,
      projected: 0,
      exemptions: {
        sec10: 0,
        sec16: 0,
        sec80C: 0,
        sec80CCE: 0,
        sec6A: 0,
      },
      grossSalary: 0,
      totalIncome: 0,
      tax: {
        base: 0,
        educationCess: 0,
        totalTax: 0,
        deductedTillDate: 0,
        currentMonth: 0,
        balancePayable: 0,
      },
    },
    hraExemption: [
      {
        month: "",
        basicPaid: 0,
        rentPaid: 0,
        isMetro: false,
        hra: 0,
        rentLess10Percent: 0,
        percentOfBasic: 0,
        exemption: 0,
      },
    ],
    taxDeductedBreakup: [
      {
        month: "",
        amount: 0,
      },
    ],
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
            "month",
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
                value={form[field]}
                onChange={handleChange}
                className="employee-form"
              />
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Earnings</h3>
        <SalaryInput
          salary={form.earnings}
          setSalary={(components) =>
            setForm((prev) => ({ ...prev, earnings: components }))
          }
        />

        <h3 className="text-lg font-semibold mt-6 mb-2">Deductions</h3>
        <SalaryInput
          salary={form.deductions}
          setSalary={(components) =>
            setForm((prev) => ({ ...prev, deductions: components }))
          }
        />

        <h3 className="text-lg font-semibold mt-6 mb-2">Income Tax Info</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(form.incomeTax).map(([key, val]) =>
            typeof val === "object" ? (
              <div key={key} className="col-span-2">
                <h4 className="font-semibold text-gray-700 mt-4">
                  {key.toUpperCase()}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(val).map(([subKey, subVal]) => (
                    <div key={subKey}>
                      <label className="text-sm text-gray-600">{subKey}</label>
                      <input
                        type="number"
                        className="employee-form"
                        value={subVal}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            incomeTax: {
                              ...prev.incomeTax,
                              [key]: {
                                ...prev.incomeTax[key],
                                [subKey]: Number(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={key}>
                <label className="text-sm text-gray-600">{key}</label>
                <input
                  type="number"
                  className="employee-form"
                  value={val}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      incomeTax: {
                        ...prev.incomeTax,
                        [key]: Number(e.target.value),
                      },
                    }))
                  }
                />
              </div>
            )
          )}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">HRA Exemption</h3>
        {/* Can be enhanced with dynamic UI */}
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(form.hraExemption[0]).map((key) => (
            <div key={key}>
              <label className="text-sm text-gray-600">{key}</label>
              <input
                type={key === "isMetro" ? "checkbox" : "text"}
                className="employee-form"
                value={form.hraExemption[0][key]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    hraExemption: [
                      {
                        ...prev.hraExemption[0],
                        [key]:
                          key === "isMetro"
                            ? e.target.checked
                            : isNaN(e.target.value)
                            ? e.target.value
                            : Number(e.target.value),
                      },
                    ],
                  }))
                }
              />
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Tax Deducted Breakup
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {form.taxDeductedBreakup.map((item, index) => (
            <React.Fragment key={index}>
              <input
                type="text"
                placeholder="Month"
                className="employee-form"
                value={item.month}
                onChange={(e) => {
                  const updated = [...form.taxDeductedBreakup];
                  updated[index].month = e.target.value;
                  setForm((prev) => ({ ...prev, taxDeductedBreakup: updated }));
                }}
              />
              <input
                type="number"
                placeholder="Amount"
                className="employee-form"
                value={item.amount}
                onChange={(e) => {
                  const updated = [...form.taxDeductedBreakup];
                  updated[index].amount = Number(e.target.value);
                  setForm((prev) => ({ ...prev, taxDeductedBreakup: updated }));
                }}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
