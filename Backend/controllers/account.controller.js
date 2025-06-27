const Account = require("../models/account.model");
const Employee = require("../models/employee.model");

const addOrUpdateAccount = async (req, res) => {
  try {
    const formData = req.body;

    if (
      !formData.employee ||
      !formData.bankName ||
      !formData.pan ||
      !formData.aadhar
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const emp = await Employee.findById(formData.employee);
    if (!emp) {
      return res
        .status(400)
        .json({ message: "Employee Not Exist With Given Id" });
    }

    let account = await Account.findOne({ employee: formData.employee });

    const staticFields = {
      bankName: formData.bankName ?? account.bankName ?? "",
      bankAccountNo: formData.bankAccountNo ?? account.bankAccountNo ?? "",
      bankIfscCode: formData.bankIfscCode ?? account.bankIfscCode ?? "",
      bank_location: formData.bank_location ?? account.bank_location ?? "",
      pan: formData.pan ?? account.pan ?? "",
      aadhar: formData.aadhar ?? account.aadhar ?? "",
      pfNo: formData.pfNo ?? account.pfNo ?? "",
      uan: formData.uan ?? account.uan ?? "",
      esiNo: formData.esiNo ?? account.esiNo ?? "",
      taxExemptions: formData.taxExemptions ??
        account.taxExemptions ?? {
          sec10: 0,
          sec16: 0,
          sec80C: 0,
          sec80CCE: 0,
          sec6A: 0,
        },
      projectedIncomeTax:
        formData.projectedIncomeTax ?? account.projectedIncomeTax ?? 0,
      grossSalary: formData.grossSalary ?? account.grossSalary ?? 0,
      totalIncome: formData.totalIncome ?? account.totalIncome ?? 0,
      taxStructure: formData.taxStructure ??
        account.taxStructure ?? {
          base: 0,
          educationCess: 0,
        },
    };

    const newSalaryRecord = {
      month: formData.month,
      year: formData.year,
      paidDays: formData.paidDays,
      lopDays: formData.lopDays,
      arrearDays: formData.arrearDays,
      daysInMonth: formData.daysInMonth,
      earnings: formData.earnings || {},
      deductions: formData.deductions || {},
      netPay: formData.netPay,
      incomeTax: formData.incomeTax || {},
      hraExemption: formData.hraExemption || {},
      taxDeductedBreakup: formData.taxDeductedBreakup || [],
    };

    if (account) {
      // Update static fields
      Object.assign(account, staticFields);
    } else {
      // Create new account
      account = new Account({
        employee: formData.employee,
        ...staticFields,
      });
    }

    await account.save();

    emp.payroll = true;
    await emp.save();

    return res
      .status(201)
      .json({ message: "Account details saved successfully", account });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      return res.status(400).json({
        message: `Duplicate value for '${field}': '${value}'. This ${field} already exists for another employee.`,
      });
    }

    console.error("Error saving account details:", err);
    return res.status(500).json({ message: err.message });
  }
};

const removeEmployeeFromPayroll = async (req, res) => {
  try {
    const emp_id = req.params.emp_id;
    let emp = null;
    if (emp_id) {
      emp = await Employee.findById(emp_id);
    }
    if (!emp_id || !emp) {
      return res.status(400).json({ message: "emp id is invalid" });
    }
    emp.payroll = false;
    await emp.save();
    res
      .status(200)
      .json({ message: `Employee Removed from payroll Successfully` });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: err.message });
  }
};
module.exports = { addOrUpdateAccount, removeEmployeeFromPayroll };
