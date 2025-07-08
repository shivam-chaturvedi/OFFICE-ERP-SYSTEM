import React, { useEffect, useState } from "react";
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
  UserCog,
  UserPlus,
  ListTodo,
  Briefcase,
  X,
  Menu,
  Calculator,
  ChevronDown,
  ChevronRight,
  Building,
  UserCheck,
  ClipboardList,
  Shield,
  User,
} from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

const Sidebar = ({ user, setUser, expanded, setExpanded }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    employees: false,
    tasks: false,
    clients: false,
    admin: false,
  });

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && expanded && !event.target.closest(".sidebar-container")) {
        setExpanded(false);
      }
    };

    if (isMobile && expanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, expanded, setExpanded]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, expanded]);

  const sidebarStructure = {
    admin: [
      { icon: <Home size={20} />, label: "Home", to: "/" },
      { icon: <User size={20} />, label: "Profile", to: "/admin-profile" },
      {
        icon: <Users size={20} />,
        label: "Employees Management",
        key: "employees",
        isSection: true,
        children: [
          {
            icon: <UserCog size={18} />,
            label: "Manage Employees",
            to: "/manage-employees",
          },
          {
            icon: <UserPlus size={18} />,
            label: "Manage Trainees",
            to: "/manage-trainees",
          },
          // {
          //   icon: <UserCheck size={18} />,
          //   label: "Employee Directory",
          //   to: "/employee-directory",
          // },
        ]
      },
      {
        icon: <ListTodo size={20} />,
        label: "Task & Leaves",
        key: "tasks",
        isSection: true,
        children: [
          {
            icon: <ListTodo size={18} />,
            label: "Manage Tasks",
            to: "/manage-tasks",
          },
          {
            icon: <CalendarCheck size={18} />,
            label: "Manage Leaves",
            to: "/manage-leaves",
          },
          // {
          //   icon: <ClipboardList size={18} />,
          //   label: "Leave Approvals",
          //   to: "/leave-approvals",
          // },
        ]
      },
      {
        icon: <Briefcase size={20} />,
        label: "Clients & Projects",
        key: "clients",
        isSection: true,
        children: [
          { icon: <Briefcase size={18} />, label: "Clients", to: "/clients" },
          { icon: <Users size={18} />, label: "Manage Teams", to: "/manage-teams" },
          {
            icon: <Building size={18} />,
            label: "Manage Departments",
            to: "/manage-departments",
          },
        ]
      },
      {
        icon: <Shield size={20} />,
        label: "Admin Panel",
        key: "admin",
        isSection: true,
        children: [
          { icon: <Users size={18} />, label: "Manage Users", to: "/manage-users" },
          { icon: <FileText size={18} />, label: "Reports", to: "/hr-reports" },
          { icon: <Bell size={18} />, label: "Notices", to: "/hr-notices" },
          {
            icon: <UserPlus size={18} />,
            label: "Recruitments",
            to: "/hr-recruitments",
          },
        ]
      },
    ],
    hr: [
      { icon: <Home size={20} />, label: "Home", to: "/" },
      { icon: <User size={20} />, label: "Profile", to: "/profile" },
      {
        icon: <Users size={20} />,
        label: "Employees Management",
        key: "employees",
        isSection: true,
        children: [
          {
            icon: <UserCog size={18} />,
            label: "Manage Employees",
            to: "/manage-employees",
          },
          {
            icon: <UserPlus size={18} />,
            label: "Manage Trainees",
            to: "/manage-trainees",
          },
          {
            icon: <UserCheck size={18} />,
            label: "Employee Directory",
            to: "/employee-directory",
          },
        ]
      },
      {
        icon: <ListTodo size={20} />,
        label: "Task & Leaves",
        key: "tasks",
        isSection: true,
        children: [
          {
            icon: <ListTodo size={18} />,
            label: "Manage Tasks",
            to: "/manage-tasks",
          },
          {
            icon: <CalendarCheck size={18} />,
            label: "Manage Leaves",
            to: "/manage-leaves",
          },
          {
            icon: <ClipboardList size={18} />,
            label: "Leave Approvals",
            to: "/leave-approvals",
          },
        ]
      },
      {
        icon: <Briefcase size={20} />,
        label: "Clients & Projects",
        key: "clients",
        isSection: true,
        children: [
          { icon: <Briefcase size={18} />, label: "Clients", to: "/clients" },
          { icon: <Users size={18} />, label: "Manage Teams", to: "/manage-teams" },
          {
            icon: <Building size={18} />,
            label: "Manage Departments",
            to: "/manage-departments",
          },
        ]
      },
      {
        icon: <Shield size={20} />,
        label: "Admin Panel",
        key: "admin",
        isSection: true,
        children: [
          { icon: <FileText size={18} />, label: "Reports", to: "/hr-reports" },
          { icon: <Bell size={18} />, label: "Notices", to: "/hr-notices" },
          {
            icon: <Settings size={18} />,
            label: "Recruitments",
            to: "/hr-recruitments",
          },
        ]
      },
    ],
    employee: [
      { icon: <Home size={20} />, label: "Home", to: "/" },
      { icon: <User size={20} />, label: "Profile", to: "/profile" },
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
      {
        icon: <Bell size={20} />,
        label: "Announcements",
        to: "/announcements",
      },
    ],
  };

  const renderMenuItem = (item, index) => {
    if (item.isSection) {
      return (
        <div key={index} className="mb-1">
          {/* Section Header */}
          <button
            onClick={() => toggleSection(item.key)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium
              ${!expanded ? "justify-center" : ""}
              ${expandedSections[item.key] ? "bg-gray-50" : ""}`}
          >
            <div className="flex-shrink-0 relative">
              {item.icon}
              {/* Tooltip for collapsed state */}
              {!expanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
                  {item.label}
                </div>
              )}
            </div>
            {expanded && (
              <>
                <span className="flex-1 text-left text-sm">{item.label}</span>
                <div className="flex-shrink-0">
                  {expandedSections[item.key] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              </>
            )}
          </button>
          
          {/* Sub-items */}
          {expanded && expandedSections[item.key] && (
            <div className="ml-6 mt-1 space-y-1 bg-gray-50 rounded-lg p-2">
              {item.children.map((child, childIndex) => (
                <NavLink
                  key={childIndex}
                  to={child.to}
                  onClick={() => isMobile && setExpanded(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group relative
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold border-r-2 border-blue-500"
                        : "text-gray-600"
                    }`
                  }
                >
                  <div className="flex-shrink-0">
                    {child.icon}
                  </div>
                  <span className="text-sm font-medium">{child.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      // Regular menu item
      return (
        <NavLink
          key={index}
          to={item.to}
          onClick={() => isMobile && setExpanded(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group relative mb-1
            ${
              isActive
                ? "bg-blue-100 text-blue-700 font-semibold border-r-2 border-blue-500"
                : "text-gray-700"
            }
            ${!expanded ? "justify-center" : ""}`
          }
        >
          <div className="flex-shrink-0 relative">
            {item.icon}
            {/* Tooltip for collapsed state */}
            {!expanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
                {item.label}
              </div>
            )}
          </div>
          {expanded && (
            <span className="text-sm whitespace-nowrap font-medium">
              {item.label}
            </span>
          )}
        </NavLink>
      );
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && expanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg border lg:hidden"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-container fixed top-0 left-0 z-50 h-screen
          bg-white border-r border-gray-200 
          flex flex-col justify-between 
          transition-all duration-300 ease-in-out
          ${
            isMobile
              ? expanded
                ? "w-64 translate-x-0"
                : "w-64 -translate-x-full"
              : expanded
              ? "w-64"
              : "w-16"
          }
          ${isMobile ? "shadow-2xl" : "shadow-sm"}`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between flex-shrink-0 border-b border-gray-100">
          <span
            className={`text-xl font-bold text-gray-800 sm:text-2xl transition-opacity duration-200 
              ${!expanded && !isMobile ? "opacity-0" : "opacity-100"}`}
          >
            TAC
          </span>
          {isMobile && expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div
          className={`flex-1 px-3 py-4 overflow-y-auto scrollbar-hide
            ${!expanded && !isMobile ? "px-2" : ""}`}
        >
          {sidebarStructure[user?.role]?.map((item, index) => renderMenuItem(item, index))}
        </div>

        {/* Bottom Actions */}
        <div
          className={`px-3 pb-4 space-y-2 flex-shrink-0 border-t border-gray-100 pt-4
          ${!expanded && !isMobile ? "px-2" : ""}`}
        >
          {/* Toggle Button */}
          <button onClick={toggleSidebar} className="w-full text-left">
            <div
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group relative text-gray-700
                ${!expanded ? "justify-center" : ""}`}
            >
              <div className="flex-shrink-0 relative">
                <ArrowRightLeft size={20} />
                {!expanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
                    Toggle
                  </div>
                )}
              </div>
              {expanded && (
                <span className="text-sm font-medium">Toggle</span>
              )}
            </div>
          </button>
          
          {/* Logout Button */}
          <button onClick={logout} className="w-full text-left">
            <div
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-200 group relative text-gray-700 hover:text-red-600
                ${!expanded ? "justify-center" : ""}`}
            >
              <div className="flex-shrink-0 relative">
                <LogOut size={20} />
                {!expanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
                    Logout
                  </div>
                )}
              </div>
              {expanded && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;