// controllers/addAccount.js
const Account = require("../models/account.model");

const addAccount = async (req, res) => {
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

    const account = new Account({
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

    await account.save();

    return res
      .status(201)
      .json({ message: "Account details saved successfully", account });
  } catch (err) {
    console.error("Error saving account details:", err);
    return res
      .status(500)
      .json({ message: "Server error while saving account details" });
  }
};

module.exports = { addAccount };
