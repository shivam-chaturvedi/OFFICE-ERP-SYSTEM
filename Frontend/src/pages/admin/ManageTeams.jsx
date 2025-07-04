import React, { useState, useCallback, useEffect } from "react";
import {
  Plus,
  Search,
  Users,
  FolderOpen,
  Building,
  User,
  MoreHorizontal,
  Eye,
  Edit,
  X,
} from "lucide-react";
import CreateTeamModal from "../../components/CreateTeamModal";
import config from "../../config";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [alert, setAlert] = useState({});

  const fetchEmployees = async () => {
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/employees`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error("Error fetching employees", err);
    } finally {
      setLoader(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoader(true);
      const res = await fetch(`${config.BACKEND_URL}/api/departments/names`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setDepartments(data.names || []);
    } catch (err) {
      console.error("Error fetching employees", err);
    } finally {
      setLoader(false);
    }
  };

  React.useEffect(() => {
    console.log();
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/teams`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setTeams(data.teams);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      departmentFilter === "All Departments" ||
      team.department.name.toLowerCase() === departmentFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Active" && team.active) ||
      (statusFilter === "Inactive" && !team.active);

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleTeamUpdate = (updatedTeam) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
    );
    setShowEditModal(false);
  };

  const updateSelectedTeamField = (field, value) => {
    setSelectedTeam((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loader && <Loader />}
      <Alert alert={alert} setAlert={setAlert} />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Manage Teams
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage your organization teams
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Create Team
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="text-blue-600" size={20} />}
            label="Total Teams"
            value={teams.length}
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={<FolderOpen className="text-green-600" size={20} />}
            label="Active Projects"
            value={teams.filter((t) => t.hasActiveProject).length}
            bgColor="bg-green-100"
          />
          
          <StatCard
            icon={<Building className="text-purple-600" size={20} />}
            label="Departments"
            value={
              teams?.length
                ? new Set(
                    teams
                      .filter((t) => t?.department?._id) // filter out invalid ones
                      .map((t) => t.department._id)
                  ).size
                : 0
            }
            bgColor="bg-purple-100"
          />

          <StatCard
            icon={<User className="text-orange-600" size={20} />}
            label="Total Members"
            value={teams.reduce((acc, t) => acc + t.members.length, 0)}
            bgColor="bg-orange-100"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
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
              {departments.map((d) => {
                return <option key={d._id}>{d.name}</option>;
              })}
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
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
          {filteredTeams.map((team, idx) => (
            <div
              key={team._id + idx}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="uppercase text-xl shadow-md shadow-pink-400 p-2 rounded-xl font-semibold text-gray-900">
                  {team.name}
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <TeamDetail label="ID" value={team._id} />
                <TeamDetail label="Department" value={team.department.name} />
                <TeamDetail
                  label="Members"
                  value={
                    <span className="flex items-center gap-1">
                      <Users size={16} /> {team.members.length}
                    </span>
                  }
                />
                <TeamDetail label="Team Lead" value={team.leader?.user?.name} />
                {team.active_project ? (
                  <div>
                    <span className="text-gray-600">Active Project</span>
                    <div className="mt-1">
                      {team.active ? (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-sm">
                          <FolderOpen size={14} />
                          {team.active_project?.name}
                        </span>
                      ) : (
                        <span className="text-red-600 text-sm">
                          {team.active_project?.name}
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowViewModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowEditModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-yellow-500 text-yellow-600 rounded hover:bg-yellow-50"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <CreateTeamModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setAlert({
                type: "success",
                message: "Team Added Successfully",
              });
              fetchTeams();
            }}
            employees={employees}
            departments={departments}
          />
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow p-6 relative">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Team Details</h2>
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {selectedTeam._id}
              </p>
              <p>
                <strong>Name:</strong> {selectedTeam.name}
              </p>
              <p>
                <strong>Department:</strong> {selectedTeam.department.name}
              </p>
              <p>
                <strong>Team Lead:</strong> {selectedTeam.leader?.user?.name}
              </p>
              <p>
                <strong>Members:</strong> {selectedTeam.members?.length}
              </p>
              <p>
                <strong>Active Project:</strong>{" "}
                {selectedTeam.active_project
                  ? selectedTeam.active_project?.name
                  : "No Active Project"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Team</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTeamUpdate(selectedTeam);
              }}
              className="space-y-4"
            >
              <input
                id="edit-name"
                name="name"
                type="text"
                value={selectedTeam.name}
                onChange={(e) =>
                  updateSelectedTeamField("name", e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                id="edit-department"
                name="department"
                type="text"
                value={selectedTeam.department}
                onChange={(e) =>
                  updateSelectedTeamField("department", e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                id="edit-team-lead"
                name="teamLead"
                type="text"
                value={selectedTeam.leader?.user?.name}
                onChange={(e) =>
                  updateSelectedTeamField("teamLead", e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                id="edit-members"
                name="members"
                type="number"
                value={selectedTeam.members.length}
                onChange={(e) =>
                  updateSelectedTeamField("members", Number(e.target.value))
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                id="edit-active-project"
                name="activeProject"
                type="text"
                value={selectedTeam.active_project?.name}
                onChange={(e) =>
                  updateSelectedTeamField("activeProject", e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
              />

              <label
                htmlFor="hasActiveProject"
                className="flex items-center gap-2"
              >
                <input
                  id="hasActiveProject"
                  name="hasActiveProject"
                  type="checkbox"
                  checked={selectedTeam.active_project}
                  onChange={(e) =>
                    updateSelectedTeamField(
                      "hasActiveProject",
                      e.target.checked
                    )
                  }
                />
                Has Active Project
              </label>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, bgColor }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="flex items-center gap-3">
      <div className={`p-2 ${bgColor} rounded-lg`}>{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const TeamDetail = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600 uppercase font-extralight">{label}</span>
    <span className="text-pink-600 uppercase font-semibold text-lg ">
      {value}
    </span>
  </div>
);

export default TeamManagement;
