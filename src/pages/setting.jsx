import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading"; // Import the Loading component


const AdminSettings = () => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          "https://lms-backend-flwq.onrender.com/api/v1/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success && response.data.data) {
          const { data } = response.data;
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            avatar: data.avatar || "",
            updatedAt: data.updatedAt || new Date().toISOString(),
          });
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditable(!editable);
    setUpdateStatus(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.avatar,
      };

      const response = await axios.put(
        "https://lms-backend-flwq.onrender.com/api/v1/auth/updatedetails",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUpdateStatus("Profile updated successfully!");
        setFormData({
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        setEditable(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      setUpdateStatus(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-sm sm:text-base">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="max-w-5xl sm:max-w-6xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md">
        {/* Header */}
        <div className="text-center h-16 sm:h-20 w-full rounded-xl bg-gradient-to-r from-blue-100 to-yellow-100 mb-6 sm:mb-8">
          <h2  className="pt-3 text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
            Welcome, {formData.firstName}{} {formData.lastName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Gradient Header */}
        {/* <div className="h-16 sm:h-20 w-full rounded-xl bg-gradient-to-r from-blue-100 to-yellow-100 mb-6 sm:mb-8" /> */}

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img
              src={formData.avatar || "https://via.placeholder.com/80"}
              alt="Profile"
              className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border border-gray-200 rounded-full object-cover"
            />
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {formData.email}
              </p>
            </div>
          </div>

          <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleEditToggle}
              className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
            >
              {editable ? "Cancel" : "Edit"}
            </button>
            {editable && (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-700 transition text-xs sm:text-sm"
              >
                Save
              </button>
            )}
          </div>
        </div>

        {/* Update Status */}
        {updateStatus && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-xs sm:text-sm z-[110] ${
              updateStatus.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {updateStatus}
          </div>
        )}

        {/* Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!editable}
              placeholder="First Name"
              className="mt-1 block w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!editable}
              placeholder="Last Name"
              className="mt-1 block w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editable}
              placeholder="Email"
              className="mt-1 block w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editable}
              placeholder="Phone Number"
              className="mt-1 block w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-xs sm:text-sm"
            />
          </div>

          
        </div>

        {/* Email Section */}
        <div className="mt-6 sm:mt-10">
          <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            My Email Address
          </h4>
          <div className="flex items-center space-x-3 sm:space-x-4 bg-blue-50 p-3 sm:p-4 rounded-xl">
            <div className="bg-blue-600 text-white rounded-full p-1.5 sm:p-2 text-base sm:text-lg">
              📧
            </div>
            <div>
              <p className="font-medium text-gray-700 text-xs sm:text-sm">
                {formData.email}
              </p>
              <p className="text-xs text-gray-500">
                Last updated:{" "}
                {new Date(formData.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
