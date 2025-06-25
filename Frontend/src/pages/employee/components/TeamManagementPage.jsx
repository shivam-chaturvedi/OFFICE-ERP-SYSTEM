import { Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import config from "../../../config";

const TeamManagementPage = ({ selectedTask, employee }) => {
  const [members, setMembers] = useState([]);
  const [viewTasksModal, setViewTasksModal] = useState(null);
  const [assignTaskModal, setAssignTaskModal] = useState(null);

  const handleAssignTaskForm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/tasks/add-subtask`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body:JSON.stringify()
      });
    } catch (err) {}
  };

  useEffect(() => {
    const fetchTask = async () => {
      if (!selectedTask) return;
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/tasks/${selectedTask._id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setMembers(data.task?.team?.members || []);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchTask();
  }, [selectedTask]);

  if (!selectedTask) {
    return (
      <h1 className="uppercase text-center text-lg text-gray-400 mt-4">
        Please Select any task first
      </h1>
    );
  }

  if (selectedTask?.team?.leader !== employee._id) {
    return (
      <h1 className="uppercase text-center text-lg text-gray-400 mt-4">
        Only Leader Can View This Page
      </h1>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {members.map((member, idx) => (
          <div
            key={member.user?._id + idx}
            className="bg-white rounded-xl shadow border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                {member.user?.profile_image ? (
                  <img
                    className="rounded-full overflow-hidden w-full h-full"
                    src={config.BACKEND_URL + member.user?.profile_image}
                    alt="Profile"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="capitalize text-lg font-semibold text-yellow-700">
                  {member.user?.name}
                </h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-lg text-gray-600">
                Experience: {member.experience}
              </p>
              <p className="text-lg text-gray-600">
                Email: {member.user?.email}
              </p>
            </div>

            <div className="mb-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {member.tasks?.length}
              </div>
              <div className="text-sm text-gray-600">Current Tasks</div>
            </div>

            <div className="flex space-x-2">
              <button
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                onClick={() => setViewTasksModal(member)}
              >
                <span className="text-sm font-medium text-gray-700">
                  View Tasks
                </span>
              </button>
              <button
                className="flex-1 py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                onClick={() => setAssignTaskModal(member)}
              >
                <span className="text-sm font-medium">Assign Task</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Tasks Modal */}
      {viewTasksModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 ">
              Tasks for{" "}
              <span className="capitalize text-yellow-800 underline">
                {viewTasksModal.user?.name}
              </span>
            </h2>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {(viewTasksModal.tasks || []).map((taskId, idx) => (
                <li key={idx}>Task ID: {taskId}</li>
              ))}
            </ul>
            <div className="text-right mt-4">
              <button
                onClick={() => setViewTasksModal(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {assignTaskModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Assign Subtask</h2>
            <form
              onSubmit={(e) => {
                handleAssignTaskForm(e);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Subtask Name"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Subtask Description"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignTaskModal(null)}
                  className="text-sm text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagementPage;
