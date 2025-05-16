import React, { useRef, useState } from "react";
import { instructorsWithCourses } from "../data/courses";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Course Card Component
const CourseCard = ({ course, onCourseClick }) => (
  <div className="bg-gray-50 shadow-lg p-5 rounded-xl w-80 flex-shrink-0">
    <div className="relative m-2 shadow-lg">
      <img
        src={course.image}
        alt={course.title}
        className="rounded-t-xl h-36 w-full object-cover cursor-pointer"
        onClick={() => onCourseClick(course)}
      />
      <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
        ★ {course.rating}
      </div>
    </div>
    <div className="p-3">
      <h4 className="font-semibold text-center text-sm">{course.title}</h4>
      <p className="text-center text-xs text-gray-500">{course.lessons} lessons</p>
    </div>
  </div>
);

// Instructor Row with Scroll Control
const InstructorRow = ({ instructor, onCourseClick }) => {
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
      <div className="relative overflow-hidden ">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar space-x-4 pr-4 "
          style={{ scrollBehavior: "smooth", overflowY: "hidden" }}
        >
          {instructor.courses.map((course) => (
            <CourseCard key={course.id} course={course} onCourseClick={onCourseClick} />
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

// Modal Component for Course Details and Editing
const CourseModal = ({ course, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: course.title,
    lessons: course.lessons,
    rating: course.rating,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...course, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Course Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lessons</label>
            <input
              type="number"
              name="lessons"
              value={formData.lessons}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              min="0"
              max="5"
              step="0.1"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-cyan-500 rounded-md hover:bg-cyan-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Page
const AllCoursesPage = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [coursesData, setCoursesData] = useState(instructorsWithCourses);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleSaveCourse = (updatedCourse) => {
    // Update the courses data (simulated, no backend)
    const updatedData = coursesData.map((instructor) => ({
      ...instructor,
      courses: instructor.courses.map((c) =>
        c.id === updatedCourse.id ? { ...c, ...updatedCourse } : c
      ),
    }));
    setCoursesData(updatedData);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="p-4 bg-gray-50 m-3 min-h-screen overflow-x-hidden">
      <h2 className="text-2xl font-semibold mb-6">All Courses</h2>
      {coursesData.map((instructor) => (
        <InstructorRow
          key={instructor.id}
          instructor={instructor}
          onCourseClick={handleCourseClick}
        />
      ))}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={handleCloseModal}
          onSave={handleSaveCourse}
        />
      )}
    </div>
  );
};

export default AllCoursesPage;