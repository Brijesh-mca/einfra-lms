import React, { useState } from 'react';

const initialInstructorsData = [
  {
    socialLinks: {
      linkedin: "https://linkedin.com/in/janesmith",
      twitter: "https://twitter.com/janesmith"
    },
    _id: "681b1a4e8d6502ad63eb1b7f",
    firstName: "Ruchika",
    lastName: "P",
    email: "t7_ruchi@einfratechsys.tech",
    phone: "1234565890",
    avatar: "default_avatar.jpg",
    role: "instructor",
    isVerified: true,
    isActive: true,
    expertise: ["JavaScript", "React", "Node.js"],
    rating: 0,
    totalStudents: 0,
    totalCourses: 3,
    earnings: 0,
    approved: false,
    createdAt: "2025-05-07T08:31:10.821Z",
    updatedAt: "2025-05-15T07:34:51.578Z",
    __v: 0,
    lastLogin: "2025-05-15T07:34:51.578Z",
    bio: "Senior developer with 10 years of experience"
  },
  {
    socialLinks: {
      linkedin: "https://linkedin.com/in/janesmith",
      twitter: "https://twitter.com/janesmith"
    },
    _id: "682197d1e2aa36bcc48b94bc",
    firstName: "Jay",
    lastName: "instructor",
    email: "95078prakash@gmail.com",
    phone: "1234567890",
    avatar: "default_avatar.jpg",
    role: "instructor",
    isVerified: true,
    isActive: true,
    expertise: ["JavaScript", "React", "Node.js"],
    rating: 0,
    totalStudents: 0,
    totalCourses: 2,
    earnings: 0,
    approved: false,
    createdAt: "2025-05-12T06:40:17.393Z",
    updatedAt: "2025-05-15T06:45:34.053Z",
    __v: 0,
    lastLogin: "2025-05-15T06:45:34.052Z",
    bio: "Senior developer with 10 years of experience"
  },
  {
    _id: "682360f9dae5b8179edd95e0",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    avatar: "default_avatar.jpg",
    role: "instructor",
    isVerified: true,
    isActive: true,
    bio: "Experienced developer with 5 years in web development.",
    expertise: ["JavaScript", "Node.js"],
    rating: 0,
    totalStudents: 0,
    totalCourses: 0,
    earnings: 0,
    approved: false,
    createdAt: "2025-05-13T15:10:49.340Z",
    updatedAt: "2025-05-13T15:10:49.340Z",
    __v: 0
  }
];

