import React, { useEffect, useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading"; // Import the Loading component

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 w-full">{children}</div>
);


const InfoCard = ({ title, value, link, to }) => (
  <Card className="flex flex-col items-center justify-between h-[100px] p-4">
    <div className="flex flex-col  h-[100px]">
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <div className="text-3xl font-bold">{value}</div>
    </div>
    <Link
      to={to}
      className="text-sm text-teal-500 mt-2 hover:underline  border-gray-200 pt-1 w-full text-center"
    >
      {link} →
    </Link>
  </Card>
);

const UserList = ({ title, users }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        
      </div>
      <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between p-2 rounded-xl transition hover:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || "https://via.placeholder.com/36"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-9 h-9 rounded-full"
              />
              <div>
                <div className="font-medium text-sm">{`${user.firstName} ${user.lastName}`}</div>
                <div className="text-xs text-gray-500">
                  {user.company || user.school || user.role}
                </div>
              </div>
            </div>
            <div className="relative">
              <MoreVertical
                size={16}
                className="cursor-pointer text-gray-500"
                onClick={() =>
                  setOpenMenuId(openMenuId === user._id ? null : user._id)
                }
              />
              {openMenuId === user._id && (
                <div
                  ref={(el) => (menuRefs.current[user._id] = el)}
                  className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4"
                >
                  <h4 className="text-sm font-semibold mb-2">User Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>ID:</strong> {user._id}
                    </p>
                    <p>
                      <strong>Name:</strong> {user.firstName} {user.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Role:</strong>{" "}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </p>
                    {user.company && (
                      <p>
                        <strong>Company:</strong> {user.company}
                      </p>
                    )}
                    {user.school && (
                      <p>
                        <strong>School:</strong> {user.school}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
        {users.length === 0 && (
          <li className="text-center text-gray-500 py-2">No {title.toLowerCase()} found</li>
        )}
      </ul>
      <div className="mt-4 flex justify-end ">
        <Link
          to={title === "Instructors" ? "/manage-instructor" : "/manage-student"}
          className="w-32 h-7 shadow shadow-black rounded text-sm card-bg text-white hover:bg-teal-600 flex items-center justify-center"
        >
          Manage {title}
        </Link>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #49BBBD;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3a9a9b;
        }
      `}</style>
    </Card>
  );
};

export default function Dashboard() {
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 6; // Users per list

  const token = localStorage.getItem("authToken");

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format number
  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const axiosInstance = axios.create({
          baseURL: "https://lms-backend-flwq.onrender.com/api/v1/admin",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Fetch instructors
        // console.log(`Fetching instructors: limit=${limit}`);
        const instructorResponse = await axiosInstance.get(
          `/users/instructors?limit=${limit}`
        );
        // console.log("Instructor response:", instructorResponse.data);
        setInstructors(instructorResponse.data.data);

        // Fetch students
        // console.log(`Fetching students: limit=${limit}`);
        const studentResponse = await axiosInstance.get(
          `/users/students?limit=${limit}`
        );
        // console.log("Student response:", studentResponse.data);
        setStudents(studentResponse.data.data);

        // Fetch total revenue
        // console.log("Fetching total revenue");
        const revenueResponse = await axiosInstance.get("/analytics/revenue");
        // console.log("Revenue response:", revenueResponse.data);
        setTotalRevenue(revenueResponse.data.data.totalRevenue || 0);

        // Fetch total enrollments
        // console.log("Fetching total enrollments");
        const enrollmentResponse = await axiosInstance.get("/analytics/total-enrollments");
        // console.log("Enrollment response:", enrollmentResponse.data);
        setTotalEnrollments(enrollmentResponse.data.data.totalEnrollments || 0);

        setLoading(false);
      } catch (error) {
        // console.error("Error fetching data:", error);
        const errorMessage =
          error.response?.status === 401
            ? "Unauthorized: Please check your token or log in again."
            : "Failed to fetch data. Please try again later.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("No authentication token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-6 text-gray-800 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 mt-5 space-y-6 bg-gray-50 min-h-screen">
      {/* Info Cards */}
      <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
        <InfoCard
          title="Revenues"
          value={formatCurrency(totalRevenue)}
          link="Revenues report"
          to="/revenues-report"
        />
        <InfoCard
          title="Total Enrollment"
          value={formatNumber(totalEnrollments)}
          link="All Enrollments"
          to="/memberships"
        />
      </div>

      {/* Instructors & Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserList title="Instructors" users={instructors} />
        <UserList title="Students" users={students} />
      </div>
    </div>
  );
}