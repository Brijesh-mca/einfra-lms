import React from 'react';
import { instructors, students } from '../data/activities';

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-200 border text-green-700';
    case 'Pending':
      return 'bg-red-200 border text-red-700';
    case 'Uploaded':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
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
              className="px-3 py-1 border border-blue-500 rounded w-full sm:w-auto"
            />
            <select className="px-2 py-1 border border-blue-500 rounded w-full sm:w-auto">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 whitespace-nowrap">Users Name</th>
                <th className="whitespace-nowrap">Phone Number</th>
                <th className="whitespace-nowrap">Email</th>
                <th className="whitespace-nowrap">Courses</th>
                <th className="whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((inst) => (
                <tr key={inst.id}>
                  <td className="py-3 whitespace-nowrap">{inst.name}</td>
                  <td className="whitespace-nowrap">{inst.phone}</td>
                  <td className="whitespace-nowrap">{inst.email}</td>
                  <td className="whitespace-nowrap">{inst.course}</td>
                  <td className="whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(inst.status)}`}>
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
              className={`w-8 h-8 rounded ${
                n === 1 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-800'
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
              className="px-3 py-1 border border-blue-500 rounded w-full sm:w-auto"
            />
            <select className="px-2 py-1 border border-blue-500 rounded w-full sm:w-auto">
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2 whitespace-nowrap">Users Name</th>
                <th className="whitespace-nowrap">Phone Number</th>
                <th className="whitespace-nowrap">Email</th>
                <th className="whitespace-nowrap">Assignment</th>
                <th className="whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stud) => (
                <tr key={stud.id}>
                  <td className="py-3 whitespace-nowrap">{stud.name}</td>
                  <td className="whitespace-nowrap">{stud.phone}</td>
                  <td className="whitespace-nowrap">{stud.email}</td>
                  <td className="whitespace-nowrap">{stud.assignment}</td>
                  <td className="whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(stud.status)}`}>
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
              className={`w-8 h-8 rounded ${
                n === 1 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-800'
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
