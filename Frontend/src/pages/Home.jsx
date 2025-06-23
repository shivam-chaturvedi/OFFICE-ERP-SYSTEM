import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ user, setUser }) => {
  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";
  const isHR = user?.role === "hr";

  const navigate = useNavigate();

  const buttonStyle =
    "hover:bg-[#000000] text-white px-4 py-2 rounded cursor-pointer bg-gray-700 hover:text-green-500 transition";

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <main className="p-6 bg-gray-50 min-h-screen">
          <div className="mb-6">
            <div>
              {user.roles?.length > 1 &&
                user.roles.map((role) => {
                  return (
                    <button
                      key={role}
                      className="hover:bg-orange-600 uppercase hover:text-white px-4 py-2 m-2 rounded cursor-pointer bg-orange-300 text-black transition"
                      onClick={() => {
                        setUser({ ...user, role });
                      }}
                    >
                      View As {role}
                    </button>
                  );
                })}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.name || "User"}!
            </h1>
            {user.roles?.length > 1 && (
              <h2 className="text-xl shadow-lg shadow-amber-200 w-full max-w-sm mt-2 uppercase  mb-2 font-bold text-yellow-600">
                Viewing As {user?.role}
              </h2>
            )}
            <p className="text-gray-600">
              Here’s a quick overview of your ERP dashboard.
            </p>
          </div>

          {/* Admin */}
          {isAdmin && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {user?.stats?.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-sm text-gray-500">{stat.label}</h2>
                    <p className="text-xl font-semibold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <h2 className="text-lg font-bold text-gray-700 mb-2">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => navigate("/admin-profile")}
                  className={buttonStyle}
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/manage-users")}
                  className={buttonStyle}
                >
                  Manage Users
                </button>

                <button
                  onClick={() => navigate("/manage-departments")}
                  className={buttonStyle}
                >
                  Manage Departments
                </button>

                <button
                  onClick={() => navigate("/manage-employees")}
                  className={buttonStyle}
                >
                  Manage Employees
                </button>
                <button
                  onClick={() => navigate("/manage-trainees")}
                  className={buttonStyle}
                >
                  Manage Trainess
                </button>
                <button
                  onClick={() => navigate("/manage-tasks")}
                  className={buttonStyle}
                >
                  Manage Tasks
                </button>
                <button
                  onClick={() => navigate("/clients")}
                  className={buttonStyle}
                >
                  Clients
                </button>
                <button
                  onClick={() => navigate("/manage-teams")}
                  className={buttonStyle}
                >
                  Manage Teams
                </button>

                <button
                  onClick={() => navigate("/manage-leaves")}
                  className={buttonStyle}
                >
                  Manage Leaves
                </button>
                <button
                  onClick={() => navigate("/reports")}
                  className={buttonStyle}
                >
                  Reports
                </button>
                <button
                  onClick={() => navigate("/notifications")}
                  className={buttonStyle}
                >
                  Notifications
                </button>
                <button
                  onClick={() => navigate("/salary-details")}
                  className={buttonStyle}
                >
                  Salary Details
                </button>
              </div>
            </>
          )}

          {/* Employee */}
          {isEmployee && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {user?.stats?.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-sm text-gray-500">{stat.label}</h2>
                    <p className="text-xl font-semibold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <h2 className="text-lg font-bold text-gray-700 mb-2">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => navigate("/profile")}
                  className={buttonStyle}
                >
                  My Profile
                </button>
                <button
                  onClick={() => navigate("/leave-requests")}
                  className={buttonStyle}
                >
                  Apply Leave
                </button>
                <button
                  onClick={() => navigate("/my-attendance")}
                  className={buttonStyle}
                >
                  Attendance
                </button>
                <button
                  onClick={() => navigate("/tasks")}
                  className={buttonStyle}
                >
                  My Tasks
                </button>
                <button
                  onClick={() => navigate("/salary-slips")}
                  className={buttonStyle}
                >
                  Salary Slip
                </button>
                <button
                  onClick={() => navigate("/announcements")}
                  className={buttonStyle}
                >
                  Announcements
                </button>
              </div>
            </>
          )}

          {/* HR */}
          {isHR && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {user?.stats?.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-sm text-gray-500">{stat.label}</h2>
                    <p className="text-xl font-semibold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <h2 className="text-lg font-bold text-gray-700 mb-2">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => navigate("/hr-employee-directory")}
                  className={buttonStyle}
                >
                  Employee Directory
                </button>
                <button
                  onClick={() => navigate("/hr-leave-approvals")}
                  className={buttonStyle}
                >
                  Leave Approvals
                </button>
                <button
                  onClick={() => navigate("/hr-reports")}
                  className={buttonStyle}
                >
                  Reports
                </button>
                <button
                  onClick={() => navigate("/hr-notices")}
                  className={buttonStyle}
                >
                  Notices
                </button>
                <button
                  onClick={() => navigate("/hr-recruitments")}
                  className={buttonStyle}
                >
                  Recruitments
                </button>
              </div>
            </>
          )}
          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Recent Activity
            </h2>
            <div className="bg-white shadow rounded-xl p-4 space-y-3">
              {/* Sample activities - Replace with dynamic data if needed */}
            </div>
          </div>

          {!isAdmin && !isEmployee && !isHR && (
            <p className="text-gray-500">
              Your role is not defined or not authorized.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
