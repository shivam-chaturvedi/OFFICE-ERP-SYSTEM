import React, { useState } from "react";

const AdminProfile = ({ user }) => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 mt-6">
      {/* No white box wrapper */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center space-x-6">
          {/* Profile Image Upload */}
          <div className="relative w-28 h-28">
            <label htmlFor="profile-upload">
              <div className="w-28 h-28 rounded-full border-2 border-gray-400 flex items-center justify-center bg-gray-100 text-gray-500 cursor-pointer overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm">Admin</span>
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
            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-lg text-gray-600 capitalize">{user.role}</p>
            <span className="inline-block mt-2 px-4 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Admin Details Right */}
        <div className="mt-6 md:mt-0 text-gray-700 space-y-1 text-sm max-w-xs">
          <p>
            <strong>Admin ID:</strong> {user._id}
          </p>
          <p>
            <strong>Department:</strong> {user.department}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{user.employeeCount}</p>
          <p className="text-gray-500 text-sm">Total Employees</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{user.projectCount}</p>
          <p className="text-gray-500 text-sm">Projects</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{user.departmentCount}</p>
          <p className="text-gray-500 text-sm">Departments</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{user.pendingLeavesCount}</p>
          <p className="text-gray-500 text-sm">Leave Pending Approvals</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-12 max-w-3xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
          Recent Activity
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li>Approved leave request from Employee </li>
          <li>Updated project deadline for ERP Dashboard</li>
          <li>Added new user: Ravi Kumar</li>
          <li>Reviewed quarterly budget reports</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminProfile;
