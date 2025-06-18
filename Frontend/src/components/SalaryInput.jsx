import React, { useState } from "react";
import { PlusCircle, Edit3, CheckCircle2, X } from "lucide-react";
import Alert from "../components/Alert";
import { useEffect } from "react";

function SalaryInput({ salary, setSalary}) {
  const [salaryComponents, setSalaryComponents] = useState(salary);
  const [editMode, setEditMode] = useState(true);
  const [alert, setAlert] = useState({});

  useEffect(() => {
    setSalaryComponents(salary);
  }, [salary]);

  const handleComponentChange = (index, field, value) => {
    const updated = [...salaryComponents];
    updated[index][field] = value;
    setSalaryComponents(updated);
  };

  const addComponent = () => {
    setSalaryComponents([...salaryComponents, { type: "", amount: "" }]);
  };

  const removeComponent = (index) => {
    const updated = salaryComponents.filter((_, i) => i !== index);
    setSalaryComponents(updated);
  };

  const totalSalary = salaryComponents.reduce((acc, curr) => {
    const val = parseFloat(curr.amount);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const handleSubmit = () => {
    let flag = true;
    const salaryObj = {};
    salaryComponents.forEach((component) => {
      if (component.type && component.amount) {
        salaryObj[component.type] = Number(component.amount);
      } else {
        setAlert({ type: "error", message: "Please Fill All Fields!" });
        flag = false;
        return;
      }
    });
    if (flag) {
      setSalary(salaryObj);
      setEditMode(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm w-full max-w-xl">
      {alert && <Alert alert={alert} setAlert={setAlert} />}
      <div className="flex justify-between items-center mb-4">
        <label className="text-lg font-semibold">Salary Breakdown</label>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex cursor-pointer items-center text-sm text-blue-600 hover:underline"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>

      {editMode ? (
        <>
          <div className="space-y-3">
            {salaryComponents.map((component, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Type(Basic,Bonus)"
                  value={component.type}
                  onChange={(e) =>
                    handleComponentChange(index, "type", e.target.value)
                  }
                  className="employee-form flex-1 px-3 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={component.amount}
                  onChange={(e) =>
                    handleComponentChange(index, "amount", e.target.value)
                  }
                  className="employee-form flex-1 px-3 py-2 border rounded"
                  required
                />

                {salaryComponents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeComponent(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 cursor-pointer h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={addComponent}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-500 hover:text-black text-white rounded"
            >
              <PlusCircle className="w-5 h-5" />
              Add
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              <CheckCircle2 className="w-5 h-5" />
              Submit
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            {salaryComponents.map((component, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded"
              >
                <span className="font-medium">{component.type}</span>
                <span>₹{Number(component.amount).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 font-semibold text-gray-700">
            Total Salary: ₹{totalSalary.toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
}

export default SalaryInput;
