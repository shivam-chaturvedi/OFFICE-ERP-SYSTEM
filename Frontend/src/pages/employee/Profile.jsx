import React, { useEffect, useState } from "react";
import config from "../../config";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";

const Profile = ({ user }) => {
  const [profileImage, setProfileImage] = useState(
    `${config.BACKEND_URL}${user.profile_image}`
  );
  const [employee, setEmployee] = useState({});
  const [members, setMembers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoader(true);
      const res = await fetch(
        `${config.BACKEND_URL}/api/users/upload-profile/${user._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: formData,
        }
      );
      const data = await res.json();

      if (res.ok) {
        const localURL = URL.createObjectURL(file);
        setProfileImage(localURL);

        setAlert({
          type: "success",
          message: data.message,
        });
      } else {
        setAlert({
          type: "error",
          message: data.message,
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message,
      });
    } finally {
      setLoader(false);
    }
  };

  const fetchEmployee = async () => {
    try {
      const res = await fetch(
        `${config.BACKEND_URL}/api/employees/${user._id}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEmployee(data.employee);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    if (employee?.tasks?.length > 0) {
      setMembers(employee?.tasks[0]?.team?.members);
    }
  }, [employee]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {loader && <Loader />}
      <Alert alert={alert} setAlert={setAlert} />
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
                      loading="lazy"
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
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-gray-500">{user.position}</p>
              <span className="mt-1 inline-block px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                Full-time
              </span>
            </div>
          </div>

          {/* Employee Info Right Side */}
          <div className="uppercase ml-2 text-lg font-semibold  mt-6 md:mt-0 text-gray-600">
            <p>
              <strong>Employee ID:</strong>
              {user._id}
            </p>
            <p className="text-purple-400">
              <strong>Department:</strong> {employee?.department?.name || "N/A"}
            </p>
            <p>
              <strong>Reports to:</strong> Admin
            </p>
          </div>
        </div>

        {/* Stats Cards with box shadow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center mt-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-xl font-bold text-gray-800">
              {employee?.tasks?.length || 0}
            </p>
            <p className="text-sm text-gray-500">Task Assigned</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p
              className={`text-xl font-bold text-gray-800 ${
                employee?.status == "Active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {employee?.status}
            </p>
            <p className="text-sm text-gray-500">Status</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-xl font-bold text-gray-800">
              {members.length || 0}
            </p>
            <p className="text-sm text-gray-500">Team Members</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md col-span-2 sm:col-span-1">
            <p className="text-sm text-gray-500">Joined</p>
            <p className="text-md font-semibold text-gray-800">
              {new Date(employee?.date_of_joining).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="uppercase ml-2 text-lg font-semibold grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mt-6">
          <div>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          </div>
          <div>
            <p>
              <strong>Location:</strong> {user.address?.city} ,{" "}
              {user.address?.state} , {user.address?.country}
            </p>
          </div>
        </div>

        {/* Current Projects */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
            Current Projects
          </h3>
          <ul className="space-y-5 ">
            {employee?.tasks?.map(({ title, deadline, status }, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border rounded-md p-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-medium capitalize text-lg text-gray-700 ">
                    {title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(deadline).toString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    status == "pending"
                      ? "bg-red-600 text-white"
                      : "bg-green-600 text-black"
                  }  uppercase`}
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
