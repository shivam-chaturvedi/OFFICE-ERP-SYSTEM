import React from "react";

const Announcements = () => {
  const sampleAnnouncements = [
    { id: 1, message: "📢 Office will remain closed on 15th August", date: "2025-08-10" },
    { id: 2, message: "📢 New company policy updated in portal", date: "2025-08-08" },
    { id: 3, message: "📢 Project submission deadline extended to Friday", date: "2025-08-05" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Announcements</h1>
      <p className="text-gray-600 mb-6">Stay updated with the latest announcements from HR and management.</p>

      <div className="space-y-4">
        {sampleAnnouncements.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500"
          >
            <div className="text-sm text-gray-800 font-medium">{item.message}</div>
            <div className="text-xs text-gray-500 mt-1">Published on: {item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
