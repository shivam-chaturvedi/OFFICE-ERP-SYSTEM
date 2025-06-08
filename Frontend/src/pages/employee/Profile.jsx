import React, { useState } from "react";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-8">
        {/* Header: Profile Image & Info */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center space-x-6">
            {/* Profile Upload */}
            <div className="relative w-28 h-28">
              <label htmlFor="profile-upload">
                <div className="w-28 h-28 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-100 text-gray-500 cursor-pointer overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-sm">Profile</span>
                  )}
                </div>
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name & Role */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Test User</h2>
              <p className="text-gray-500">Frontend Developer</p>
              <span className="mt-1 inline-block px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                Full-time
              </span>
            </div>
          </div>

          {/* Employee Info Right Side */}
          <div className="mt-6 md:mt-0 text-sm text-gray-600">
            <p><strong>Employee ID:</strong> EMP-2025-0001</p>
            <p><strong>Department:</strong> Software Development</p>
            <p><strong>Reports to:</strong> Admin</p>
          </div>
        </div>

        {/* Stats Cards with box shadow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center mt-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-xl font-bold text-gray-800">12</p>
            <p className="text-sm text-gray-500">Projects Completed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-xl font-bold text-gray-800">10 days</p>
            <p className="text-sm text-gray-500">Leave Balance</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-xl font-bold text-gray-800">5</p>
            <p className="text-sm text-gray-500">Team Members</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md col-span-2 sm:col-span-1">
            <p className="text-sm text-gray-500">Joined</p>
            <p className="text-md font-semibold text-gray-800">Feb 12, 2024</p>
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mt-6">
          <div>
            <p><strong>Email:</strong> testuser@officeerp.com</p>
            <p><strong>Phone:</strong> +91 9876543210</p>
          </div>
          <div>
            <p><strong>Location:</strong> Ghaziabad, India</p>
          </div>
        </div>

        {/* Current Projects */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
            Current Projects
          </h3>
          <ul className="space-y-5">
            {[
              {
                title: "ERP Dashboard Redesign",
                due: "Aug 15, 2025",
                status: "In Progress",
                statusColor: "bg-yellow-100 text-yellow-700",
              },
              {
                title: "API Integration",
                due: "Sep 30, 2025",
                status: "Planning",
                statusColor: "bg-blue-100 text-blue-700",
              },
              {
                title: "Mobile App Development",
                due: "Dec 1, 2025",
                status: "Planning",
                statusColor: "bg-blue-100 text-blue-700",
              },
            ].map(({ title, due, status, statusColor }, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border rounded-md p-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-medium text-gray-700">{title}</p>
                  <p className="text-sm text-gray-500">Due: {due}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${statusColor}`}
                >
                  {status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
