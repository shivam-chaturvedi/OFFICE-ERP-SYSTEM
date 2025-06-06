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
} from "lucide-react";
import useIsMobile from "../hooks/useIsMobile";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setUser }) => {
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

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 flex flex-col justify-between ${
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
      <div className="flex-1 px-2 sm:px-4 space-y-2">
        <NavItem icon={<Home size={20} />} label="Home" expanded={expanded} />
        <NavItem
          icon={<Users size={20} />}
          label="Manage Users"
          expanded={expanded}
        />
        <NavItem
          icon={<FileText size={20} />}
          label="Reports"
          expanded={expanded}
        />
        <NavItem
          icon={<Settings size={20} />}
          label="Settings"
          expanded={expanded}
        />
        <NavItem
          icon={<Bell size={20} />}
          label="Notifications"
          expanded={expanded}
        />

        <hr className="border-gray-300 my-2" />

        <div className="bg-gray-100 rounded-md p-2 space-y-2">
          <NavItem
            icon={<CalendarCheck size={20} />}
            label="Manage Leaves"
            expanded={expanded}
          />
          <NavItem
            icon={<DollarSign size={20} />}
            label="Salary Details"
            expanded={expanded}
          />
          <NavItem
            icon={<Calendar size={20} />}
            label="Calendar"
            expanded={expanded}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-2 sm:px-4 mb-4 space-y-2">
        <button onClick={toggleSidebar} className="w-full text-left">
          <NavItem
            icon={<ArrowRightLeft size={20} />}
            label="Switch"
            expanded={expanded}
          />
        </button>
        <button className="w-full text-left" onClick={logout}>
          <NavItem
            icon={<LogOut size={20} />}
            label="Logout"
            expanded={expanded}
          />
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, expanded }) => (
  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-100 transition-colors duration-200 group">
    <div className="text-gray-700">{icon}</div>
    {expanded && <span className="text-sm text-gray-700">{label}</span>}
  </div>
);

export default Sidebar;
