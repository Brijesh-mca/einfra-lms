import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaBook,
  FaChartLine,
  FaTicketAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../AuthContext';

export default function Sidebar({ onLinkClick }) {
  const { user, logout } = useAuth();
  const linkClass =
    'flex items-center gap-3 p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors duration-200 ease-in-out';
  const activeClass = 'text-black font-semibold';

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
  };

  const handleLogout = () => {
    logout();
    handleClick();
  };

  if (!user) return null; // Hide sidebar if not authenticated

  return (
    <div className="w-64 bg-white text-white border-r h-full flex flex-col justify-between rounded-xl shadow-md p-4 border-none">
      <div>
        <div className="flex items-center justify-left pl-[1rem] mb-8">
          <div className="text-xl font-bold text-cyan-500">LMS</div>
        </div>
        <nav className="space-y-2">
          <NavLink
            to="/"
            end
            onClick={handleClick}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaHome size={18} className="text-black" /> Dashboard
          </NavLink>
          <NavLink
            to="/manage-courses"
            onClick={handleClick}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaBook size={18} className="text-black" /> Manage Courses
          </NavLink>
          <NavLink
            to="/track-activities"
            onClick={handleClick}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaChartLine size={18} className="text-black" /> Track Activities
          </NavLink>
          <NavLink
            to="/view-ticket"
            onClick={handleClick}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaTicketAlt size={18} className="text-black" /> View Ticket
          </NavLink>
          <NavLink
            to="/manage-instructor"
            onClick={handleClick}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaChalkboardTeacher size={18} className="text-black" /> Manage Instructors
          </NavLink>
          <NavLink
            to="/manage-student"
            onClick={handleClick}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaUserGraduate size={18} className="text-black" /> Manage Student
          </NavLink>
         
         
        </nav>
      </div>
      <div className="mt-6">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="rounded-full w-10 h-10"
          />
          <div>
            <p className="text-sm font-semibold text-gray-700">{user.firstName}</p>
            <span className="text-xs text-green-800 bg-green-100 px-2 py-1 rounded-md">
              {user.role}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <NavLink
            to="/settings"
            onClick={handleClick}
            className={({ isActive }) =>
              isActive ? `${linkClass} ${activeClass}` : linkClass
            }
          >
            <FaCog size={16} className="text-black" /> Settings
          </NavLink>
          <NavLink
            to="/login"
            onClick={handleLogout}
            className={({ isActive }) =>
              isActive
                ? `${linkClass} ${activeClass} text-red-400`
                : `${linkClass} text-red-400`
            }
          >
            <FaSignOutAlt size={16} className="text-black" /> Log out
          </NavLink>
        </div>
      </div>
    </div>
  );
}