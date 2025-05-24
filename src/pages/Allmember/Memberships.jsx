import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Loading"
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

        // console.log("Fetching memberships from /analytics/enrollments");
        const response = await axiosInstance.get("/analytics/enrollments");
        // console.log("Memberships response:", response.data);

        // Map response data to include only specified fields
        const mappedMemberships = response.data.data.map((enrollment) => ({
          id: enrollment._id,
          studentName: enrollment.studentName,
          studentId: enrollment.studentId,
          studentEmail: enrollment.studentEmail,
          courseTitle: enrollment.courseTitle,
        }));

        setMemberships(mappedMemberships);
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
    return <Loading />;
  }

  if (error) {
    return <div className="p-6 text-gray-800 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold clr 500 mb-6 text-center">All Enrollment </h1>
      <p className="text-gray-600 mb-8 text-center">
        View enrollment details for your courses.
      </p>

      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Student ID</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Student Email</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Course Title</th>
            </tr>
          </thead>
          <tbody>
            {memberships.length > 0 ? (
              memberships.map((membership) => (
                <tr key={membership.id} className="border-b hover:bg-gray-50">
                  
                  <td className="p-4 text-gray-800">{membership.studentName || "N/A"}</td>
                  <td className="p-4 text-gray-800">{membership.studentId || "N/A"}</td>
                  <td className="p-4 text-gray-800">{membership.studentEmail || "N/A"}</td>
                  <td className="p-4 text-gray-800">{membership.courseTitle || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No enrollments found
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
                {membership.courseTitle || "N/A"}
              </h2>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">ID:</span> {membership.id || "N/A"}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Student Name:</span>{" "}
                {membership.studentName || "N/A"}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Student ID:</span>{" "}
                {membership.studentId || "N/A"}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Student Email:</span>{" "}
                {membership.studentEmail || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <div className="p-6 bg-white border rounded-lg shadow-sm text-center text-gray-500">
            No enrollments found
          </div>
        )}
      </div>
    </div>
  );
};

export default Memberships;