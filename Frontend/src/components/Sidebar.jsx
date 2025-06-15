import React, { useState } from "react";
import {
  Home,
  Users,
  FileText,
  Settings,
  Bell,
  LogOut,
  ArrowRightLeft,
  CalendarCheck,
  DollarSign,
  Calendar,
  LifeBuoy,
} from "lucide-react";
import useIsMobile from "../hooks/useIsMobile";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Sidebar = ({ user, setUser }) => {
  const [expanded, setExpanded] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  const logout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  const adminNavItems = [
    { icon: <Home size={20} />, label: "Home", to: "/" },
    { icon: <Settings size={20} />, label: "Profile", to: "/admin-profile" },
    { icon: <Users size={20} />, label: "Manage Users", to: "/manage-users" },
    { icon: <FileText size={20} />, label: "Reports", to: "/reports" },
    { icon: <Bell size={20} />, label: "Notifications", to: "/notifications" },
  ];

  const adminSubNav = [
    {
      icon: <CalendarCheck size={20} />,
      label: "Manage Leaves",
      to: "/manage-leaves",
    },
    {
      icon: <DollarSign size={20} />,
      label: "Salary Details",
      to: "/salary-details",
    },
  ];

  const employeeNavItems = [
    { icon: <Home size={20} />, label: "Home", to: "/" },
    { icon: <Settings size={20} />, label: "My Profile", to: "/profile" },
    {
      icon: <CalendarCheck size={20} />,
      label: "Leave Requests",
      to: "/leave-requests",
    },
    {
      icon: <DollarSign size={20} />,
      label: "Salary Slips",
      to: "/salary-slips",
    },
    {
      icon: <Calendar size={20} />,
      label: "My Attendance",
      to: "/my-attendance",
    },
    { icon: <FileText size={20} />, label: "Tasks / Projects", to: "/tasks" },
    { icon: <Bell size={20} />, label: "Announcements", to: "/announcements" },
  ];

  const hrNavItems = [
    { icon: <Home size={20} />, label: "Home", to: "/" },
    {
      icon: <Users size={20} />,
      label: "Employee Directory",
      to: "/hr-employee-directory",
    },
    {
      icon: <CalendarCheck size={20} />,
      label: "Leave Approvals",
      to: "/hr-leave-approvals",
    },
    { icon: <FileText size={20} />, label: "Reports", to: "/hr-reports" },
    { icon: <Bell size={20} />, label: "Notices", to: "/hr-notices" },
    {
      icon: <Settings size={20} />,
      label: "Recruitments",
      to: "/hr-recruitments",
    }, // ✅ NEW
  ];

  return (
    <div
      className={`${
        isMobile ? "h-[82%]" : "h-screen"
      }  bg-white border-r border-gray-200 flex flex-col justify-between ${
        expanded ? `w-64 ${isMobile ? "absolute z-30" : ""}` : "w-16"
      } transition-all duration-300`}
    >
      {/* Logo / Header */}
      <div className="p-4 flex justify-center sm:justify-start">
        <span
          className={`text-xl font-bold text-gray-600 sm:text-2xl ${
            !expanded && "hidden"
          }`}
        >
          TAC
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2 sm:px-4 space-y-2 overflow-y-auto">
        {user?.role === "admin" &&
          adminNavItems.map((item, idx) => (
            <NavItem key={idx} {...item} expanded={expanded} />
          ))}

        {user?.role === "admin" && (
          <div className="bg-gray-100 rounded-md p-2 space-y-2">
            {adminSubNav.map((item, idx) => (
              <NavItem key={idx} {...item} expanded={expanded} />
            ))}
          </div>
        )}

        {user?.role === "employee" &&
          employeeNavItems.map((item, idx) => (
            <NavItem key={idx} {...item} expanded={expanded} />
          ))}

        {user?.role === "hr" &&
          hrNavItems.map((item, idx) => (
            <NavItem key={idx} {...item} expanded={expanded} />
          ))}
      </div>

      {/* Bottom Section */}
      <div className="px-2 sm:px-4 mb-4 space-y-2">
        <button onClick={toggleSidebar} className="w-full text-left">
          <NavItem
            icon={<ArrowRightLeft size={20} />}
            label="Switch"
            to="#"
            expanded={expanded}
          />
        </button>
        <button className="w-full text-left" onClick={logout}>
          <NavItem
            icon={<LogOut size={20} />}
            label="Logout"
            to="#"
            expanded={expanded}
          />
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to, expanded }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 p-2 rounded-md hover:bg-blue-100 transition-colors duration-200 group ${
        isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
      }`
    }
  >
    <div>{icon}</div>
    {expanded && <span className="text-sm">{label}</span>}
  </NavLink>
);

export default Sidebar;
