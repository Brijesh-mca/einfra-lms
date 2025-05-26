import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Memberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [filteredMemberships, setFilteredMemberships] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Debounce the search query with 300ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch memberships
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

        const response = await axiosInstance.get("/analytics/enrollments");
        const mappedMemberships = response.data.data.map((enrollment) => ({
          id: enrollment._id,
          studentName: enrollment.studentName,
          studentId: enrollment.studentId,
          studentEmail: enrollment.studentEmail,
          courseTitle: enrollment.courseTitle,
        }));

        setMemberships(mappedMemberships);
        setFilteredMemberships(mappedMemberships); // Initialize filtered data
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

  // Filter memberships based on debounced search query
  useEffect(() => {
    const filtered = memberships.filter((membership) =>
      [
        membership.studentName,
        membership.studentEmail,
        membership.courseTitle,
      ].some((field) =>
        field?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    );
    setFilteredMemberships(filtered);
  }, [debouncedSearchQuery, memberships]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-6 text-gray-800 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 card-bg text-white font-bold rounded hover:bg-gray-300 transition"
          >
            Back
          </button>
          <h1 className="text-3xl font-bold text-cyan-500 text-center sm:text-left">
            All Enrollment
          </h1>
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 text-gray-800"
        />
      </div>
      <p className="text-gray-600 mb-8 text-center">
        View enrollment details for your courses.
      </p>

      {/* Table for desktop screens (lg and above) */}
      <div className="hidden lg:block overflow-x-auto">
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
            {filteredMemberships.length > 0 ? (
              filteredMemberships.map((membership) => (
                <tr key={membership.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{membership.studentName || "N/A"}</td>
                  <td className="p-4 text-gray-800">{membership.studentId || "N/A"}</td>
                  <td className="p-4 text-gray-800">{membership.studentEmail || "N/A"}</td>
                  <td className="p-4 text-gray-800">{membership.courseTitle || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No enrollments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for tablet screens (sm to lg) */}
      <div className="hidden sm:block lg:hidden grid gap-4 sm:grid-cols-2">
        {filteredMemberships.length > 0 ? (
          filteredMemberships.map((membership) => (
            <div
              key={membership.id}
              className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {membership.courseTitle || "N/A"}
              </h2>
              <p className="text-gray-600 mb-1">
                <span className="font-bold">Student Name:</span>{" "}
                {membership.studentName || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-bold">Student ID:</span>{" "}
                {membership.studentId || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-bold">Student Email:</span>{" "}
                {membership.studentEmail || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <div className="p-4 bg-white border rounded-lg shadow-sm text-center text-gray-500 col-span-2">
            No enrollments found
          </div>
        )}
      </div>

      {/* Cards for mobile screens (below sm) */}
      <div className="sm:hidden grid gap-6">
        {filteredMemberships.length > 0 ? (
          filteredMemberships.map((membership) => (
            <div
              key={membership.id}
              className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {membership.courseTitle || "N/A"}
              </h2>
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