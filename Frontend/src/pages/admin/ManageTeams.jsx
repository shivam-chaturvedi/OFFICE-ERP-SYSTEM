import React, { useState, useCallback } from 'react';
import {
  Plus, Search, Users, FolderOpen, Building, User,
  MoreHorizontal, Eye, Edit
} from 'lucide-react';
import CreateTeamModal from '../../components/CreateTeamModal';

const initialTeams = [
  {
    id: 'TM001',
    name: 'Frontend Development Team',
    department: 'Engineering',
    members: 5,
    teamLead: 'John Smith',
    activeProject: 'E-commerce Platform',
    hasActiveProject: true
  },
  {
    id: 'TM002',
    name: 'Data Analytics Team',
    department: 'Analytics',
    members: 3,
    teamLead: 'Sarah Johnson',
    activeProject: 'No Active Project',
    hasActiveProject: false
  },
  {
    id: 'TM003',
    name: 'DevOps Team',
    department: 'Engineering',
    members: 4,
    teamLead: 'Mike Wilson',
    activeProject: 'Cloud Migration',
    hasActiveProject: true
  }
];

const TeamManagement = () => {
  const [teams, setTeams] = useState(initialTeams);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const handleTeamCreated = useCallback((newTeam) => {
    const teamId = `TM${teams.length + 1}`.padStart(5, '0');
    setTeams((prev) => [
      ...prev,
      {
        id: teamId,
        name: newTeam.name,
        department: newTeam.department,
        teamLead: newTeam.lead,
        members: newTeam.members.length,
        activeProject: 'No Active Project',
        hasActiveProject: false
      }
    ]);
  }, [teams]);

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === 'All Departments' || team.department === departmentFilter;

    const matchesStatus =
      statusFilter === 'All Status' ||
      (statusFilter === 'Active' && team.hasActiveProject) ||
      (statusFilter === 'Inactive' && !team.hasActiveProject);

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Manage Teams</h1>
            <p className="text-gray-600 mt-1">Create and manage your organization teams</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Create Team
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Users className="text-blue-600" size={20} />} label="Total Teams" value={teams.length} bg="blue" />
          <StatCard icon={<FolderOpen className="text-green-600" size={20} />} label="Active Projects" value={teams.filter(t => t.hasActiveProject).length} bg="green" />
          <StatCard icon={<Building className="text-purple-600" size={20} />} label="Departments" value={new Set(teams.map(t => t.department)).size} bg="purple" />
          <StatCard icon={<User className="text-orange-600" size={20} />} label="Total Members" value={teams.reduce((acc, t) => acc + t.members, 0)} bg="orange" />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search teams by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>HR</option>
              <option>Analytics</option>
              <option>Quality Assurance</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <TeamDetail label="ID" value={team.id} />
                <TeamDetail label="Department" value={team.department} />
                <TeamDetail label="Members" value={<span className="flex items-center gap-1"><Users size={16} /> {team.members}</span>} />
                <TeamDetail label="Team Lead" value={team.teamLead} />
                <div>
                  <span className="text-gray-600">Active Project</span>
                  <div className="mt-1">
                    {team.hasActiveProject ? (
                      <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-sm">
                        <FolderOpen size={14} />
                        {team.activeProject}
                      </span>
                    ) : (
                      <span className="text-red-600 text-sm">{team.activeProject}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Viewing team: ${team.name}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => alert(`Editing team: ${team.name}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Integration */}
      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value, bg }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center gap-3">
      <div className={`p-2 bg-${bg}-100 rounded-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const TeamDetail = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default TeamManagement;
