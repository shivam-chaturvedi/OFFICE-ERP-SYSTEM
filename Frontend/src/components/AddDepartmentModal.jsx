import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import config from "../config";

const AddDepartmentModal = ({ isOpen, onClose, onSuccess, employees }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [head, setHead] = useState("");
  const [status, setStatus] = useState(true);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});

  const handleCreate = async () => {
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/departments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ name, description, head, status }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
      {loader && <Loader />}
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <Alert alert={alert} setAlert={setAlert} />
        {/* Close Button */}
        <button
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Add New Department
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Create a new department for your organization.
        </p>

        <div className="space-y-4">
          {/* Department Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter department name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description
            </label>
            <textarea
              placeholder="Enter department description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              rows={3}
            />
          </div>

          {/* Department Head */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Department Head
            </label>
            <select
              value={head}
              onChange={(e) => {
                setHead(e.target.value);
              }}
              className=" w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select department head</option>
              {employees.map((emp, idx) => {
                return (
                  <option className="capitalize" key={emp._id + idx} value={emp._id}>
                    {emp.user?.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Inactive</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={status}
                  onChange={() => setStatus(!status)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
              <span className="text-sm text-gray-900">Active</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name}
            className={`cursor-pointer capitalize px-4 py-2 rounded-lg text-white ${
              name
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Create Department
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
