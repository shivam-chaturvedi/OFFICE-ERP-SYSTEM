import React from "react";
import { Bell, AlertCircle, UserCheck } from "lucide-react";

const dummyNotifications = [
  {
    id: 1,
    title: "New User Registered",
    message: "An employee named Aman Verma has registered.",
    type: "info",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Leave Request",
    message: "Priya Sharma has requested leave for 10 June.",
    type: "alert",
    time: "4 hours ago",
  },
  {
    id: 3,
    title: "Salary Disbursed",
    message: "Monthly salaries have been processed.",
    type: "success",
    time: "1 day ago",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "alert":
      return <AlertCircle className="text-red-500" size={20} />;
    case "success":
      return <UserCheck className="text-green-500" size={20} />;
    default:
      return <Bell className="text-blue-500" size={20} />;
  }
};

const Notifications = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
      <p className="text-gray-600 mb-6">Stay updated with recent activities and alerts.</p>

      <div className="space-y-4">
        {dummyNotifications.map((note) => (
          <div
            key={note.id}
            className="flex items-start p-4 bg-white shadow rounded-lg border border-gray-100"
          >
            <div className="mr-4">{getIcon(note.type)}</div>
            <div>
              <h3 className="font-semibold text-gray-800">{note.title}</h3>
              <p className="text-gray-600 text-sm">{note.message}</p>
              <span className="text-xs text-gray-400">{note.time}</span>
            </div>
          </div>
        ))}
        {dummyNotifications.length === 0 && (
          <p className="text-gray-500">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
