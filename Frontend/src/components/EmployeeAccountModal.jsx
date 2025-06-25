import React, { useState } from "react";
import config from "../config";
import Loader from "./Loader";
import Alert from "./Alert";

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

export default function EmployeeAccountModal({ onClose, employee, onSuccess }) {
  const [form, setForm] = useState({
    employee: employee._id,
    bankName: employee?.account?.bankName || "",
    bankAccountNo: employee?.account?.bankAccountNo || "",
    bankIfscCode: employee?.account?.bankIfscCode || "",
    bank_location: employee?.account?.bank_location || "",
    pan: employee?.account?.pan || "",
    aadhar: employee?.account?.aadhar || "",
    esiNo: employee?.account?.esiNo || "",
  });

  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});
  const [showCustomBank, setShowCustomBank] = useState(false);

  indianBanks.sort((a, b) => a.localeCompare(b));

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

  const Label = ({ children, required }) => (
    <label className="mr-2 text-base font-medium text-gray-700">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
      {loader && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <Alert alert={alert} setAlert={setAlert} />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Account Details for{" "}
          <span className="text-lg text-yellow-600 capitalize">
            {employee?.user?.name}
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>PAN Card Number</Label>
            <input
              type="text"
              name="pan"
              value={form.pan}
              onChange={handleChange}
              className="employee-form"
              required
            />
          </div>

          <div>
            <Label required>Aadhar Card Number</Label>
            <input
              type="text"
              name="aadhar"
              value={form.aadhar}
              onChange={handleChange}
              className="employee-form"
              required
            />
          </div>

          <div>
            <Label>ESI Number</Label>
            <input
              type="text"
              name="esiNo"
              value={form.esiNo}
              onChange={handleChange}
              className="employee-form"
            />
          </div>

          <div>
            <Label required>Bank Name</Label>
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

          <div>
            <Label required>Bank Account Number</Label>
            <input
              type="text"
              name="bankAccountNo"
              value={form.bankAccountNo}
              onChange={handleChange}
              className="employee-form"
              required
            />
          </div>

          <div>
            <Label required>IFSC Code</Label>
            <input
              type="text"
              name="bankIfscCode"
              value={form.bankIfscCode}
              onChange={handleChange}
              className="employee-form"
              required
            />
          </div>

          <div>
            <Label required>Bank Branch Location</Label>
            <input
              type="text"
              name="bank_location"
              value={form.bank_location}
              onChange={handleChange}
              className="employee-form"
              required
            />
          </div>
        </div>

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
            Save Account Info
          </button>
        </div>
      </form>
    </div>
  );
}
