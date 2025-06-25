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

    if (account) {
      // update existing account fields
      account.bankName = formData.bankName || account.bankName;
      account.bankAccountNo = formData.bankAccountNo || account.bankAccountNo;
      account.bankIfscCode = formData.bankIfscCode || account.bankIfscCode;
      account.bank_location = formData.bank_location || account.bank_location;
      account.pan = formData.pan || account.pan;
      account.aadhar = formData.aadhar || account.aadhar;
      account.pfNo = formData.pfNo || account.pfNo;
      account.uan = formData.uan || account.uan;
      account.esiNo = formData.esiNo || account.esiNo;

      account.month = formData.month || account.month;
      account.year = formData.year || account.year;
      account.paidDays = formData.paidDays || account.paidDays;
      account.lopDays = formData.lopDays || account.lopDays;
      account.arrearDays = formData.arrearDays || account.arrearDays;
      account.daysInMonth = formData.daysInMonth || account.daysInMonth;

      account.earnings = formData.earnings || account.earnings;
      account.deductions = formData.deductions || account.deductions;
      account.netPay = formData.netPay || account.netPay;

      account.incomeTax = formData.incomeTax || account.incomeTax;
      account.hraExemption = formData.hraExemption || account.hraExemption;
      account.taxDeductedBreakup =
        formData.taxDeductedBreakup || account.taxDeductedBreakup;
    } else {
      // create new account
      account = new Account({
        employee: formData.employee,
        bankName: formData.bankName,
        bankAccountNo: formData.bankAccountNo,
        bankIfscCode: formData.bankIfscCode,
        bank_location: formData.bank_location,
        pan: formData.pan,
        aadhar: formData.aadhar,
        pfNo: formData.pfNo,
        uan: formData.uan,
        esiNo: formData.esiNo,

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
        hraExemption: formData.hraExemption || [],
        taxDeductedBreakup: formData.taxDeductedBreakup || [],
      });
    }

    await account.save();

    return res
      .status(201)
      .json({ message: "Account details saved successfully", account });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; // gets the field causing the duplicate
      const value = err.keyValue[field]; // gets the value that caused conflict

      return res.status(400).json({
        message: `Duplicate value for '${field}': '${value}'. This ${field} already exists for another employee.`,
      });
    }

    console.error("Error saving account details:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { addOrUpdateAccount };
