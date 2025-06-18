import React, { useState } from 'react';
import { X, Search, Clock, User, Building, ChevronDown } from 'lucide-react';

const CreateTeamModal = ({ onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    department: '',
    teamLead: ''
  });

  // Sample employee data
  const employees = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      experience: '5 years',
      role: 'Frontend Development',
      department: 'Engineering'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      experience: '7 years',
      role: 'Data Science',
      department: 'Analytics'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      experience: '8 years',
      role: 'DevOps',
      department: 'Engineering'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      experience: '6 years',
      role: 'UI/UX Design',
      department: 'Design'
    },
    {
      id: 5,
      name: 'Alex Chen',
      email: 'alex.chen@company.com',
      experience: '4 years',
      role: 'Backend Development',
      department: 'Engineering'
    },
    {
      id: 6,
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      experience: '9 years',
      role: 'Product Management',
      department: 'Product'
    }
  ];

  const departments = [
    'Engineering',
    'Design',
    'Marketing',
    'HR',
    'Analytics',
    'Quality Assurance',
    'Product',
    'Sales'
  ];

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemberToggle = (employee) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(member => member.id === employee.id);
      if (isSelected) {
        return prev.filter(member => member.id !== employee.id);
      } else {
        return [...prev, employee];
      }
    });
  };

  const handleNext = () => {
    if (selectedMembers.length > 0) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamData.name && teamData.department && teamData.teamLead) {
      const newTeam = {
        ...teamData,
        members: selectedMembers.length,
        selectedMembers: selectedMembers
      };
      onCreate(newTeam);
    }
  };

  const handleInputChange = (field, value) => {
    setTeamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Team</h2>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            Step {step} of 2
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {step === 1 ? (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Team Members</h3>
              <p className="text-gray-600">
                Choose employees to add to your team. You can search by name, domain, or department.
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Employee List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEmployees.map((employee) => {
                const isSelected = selectedMembers.some(member => member.id === employee.id);
                return (
                  <div
                    key={employee.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMemberToggle(employee)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleMemberToggle(employee)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{employee.name}</h4>
                            <p className="text-sm text-gray-600">{employee.email}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>{employee.experience}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User size={16} />
                              <span>{employee.role}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building size={16} />
                              <span>{employee.department}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Information</h3>
              <p className="text-gray-600">Provide details about your new team.</p>
            </div>

            {/* Selected Members Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-green-800 mb-2">
                Selected Team Members ({selectedMembers.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <span
                    key={member.id}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {member.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter team name"
                    value={teamData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Team Description
                  </label>
                  <textarea
                    placeholder="Describe the team's purpose and responsibilities..."
                    value={teamData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
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
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Team Lead
                  </label>
                  <div className="relative">
                    <select
                      value={teamData.teamLead}
                      onChange={(e) => handleInputChange('teamLead', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option value="">Select team lead</option>
                      {selectedMembers.map((member) => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex justify-between">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={selectedMembers.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!teamData.name || !teamData.department}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Team
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;