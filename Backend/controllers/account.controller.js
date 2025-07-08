const Account = require("../models/account.model");
const Employee = require("../models/employee.model");
const User = require("../models/user.model");

const PDFDocument = require("pdfkit");

function convertToSalaryObject(arr) {
  const salaryObj = {};
  arr.forEach(({ type, amount }) => {
    if (type && amount !== "") {
      salaryObj[type] = Number(amount);
    }
  });
  return salaryObj;
}
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
      bankName: formData.bankName ?? account?.bankName ?? "",
      bankAccountNo: formData.bankAccountNo ?? account?.bankAccountNo ?? "",
      bankIfscCode: formData.bankIfscCode ?? account?.bankIfscCode ?? "",
      bank_location: formData.bank_location ?? account?.bank_location ?? "",
      pan: formData.pan ?? account?.pan ?? "",
      aadhar: formData.aadhar ?? account?.aadhar ?? "",
      pfNo: formData.pfNo ?? account?.pfNo ?? "",
      uan: formData.uan ?? account?.uan ?? "",
      esiNo: formData.esiNo ?? account?.esiNo ?? "",
      taxExemptions: formData.taxExemptions ??
        account?.taxExemptions ?? {
          sec10: 0,
          sec16: 0,
          sec80C: 0,
          sec80CCE: 0,
          sec6A: 0,
        },
      projectedIncomeTax:
        formData.projectedIncomeTax ?? account?.projectedIncomeTax ?? 0,
      grossSalary: formData.grossSalary ?? account?.grossSalary ?? 0,
      totalIncome: formData.totalIncome ?? account?.totalIncome ?? 0,
      taxStructure: formData.taxStructure ??
        account?.taxStructure ?? {
          base: 0,
          educationCess: 0,
        },
      earnings: convertToSalaryObject(formData.salaryRecord?.earnings) || {},
      deductions:
        convertToSalaryObject(formData.salaryRecord?.deductions) || {},
      netPay: formData.salaryRecord?.netPay || 0,
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

    const role = req.query.role;
    if (role && role == "account") {
      emp.payroll = true;
      await emp.save();
    }

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

const addMonthlySalaryOfEmployee = async (req, res) => {
  try {
    const emp_id = req.params.emp_id;
    const formData = req.body;

    const emp = await Employee.findById(emp_id);
    if (!emp) {
      return res
        .status(400)
        .json({ message: "Employee Not Exist With Given Id" });
    }

    let account = await Account.findOne({ employee: emp._id });
    if (!account) {
      return res
        .status(400)
        .json({ message: "Account not exists for selected employee" });
    }

    const salaryRecord = {
      month: formData.month,
      year: formData.year,
      paidDays: formData.paidDays,
      lopDays: formData.lopDays,
      arrearDays: formData.arrearDays,
      daysInMonth: formData.daysInMonth,
      earnings: convertToSalaryObject(formData.earnings) || {},
      deductions: convertToSalaryObject(formData.deductions) || {},
      netPay: formData.netPay,
      incomeTax: formData.incomeTax || {},
      hraExemption: formData.hraExemption || {},
      taxDeductedBreakup: formData.taxDeductedBreakup || [],
    };

    account.salaryRecords.push(salaryRecord);

    const { month, year, paidDays } = formData;

    const lastDate = new Date(account.lastPayedDateTime);

    if (month && year) {
      account.lastPayedDateTime = new Date(`${year}-${month}-${paidDays || 1}`);
    } else {
      account.lastPayedDateTime = new Date();
    }

    const newDate = new Date(account.lastPayedDateTime);

    //Check if the new salary date is within 26 days of the last paid date
    const diffInMs = newDate - lastDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (!isNaN(diffInDays) && diffInDays < 26) {
      return res.status(400).json({
        message:
          "Salary cannot be processed again within 26 days of the last payment.",
      });
    }

    await account.save();

    res.status(200).json({ message: "Salary Info Updated Successfully " });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: err.message });
  }
};
const getSalarySlip = async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;

    const account = await Account.findOne({ employee: employeeId });
    if (!account) return res.status(404).json({ message: "Account not found" });

    const employee = await Employee.findById(employeeId).populate("user");
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const record = account.salaryRecords.find(
      (r) =>
        r.month?.toLowerCase() === month?.toLowerCase() &&
        r.year === parseInt(year)
    );

    if (!record)
      return res.status(404).json({ message: "Salary record not found" });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=SalarySlip-${month}-${year}.pdf`
    );
    doc.pipe(res);

    doc
      .fontSize(16)
      .text("TAC Service PVT. LTD.", { align: "center" });
    doc
      .fontSize(10)
      .text(
        "Corporate Office: TAC Services ,Ghaziabad",
        { align: "center" }
      );
    doc.moveDown();

    doc
      .fontSize(14)
      .text(`Payslip for the Month of: ${month.toUpperCase()} ${year}`, {
        align: "center",
      });
    doc.moveDown();

    const left = 50;
    const right = 300;

    doc.fontSize(10);
    doc
      .text(`Employee Code: ${employee._id}`, left)
      .text(`Bank Name: ${account.bankName}`, right)
      .text(`Paid Days: ${record.paidDays}`, left, doc.y)
      .text(`Bank A/C No.: ${account.bankAccountNo}`, right)
      .text(`LOP Days: ${record.lopDays}`, left, doc.y)
      .text(
        `Date of Joining: ${new Date(
          employee.date_of_joining
        ).toLocaleDateString()}`,
        left
      )
      .text(`PF No.: ${account.pfNo || "-"}`, right)
      .text(`Location: ${employee.work_location || "-"}`, left)
      .text(`UAN: ${account.uan || "-"}`, right)
      .text(`Days in Month: ${record.daysInMonth}`, left)
      .text(`Department: ${employee.department || "-"}`, right)
      .text(`Designation: ${employee.user.position}`, left)
      .text(`PAN: ${account.pan || "-"}`, right)
      .text(`Gender: ${employee.user.gender || "-"}`);

    doc.moveDown(); 
    doc.fontSize(12).text("Earnings", { underline: true });
    (record.earnings || {}).keys().forEach((key) => {
      doc.text(`${key}: ₹${new Number(record.earnings.get(key)).toFixed(2)}`);
    });

    doc.moveDown();
    doc.fontSize(12).text("Deductions", { underline: true });
    (record.deductions || {}).keys().forEach((key) => {
      doc.text(`${key}: ₹${new Number(record.deductions.get(key)).toFixed(2)}`);
    });

    doc.moveDown();
    doc
      .fontSize(12)
      .text(
        `Total Earnings: ₹${
          record.earnings
            ? [...record.earnings.values()]
                .reduce((a, b) => a + b, 0)
                .toFixed(2)
            : "0.00"
        }`
      );
    doc.text(
      `Total Deductions: ₹${
        record.deductions
          ? [...record.deductions.values()]
              .reduce((a, b) => a + b, 0)
              .toFixed(2)
          : "0.00"
      }`
    );
    doc.text(`Net Pay: ₹${record.netPay.toFixed(2)}`);

    doc.moveDown();
    doc.text(`In Words: Indian Rupee ${numberToWords(record.netPay)} Only`);

    doc.moveDown(2);
    doc
      .fontSize(8)
      .text(
        "* This is a computer generated slip and does not require a signature.",
        { align: "center" }
      );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

function numberToWords(num) {
  const converter = require("number-to-words");
  return converter.toWords(num).replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

module.exports = {
  addOrUpdateAccount,
  removeEmployeeFromPayroll,
  addMonthlySalaryOfEmployee,
  getSalarySlip,
};
