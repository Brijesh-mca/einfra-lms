import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';

export default function InstructorActivity() {
  const [instructorsCache, setInstructorsCache] = useState([]);
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

  // Debounced search handler
  const handleSearch = debounce((value) => {
    setSearch(value);
  }, 300);

  // Format date
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  // Fetch data without sorting parameters
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

        // Fetch data without sort parameter
        const response = await axiosInstance.get(`/instructor-activity?limit=${limit}`);
        const data = response.data.data;

        const mappedInstructors = data.map((inst) => ({
          id: inst._id,
          name: `${inst.instructor.firstName} ${inst.instructor.lastName}`,
          email: inst.instructor.email,
          course: inst.title,
          createdAt: inst.createdAt,
        }));

        setInstructorsCache(mappedInstructors);
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

    if (token && !instructorsCache.length) {
      fetchData();
    } else if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
    } else {
      setLoading(false); // Use cached data
    }
  }, [token, limit, instructorsCache.length]); // Removed sort and cacheKey from dependencies

  // Sort instructors when sort state changes
  useEffect(() => {
    const sortedInstructors = [...instructorsCache].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sort === 'Newest' ? dateB - dateA : dateA - dateB;
    });

    setInstructorsCache(sortedInstructors);
  }, [sort]); // Trigger sorting when sort state changes

  const filteredInstructors = instructorsCache.filter(
    (inst) =>
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.email.toLowerCase().includes(search.toLowerCase()) ||
      inst.id.toLowerCase().includes(search.toLowerCase())
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
          Instructor Activity
        </h1>
      </div>

      <section className="bg-white p-4 md:p-6 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-cyan-600">Instructors</h2>
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

        {filteredInstructors.length === 0 && (
          <div className="text-center text-gray-500 py-4">No instructors found</div>
        )}

        {/* Mobile View (below md) */}
        <div className="md:hidden grid gap-4">
          {filteredInstructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-800">{inst.name}</h3>
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
                <span className="font-semibold">Created:</span> {formatDate(inst.createdAt)}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{inst.name}</h3>
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
                  <td className="whitespace-nowrap px-4">{formatDate(inst.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}