import React, { useState, useEffect } from "react";
import axios from "axios";

const Memberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true);
        const axiosInstance = axios.create({
          baseURL: "https://lms-backend-flwq.onrender.com/api/v1/admin",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // TODO: Replace '/subscriptions' with the correct endpoint (e.g., '/enrollments')
        console.log("Fetching memberships from /subscriptions");
        const response = await axiosInstance.get("/analytics/drop-out");
        console.log("Memberships response:", response.data);

        // Expect response like: { success: true, data: [{ id, studentName, course, price, features, status }] }
        setMemberships(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching memberships:", error);
        let errorMessage = "Failed to fetch memberships. Please try again later.";
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "Unauthorized: Please check your token or log in again.";
          } else if (error.response.status === 404) {
            errorMessage = "Membership endpoint not found. Please check the API endpoint.";
          } else {
            errorMessage = `Error ${error.response.status}: ${error.response.data.message || "Unknown error"}`;
          }
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (token) {
      fetchMemberships();
    } else {
      setError("No authentication token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div className="p-6 text-gray-800 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-gray-800 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-500 mb-6 text-center">Lost Memberships</h1>
      <p className="text-gray-600 mb-8 text-center">
        Explore our membership plans to find the perfect fit for your learning journey.
      </p>

      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="card-bg text-white">
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Course</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Features</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {memberships.length > 0 ? (
              memberships.map((membership) => (
                <tr key={membership.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{membership.studentName || "N/A"}</td>
                  <td className="p-4 text-gray-800">{membership.course || "No Course"}</td>
                  <td className="p-4 text-gray-800">
                    {membership.price ? `$${membership.price.toFixed(2)}` : "N/A"}
                  </td>
                  <td className="p-4 text-gray-600">
                    <ul className="list-disc list-inside">
                      {membership.features && membership.features.length > 0 ? (
                        membership.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))
                      ) : (
                        <li>No features available</li>
                      )}
                    </ul>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        membership.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {membership.status || "Unknown"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No memberships found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for smaller screens */}
      <div className="md:hidden grid gap-6">
        {memberships.length > 0 ? (
          memberships.map((membership) => (
            <div
              key={membership.id}
              className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {membership.studentName || "N/A"}
              </h2>
              <p className="text-gray-600 mb-2">{membership.course || "No Course"}</p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">
                  {membership.price ? `$${membership.price.toFixed(2)}` : "N/A"}
                </span>
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                {membership.features && membership.features.length > 0 ? (
                  membership.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                ) : (
                  <li>No features available</li>
                )}
              </ul>
              <p className="mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    membership.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {membership.status || "Unknown"}
                </span>
              </p>
            </div>
          ))
        ) : (
          <div className="p-6 bg-white border rounded-lg shadow-sm text-center text-gray-500">
            No memberships found
          </div>
        )}
      </div>
    </div>
  );
};

export default Memberships;