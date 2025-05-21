import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext"; // Adjust path if needed

const ManageStudent = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
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
      setSelectedStudent(null);
      setError("");
    }
  };

  const openDetailsPopup = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Manage Students</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      {loading ? (
        <div className="text-center text-gray-600">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="text-center text-gray-600">No students found.</div>
      ) : (
        <>
          {selectedStudent && (
            <div
              className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={handleOverlayClick}
            >
              <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                  {`${selectedStudent.firstName} ${selectedStudent.lastName}`} Details
                </h2>
                <div className="space-y-2 text-sm sm:text-base text-gray-600">
                  <p><strong>Email:</strong> {selectedStudent.email}</p>
                  <p><strong>Phone:</strong> {selectedStudent.phone || "N/A"}</p>
                  <p><strong>Skills:</strong> {selectedStudent.skills?.join(", ") || "N/A"}</p>
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
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {student.skills?.join(", ") || "N/A"}
                      </td>
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
        </>
      )}
    </div>
  );
};

export default ManageStudent;
