import React, { useState } from "react";
import { X, Search, Clock, User, Building, ChevronDown } from "lucide-react";
import Loader from "./Loader";
import config from "../config";
import Alert from "./Alert";

const CreateTeamModal = ({ onClose, onSuccess, employees, departments }) => {
  const [step, setStep] = useState(1);
  const [selectedMemberIds, setSelectedMemberIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    department: "",
    teamLead: "",
  });
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemberToggle = (employee) => {
    const updated = new Set(selectedMemberIds);
    if (updated.has(employee._id)) {
      updated.delete(employee._id);
    } else {
      updated.add(employee._id);
    }
    setSelectedMemberIds(updated);
  };

  const handleNext = () => {
    if (selectedMemberIds.size > 0) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (teamData.name && teamData.department && teamData.teamLead) {
      setLoader(true);
      try {
        const payload = {
          name: teamData.name,
          description: teamData.description,
          department: teamData.department,
          members: Array.from(selectedMemberIds),
          leader: teamData.teamLead,
        };

        const res = await fetch(`${config.BACKEND_URL}/api/teams/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (res.ok) {
          onSuccess(result.team);
          onClose();
        } else {
          setAlert({
            type: "error",
            message: result.message,
          });
        }
      } catch (error) {
        console.error("Create team failed", error);
        setAlert({
          type: "error",
          message: error.message,
        });
      } finally {
        setLoader(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setTeamData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAll = () => {
    if (selectedMemberIds.size === employees.length) {
      setSelectedMemberIds(new Set());
    } else {
      setSelectedMemberIds(new Set(employees.map((emp) => emp._id))); // Select all
    }
  };

  return (
    <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
      {loader && <Loader />}
      <Alert alert={alert} setAlert={setAlert} />
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Team
          </h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            Step {step} of 2
          </span>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {step === 1 ? (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select Team Members
              </h3>
              <p className="text-gray-600">
                Choose employees to add to your team. You can search by name,
                email or department.
              </p>
            </div>

            <div className="relative mb-6">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              <input
                type="checkbox"
                checked={selectedMemberIds.size === employees.length}
                id="sa"
                onChange={() => handleAddAll()}
                className="cursor-pointer w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                for="sa"
                className="cursor-pointer ml-2 p-1 w-fit bg-gray-50 rounded-md  "
              >
                Select All
              </label>

              {filteredEmployees.map((emp) => (
                <div
                  key={emp._id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMemberIds.has(emp._id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleMemberToggle(emp)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMemberIds.has(emp._id)}
                      onChange={() => handleMemberToggle(emp)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="capitalize font-medium text-gray-900">
                            {emp.user?.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {emp.user?.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={16} /> {emp.experience}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={16} /> {emp.user.roles[0]}
                          </span>
                          <span className="flex items-center gap-1 px-6 py-4 uppercase font-bold text-purple-500 whitespace-nowrap text-sm">
                            <Building size={16} /> {emp.department?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter team name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Team Description
                </label>
                <textarea
                  value={teamData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the team's purpose and responsibilities..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={teamData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    requiredz
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Team Lead <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={teamData.teamLead}
                    onChange={(e) =>
                      handleInputChange("teamLead", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    required
                  >
                    <option value="">Select team lead</option>
                    {employees
                      .filter((e) => selectedMemberIds.has(e._id))
                      .map((e) => (
                        <option key={e._id} value={e._id}>
                          {e.user.name}
                        </option>
                      ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="border-t border-gray-200 p-6 flex justify-between">
        {step === 1 ? (
          <>
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={selectedMemberIds.size === 0}
              className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleBack}
              className="cursor-pointer px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                !teamData.name || !teamData.department || !teamData.teamLead
              }
              className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Team
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateTeamModal;
