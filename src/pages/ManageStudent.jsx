import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext"; // Adjust path as per your project structure

const ManageStudent = () => {
  const { token } = useAuth(); // Get token from AuthContext
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "", // Added password field
    phone: "",
    avatar: "",
    skills: "",
    interests: "",
    education: "",
    occupation: "",
    isActive: true,
    role: "student",
    isVerified: true,
    points: 0,
    approved: false,
    badges: [],
    enrolledCourses: [],
  });
  const [error, setError] = useState(""); // For API error messages
  const [loading, setLoading] = useState(true); // For loading state

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "https://lms-backend-flwq.onrender.com/api/v1/admin/users/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          setError("Failed to fetch students");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching students");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStudents();
    } else {
      setError("Please log in to fetch students");
      setLoading(false);
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation for password
    if (!formData.password || formData.password.length < 6) {
      setError("Password is required and must be at least 6 characters long");
      return;
    }

    const newStudent = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password, // Include password in the payload
      phone: formData.phone,
      avatar: formData.avatar || "default_avatar.jpg",
      skills: formData.skills
        ? formData.skills.split(",").map((item) => item.trim()).filter(item => item)
        : [],
      interests: formData.interests
        ? formData.interests.split(",").map((item) => item.trim()).filter(item => item)
        : [],
      education: formData.education,
      occupation: formData.occupation,
      isActive: formData.isActive === "true" || formData.isActive === true,
      role: "student",
      isVerified: true,
    };

    try {
      const response = await axios.post(
        "https://lms-backend-flwq.onrender.com/api/v1/admin/users/students",
        newStudent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setStudents([response.data.data, ...students]);
        setIsModalOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "", // Reset password field
          phone: "",
          avatar: "",
          skills: "",
          interests: "",
          education: "",
          occupation: "",
          isActive: true,
          role: "student",
          isVerified: true,
          points: 0,
          approved: false,
          badges: [],
          enrolledCourses: [],
        });
      } else {
        setError("Failed to enroll student");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error enrolling student");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setSelectedStudent(null);
      setError("");
    }
  };

  const openDetailsPopup = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manage Students
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="card-bg text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Enroll Student
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-600">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="text-center text-gray-600">No students found.</div>
      ) : (
        <>
          {/* Enroll Modal */}
          {isModalOpen && (
            <div
              className="fixed border-2 inset-0 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={handleOverlayClick}
            >
              <div className="bg-white border rounded-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                  Enroll New Student
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      required
                      placeholder="Enter password (min 6 characters)"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Avatar URL
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Skills (comma-separated)
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Interests (comma-separated)
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Education
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Occupation
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Active Status
                    </label>
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
                      className="px-4 py-2 card-bg text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
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
                        src={selectedStudent.avatar || 'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg'}
                        alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                        className="w-10 h-10 rounded-full object-cover inline-block"
                        onError={(e) => (e.target.src = '')}
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
                          src={student.avatar || 'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg'}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => (e.target.src = '')}
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
                          className="card-bg text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
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
                    src={student.avatar || 'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg'}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => (e.target.src = '')}
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
                      className="card-bg text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageStudent;