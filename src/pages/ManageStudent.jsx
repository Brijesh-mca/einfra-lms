import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext"; // Adjust path if needed
import Loading from "./Loading"; // Import the Loading component

const ManageStudent = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    education: "",
    occupation: "",
    skills: "",
    interests: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
      const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://lms-backend-flwq.onrender.com/api/v1/admin/users/students",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );
        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          setError("Failed to fetch students: " + response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || `Error fetching students: ${err.message}`);
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

    if (!formData.password || formData.password.length < 6) {
      setError("Password is required and must be at least 6 characters long");
      return;
    }

    const newStudent = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      education: formData.education,
      occupation: formData.occupation,
      skills: formData.skills,
      interests: formData.interests,
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
          timeout: 10000,
        }
      );
      if (response.data.success) {
        setStudents([response.data.data, ...students]);
        setIsModalOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          education: "",
          occupation: "",
          skills: "",
          interests: "",
        });
      } else {
        setError("Failed to enroll student: " + response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Error enrolling student: ${err.message}`);
    }
  };

  const handleToggleStatus = async (studentId) => {
    
    
    const student = students.find((s) => s._id === studentId);
    


    if (!student) return setError("Student not found");

    const newStatus = !student.isActive;
    setToggleLoading((prev) => ({ ...prev, [studentId]: true }));
    setError("");

    try {
      const config = {
        method: "PATCH",
        url: `https://lms-backend-flwq.onrender.com/api/v1/admin/users/students/${studentId}/toggle-active`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { isActive: newStatus },
        timeout: 10000,
      };
      const response = await axios(config);

      if (response.data.success) {
        setStudents(
          students.map((student) =>
            student._id === studentId

              ? { ...student, isActive: response.data.data.isActive }
              : student
          )
        );
        if (selectedStudent && selectedStudent._id === studentId) {
          setSelectedStudent({ ...selectedStudent, isActive: response.data.data.isActive });
        }
      } else {
        setError("Failed to toggle student status: " + response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Error toggling student status: ${errorMessage}`);
    } finally {
      setToggleLoading((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setSelectedStudent(null);
      setError("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        education: "",
        occupation: "",
        skills: "",
        interests: "",
      });
    }
  };

  const openDetailsPopup = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 mt-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          Manage Students
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="card-bg text-white shadow shadow-black px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Enroll Student
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      {loading ? (
        <Loading />
      ) : students.length === 0 ? (
        <div className="text-center text-gray-600">No students found.</div>
      ) : (
        <>
          {isModalOpen && (
            <div
              className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={handleOverlayClick}
            >
              <div className="bg-white border-2 border-blue-400 rounded-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                  Enroll New Student
                </h2>
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
                    <label className="block text-sm font-medium text-gray-700">Password</label>
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
                    <label className="block text-sm font-medium text-gray-700">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
                      placeholder="e.g., Python, SQL"
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
                      placeholder="e.g., AI, ML"
                    />
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

          {selectedStudent && (
            <div
              className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={handleOverlayClick}
            >
              <div className="bg-white border-2 border-blue-400 rounded-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                  {`${selectedStudent.firstName} ${selectedStudent.lastName}`} Details
                </h2>
                <div className="space-y-2 text-sm sm:text-base text-gray-600">
                  <p><strong>First Name:</strong> {selectedStudent.firstName}</p>
                  <p><strong>Last Name:</strong> {selectedStudent.lastName}</p>
                  <p><strong>Email:</strong> {selectedStudent.email}</p>
                  <p><strong>Phone:</strong> {selectedStudent.phone || "N/A"}</p>
                  <p><strong>Education:</strong> {selectedStudent.education || "N/A"}</p>
                  <p><strong>Occupation:</strong> {selectedStudent.occupation || "N/A"}</p>
                  <p><strong>Skills:</strong> {selectedStudent.skills || "N/A"}</p>
                  <p><strong>Interests:</strong> {selectedStudent.interests || "N/A"}</p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`inline-block px-2 py-1 ml-2 rounded-full text-xs font-medium ${
                        selectedStudent.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedStudent.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                  <p><strong>Verified:</strong> {selectedStudent.isVerified ? "Yes" : "No"}</p>
                  <p><strong>Created At:</strong> {new Date(selectedStudent.createdAt).toLocaleString()}</p>
                  <p><strong>Last Login:</strong> {selectedStudent.lastLogin ? new Date(selectedStudent.lastLogin).toLocaleString() : "N/A"}</p>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => handleToggleStatus(selectedStudent._id)}
                    disabled={toggleLoading[selectedStudent._id]}
                    className={`px-4 py-2 text-white rounded-lg text-sm sm:text-base ${
                      selectedStudent.isActive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } ${
                      toggleLoading[selectedStudent._id] ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {toggleLoading[selectedStudent._id]
                      ? "Loading..."
                      : selectedStudent.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>
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

          <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Phone</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Skills</th>
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
                      <td className="py-4 px-6 text-sm text-gray-800 font-medium">{`${student.firstName} ${student.lastName}`}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{student.email}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{student.phone || "N/A"}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{student.skills || "N/A"}</td>
                      <td className="py-4 px-6 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            student.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <button
                          onClick={() => openDetailsPopup(student)}
                          className="card-bg text-white shadow shadow-black px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
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

          <div className="sm:hidden space-y-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{`${student.firstName} ${student.lastName}`}</h3>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      student.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Phone:</strong> {student.phone || "N/A"}</p>
                  <p><strong>Skills:</strong> {student.skills || "N/A"}</p>
                  <div className="mt-3">
                    <button
                      onClick={() => openDetailsPopup(student)}
                      className="card-bg text-white shadow shadow-black px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
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
