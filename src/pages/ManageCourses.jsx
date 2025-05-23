import React, { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { FaPlay } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Course Card Component
const CourseCard = ({ course, onCourseClick, onPlay }) => (
  <div
    key={course._id}
    className="bg-gray-50 p-4 rounded-xl shadow-lg w-80 flex-shrink-0 relative transition-transform transform hover:scale-105 cursor-pointer"
    onClick={() => onCourseClick(course._id, course.title)}
  >
    {/* Thumbnail container with fixed height */}
    <div className="relative w-full h-36 bg-gray-200 rounded-md mb-3">
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-md">
          <span className="text-gray-500">No Thumbnail</span>
        </div>
      )}
      {/* Play button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click event
          onPlay(course._id);
        }}
        className="absolute -bottom-4 right-0 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:scale-120 cursor-pointer z-50"
        title="Play Course"
      >
        <FaPlay />
      </button>
    </div>

    <h3 className="text-sm font-semibold text-center text-slate-800 mb-1 truncate">
      {course.title}
    </h3>
    <p className="text-xs text-center text-gray-500 mb-2 truncate">
      {course.description || "No description available"}
    </p>

    <div className="flex justify-between items-center">
      <span className="text-sm font-semibold text-slate-700">
        ₹{course.discountPrice ?? course.price}
      </span>
      {course.discountPrice && (
        <span className="text-xs text-gray-500 line-through">₹{course.price}</span>
      )}
    </div>

    <div className="flex justify-between items-center mt-3">
      <span className="text-xs text-gray-700">
        👨‍🎓 {course.totalStudents || 0} Students
      </span>
      <span className="text-xs text-yellow-500">⭐ {course.rating || "N/A"}</span>
    </div>
  </div>
);

// Instructor Row with Scroll Control
const InstructorRow = ({ instructor, onCourseClick, onPlay }) => {
  const scrollRef = useRef();

  const scrollRight = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = 272; // width (256) + margin
      container.scrollBy({ left: cardWidth * 3, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = 272; // width (256) + margin
      container.scrollBy({ left: -cardWidth * 3, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-10 bg-white shadow-lg rounded-xl p-4">
      <h3 className="text-lg font-medium mb-3">{instructor.name}</h3>
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar space-x-4 pr-4"
          style={{ scrollBehavior: "smooth", overflowY: "hidden" }}
        >
          {instructor.courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onCourseClick={onCourseClick}
              onPlay={onPlay}
            />
          ))}
        </div>

        {/* Scroll Left Arrow */}
        {instructor.courses.length > 3 && (
          <div
            onClick={scrollLeft}
            className="absolute left-0 border border-cyan-400 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg cursor-pointer z-10"
          >
            <ChevronLeft className="w-6 h-6 text-blue-700" />
          </div>
        )}

        {/* Scroll Right Arrow */}
        {instructor.courses.length > 3 && (
          <div
            onClick={scrollRight}
            className="absolute right-4 border border-cyan-400 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md cursor-pointer z-10"
          >
            <ChevronRight className="w-6 h-6 text-blue-700" />
          </div>
        )}
      </div>
    </div>
  );
};

// Main Page
const AllCoursesPage = () => {
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve Bearer token from localStorage
  const token = localStorage.getItem("authToken");

  // Fetch instructors and their courses using Axios
  useEffect(() => {
    const fetchInstructorsAndCourses = async () => {
      if (!token) {
        setError("Please log in to view courses.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        // Fetch all instructors
        const instructorsResponse = await axios.get(
          "https://lms-backend-flwq.onrender.com/api/v1/admin/users/instructors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const instructors = instructorsResponse.data.data || [];

        // Fetch courses for each instructor
        const instructorsWithCourses = await Promise.all(
          instructors.map(async (instructor) => {
            try {
              const coursesResponse = await axios.get(
                `https://lms-backend-flwq.onrender.com/api/v1/admin/instructors/${instructor._id}/courses`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return {
                id: instructor._id,
                name: `${instructor.firstName} ${instructor.lastName}`,
                courses: coursesResponse.data.data.courses.map((course) => ({
                  ...course,
                  _id: course._id,
                  title: course.title,
                  description: course.description,
                  price: course.price,
                  discountPrice: course.discountPrice || null,
                  totalStudents: course.totalStudents || 0,
                  rating: course.rating || 0,
                  thumbnail: course.thumbnail || null,
                })),
              };
            } catch (courseError) {
              console.error(
                `Failed to fetch courses for instructor ${instructor._id}:`,
                courseError
              );
              return {
                id: instructor._id,
                name: `${instructor.firstName} ${instructor.lastName}`,
                courses: [],
              };
            }
          })
        );

        setCoursesData(instructorsWithCourses);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch instructors");
        setLoading(false);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchInstructorsAndCourses();
  }, [navigate, token]);

  const handleCourseClick = (courseId, courseTitle) => {
    navigate(`/dashboard/course-editor/${courseId}`, { state: { courseTitle } });
  };

  const handlePlay = (courseId) => {
    // Implement play functionality (e.g., redirect to course player or log)
    console.log(`Playing course with ID: ${courseId}`);
  };

  if (loading) {
    return <div className="p-4 bg-gray-50 m-3 min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 bg-gray-50 m-3 min-h-screen">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-gray-50 mt-5 min-h-screen overflow-x-hidden">
      <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">All Courses</h2>
      {coursesData.map((instructor) => (
        <InstructorRow
          key={instructor.id}
          instructor={instructor}
          onCourseClick={handleCourseClick}
          onPlay={handlePlay}
        />
      ))}
    </div>
  );
};

export default AllCoursesPage;