const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // Basic Bank & Document Info
    bankName: String,
    bankAccountNo: String,
    bankIfscCode: String,
    pan: String,
    aadhar: String,
    pfNo: String,
    uan: String,
    esiNo: String,
    bank_location: String,

    // Month Metadata
    month: String,
    year: Number,
    paidDays: Number,
    lopDays: Number,
    arrearDays: Number,
    daysInMonth: Number,

    // Dynamic Earnings & Deductions (like salary Map)
    earnings: {
      type: Map,
      of: Number,
    },
    deductions: {
      type: Map,
      of: Number,
    },

    netPay: Number,

    // Income Tax Info
    incomeTax: {
      tillDate: Number,
      projected: Number,
      exemptions: {
        sec10: Number,
        sec16: Number,
        sec80C: Number,
        sec80CCE: Number,
        sec6A: Number,
      },
      grossSalary: Number,
      totalIncome: Number,
      tax: {
        base: Number,
        educationCess: Number,
        totalTax: Number,
        deductedTillDate: Number,
        currentMonth: Number,
        balancePayable: Number,
      },
    },

    // Optional Details
    hraExemption: [
      {
        month: String,
        basicPaid: Number,
        rentPaid: Number,
        isMetro: Boolean,
        hra: Number,
        rentLess10Percent: Number,
        percentOfBasic: Number,
        exemption: Number,
      },
    ],

    taxDeductedBreakup: [
      {
        month: String,
        amount: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
