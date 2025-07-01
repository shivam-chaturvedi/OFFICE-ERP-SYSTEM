import React, { useEffect, useRef, useState } from "react";
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

const indianBanks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "IDBI Bank",
  "Yes Bank",
  "IndusInd Bank",
  "Indian Bank",
  "Bank of India",
  "Central Bank of India",
];

export function AddToPayrollFinanceAccountModal({
  onClose,
  employee,
  onSuccess,
}) {
  const earningsArr = [];

  const deductionsArr = [];

  for (const key in employee?.account?.earnings) {
    earningsArr.push({ type: key, amount: employee?.account?.earnings[key] });
  }

  for (const key in employee?.account?.deductions) {
    deductionsArr.push({
      type: key,
      amount: employee?.account?.deductions[key],
    });
  }

  const defaultDeductions = ["pf", "vpf", "gtli", "tds", "other"];

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

  const getDefaultComponents = (fields, salaryObj = {}) =>
    fields.map((key) => ({ type: key, amount: salaryObj[key] || 0 }));

  const getTotal = (components) =>
    components.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const earningsRef = useRef();
  const deductionsRef = useRef();

  const [showCustomBank, setShowCustomBank] = useState(false);

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
    projectedIncomeTax: employee?.account?.projectedIncomeTax || 0,
    grossSalary: employee?.account?.grossSalary || 0,
    totalIncome: employee?.account?.totalIncome || 0,
    taxStructure: {
      base: employee?.account?.taxStructure?.base || 0,
      educationCess: employee?.account?.taxStructure?.educationCess || 0,
    },
    salaryRecord: {
      earnings:
        earningsArr && earningsArr.length > 0
          ? earningsArr
          : getDefaultComponents(defaultEarnings),
      deductions:
        deductionsArr && deductionsArr.length > 0
          ? deductionsArr
          : getDefaultComponents(defaultDeductions),
      netPay: employee?.account?.netPay || 0,
    },
  });

  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});

  useEffect(() => {
    const totalEarnings = getTotal(form.salaryRecord.earnings);
    const totalDeductions = getTotal(form.salaryRecord.deductions);
    const netPay = totalEarnings - totalDeductions;

    setForm((prev) => ({
      ...prev,
      salaryRecord: {
        ...prev.salaryRecord,
        netPay: netPay,
      },
    }));
  }, [form.salaryRecord.earnings, form.salaryRecord.deductions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEarnings = earningsRef.current?.handleSubmit();
    const updatedDeductions = deductionsRef.current?.handleSubmit();

    if (!updatedEarnings || !updatedDeductions) {
      return;
    }

    const totalEarnings = getTotal(updatedEarnings);
    const totalDeductions = getTotal(updatedDeductions);
    const netPay = totalEarnings - totalDeductions;

    if (netPay < 0) {
      setAlert({ type: "error", message: "Net pay Is Invalid " });
      return;
    }

    const updatedSalaryRecord = {
      earnings: updatedEarnings,
      deductions: updatedDeductions,
      netPay: netPay,
    };

    setForm((prev) => ({
      ...prev,
      salaryRecord: updatedSalaryRecord,
    }));

    try {
      setLoader(true);
      const res = await fetch(
        `${config.BACKEND_URL}/api/accounts/add-update?role=account`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form, salaryRecord: updatedSalaryRecord }),
        }
      );
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

  indianBanks.sort((a, b) => a.localeCompare(b));

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

          {/* Bank Name field with dropdown + custom input */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              BANK NAME
            </label>
            <select
              name="bankName"
              value={showCustomBank ? "custom" : form.bankName}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setShowCustomBank(true);
                  setForm((prev) => ({ ...prev, bankName: "" }));
                } else {
                  setShowCustomBank(false);
                  setForm((prev) => ({ ...prev, bankName: e.target.value }));
                }
              }}
              className="employee-form"
              required
            >
              <option value="">-- Select Bank --</option>
              {indianBanks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
              <option value="custom">Other</option>
            </select>

            {showCustomBank && (
              <input
                type="text"
                name="bankName"
                required
                placeholder="Enter Bank Name"
                value={form.bankName}
                onChange={handleChange}
                className="employee-form mt-2"
              />
            )}
          </div>
        </div>

        <SalaryInput
          ref={earningsRef}
          title="Earnings"
          salary={form?.salaryRecord?.earnings}
          setSalary={(components) => {
            setForm((prev) => ({
              ...prev,
              salaryRecord: { ...prev.salaryRecord, earnings: components },
            }));
          }}
        />

        <SalaryInput
          ref={deductionsRef}
          title="Deductions"
          salary={form?.salaryRecord?.deductions}
          setSalary={(components) =>
            setForm((prev) => ({
              ...prev,
              salaryRecord: { ...prev.salaryRecord, deductions: components },
            }))
          }
        />

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
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 text-white text-3xl font-bold shadow-lg text-center">
          Net Pay: ₹{form?.salaryRecord?.netPay}
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
  const earningsArr = [];

  const deductionsArr = [];

  for (const key in employee?.account?.earnings) {
    earningsArr.push({ type: key, amount: employee?.account?.earnings[key] });
  }

  for (const key in employee?.account?.deductions) {
    deductionsArr.push({
      type: key,
      amount: employee?.account?.deductions[key],
    });
  }

  const defaultDeductions = ["pf", "vpf", "gtli", "tds", "other"];

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

  const getDefaultComponents = (fields, salaryObj = {}) =>
    fields.map((key) => ({ type: key, amount: salaryObj[key] || 0 }));

  const [alert, setAlert] = useState({});
  const [loader, setLoader] = useState(false);

  const [form, setForm] = useState({
    salaryRecord: {
      month: new Date().toLocaleString("en-US", { month: "long" }),
      year: new Date().getFullYear(),
      paidDays: 0,
      lopDays: 0,
      arrearDays: 0,
      daysInMonth: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getDate(),
      earnings:
        earningsArr && earningsArr.length > 0
          ? earningsArr
          : getDefaultComponents(defaultEarnings),
      deductions:
        deductionsArr && deductionsArr.length > 0
          ? deductionsArr
          : getDefaultComponents(defaultDeductions),
      netPay: employee?.account?.netPay || 0,
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

  const earningsRef = useRef();
  const deductionsRef = useRef();

  const getTotal = (components) =>
    components.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const getDaysInMonth = (monthName, year) => {
    const index = months.indexOf(monthName);
    return new Date(year, index + 1, 0).getDate();
  };

  useEffect(() => {
    const totalEarnings = getTotal(form.salaryRecord.earnings);
    const totalDeductions = getTotal(form.salaryRecord.deductions);
    const netPay = totalEarnings - totalDeductions;

    setForm((prev) => ({
      ...prev,
      salaryRecord: {
        ...prev.salaryRecord,
        netPay: netPay,
      },
    }));
  }, [form.salaryRecord.earnings, form.salaryRecord.deductions]);

  useEffect(() => {
    const updatedDays = getDaysInMonth(
      form.salaryRecord.month,
      form.salaryRecord.year
    );
    setForm((prev) => ({
      ...prev,
      salaryRecord: {
        ...prev.salaryRecord,
        daysInMonth: updatedDays,
        paidDays: updatedDays,
      },
    }));
  }, [form.salaryRecord.month, form.salaryRecord.year]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.salaryRecord?.paidDays < 1 || form.salaryRecord?.paidDays > 31) {
      setAlert({
        type: "error",
        message: "Paid Days should be between 1 and 31",
      });
      return;
    }

    const updatedEarnings = earningsRef.current?.handleSubmit();
    const updatedDeductions = deductionsRef.current?.handleSubmit();

    if (!updatedEarnings || !updatedDeductions) {
      return;
    }

    const totalEarnings = getTotal(updatedEarnings);
    const totalDeductions = getTotal(updatedDeductions);
    const netPay = totalEarnings - totalDeductions;

    const updatedSalaryRecord = {
      ...form.salaryRecord,
      earnings: updatedEarnings,
      deductions: updatedDeductions,
      netPay,
    };

    setForm((prev) => ({
      ...prev,
      salaryRecord: updatedSalaryRecord,
    }));

    try {
      setLoader(true);
      const res = await fetch(
        `${config.BACKEND_URL}/api/accounts/add-monthly-salary/${employee._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSalaryRecord),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setAlert({
          type: "success",
          message: data.message,
        });
        onSuccess?.();
        onClose();
      } else {
        setAlert({
          type: "error",
          message: data.message,
        });
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message,
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex flex-col items-center justify-center z-50 p-4">
      {/* Monthly Inputs */}
      {loader && <Loader />}
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-white p-6 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <Alert alert={alert} setAlert={setAlert} />
        <h2 className="text-xl font-bold mb-4 text-center">
          Finance Account Entry
        </h2>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Monthly Salary Inputs
        </h3>
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
              <option value={form.salaryRecord.month}>
                {form.salaryRecord.month}
              </option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          {["year", "paidDays", "lopDays", "arrearDays", "daysInMonth"].map(
            (field) => (
              <div key={field}>
                <label className={`block text-sm font-medium text-gray-500`}>
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
            )
          )}
        </div>

        <SalaryInput
          ref={earningsRef}
          title="Earnings"
          salary={form.salaryRecord.earnings}
          setSalary={(components) => {
            setForm((prev) => ({
              ...prev,
              salaryRecord: { ...prev.salaryRecord, earnings: components },
            }));
          }}
        />

        <SalaryInput
          ref={deductionsRef}
          title="Deductions"
          salary={form.salaryRecord.deductions}
          setSalary={(components) =>
            setForm((prev) => ({
              ...prev,
              salaryRecord: { ...prev.salaryRecord, deductions: components },
            }))
          }
        />

        {/* New Income Tax Fields */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Income Tax</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            "tillDate",
            "currentMonth",
            "deductedTillDate",
            "balancePayable",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-500">
                {field.replace(/([A-Z])/g, " $1").toUpperCase()}
              </label>
              <input
                type="number"
                name={field}
                value={form.salaryRecord.incomeTax[field]}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setForm((prev) => ({
                    ...prev,
                    salaryRecord: {
                      ...prev.salaryRecord,
                      incomeTax: {
                        ...prev.salaryRecord.incomeTax,
                        [name]: Number(value),
                      },
                    },
                  }));
                }}
                className="employee-form"
              />
            </div>
          ))}
        </div>

        {/* HRA Exemption Fields */}
        <h3 className="text-lg font-semibold mt-6 mb-2">HRA Exemption</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            "basicPaid",
            "rentPaid",
            "hra",
            "rentLess10Percent",
            "percentOfBasic",
            "exemption",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-500">
                {field.replace(/([A-Z])/g, " $1").toUpperCase()}
              </label>
              <input
                type="number"
                name={field}
                value={form.salaryRecord.hraExemption[field]}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setForm((prev) => ({
                    ...prev,
                    salaryRecord: {
                      ...prev.salaryRecord,
                      hraExemption: {
                        ...prev.salaryRecord.hraExemption,
                        [name]: Number(value),
                      },
                    },
                  }));
                }}
                className="employee-form"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Is Metro
            </label>
            <select
              name="isMetro"
              value={form.salaryRecord.hraExemption.isMetro}
              onChange={(e) => {
                const { value } = e.target;
                setForm((prev) => ({
                  ...prev,
                  salaryRecord: {
                    ...prev.salaryRecord,
                    hraExemption: {
                      ...prev.salaryRecord.hraExemption,
                      isMetro: value === "true",
                    },
                  },
                }));
              }}
              className="employee-form"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {/* Tax Deducted Breakup */}
        <h3 className="text-lg font-semibold mt-6 mb-2">
          Tax Deducted Breakup
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Month
            </label>
            <input
              type="text"
              name="taxMonth"
              value={form.salaryRecord.taxDeductedBreakup[0]?.month}
              onChange={(e) => {
                const { value } = e.target;
                setForm((prev) => ({
                  ...prev,
                  salaryRecord: {
                    ...prev.salaryRecord,
                    taxDeductedBreakup: [
                      {
                        ...prev.salaryRecord.taxDeductedBreakup[0],
                        month: value,
                      },
                    ],
                  },
                }));
              }}
              className="employee-form"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Amount
            </label>
            <input
              type="number"
              name="taxAmount"
              value={form.salaryRecord.taxDeductedBreakup[0]?.amount}
              onChange={(e) => {
                const { value } = e.target;
                setForm((prev) => ({
                  ...prev,
                  salaryRecord: {
                    ...prev.salaryRecord,
                    taxDeductedBreakup: [
                      {
                        ...prev.salaryRecord.taxDeductedBreakup[0],
                        amount: Number(value),
                      },
                    ],
                  },
                }));
              }}
              className="employee-form"
            />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 text-white text-3xl font-bold shadow-lg text-center">
          Net Pay: ₹{form?.salaryRecord?.netPay}
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
};
