import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SalarySlip = ({ user }) => {
  const [slips, setSlips] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const dummySlips = [
    {
      id: 1,
      month: "March 2025",
      basic: 30000,
      hra: 10000,
      medical: 2000,
      deductions: {
        pf: 3600,
        tax: 2000,
      },
      netSalary: 36400,
    },
    {
      id: 2,
      month: "February 2025",
      basic: 30000,
      hra: 10000,
      medical: 2000,
      deductions: {
        pf: 3600,
        tax: 1800,
      },
      netSalary: 36600,
    },
  ];

  useEffect(() => {
    setSlips(dummySlips);
    setSelectedSlip(dummySlips[0]);
  }, []);

  const handleSelect = (e) => {
    const slip = slips.find((s) => s.id === parseInt(e.target.value));
    setSelectedSlip(slip);
  };

  const handleDownloadSalarySlip = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/accounts/salary-slip/6863842010eb7738af737e80/july/2025",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to download salary slip");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "SalarySlip-July-2025.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading salary slip:", err);
      alert("Error downloading salary slip");
    }
  };

  if (!selectedSlip) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-10">
      <div className="flex flex-col md:flex-row justify-between">
        {/* Salary Slip Details */}
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Salary Slips</h2>
          <p>
            Employee: <strong>{user.name}</strong>
          </p>
          <p>
            Role: <strong>{user.role}</strong>
          </p>

          <label
            htmlFor="slip-select"
            className="mt-4 block mb-2 font-semibold"
          >
            Select Month:
          </label>
          <select
            id="slip-select"
            onChange={handleSelect}
            className="mb-6 p-2 border rounded"
          >
            {slips.map((slip) => (
              <option key={slip.id} value={slip.id}>
                {slip.month}
              </option>
            ))}
          </select>

          <div className="border p-4 rounded shadow bg-white">
            <h3 className="text-xl font-semibold mb-3">
              {selectedSlip.month} Salary Slip
            </h3>
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td>₹{selectedSlip.basic}</td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td>₹{selectedSlip.hra}</td>
                </tr>
                <tr>
                  <td>Medical Allowance</td>
                  <td>₹{selectedSlip.medical}</td>
                </tr>
                <tr>
                  <td>Deductions (PF)</td>
                  <td>-₹{selectedSlip.deductions.pf}</td>
                </tr>
                <tr>
                  <td>Deductions (Tax)</td>
                  <td>-₹{selectedSlip.deductions.tax}</td>
                </tr>
                <tr className="font-bold border-t mt-3 pt-3">
                  <td>Net Salary</td>
                  <td>₹{selectedSlip.netSalary}</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={handleDownloadSalarySlip}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Print Salary Slip
            </button>
          </div>
        </div>

        {/* Calendar on Right Side */}
        <div className="mt-10 md:mt-0 md:ml-10 bg-white p-4 rounded shadow h-fit">
          <h4 className="text-md font-semibold mb-2 text-gray-700">
            📅 Calendar
          </h4>
          <DatePicker
            selected={calendarDate}
            onChange={(date) => setCalendarDate(date)}
            inline
          />
        </div>
      </div>
    </div>
  );
};

export default SalarySlip;
