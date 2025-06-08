import { useNavigate } from "react-router-dom";

const Home = ({ user, setUser }) => {
  const isAdmin = user?.role === "admin";
  const isEmployee = user?.role === "employee";
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <main className="p-6 bg-gray-50 min-h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.name || "User"}!
            </h1>
            <p className="text-gray-600">
              Here’s a quick overview of your ERP dashboard.
            </p>
          </div>

          {isAdmin && (
            <>
              {/* Admin Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {user?.stats?.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-sm text-gray-500">{stat.label}</h2>
                    <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Admin Quick Actions */}
              <h2 className="text-lg font-bold text-gray-700 mb-2">Quick Actions</h2>
              <div className="flex flex-wrap gap-4 mb-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700" onClick={() => navigate("/admin-profile")}>Profile</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700" onClick={() => navigate("/manage-users")}>Manage Users</button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md shadow hover:bg-purple-700" onClick={() => navigate("/manage-leaves")}>Manage Leaves</button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-700" onClick={() => navigate("/reports")}>Reports</button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700" onClick={() => navigate("/notifications")}>Notifications</button>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-md shadow hover:bg-pink-700" onClick={() => navigate("/salary-details")}>Salary Details</button>
              </div>

              {/* Admin Activity */}
              <div>
                <h2 className="text-lg font-bold text-gray-700 mb-2">Recent Activity</h2>
                <div className="bg-white shadow rounded-xl p-4 space-y-2 text-sm text-gray-700">
                  {user?.activity?.map((log, idx) => (
                    <div key={idx}>✔️ {log}</div>
                  ))}
                </div>
              </div>
            </>
          )}

          {isEmployee && (
            <>
              {/* Employee Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {user?.stats?.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-sm text-gray-500">{stat.label}</h2>
                    <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Employee Quick Actions */}
              <h2 className="text-lg font-bold text-gray-700 mb-2">Quick Actions</h2>
              <div className="flex flex-wrap gap-4 mb-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700" onClick={() => navigate("/profile")}>My Profile</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700" onClick={() => navigate("/leave-requests")}>Apply Leave</button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md shadow hover:bg-purple-700" onClick={() => navigate("/my-attendance")}>Attendance</button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-700" onClick={() => navigate("/tasks")}>My Tasks</button>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-md shadow hover:bg-pink-700" onClick={() => navigate("/salary-slips")}>Salary Slip</button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700" onClick={() => navigate("/announcements")}>Announcements</button>
              </div>

              {/* Employee Announcements */}
              <div>
                <h2 className="text-lg font-bold text-gray-700 mb-2">Recent Announcements</h2>
                <div className="bg-white shadow rounded-xl p-4 space-y-2 text-sm text-gray-700">
                  {user?.announcements?.map((note, idx) => (
                    <div key={idx}>📢 {note}</div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!isAdmin && !isEmployee && (
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
