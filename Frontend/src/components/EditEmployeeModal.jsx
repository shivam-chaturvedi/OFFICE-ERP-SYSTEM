import React, { useEffect, useState } from "react";
import config from "../config";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

function EditEmployeeModal({ onClose, onSuccess, selectedEmployee }) {
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    position: "",
    date_of_birth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
    emergency_contact: {
      name: "",
      relation: "",
      contact_number: "",
    },
    department: "NA",
    date_of_joining: "",
    experience: 0,
    skills: "",
    domain: "",
    salary: "",
    shift: "General",
    work_location: "",
    status: "Active",
  });

  const departments = [
    "IT",
    "DevOps",
    "Finance",
    "HR",
    "Engineering",
    "Sales",
    "NA",
  ];
  const shifts = ["Morning", "Evening", "Night", "General"];
  const statusOptions = ["Active", "On Leave", "Resigned", "Terminated"];
  const genderOptions = ["Male", "Female", "Other"];

  useEffect(() => {
    if (selectedEmployee) {
      setForm(selectedEmployee);
      console.log(selectedEmployee);
      console.log(form);
    }
  }, [selectedEmployee]);

  useEffect(() => {
    console.log("Updated form state:", form);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.") || name.includes("emergency_contact.")) {
      const [section, key] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const res = await fetch(
        `${config.BACKEND_URL}/api/employees/edit/${selectedEmployee._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setAlert({ type: "success", message: data.message });
        onSuccess?.();
        onClose();
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoader(false);
    }
  };

  const Label = ({ children, required }) => (
    <label className="mr-2 text-lg font-medium text-gray-700">
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
          className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Edit Employee</h2>

        {/* All your form fields here, same as AddEmployeeModal (copy those JSX fields) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>Full Name</Label>
            <input
              type="text"
              name="name"
              value={form.user.name}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
              required
            />
          </div>
          <div>
            <Label required>Email</Label>
            <input
              type="email"
              name="email"
              value={form.user.email}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
              required
            />
          </div>
          <div>
            <Label required>Phone</Label>
            <input
              type="text"
              name="phone"
              value={form.user.phone}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
              required
            />
          </div>
          <div>
            <Label required>Password</Label>
            <input
              type="password"
              name="password"
              value={form.user.password}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
              required
            />
          </div>
          <div>
            <Label required>Position</Label>
            <input
              type="text"
              name="position"
              value={form.user.position}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
              required
            />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <input
              type="date"
              name="date_of_birth"
              value={form.user.date_of_birth}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label required>Gender</Label>
            <select
              name="gender"
              value={form.user.gender}
              onChange={handleChange}
              required
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <Label>Street</Label>
            <input
              type="text"
              name="address.street"
              value={form.user.address?.street}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label>City</Label>
            <input
              type="text"
              name="address.city"
              value={form.user.address?.city}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label>State</Label>
            <input
              type="text"
              name="address.state"
              value={form.user.address?.state}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label>Country</Label>
            <input
              type="text"
              name="address.country"
              value={form.user.address?.country}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label>Postal Code</Label>
            <input
              type="text"
              name="address.postal_code"
              value={form.user.address?.postal_code}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <Label>Emergency Contact Name</Label>
            <input
              type="text"
              name="emergency_contact.name"
              value={form.user.emergency_contact?.name}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label>Relation</Label>
            <input
              type="text"
              name="emergency_contact.relation"
              value={form.user.emergency_contact?.relation}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label>Emergency Contact Number</Label>
            <input
              type="text"
              name="emergency_contact.contact_number"
              value={form.user.emergency_contact?.contact_number}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>

          <div>
            <Label required>Department</Label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label required>Date of Joining</Label>
            <input
              type="date"
              name="date_of_joining"
              value={form.date_of_joining}
              onChange={handleChange}
              required
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label>Experience (Years)</Label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label>Skills (comma separated)</Label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label>Domain</Label>
            <input
              type="text"
              name="domain"
              value={form.domain}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>
          <div>
            <Label required>Salary</Label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
              required
            />
          </div>

          <div>
            <Label>Shift</Label>
            <select
              name="shift"
              value={form.shift}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            >
              {shifts.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Work Location</Label>
            <input
              type="text"
              name="work_location"
              value={form.work_location}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            />
          </div>

          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border-2 bg-yellow-50 shadow-lg rounded-lg p-2"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* At the end */}
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
            Update Employee
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEmployeeModal;
