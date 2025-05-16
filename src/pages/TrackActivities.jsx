import React from 'react';
import { instructors, students } from '../data/activities';

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 border-green-500 text-green-700';
    case 'Pending':
      return 'bg-red-100 border-red-500 text-red-700';
    case 'Uploaded':
      return 'bg-gray-100 border-gray-500 text-gray-700';
    default:
      return 'bg-gray-100 border-gray-500 text-gray-700';
  }
};

export default function Activities() {
  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Activities</h1>

      {/* Instructors Section */}
      <section className="bg-white p-4 md:p-6 rounded-2xl shadow mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Instructors</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
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
          {instructors.map((inst) => (
            <div key={inst.id} className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-800">{inst.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded border ${getStatusColor(inst.status)}`}
                >
                  {inst.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Phone:</span> {inst.phone}
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
                <th className="whitespace-nowrap px-4">Phone Number</th>
                <th className="whitespace-nowrap px-4">Email</th>
                <th className="whitespace-nowrap px-4">Courses</th>
                <th className="whitespace-nowrap px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((inst) => (
                <tr key={inst.id}>
                  <td className="py-3 whitespace-nowrap px-4">{inst.name}</td>
                  <td className="whitespace-nowrap px-4">{inst.phone}</td>
                  <td className="whitespace-nowrap px-4">{inst.email}</td>
                  <td className="whitespace-nowrap px-4">{inst.course}</td>
                  <td className="whitespace-nowrap px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded border ${getStatusColor(
                        inst.status
                      )}`}
                    >
                      {inst.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-500 mt-3">Showing data 1 to 3 of 256 entries</div>
        <div className="flex flex-wrap justify-end gap-2 mt-2">
          {[1, 2, 3, 4, '...', 40].map((n, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded text-sm ${
                n === 1 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      {/* Students Section */}
      <section className="bg-white p-4 md:p-6 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-teal-600">Active Members</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
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
          {students.map((stud) => (
            <div key={stud.id} className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-800">{stud.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded border ${getStatusColor(stud.status)}`}
                >
                  {stud.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Phone:</span> {stud.phone}
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
                <th className="whitespace-nowrap px-4">Phone Number</th>
                <th className="whitespace-nowrap px-4">Email</th>
                <th className="whitespace-nowrap px-4">Assignment</th>
                <th className="whitespace-nowrap px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stud) => (
                <tr key={stud.id}>
                  <td className="py-3 whitespace-nowrap px-4">{stud.name}</td>
                  <td className="whitespace-nowrap px-4">{stud.phone}</td>
                  <td className="whitespace-nowrap px-4">{stud.email}</td>
                  <td className="whitespace-nowrap px-4">{stud.assignment}</td>
                  <td className="whitespace-nowrap px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded border ${getStatusColor(
                        stud.status
                      )}`}
                    >
                      {stud.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-500 mt-3">Showing data 1 to 6 of 256 entries</div>
        <div className="flex flex-wrap justify-end gap-2 mt-2">
          {[1, 2, 3, 4, '...', 40].map((n, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded text-sm ${
                n === 1 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}