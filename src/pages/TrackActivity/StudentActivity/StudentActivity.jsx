import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';

export default function StudentActivity() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');
  const [limit] = useState(100); // Fetch all entries

  const token = localStorage.getItem('authToken');

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
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const axiosInstance = axios.create({
          baseURL: 'https://lms-backend-flwq.onrender.com/api/v1/admin/analytics',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const sortParam = sort === 'Newest' ? 'createdAt:desc' : 'createdAt:asc';
        const response = await axiosInstance.get(
          `/student-activity?limit=${limit}&sort=${sortParam}`
        );
        const data = response.data.data;

        const mappedStudents = data.map((stud) => ({
          id: stud._id,
          name: `${stud.student.firstName} ${stud.student.lastName}`,
          email: stud.student.email,
          assignment: stud.course ? stud.course.title : 'No Course Assigned',
          createdAt: stud.createdAt || new Date().toISOString(),
        }));

        const sortedStudents = mappedStudents.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sort === 'Newest' ? dateB - dateA : dateA - dateB;
        });

        setStudents(sortedStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.response || error);
        const errorMessage =
          error.response?.data?.message ||
          (error.response?.status === 401
            ? 'Unauthorized: Please check your token or log in again.'
            : 'Failed to fetch data. Please try again later.');
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
  }, [token, sort, limit]);

  const handleSearch = debounce((value) => {
    setSearch(value);
  }, 300);

  const filteredStudents = students.filter(
    (stud) =>
      stud.name.toLowerCase().includes(search.toLowerCase()) ||
      stud.email.toLowerCase().includes(search.toLowerCase()) ||
      stud.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <div className="flex items-center gap-4 mb-6 md:mb-8 mt-10">
        <Link
          to="/track-activities"
          className="flex items-center px-3 py-2 card-bg text-white rounded hover:bg-cyan-600 text-sm"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">
          Student Activity
        </h1>
      </div>

      <section className="bg-white p-4 md:p-6 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-cyan-600">Students</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email, or ID"
              onChange={(e) => handleSearch(e.target.value)}
              className="px-3 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-2 py-1 border border-blue-500 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center text-gray-500 py-4">No students found</div>
        )}

        {/* Mobile View (below md) */}
        <div className="md:hidden grid gap-4">
          {filteredStudents.map((stud) => (
            <div
              key={stud.id}
              className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-800">{stud.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">ID:</span> {stud.id}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Email:</span> {stud.email}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Assignment:</span> {stud.assignment}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Created:</span> {formatDate(stud.createdAt)}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{stud.name}</h3>
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
                  <td className="whitespace-nowrap px-4">{formatDate(stud.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}