import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
export default function Activities() {
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructorSearch, setInstructorSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [instructorSort, setInstructorSort] = useState("Newest");
  const [studentSort, setStudentSort] = useState("Newest");
  const [limit] = useState(5); // Strictly 5 items

  const token = localStorage.getItem("authToken");

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Format date
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  // Fetch data without sorting parameters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const axiosInstance = axios.create({
          baseURL:
            "https://lms-backend-flwq.onrender.com/api/v1/admin/analytics",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Fetch data without sort parameters
        const instructorResponse = await axiosInstance.get(
          `/instructor-activity?limit=${limit}`
        );
        const instructorData = instructorResponse.data.data.slice(0, 5);

        const studentResponse = await axiosInstance.get(
          `/student-activity?limit=${limit}`
        );
        const studentData = studentResponse.data.data.slice(0, 5);

        const mappedInstructors = instructorData.map((inst) => ({
          id: inst._id,
          name: `${inst.instructor.firstName} ${inst.instructor.lastName}`,
          email: inst.instructor.email,
          course: inst.title,
          createdAt: inst.createdAt,
        }));

        const mappedStudents = studentData.map((stud) => ({
          id: stud._id,
          name: `${stud.student.firstName} ${stud.student.lastName}`,
          email: stud.student.email,
          assignment: stud.course ? stud.course.title : "No Course Assigned",
          createdAt: stud.createdAt || new Date().toISOString(),
        }));

        setInstructors(mappedInstructors);
        setStudents(mappedStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.response || error);
        const errorMessage =
          error.response?.data?.message ||
          (error.response?.status === 401
            ? "Unauthorized: Please check your token or log in again."
            : "Failed to fetch data. Please try again later.");
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
  }, [token, limit]); // Removed instructorSort and studentSort from dependencies

  // Sort instructors and students when sort state changes
  useEffect(() => {
    const sortedInstructors = [...instructors].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return instructorSort === "Newest" ? dateB - dateA : dateA - dateB;
    });

    const sortedStudents = [...students].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return studentSort === "Newest" ? dateB - dateA : dateA - dateB;
    });

    setInstructors(sortedInstructors);
    setStudents(sortedStudents);
  }, [instructorSort, studentSort]); // Trigger sorting when sort state changes

  const handleInstructorSearch = debounce((value) => {
    setInstructorSearch(value);
  }, 300);

  const handleStudentSearch = debounce((value) => {
    setStudentSearch(value);
  }, 300);

  const filteredInstructors = instructors.filter(
    (inst) =>
      inst.name.toLowerCase().includes(instructorSearch.toLowerCase()) ||
      inst.email.toLowerCase().includes(instructorSearch.toLowerCase()) ||
      inst.id.toLowerCase().includes(instructorSearch.toLowerCase())
  );

  const filteredStudents = students.filter(
    (stud) =>
      stud.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      stud.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      stud.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
          
          <div className="flex flex-row justify-between items-center mb-6 md:mb-8">
  <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
    Activities
  </h1>
  <div className="flex flex-row gap-2 sm:gap-4">
    <Link
      to="/instructor-activity"
      className="px-3 sm:px-4 py-1 sm:py-2 card-bg border text-white shadow-md shadow-black font-bold rounded hover:bg-cyan-600 text-sm flex items-center justify-center"
    >
      <span className="block sm:hidden"> <FaChalkboardTeacher className="text-lg" /></span>
      <span className="hidden sm:block">Instructor Activity</span>
    </Link>
    <Link
      to="/student-activity"
      className="px-3 sm:px-4 py-1 sm:py-2 card-bg border text-white shadow-md shadow-black font-bold rounded hover:bg-cyan-600 text-sm flex items-center justify-center"
    >
      <span className="block sm:hidden"><FaUserGraduate className="text-lg" /></span>
      <span className="hidden sm:block">Student Activity</span>
    </Link>
  </div>
</div>

      {/* Instructors Section */}
      <section className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-cyan-600">
            Instructors
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              onChange={(e) => handleInstructorSearch(e.target.value)}
              className="px-3 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={instructorSort}
              onChange={(e) => setInstructorSort(e.target.value)}
              className="px-2 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {filteredInstructors.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No instructors found
          </div>
        )}

        {/* Mobile View (below md) */}
        <div className="md:hidden grid gap-4">
          {filteredInstructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-800">
                  {inst.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">ID:</span> {inst.id}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {inst.email}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Course:</span> {inst.course}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Created:</span>{" "}
                {formatDate(inst.createdAt)}
              </p>
            </div>
          ))}
        </div>

        {/* Tablet View (md to lg) */}
        <div className="hidden md:block lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredInstructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {inst.name}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <p className="font-semibold">ID:</p>
                  <p className="truncate">{inst.id}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p className="truncate">{inst.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Course:</p>
                  <p className="truncate">{inst.course}</p>
                </div>
                <div>
                  <p className="font-semibold">Created:</p>
                  <p>{formatDate(inst.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (lg and above) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 whitespace-nowrap px-4">Users Name</th>
                <th className="whitespace-nowrap px-4">ID</th>
                <th className="whitespace-nowrap px-4">Email</th>
                <th className="whitespace-nowrap px-4">Courses</th>
                <th className="whitespace-nowrap px-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstructors.map((inst) => (
                <tr key={inst.id}>
                  <td className="py-3 whitespace-nowrap px-4">{inst.name}</td>
                  <td className="whitespace-nowrap px-4">{inst.id}</td>
                  <td className="whitespace-nowrap px-4">{inst.email}</td>
                  <td className="whitespace-nowrap px-4">{inst.course}</td>
                  <td className="whitespace-nowrap px-4">
                    {formatDate(inst.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Students Section */}
      <section className="bg-white p-4 md:p-6 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-cyan-600">
            Students
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              onChange={(e) => handleStudentSearch(e.target.value)}
              className="px-3 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={studentSort}
              onChange={(e) => setStudentSort(e.target.value)}
              className="px-2 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No students found
          </div>
        )}

        {/* Mobile View (below md) */}
        <div className="md:hidden grid gap-4">
          {filteredStudents.map((stud) => (
            <div
              key={stud.id}
              className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-800">
                  {stud.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">ID:</span> {stud.id}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {stud.email}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Assignment:</span>{" "}
                {stud.assignment}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Created:</span>{" "}
                {formatDate(stud.createdAt)}
              </p>
            </div>
          ))}
        </div>

        {/* Tablet View (md to lg) */}
        <div className="hidden md:block lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredStudents.map((stud) => (
            <div
              key={stud.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {stud.name}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <p className="font-semibold">ID:</p>
                  <p className="truncate">{stud.id}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p className="truncate">{stud.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Assignment:</p>
                  <p className="truncate">{stud.assignment}</p>
                </div>
                <div>
                  <p className="font-semibold">Created:</p>
                  <p>{formatDate(stud.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (lg and above) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 whitespace-nowrap px-4">Users Name</th>
                <th className="whitespace-nowrap px-4">ID</th>
                <th className="whitespace-nowrap px-4">Email</th>
                <th className="whitespace-nowrap px-4">Assignment</th>
                <th className="whitespace-nowrap px-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stud) => (
                <tr key={stud.id}>
                  <td className="py-3 whitespace-nowrap px-4">{stud.name}</td>
                  <td className="whitespace-nowrap px-4">{stud.id}</td>
                  <td className="whitespace-nowrap px-4">{stud.email}</td>
                  <td className="whitespace-nowrap px-4">{stud.assignment}</td>
                  <td className="whitespace-nowrap px-4">
                    {formatDate(stud.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
