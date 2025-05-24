import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from "../Loading"

export default function InstructorActivity() {
  const [instructors, setInstructors] = useState([]);
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const sortParam = sort === 'Newest' ? 'createdAt:desc' : 'createdAt:asc';
        const response = await axiosInstance.get(
          `/instructor-activity?limit=${limit}&sort=${sortParam}`
        );
        const data = response.data.data;
        console.log('Instructor data:', data); // Debug

        const mappedInstructors = data.map((inst) => ({
          id: inst._id,
          name: `${inst.instructor.firstName} ${inst.instructor.lastName}`,
          email: inst.instructor.email,
          course: inst.title,
          createdAt: inst.createdAt,
        }));

        // Client-side sorting as fallback
        const sortedInstructors = mappedInstructors.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sort === 'Newest' ? dateB - dateA : dateA - dateB;
        });

        setInstructors(sortedInstructors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.response || error);
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
  }, [token, sort, limit]);

  // Debounced search handler
  const handleSearch = debounce((value) => {
    setSearch(value);
  }, 300);

  // Filter instructors based on search input
  const filteredInstructors = instructors.filter(
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
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 mt-10 text-center md:text-left">
        Instructor Activity
      </h1>

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
          <div className="text-center text-gray-500 py-4">
            No instructors found
          </div>
        )}

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
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Course:</span> {inst.course}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Created:</span> {formatDate(inst.createdAt)}
              </p>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
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