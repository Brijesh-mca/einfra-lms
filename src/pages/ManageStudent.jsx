import React, { useState } from 'react';

const initialStudentsData = [
  {
    _id: "6819e09cc2c88d511699fdb9",
    firstName: "Jaya",
    lastName: "Prakasha",
    email: "jayp780884@gmail.com",
    phone: "1234567890",
    avatar: "default_avatar.jpg",
    role: "student",
    isVerified: true,
    isActive: true,
    skills: ["JavaScript", "React", "Node.js"],
    interests: ["Web Development", "Cloud Computing"],
    points: 0,
    approved: false,
    badges: [],
    enrolledCourses: [
      {
        course: "6821b1cac173175bd5fdd333",
        enrollmentDate: "2025-05-12T09:09:19.874Z",
        completed: false,
        progress: 0,
        _id: "6821babf9e8cce3246a8cf59"
      }
    ],
    createdAt: "2025-05-06T10:12:44.088Z",
    updatedAt: "2025-05-15T05:18:19.736Z",
    __v: 0,
    lastLogin: "2025-05-15T05:18:19.733Z",
    education: "M.Sc. Computer Science",
    occupation: "Senior Developer"
  },
  {
    _id: "681aed20251f8f1547a9690d",
    firstName: "Ruchi",
    lastName: "P",
    email: "p.ruchika142003@gmail.com",
    phone: "9876543210",
    avatar: "default_avatar.jpg",
    role: "student",
    isVerified: true,
    isActive: true,
    skills: ["JavaScript", "React", "Node.js"],
    interests: ["Web Development", "Cloud Computing"],
    points: 50,
    approved: false,
    badges: [
      {
        icon: "🔥",
        _id: "6821a846439e3ebad8f0a2c7",
        dateEarned: "2025-05-12T07:50:30.638Z"
      }
    ],
    enrolledCourses: [
      {
        progress: 0,
        course: "68219adb32c3e47a1f7fdf91",
        completed: false,
        _id: "6821a449439e3ebad8f0a2b7",
        enrollmentDate: "2025-05-12T07:33:29.188Z"
      },
      {
        course: "6821b1cac173175bd5fdd333",
        enrollmentDate: "2025-05-14T11:50:51.942Z",
        completed: false,
        progress: 0,
        _id: "6824839bb92be24f8f9615cd"
      },
      {
        course: "68248c91893182231678921a",
        enrollmentDate: "2025-05-15T05:01:03.454Z",
        completed: false,
        progress: 0,
        _id: "6825750fc1fbaf515e509800"
      },
      {
        course: "682585ffbf4b0f0399dc0249",
        enrollmentDate: "2025-05-15T07:28:50.881Z",
        completed: false,
        progress: 0,
        _id: "682597b2c819765747d76201"
      }
    ],
    createdAt: "2025-05-07T05:18:24.301Z",
    updatedAt: "2025-05-15T07:31:24.884Z",
    __v: 2,
    lastLogin: "2025-05-15T07:31:24.882Z",
    education: "M.Sc. Computer Science",
    occupation: "Senior Developer"
  },
  {
    _id: "681c72d29f88fdf6d78ab99b",
    firstName: "Pursharth",
    lastName: "Chaudhary",
    email: "pursharth.chaudhary2257@gmail.com",
    phone: "1234234234",
    avatar: "default_avatar.jpg",
    role: "student",
    isVerified: true,
    isActive: true,
    skills: [],
    interests: [],
    points: 0,
    badges: [],
    enrolledCourses: [],
    createdAt: "2025-05-08T09:01:06.836Z",
    updatedAt: "2025-05-08T09:04:23.018Z",
    __v: 0,
    lastLogin: "2025-05-08T09:04:23.016Z"
  },
  {
    _id: "6821842f090a7f55d92cf90c",
    firstName: "hareesh",
    lastName: "Gandikota",
    email: "hareeshgandikota96@gmail.com",
    phone: "1234567890",
    avatar: "default_avatar.jpg",
    role: "student",
    isVerified: false,
    isActive: true,
    skills: [],
    interests: [],
    points: 0,
    badges: [],
    enrolledCourses: [],
    createdAt: "2025-05-12T05:16:31.566Z",
    updatedAt: "2025-05-12T05:16:32.468Z",
    __v: 0
  },
  {
    _id: "68232df6f9da77daa00a15e0",
    firstName: "sanskar",
    lastName: "Singh",
    email: "singhsanskar2023@gmail.com",
    phone: "7266813030",
    avatar: "default_avatar.jpg",
    role: "student",
    isVerified: true,
    isActive: true,
    skills: [],
    interests: [],
    points: 0,
    badges: [],
    enrolledCourses: [],
    createdAt: "2025-05-13T11:33:10.981Z",
    updatedAt: "2025-05-13T11:36:06.921Z",
    __v: 0,
    lastLogin: "2025-05-13T11:36:06.919Z"
  },
  {
    _id: "682366a6dae5b8179edd95f3",
    firstName: "Kashif",
    lastName: "Anjum",
    email: "kashif@gmail.com",
    phone: "7091817009",
    avatar: "default_avatar.jpg",
    role: "student",
    isVerified: true,
    isActive: true,
    education: "B.Tech in AI&DS",
    occupation: "Backend Developer",
    skills: ["Python, SQL"],
    interests: ["AI, ML"],
    points: 0,
    badges: [],
    enrolledCourses: [],
    createdAt: "2025-05-13T15:35:02.770Z",
    updatedAt: "2025-05-13T15:35:02.770Z",
    __v: 0
  },
  {
    _id: "6824505a264f1fac5c2891dc",
    firstName: "Jay",
    lastName: "Student",
    email: "singhsanskar54@gmail.com",
    phone: "1234567890",
    avatar: "default_avatar.jpg",
    role: "student",
    isVerified: true,
    isActive: true,
    skills: [],
    interests: [],
    points: 0,
    badges: [],
    enrolledCourses: [],
    createdAt: "2025-05-14T08:12:10.786Z",
    updatedAt: "2025-05-14T12:09:07.018Z",
    __v: 0,
    lastLogin: "2025-05-14T12:09:06.976Z"
  },
  {
    _id: "68246414c9f6a1d0d36c8ecd",
    firstName: "Jay",
    lastName: "Student",
    email: "jayp78088@gmail.com",
    phone: "1234567890",
    avatar: "default_avatar.jpg",
    role: "student",
    isVerified: true,
    isActive: true,
    skills: [],
    interests: [],
    points: 0,
    badges: [],
    enrolledCourses: [],
    createdAt: "2025-05-14T09:36:20.524Z",
    updatedAt: "2025-05-14T09:37:16.299Z",
    __v: 0
  }
];

