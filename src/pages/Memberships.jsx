import React from 'react';

// Hardcoded membership data with studentName and course
const memberships = [
  {
    id: 1,
    studentName: 'John Doe',
    course: 'Intro to Coding',
    price: 9.99,
    features: ['Access to core courses', 'Community forums', 'Monthly quizzes'],
    status: 'Active',
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    course: 'Web Development Pro',
    price: 19.99,
    features: ['All Basic features', 'Live webinars', '1:1 mentor sessions'],
    status: 'Active',
  },
  {
    id: 3,
    studentName: 'Alex Johnson',
    course: 'Enterprise Learning',
    price: 49.99,
    features: ['All Pro features', 'Custom course creation', 'Priority support'],
    status: 'Inactive',
  },
];

const Memberships = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">All Memberships</h1>
      <p className="text-gray-600 mb-8 text-center">
        Explore our membership plans to find the perfect fit for your learning journey.
      </p>

      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Course</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Features</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => (
              <tr key={membership.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-800">{membership.studentName}</td>
                <td className="p-4 text-gray-800">{membership.course}</td>
                <td className="p-4 text-gray-800">${membership.price.toFixed(2)}</td>
                <td className="p-4 text-gray-600">
                  <ul className="list-disc list-inside">
                    {membership.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      membership.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {membership.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for smaller screens */}
      <div className="md:hidden grid gap-6">
        {memberships.map((membership) => (
          <div
            key={membership.id}
            className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{membership.studentName}</h2>
            <p className="text-gray-600 mb-2">{membership.course}</p>
            <p className="text-gray-600 mb-2">
              <span className="font-bold">${membership.price.toFixed(2)}</span>
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              {membership.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <p className="mb-4">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  membership.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {membership.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memberships;