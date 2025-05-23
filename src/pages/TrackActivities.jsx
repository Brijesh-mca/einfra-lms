import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Activities() {
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructorSearch, setInstructorSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [instructorPage, setInstructorPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const [instructorTotal, setInstructorTotal] = useState(0);
  const [studentTotal, setStudentTotal] = useState(0);
  const [limit] = useState(10); // Items per page

  // Replace with your actual token retrieval logic
  const token = localStorage.getItem('authToken'); // Adjust as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Configure Axios with default headers
        const axiosInstance = axios.create({
          baseURL: 'https://lms-backend-flwq.onrender.com/api/v1/admin/analytics',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch instructor data with pagination
        const instructorResponse = await axiosInstance.get(`/instructor-activity?page=${instructorPage}&limit=${limit}`);
        const instructorData = instructorResponse.data;

        // Fetch student data with pagination
        const studentResponse = await axiosInstance.get(`/student-activity?page=${studentPage}&limit=${limit}`);
        const studentData = studentResponse.data;

        // Map instructor data
        const mappedInstructors = instructorData.data.map((inst) => ({
          id: inst._id,
          name: `${inst.instructor.firstName} ${inst.instructor.lastName}`,
          email: inst.instructor.email,
          course: inst.title,
        }));

        // Map student data
        const mappedStudents = studentData.data.map((stud) => ({
          id: stud._id,
          name: `${stud.student.firstName} ${stud.student.lastName}`,
          email: stud.student.email,
          assignment: stud.course ? stud.course.title : 'No Course Assigned',
        }));

        setInstructors(mappedInstructors);
        setStudents(mappedStudents);
        setInstructorTotal(instructorData.total || mappedInstructors.length);
        setStudentTotal(studentData.total || mappedStudents.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        const errorMessage = error.response?.data?.message || 
                            error.response?.status === 401 
                            ? 'Unauthorized: Please check your token or log in again.' 
                            : 'Failed to fetch data. Please try again later.';
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError('No authentication token found. Please log in.');
      setLoading(false);
    }
  }, [token, instructorPage, studentPage, limit]);

  // Filter instructors based on search input
  const filteredInstructors = instructors.filter(
    (inst) =>
      inst.name.toLowerCase().includes(instructorSearch.toLowerCase()) ||
      inst.email.toLowerCase().includes(instructorSearch.toLowerCase()) ||
      inst.id.toLowerCase().includes(instructorSearch.toLowerCase())
  );

  // Filter students based on search input
  const filteredStudents = students.filter(
    (stud) =>
      stud.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      stud.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      stud.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Generate pagination buttons
  const renderPagination = (total, currentPage, setPage) => {
    const totalPages = Math.ceil(total / limit);
    const pages = [];
    
    // Simple pagination logic: show first 4 pages, ellipsis, and last page
    const maxPagesToShow = 4;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`w-8 h-8 rounded text-sm ${
            i === currentPage ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(<span key="ellipsis" className="px-2">...</span>);
      pages.push(
        <button
          key={totalPages}
          onClick={() => setPage(totalPages)}
          className="w-8 h-8 rounded text-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
     <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 mt-10 text-center md:text-left">
  Activities
</h1>

      {/* Instructors Section */}
      <section className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-cyan-600">Instructors</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              value={instructorSearch}
              onChange={(e) => {
                setInstructorSearch(e.target.value);
                setInstructorPage(1); // Reset to first page on search
              }}
              className="px-3 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select className="px-2 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden grid gap-4">
          {filteredInstructors.map((inst) => (
            <div key={inst.id} className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-800">{inst.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">ID:</span> {inst.id}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {inst.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Course:</span> {inst.course}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 whitespace-nowrap px-4">Users Name</th>
                <th className="whitespace-nowrap px-4">ID</th>
                <th className="whitespace-nowrap px-4">Email</th>
                <th className="whitespace-nowrap px-4">Courses</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstructors.map((inst) => (
                <tr key={inst.id}>
                  <td className="py-3 whitespace-nowrap px-4">{inst.name}</td>
                  <td className="whitespace-nowrap px-4">{inst.id}</td>
                  <td className="whitespace-nowrap px-4">{inst.email}</td>
                  <td className="whitespace-nowrap px-4">{inst.course}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-500 mt-3">
          Showing data {(instructorPage - 1) * limit + 1} to{' '}
          {Math.min(instructorPage * limit, instructorTotal)} of {instructorTotal} entries
        </div>
        <div className="flex flex-wrap justify-end gap-2 mt-2">
          {renderPagination(instructorTotal, instructorPage, setInstructorPage)}
        </div>
      </section>

      {/* Students Section */}
      <section className="bg-white p-4 md:p-6 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-cyan-600">Students</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              value={studentSearch}
              onChange={(e) => {
                setStudentSearch(e.target.value);
                setStudentPage(1); // Reset to first page on search
              }}
              className="px-3 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select className="px-2 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden grid gap-4">
          {filteredStudents.map((stud) => (
            <div key={stud.id} className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-800">{stud.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">ID:</span> {stud.id}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {stud.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Assignment:</span> {stud.assignment}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 whitespace-nowrap px-4">Users Name</th>
                <th className="whitespace-nowrap px-4">ID</th>
                <th className="whitespace-nowrap px-4">Email</th>
                <th className="whitespace-nowrap px-4">Assignment</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stud) => (
                <tr key={stud.id}>
                  <td className="py-3 whitespace-nowrap px-4">{stud.name}</td>
                  <td className="whitespace-nowrap px-4">{stud.id}</td>
                  <td className="whitespace-nowrap px-4">{stud.email}</td>
                  <td className="whitespace-nowrap px-4">{stud.assignment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-500 mt-3">
          Showing data {(studentPage - 1) * limit + 1} to{' '}
          {Math.min(studentPage * limit, studentTotal)} of {studentTotal} entries
        </div>
        <div className="flex flex-wrap justify-end gap-2 mt-2">
          {renderPagination(studentTotal, studentPage, setStudentPage)}
        </div>
      </section>
    </div>
  );
}