const mongoose = require("mongoose");
const Employee = require("./employee.model");

const accountSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },

    // Basic Info
    bankName: String,
    bankAccountNo: { type: String, unique: true, sparse: true },
    bankIfscCode: String,
    pan: { type: String, unique: true, sparse: true },
    aadhar: { type: String, unique: true, sparse: true },
    pfNo: { type: String, unique: true, sparse: true },
    uan: { type: String, unique: true, sparse: true },
    esiNo: { type: String, unique: true, sparse: true },
    bank_location: String,

    // One-Time Tax Exemption & Income Tax Structure
    taxExemptions: {
      sec10: Number,
      sec16: Number,
      sec80C: Number,
      sec80CCE: Number,
      sec6A: Number,
    },
    projectedIncomeTax: Number,
    grossSalary: Number,
    totalIncome: Number,
    taxStructure: {
      base: Number,
      educationCess: Number,
    },

    // Monthly salary records
    salaryRecords: [
      {
        month: String,
        year: Number,
        paidDays: Number,
        lopDays: Number,
        arrearDays: Number,
        daysInMonth: Number,

        earnings: { type: Map, of: Number },
        deductions: { type: Map, of: Number },
        netPay: Number,

        incomeTax: {
          tillDate: Number,
          deductedTillDate: Number,
          currentMonth: Number,
          balancePayable: Number,
        },

        hraExemption: {
          basicPaid: Number,
          rentPaid: Number,
          isMetro: Boolean,
          hra: Number,
          rentLess10Percent: Number,
          percentOfBasic: Number,
          exemption: Number,
        },

        taxDeductedBreakup: [
          {
            month: String,
            amount: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

accountSchema.post("save", async function (doc, next) {
  try {
    await Employee.findByIdAndUpdate(doc.employee, {
      $set: { account: doc._id },
    });
    next();
  } catch (err) {
    console.error("Error updating employee with account reference:", err);
    next(err);
  }
});

module.exports = mongoose.model("Account", accountSchema);