const ManageInstructor = () => {
  const [instructors, setInstructors] = useState(initialInstructorsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    expertise: '',
    bio: '',
    socialLinks: { linkedin: '', twitter: '' },
    isActive: true,
    totalCourses: 0,
    role: 'instructor',
    isVerified: true,
    rating: 0,
    totalStudents: 0,
    earnings: 0,
    approved: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        socialLinks: { ...formData.socialLinks, [key]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInstructor = {
      ...formData,
      _id: `temp_${Date.now()}`,
      expertise: formData.expertise.split(',').map((item) => item.trim()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      __v: 0
    };
    setInstructors([newInstructor, ...instructors]);
    setIsModalOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      avatar: '',
      expertise: '',
      bio: '',
      socialLinks: { linkedin: '', twitter: '' },
      isActive: true,
      totalCourses: 0,
      role: 'instructor',
      isVerified: true,
      rating: 0,
      totalStudents: 0,
      earnings: 0,
      approved: false,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setSelectedInstructor(null);
    }
  };

  const openDetailsPopup = (instructor) => {
    setSelectedInstructor(instructor);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Instructors</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="card-bg text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Enroll Instructor
        </button>
      </div>

      {/* Enroll Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Enroll New Instructor</h2>
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
                <label className="block text-sm font-medium text-gray-700">Expertise (comma-separated)</label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="e.g., JavaScript, React"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <input
                  type="text"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Optional"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
                <input
                  type="text"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Optional"
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
      {selectedInstructor && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              {`${selectedInstructor.firstName} ${selectedInstructor.lastName}`} Details
            </h2>
            <div className="space-y-2 text-sm sm:text-base text-gray-600">
              <p><strong>First Name:</strong> {selectedInstructor.firstName}</p>
              <p><strong>Last Name:</strong> {selectedInstructor.lastName}</p>
              <p><strong>Email:</strong> {selectedInstructor.email}</p>
              <p><strong>Phone:</strong> {selectedInstructor.phone}</p>
              <p><strong>Avatar:</strong>{' '}
                {selectedInstructor.avatar ? (
                  <img
                    src={selectedInstructor.avatar }
                    alt={`${selectedInstructor.firstName} ${selectedInstructor.lastName}`}
                    className="w-10 h-10 rounded-full object-cover inline-block"
                    onError={(e) => (e.target.src = '')}
                  />
                ) : (
                  'N/A'
                )}
              </p>
              <p><strong>Expertise:</strong> {selectedInstructor.expertise?.join(', ') || 'N/A'}</p>
              <p><strong>Total Courses:</strong> {selectedInstructor.totalCourses}</p>
              <p><strong>Bio:</strong> {selectedInstructor.bio || 'N/A'}</p>
              <p><strong>Social:</strong>{' '}
                {selectedInstructor.socialLinks ? (
                  <span className="flex space-x-3">
                    {selectedInstructor.socialLinks.linkedin && (
                      <a
                        href={selectedInstructor.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs sm:text-sm"
                      >
                        LinkedIn
                      </a>
                    )}
                    {selectedInstructor.socialLinks.twitter && (
                      <a
                        href={selectedInstructor.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-xs sm:text-sm"
                      >
                        Twitter
                      </a>
                    )}
                  </span>
                ) : (
                  'N/A'
                )}
              </p>
              <p><strong>Status:</strong>{' '}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedInstructor.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedInstructor.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p><strong>Role:</strong> {selectedInstructor.role}</p>
              <p><strong>Verified:</strong> {selectedInstructor.isVerified ? 'Yes' : 'No'}</p>
              <p><strong>Rating:</strong> {selectedInstructor.rating}</p>
              <p><strong>Total Students:</strong> {selectedInstructor.totalStudents}</p>
              <p><strong>Earnings:</strong> ${selectedInstructor.earnings}</p>
              <p><strong>Approved:</strong> {selectedInstructor.approved ? 'Yes' : 'No'}</p>
              <p><strong>Created At:</strong> {new Date(selectedInstructor.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedInstructor.updatedAt).toLocaleString()}</p>
              <p><strong>Last Login:</strong>{' '}
                {selectedInstructor.lastLogin
                  ? new Date(selectedInstructor.lastLogin).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedInstructor(null)}
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
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Expertise</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Courses</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr
                  key={instructor._id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="py-4 px-6 flex items-center space-x-3">
                    <img
                      src={'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg'}
                      alt={`${instructor.firstName} ${instructor.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => (e.target.src = '')}
                    />
                    <span className="text-sm text-gray-800 font-medium">{`${instructor.firstName} ${instructor.lastName}`}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{instructor.email}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{instructor.phone}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {instructor.expertise?.join(', ') || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{instructor.totalCourses}</td>
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        instructor.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {instructor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <button
                      onClick={() => openDetailsPopup(instructor)}
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
        {instructors.map((instructor) => (
          <div
            key={instructor._id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg'}
                alt={``}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => (e.target.src = '')}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{`${instructor.firstName} ${instructor.lastName}`}</h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    instructor.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {instructor.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email:</strong> {instructor.email}</p>
              <p><strong>Phone:</strong> {instructor.phone}</p>
              <p><strong>Expertise:</strong> {instructor.expertise?.join(', ') || 'N/A'}</p>
              <p><strong>Courses:</strong> {instructor.totalCourses}</p>
              <div className="mt-3">
                <button
                  onClick={() => openDetailsPopup(instructor)}
                  className="card-bg text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
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

export default ManageInstructor;