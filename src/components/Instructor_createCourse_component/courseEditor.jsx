import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Notification Component
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-2 sm:top-4 right-2 sm:right-4 p-3 sm:p-4 rounded-md shadow-lg text-white ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      } transition-opacity duration-300 z-[1000] max-w-[90%] sm:max-w-md`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 sm:ml-4 text-white hover:text-gray-200"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-500 p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl md:text-2xl">Something went wrong.</h1>
          <p className="text-sm sm:text-base">
            {this.state.error?.message || "Please try again later."}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Contents = () => {
  const { state } = useLocation();
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Initialize courseDetails with data from state if available
  const initialCourseDetails = {
    title: state?.courseTitle || "",
    subtitle: state?.subtitle || "",
    description: state?.description || "",
    category: state?.category || "",
    subCategory: state?.subCategory || "",
    level: state?.level || "",
  };
  const initialStatus = state?.status || "draft";

  const [courseDetails, setCourseDetails] = useState(initialCourseDetails);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [promoVideoFile, setPromoVideoFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [promoVideoPreview, setPromoVideoPreview] = useState(null);

  // Show notification
  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  // Update course details
  const handleUpdateCourseDetails = async () => {
    if (!courseDetails.title.trim()) {
      showNotification("Course title is required.");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Please log in to update course details.");
        navigate("/login");
        return;
      }
      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/admin/courses/${courseId}`,
        courseDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsTitleModalOpen(false);
      showNotification("Course details updated successfully!", "success");
    } catch (error) {
      console.error("Error updating course details:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
      showNotification("Failed to update course details.");
    }
  };

  // Delete course
  const handleDeleteCourse = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Please log in to delete course.");
        navigate("/login");
        return;
      }
      await axios.delete(
        `https://lms-backend-flwq.onrender.com/api/v1/admin/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsDeleteModalOpen(false);
      showNotification("Course deleted successfully!", "success");
      navigate("/manage-courses");
    } catch (error) {
      console.error("Error deleting course:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
      showNotification("Failed to delete course.");
    }
  };

  // Upload thumbnail
  const handleThumbnailUpload = async () => {
    if (!thumbnailFile) {
      showNotification("Please select a thumbnail file.");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Please log in to upload thumbnail.");
        navigate("/login");
        return;
      }
      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);
      await axios.post(
        `https://lms-backend-flwq.onrender.com/api/v1/admin/courses/${courseId}/thumbnail`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setThumbnailFile(null);
      setThumbnailPreview(null);
      showNotification("Thumbnail uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
      showNotification("Failed to upload thumbnail.");
    }
  };

  // Upload promo video
  const handlePromoVideoUpload = async () => {
    if (!promoVideoFile) {
      showNotification("Please select a promo video file.");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Please log in to upload promo video.");
        navigate("/login");
        return;
      }
      const formData = new FormData();
      formData.append("promoVideo", promoVideoFile);
      await axios.post(
        `https://lms-backend-flwq.onrender.com/api/v1/admin/courses/${courseId}/promo-video`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPromoVideoFile(null);
      setPromoVideoPreview(null);
      showNotification("Promo video uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading promo video:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
      showNotification("Failed to upload promo video.");
    }
  };

  // Update course status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showNotification("Please log in to update course status.");
        navigate("/login");
        return;
      }
      await axios.put(
        `https://lms-backend-flwq.onrender.com/api/v1/admin/courses/${courseId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus(newStatus);
      showNotification(`Course status updated to "${newStatus}" successfully!`, "success");
    } catch (error) {
      console.error("Error updating course status:", error);
      if (error.response?.status === 401) {
        showNotification("Session expired or invalid. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
      showNotification("Failed to update course status.");
    }
  };

  // Handle thumbnail file selection with preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    } else {
      setThumbnailPreview(null);
    }
  };

  // Handle promo video file selection with preview
  const handlePromoVideoChange = (e) => {
    const file = e.target.files[0];
    setPromoVideoFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPromoVideoPreview(previewUrl);
    } else {
      setPromoVideoPreview(null);
    }
  };

  // Clean up preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (promoVideoPreview) URL.revokeObjectURL(promoVideoPreview);
    };
  }, [thumbnailPreview, promoVideoPreview]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
        <h1 className="!text-[2rem] md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 text-left">
          Update your courses
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pl-1 sm:pl-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-800">
              {courseDetails.title || "Untitled Course"}
            </h2>
            <span className="text-xs sm:text-sm md:text-base text-gray-600">
              (Status: {status})
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-0">
            <button
              onClick={() => setIsTitleModalOpen(true)}
              className="py-1.5 px-3 sm:px-4 rounded bg-gray-200 text-gray-800 text-sm sm:text-base hover:bg-gray-300 transition cursor-pointer"
            >
              Edit Course Details
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="py-1.5 px-3 sm:px-4 rounded bg-red-500 text-white text-sm sm:text-base hover:bg-red-600 transition cursor-pointer"
            >
              Delete Course
            </button>
            <select
              value={status}
              onChange={handleStatusChange}
              className="py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] outline-none border-none text-white text-sm sm:text-base hover:bg-[#3a9a9b] transition cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#49BBBD] file:text-white hover:file:bg-[#3a9a9b]"
              />
              {thumbnailPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Thumbnail Preview:</p>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="mt-1 max-w-full h-auto rounded-md shadow-md"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
              <button
                onClick={handleThumbnailUpload}
                disabled={!thumbnailFile}
                className="mt-2 py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] text-white text-sm sm:text-base hover:bg-[#3a9a9b] disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Upload Thumbnail
              </button>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Promo Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handlePromoVideoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#49BBBD] file:text-white hover:file:bg-[#3a9a9b]"
              />
              {promoVideoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Promo Video Preview:</p>
                  <video
                    src={promoVideoPreview}
                    controls
                    className="mt-1 max-w-full h-auto rounded-md shadow-md"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
              <button
                onClick={handlePromoVideoUpload}
                disabled={!promoVideoFile}
                className="mt-2 py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] text-white text-sm sm:text-base hover:bg-[#3a9a9b] disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Upload Promo Video
              </button>
            </div>
          </div>
        </div>

        {isTitleModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Edit Course Details
              </h3>
              <div className="space-y-3">
                <input
                  className="w-full border border-gray-300 outline-none p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
                  placeholder="Enter Course Title"
                  value={courseDetails.title}
                  onChange={(e) =>
                    setCourseDetails({ ...courseDetails, title: e.target.value })
                  }
                />
                <input
                  className="w-full border border-gray-300 outline-none p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
                  placeholder="Enter Subtitle"
                  value={courseDetails.subtitle}
                  onChange={(e) =>
                    setCourseDetails({ ...courseDetails, subtitle: e.target.value })
                  }
                />
                <textarea
                  className="w-full border border-gray-300 outline-none p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
                  placeholder="Enter Description"
                  value={courseDetails.description}
                  onChange={(e) =>
                    setCourseDetails({ ...courseDetails, description: e.target.value })
                  }
                />
                <input
                  className="w-full border border-gray-300 outline-none p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
                  placeholder="Enter Category"
                  value={courseDetails.category}
                  onChange={(e) =>
                    setCourseDetails({ ...courseDetails, category: e.target.value })
                  }
                />
                <input
                  className="w-full border border-gray-300 outline-none p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
                  placeholder="Enter Subcategory"
                  value={courseDetails.subCategory}
                  onChange={(e) =>
                    setCourseDetails({ ...courseDetails, subCategory: e.target.value })
                  }
                />
                <select
                  className="w-full border border-gray-300 outline-none p-2 sm:p-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-[#49BBBD] focus:border-transparent transition"
                  value={courseDetails.level}
                  onChange={(e) =>
                    setCourseDetails({ ...courseDetails, level: e.target.value })
                  }
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 sm:gap-3 mt-4">
                <button
                  onClick={handleUpdateCourseDetails}
                  disabled={!courseDetails.title.trim()}
                  className="py-1.5 px-3 sm:px-4 rounded bg-[#49BBBD] text-white text-sm sm:text-base hover:bg-[#3a9a9b] disabled:bg-gray-400 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsTitleModalOpen(false)}
                  className="py-1.5 px-3 sm:px-4 rounded bg-gray-200 text-gray-800 text-sm sm:text-base hover:bg-gray-300 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Confirm Delete Course
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Are you sure you want to delete this course? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={handleDeleteCourse}
                  className="py-1.5 px-3 sm:px-4 rounded bg-red-500 text-white text-sm sm:text-base hover:bg-red-600 transition cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="py-1.5 px-3 sm:px-4 rounded bg-gray-200 text-gray-800 text-sm sm:text-base hover:bg-gray-300 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Contents;