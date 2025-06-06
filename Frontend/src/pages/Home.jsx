import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Home = ({ user, setUser }) => {
  return (
    <div className="flex h-screen">
      <Sidebar user={user} setUser={setUser} />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} />
        <main className="p-6 bg-gray-50 min-h-screen">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here’s a quick overview of your ERP dashboard.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-sm text-gray-500">Total Employees</h2>
              <p className="text-xl font-semibold text-gray-800">152</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-sm text-gray-500">Pending Leave Requests</h2>
              <p className="text-xl font-semibold text-gray-800">6</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-sm text-gray-500">Salary Processed</h2>
              <p className="text-xl font-semibold text-gray-800">₹12,45,000</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-sm text-gray-500">Upcoming Holidays</h2>
              <p className="text-xl font-semibold text-gray-800">2</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">
                Add New Employee
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700">
                Approve Leaves
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600">
                Process Salary
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">
              Recent Activity
            </h2>
            <div className="bg-white shadow rounded-xl p-4 space-y-2 text-sm text-gray-700">
              <div>✔️ Ramesh applied for 2-day leave</div>
              <div>✔️ Salary for May processed</div>
              <div>✔️ New user added: Priya Sharma</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
