import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";

const Login = ({setUser}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({
    type: "", 
    message: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setAlert({
        type: "error",
        message: "Please fill all required fields.",
      });
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        setUser(data.user || {});

        setAlert({
          type: "success",
          message: "Login Successful!",
        });

        navigate("/");
      } else {
        const errorData = await res.json();
        setAlert({
          type: "error",
          message: errorData.message || "Login Failed.",
        });
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: "Network error. Please try again.",
      });
    }

    setFormData({ email: "", password: "" });
  };

  const renderAlert = () => {
    if (!alert.message) return null;

    const baseClass =
      "p-4 mb-4 text-sm rounded-lg font-medium text-center";
    const successClass =
      "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400";
    const errorClass =
      "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400";

    return (
      <div
        className={`${baseClass} ${
          alert.type === "success" ? successClass : errorClass
        }`}
        role="alert"
      >
        {alert.message}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Welcome to TAC Services Pvt. Ltd
        </h1>
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to ERP</h2>

        {renderAlert()}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-md hover:from-purple-600 hover:to-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link
            to="/forgot-password"
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
