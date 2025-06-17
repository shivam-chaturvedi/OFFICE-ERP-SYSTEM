import React, { useState } from 'react';
import { X, Clock, Building2, CheckCircle } from 'lucide-react';

const dummyEmployees = [
  { id: 1, name: 'John Smith', email: 'john.smith@company.com', experience: 5, domain: 'Frontend Development', department: 'Engineering' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', experience: 7, domain: 'Data Science', department: 'Analytics' },
  { id: 3, name: 'Mike Wilson', email: 'mike.wilson@company.com', experience: 8, domain: 'DevOps', department: 'Engineering' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@company.com', experience: 4, domain: 'QA Testing', department: 'Quality Assurance' },
];

const CreateTeamModal = ({ isOpen, onClose, onCreateTeam }) => {
  const [step, setStep] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [teamInfo, setTeamInfo] = useState({
    name: '',
    department: '',
    lead: '',
    description: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    setTeamInfo({ ...teamInfo, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setStep(1);
    setSelectedEmployees([]);
    setTeamInfo({
      name: '',
      department: '',
      lead: '',
      description: '',
    });
  };

  const handleCreate = () => {
    const newTeam = {
      ...teamInfo,
      members: selectedEmployees.map((id) => dummyEmployees.find(e => e.id === id)),
    };

    console.log("New Team:", newTeam);

    // 🔁 Inform parent
    if (onCreateTeam) {
      onCreateTeam(newTeam);
    }

    setShowSuccess(true);
    resetForm();

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2500);
  };

  if (!isOpen && !showSuccess) return null;

  return (
    <>
      {/* Team Creation Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-black" onClick={onClose}>
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold">
              Create New Team <span className="text-sm ml-2 text-gray-500">Step {step} of 2</span>
            </h2>

            {step === 1 ? (
              <>
                <h3 className="text-lg font-medium mt-6">Select Team Members</h3>
                <input placeholder="Search employees..." className="w-full border rounded-md p-2 mb-4" />
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {dummyEmployees.map((emp) => (
                    <div key={emp.id} className="border rounded-lg px-4 py-3 flex items-center justify-between hover:shadow-sm transition">
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-sm text-gray-500">{emp.email}</p>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Clock size={14} /> {emp.experience} yrs</span>
                          <span>{emp.domain}</span>
                          <span className="flex items-center gap-1"><Building2 size={14} /> {emp.department}</span>
                        </div>
                      </div>
                      <input type="checkbox" checked={selectedEmployees.includes(emp.id)} onChange={() => toggleEmployee(emp.id)} className="w-5 h-5" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                    onClick={() => setStep(2)}
                    disabled={selectedEmployees.length === 0}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mt-6">Team Information</h3>
                <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
                  Selected Team Members ({selectedEmployees.length}):{" "}
                  {selectedEmployees.map(id => {
                    const emp = dummyEmployees.find(e => e.id === id);
                    return <span key={id} className="inline-block bg-green-200 px-2 py-1 rounded-md mr-2">{emp?.name}</span>;
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Team Name *</label>
                    <input name="name" className="w-full border rounded-md p-2" value={teamInfo.name} onChange={handleChange} placeholder="Enter team name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Team Description</label>
                    <textarea name="description" className="w-full border rounded-md p-2" value={teamInfo.description} onChange={handleChange} placeholder="Describe the team..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department *</label>
                    <select name="department" className="w-full border rounded-md p-2" value={teamInfo.department} onChange={handleChange}>
                      <option value="">Select department</option>
                      <option>Engineering</option>
                      <option>Analytics</option>
                      <option>Quality Assurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Team Lead</label>
                    <select name="lead" className="w-full border rounded-md p-2" value={teamInfo.lead} onChange={handleChange}>
                      <option value="">Select team lead</option>
                      {dummyEmployees.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button className="text-sm text-gray-600" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    onClick={handleCreate}
                  >
                    Create Team
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-green-400 shadow-lg px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in-up">
          <CheckCircle className="text-green-600" size={24} />
          <span className="text-green-800 font-medium">Team created successfully!</span>
        </div>
      )}
    </>
  );
};

export default CreateTeamModal;