const ManageStudent = () => {
  const [students, setStudents] = useState(initialStudentsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    skills: '',
    interests: '',
    education: '',
    occupation: '',
    isActive: true,
    role: 'student',
    isVerified: true,
    points: 0,
    approved: false,
    badges: [],
    enrolledCourses: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = {
      ...formData,
      _id: `temp_${Date.now()}`,
      skills: formData.skills.split(',').map((item) => item.trim()).filter(item => item),
      interests: formData.interests.split(',').map((item) => item.trim()).filter(item => item),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      __v: 0
    };
    setStudents([newStudent, ...students]);
    setIsModalOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      avatar: '',
      skills: '',
      interests: '',
      education: '',
      occupation: '',
      isActive: true,
      role: 'student',
      isVerified: true,
      points: 0,
      approved: false,
      badges: [],
      enrolledCourses: []
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setSelectedStudent(null);
    }
  };

  const openDetailsPopup = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Students</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Enroll Student
        </button>
      </div>

      {/* Enroll Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Enroll New Student</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Optional image URL"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="e.g., JavaScript, React"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Interests (comma-separated)</label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="e.g., Web Development, AI"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="e.g., B.Tech in Computer Science"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Active Status</label>
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Popup */}
      {selectedStudent && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              {`${selectedStudent.firstName} ${selectedStudent.lastName}`} Details
            </h2>
            <div className="space-y-2 text-sm sm:text-base text-gray-600">
              <p><strong>First Name:</strong> {selectedStudent.firstName}</p>
              <p><strong>Last Name:</strong> {selectedStudent.lastName}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Phone:</strong> {selectedStudent.phone}</p>
              <p><strong>Avatar:</strong>{' '}
                {selectedStudent.avatar ? (
                  <img
                    src={selectedStudent.avatar || 'https://via.placeholder.com/40'}
                    alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                    className="w-10 h-10 rounded-full object-cover inline-block"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
                  />
                ) : (
                  'N/A'
                )}
              </p>
              <p><strong>Skills:</strong> {selectedStudent.skills?.join(', ') || 'N/A'}</p>
              <p><strong>Enrolled Courses:</strong> {selectedStudent.enrolledCourses?.length || 0}</p>
              <p><strong>Interests:</strong> {selectedStudent.interests?.join(', ') || 'N/A'}</p>
              <p><strong>Education:</strong> {selectedStudent.education || 'N/A'}</p>
              <p><strong>Occupation:</strong> {selectedStudent.occupation || 'N/A'}</p>
              <p><strong>Badges:</strong>{' '}
                {selectedStudent.badges?.length > 0 ? (
                  <ul className="list-disc pl-4">
                    {selectedStudent.badges.map((badge) => (
                      <li key={badge._id}>
                        {badge.icon} (Earned: {new Date(badge.dateEarned).toLocaleString()})
                      </li>
                    ))}
                  </ul>
                ) : (
                  'None'
                )}
              </p>
              <p><strong>Status:</strong>{' '}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedStudent.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedStudent.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p><strong>Role:</strong> {selectedStudent.role}</p>
              <p><strong>Verified:</strong> {selectedStudent.isVerified ? 'Yes' : 'No'}</p>
              <p><strong>Points:</strong> {selectedStudent.points}</p>
              <p><strong>Approved:</strong> {selectedStudent.approved ? 'Yes' : 'No'}</p>
              <p><strong>Created At:</strong> {new Date(selectedStudent.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedStudent.updatedAt).toLocaleString()}</p>
              <p><strong>Last Login:</strong>{' '}
                {selectedStudent.lastLogin
                  ? new Date(selectedStudent.lastLogin).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Skills</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Enrolled Courses</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="py-4 px-6 flex items-center space-x-3">
                    <img
                      src={student.avatar || 'https://via.placeholder.com/40'}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
                    />
                    <span className="text-sm text-gray-800 font-medium">{`${student.firstName} ${student.lastName}`}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{student.email}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{student.phone}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {student.skills?.join(', ') || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{student.enrolledCourses?.length || 0}</td>
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        student.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <button
                      onClick={() => openDetailsPopup(student)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="sm:hidden space-y-4">
        {students.map((student) => (
          <div
            key={student._id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={student.avatar || 'https://via.placeholder.com/40'}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{`${student.firstName} ${student.lastName}`}</h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    student.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {student.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
              <p><strong>Skills:</strong> {student.skills?.join(', ') || 'N/A'}</p>
              <p><strong>Enrolled Courses:</strong> {student.enrolledCourses?.length || 0}</p>
              <div className="mt-3">
                <button
                  onClick={() => openDetailsPopup(student)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                >
                  More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageStudent;