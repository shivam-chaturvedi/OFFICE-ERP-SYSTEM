import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import config from "./config";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminProfile from "./pages/admin/AdminProfile";
import ManageUsers from "./pages/admin/ManageUsers";
import Reports from "./pages/admin/Reports";
import Notifications from "./pages/admin/Notifications";
import ManageLeaves from "./pages/admin/ManageLeaves";
import SalaryDetails from "./pages/admin/SalaryDetails";

import Profile from "./pages/employee/Profile";
import LeaveRequests from "./pages/employee/LeaveRequests";
import SalarySlip from "./pages/employee/SalarySlip";
import Attendance from "./pages/employee/Attendance";
import Tasks from "./pages/employee/Tasks";
import Announcements from "./pages/employee/Announcements";

import HREmployeeDirectory from "./pages/hr/HREmployeeDirectory";
import HRLeaveApprovals from "./pages/hr/HRLeaveApprovals";
import HRReports from "./pages/hr/HRReports";
import HRNotices from "./pages/hr/HRNotices";
import Recruitments from "./pages/hr/Recruitments";
import ManageEmployees from "./pages/admin/ManageEmployees";
import ManageTrainees from "./pages/admin/ManageTrainees";
import ManageClients from "./pages/admin/ManageClients";
import ManageTasks from "./pages/admin/ManageTasks";
import ManageTeams from "./pages/admin/ManageTeams";
import ManageDepartments from "./pages/admin/ManageDepartments";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setUser({ name: "TestUser", role: "employee" });
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${config.BACKEND_URL}/api/auth/verify-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          let data = await res.json();

          if (data.user.roles.includes("admin")) {
            data.user.role = "admin";
          } else {
            data.user.role = data.user.roles[0];
          }
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Token validation failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (loading) return <Loader />;

  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;

    return (
      <div className="flex">
        <Sidebar
          user={user}
          setUser={setUser}
          expanded={expanded}
          setExpanded={setExpanded}
        />
        <div
          className={`transition-all duration-300 w-full ${
            expanded ? "ml-64" : "ml-16"
          }`}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user === null ? (
              <Navigate to="/login" />
            ) : (
              <ProtectedRoute>
                <Home user={user} setUser={setUser} />
              </ProtectedRoute>
            )
          }
        />

        <Route
          path="/login"
          element={
            user !== null ? <Navigate to="/" /> : <Login setUser={setUser} />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute role="admin">
              <AdminProfile user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute role="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute role="admin">
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute role="admin">
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-leaves"
          element={
            <ProtectedRoute role="admin">
              <ManageLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salary-details"
          element={
            <ProtectedRoute role="admin">
              <SalaryDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-employees"
          element={
            <ProtectedRoute role="admin">
              <ManageEmployees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-trainees"
          element={
            <ProtectedRoute role="admin">
              <ManageTrainees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-tasks"
          element={
            <ProtectedRoute role="admin">
              <ManageTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute role="admin">
              <ManageClients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-teams"
          element={
            <ProtectedRoute role="admin">
              <ManageTeams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-departments"
          element={
            <ProtectedRoute role="admin">
              <ManageDepartments />
            </ProtectedRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="employee">
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-requests"
          element={
            <ProtectedRoute role="employee">
              <LeaveRequests user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salary-slips"
          element={
            <ProtectedRoute role="employee">
              <SalarySlip user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-attendance"
          element={
            <ProtectedRoute role="employee">
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute role="employee">
              <Tasks user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute role="employee">
              <Announcements />
            </ProtectedRoute>
          }
        />
        {/* HR Routes */}
        <Route
          path="/hr-employee-directory"
          element={
            <ProtectedRoute role="hr">
                    <HREmployeeDirectory />   {" "}
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr-leave-approvals"
          element={
            <ProtectedRoute role="hr">
                    <HRLeaveApprovals />   {" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-reports"
          element={
            <ProtectedRoute role="hr">
                    <HRReports />   {" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-notices"
          element={
            <ProtectedRoute role="hr">
                    <HRNotices />   {" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-recruitments"
          element={
            <ProtectedRoute role="hr">
              <Recruitments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
