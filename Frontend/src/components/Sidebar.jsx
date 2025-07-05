import React, { useEffect } from "react";
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
} from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

const Sidebar = ({ user, setUser, expanded, setExpanded }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };
 const sharedAdminHrItems = [
  { icon: <UserCog size={20} />, label: "Manage Employees", to: "/manage-employees" },
  { icon: <UserPlus size={20} />, label: "Manage Trainees", to: "/manage-trainees" },
  { icon: <ListTodo size={20} />, label: "Manage Tasks", to: "/manage-tasks" },
  { icon: <CalendarCheck size={20} />, label: "Manage Leaves", to: "/manage-leaves" },
  { icon: <Briefcase size={20} />, label: "Manage Clients", to: "/clients" },
  { icon: <Users size={20} />, label: "Manage Departments", to: "/manage-departments" },
  { icon: <Users size={20} />, label: "Manage Teams", to: "/manage-teams" },
  { icon: <Users size={20} />, label: "Manage Users", to: "/manage-users" },
];



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
      if (isMobile && expanded && !event.target.closest('.sidebar-container')) {
        setExpanded(false);
      }
    };

    if (isMobile && expanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, expanded, setExpanded]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, expanded]);

  const navItemsByRole = {
    admin: [
      { icon: <Home size={20} />, label: "Home", to: "/" },
      { icon: <Settings size={20} />, label: "Profile", to: "/admin-profile" },
      { icon: <ListTodo size={20} />, label: "Manage Tasks", to: "/manage-tasks" },
      { icon: <Users size={20} />, label: "Manage Users", to: "/manage-users" },
      { icon: <Users size={20} />, label: "Manage Department", to: "/manage-departments" },
      { icon: <Users size={20} />, label: "Manage Teams", to: "/manage-teams" },
      { icon: <UserCog size={20} />, label: "Manage Employees", to: "/manage-employees" },
      { icon: <UserPlus size={20} />, label: "Manage Trainees", to: "/manage-trainees" },
      { icon: <Calculator size={20} />, label: "Manage Accounts", to: "/accounts" }, 
    ],
    adminSub: [
      { icon: <CalendarCheck size={20} />, label: "Manage Leaves", to: "/manage-leaves" },
      { icon: <DollarSign size={20} />, label: "Salary Details", to: "/salary-details" },
      { icon: <Briefcase size={20} />, label: "Clients", to: "/clients" },
      { icon: <FileText size={20} />, label: "Reports", to: "/reports" },
      { icon: <Bell size={20} />, label: "Notifications", to: "/notifications" },
    ],
    employee: [
      { icon: <Home size={20} />, label: "Home", to: "/" },
      { icon: <Settings size={20} />, label: "My Profile", to: "/profile" },
      { icon: <CalendarCheck size={20} />, label: "Leave Requests", to: "/leave-requests" },
      { icon: <DollarSign size={20} />, label: "Salary Slips", to: "/salary-slips" },
      { icon: <Calendar size={20} />, label: "My Attendance", to: "/my-attendance" },
      { icon: <FileText size={20} />, label: "Tasks / Projects", to: "/tasks" },
      { icon: <Bell size={20} />, label: "Announcements", to: "/announcements" },
    ],
    hr: [
      { icon: <Home size={20} />, label: "Home", to: "/" },
      { icon: <Users size={20} />, label: "Employee Directory", to: "/hr-employee-directory" },
      { icon: <CalendarCheck size={20} />, label: "Leave Approvals", to: "/hr-leave-approvals" },
      { icon: <FileText size={20} />, label: "Reports", to: "/hr-reports" },
      { icon: <Bell size={20} />, label: "Notices", to: "/hr-notices" },
      { icon: <Settings size={20} />, label: "Recruitments", to: "/hr-recruitments" },
    ],
  };

  const renderNavItems = (items) =>
    items.map((item, idx) => (
      <NavItem 
        key={idx} 
        {...item} 
        expanded={expanded} 
        onClick={() => isMobile && setExpanded(false)}
      />
    ));

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
          ${isMobile 
            ? expanded 
              ? "w-64 translate-x-0" 
              : "w-64 -translate-x-full"
            : expanded 
              ? "w-64" 
              : "w-16"
          }
          ${isMobile ? 'shadow-2xl' : 'shadow-sm'}`}
      >
        {/* Header with Close Button */}
        <div className="p-4 flex items-center justify-between flex-shrink-0">
          <span 
            className={`text-xl font-bold text-gray-600 sm:text-2xl transition-opacity duration-200 
              ${(!expanded && !isMobile) ? "opacity-0" : "opacity-100"}`}
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
          className={`flex-1 px-2 sm:px-4 space-y-2 overflow-y-auto scrollbar-hide
            ${!expanded && !isMobile ? "px-2" : ""}`}
        >
          {user?.role === "admin" && renderNavItems(navItemsByRole.admin)}
          {user?.role === "admin" && (
            <div className={`bg-gray-100 rounded-md p-2 space-y-2 transition-all duration-200
              ${!expanded && !isMobile ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              {renderNavItems(navItemsByRole.adminSub)}
            </div>
          )}
          {user?.role === "employee" && renderNavItems(navItemsByRole.employee)}
        {user?.role === "hr" && (
  <>
    {/* Home should be first */}
    {renderNavItems([
      { icon: <Home size={20} />, label: "Home", to: "/" },
    ])}

   
    {renderNavItems(sharedAdminHrItems)}

    
    <div className={`bg-gray-100 rounded-md p-2 space-y-2 transition-all duration-200
      ${!expanded && !isMobile ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      {renderNavItems([
        { icon: <Users size={20} />, label: "Employee Directory", to: "/hr-employee-directory" },
        { icon: <CalendarCheck size={20} />, label: "Leave Approvals", to: "/hr-leave-approvals" },
        { icon: <FileText size={20} />, label: "Reports", to: "/hr-reports" },
        { icon: <Bell size={20} />, label: "Notices", to: "/hr-notices" },
        { icon: <Settings size={20} />, label: "Recruitments", to: "/hr-recruitments" },
      ])}
    </div>
  </>
)}


        </div>

        {/* Bottom Buttons */}
        <div className={`px-2 sm:px-4 mb-4 space-y-2 flex-shrink-0
          ${!expanded && !isMobile ? "px-2" : ""}`}>
          <button onClick={toggleSidebar} className="w-full text-left">
            <NavItem 
              icon={<ArrowRightLeft size={20} />} 
              label={isMobile ? "Close" : "Toggle"} 
              to="#" 
              expanded={expanded} 
            />
          </button>
          <button onClick={logout} className="w-full text-left">
            <NavItem 
              icon={<LogOut size={20} />} 
              label="Logout" 
              to="#" 
              expanded={expanded}
              onClick={() => isMobile && setExpanded(false)}
            />
          </button>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ icon, label, to, expanded, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-md hover:bg-blue-50 transition-all duration-200 group relative
      ${isActive ? "bg-blue-100 text-blue-700 font-semibold border-r-2 border-blue-500" : "text-gray-700"}
      ${!expanded ? "justify-center" : ""}`
    }
  >
    <div className="flex-shrink-0 relative">
      {icon}
      {/* Tooltip for collapsed state */}
      {!expanded && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
          whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
          {label}
        </div>
      )}
    </div>
    {expanded && (
      <span className="text-sm whitespace-nowrap font-medium transition-all duration-200">
        {label}
      </span>
    )}
  </NavLink>
);

export default Sidebar;