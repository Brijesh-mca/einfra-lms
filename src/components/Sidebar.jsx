import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Book,
  Activity,
  Ticket,
  Presentation,
  GraduationCap,
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar({ onLinkClick }) {
  const linkBase = 'flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100';
  const activeStyle = 'bg-gray-200 font-semibold';

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <aside className="w-64 bg h-screen p-4 shadow-md flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold text-center mb-8">LMS</div>
        <nav className="space-y-2">
          <NavLink
            to="/"
            onClick={handleClick}
            className={({ isActive }) => `${linkBase} ${isActive ? activeStyle : ''}`}
          >
            <Home size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/manage-courses"
            onClick={handleClick}
            className={({ isActive }) => `${linkBase} ${isActive ? activeStyle : ''}`}
          >
            <Book size={18} /> Manage Courses
          </NavLink>
          <NavLink
            to="/track-activities"
            onClick={handleClick}
            className={({ isActive }) => `${linkBase} ${isActive ? activeStyle : ''}`}
          >
            <Activity size={18} /> Track Activities
          </NavLink>
          <NavLink
            to="/view-ticket"
            onClick={handleClick}
            className={({ isActive }) => `${linkBase} ${isActive ? activeStyle : ''}`}
          >
            <Ticket size={18} /> View Ticket
          </NavLink>
          <NavLink
            to="/manage-instructor"
            onClick={handleClick}
            className={({ isActive }) => `${linkBase} ${isActive ? activeStyle : ''}`}
          >
            <Presentation size={18} /> Manage Instructors
          </NavLink>
          <NavLink
            to="/manage-student"
            onClick={handleClick}
            className={({ isActive }) => `${linkBase} ${isActive ? activeStyle : ''}`}
          >
            <GraduationCap size={18} /> Manage Student
          </NavLink>
        </nav>
      </div>
      <div>
        <div className="text-sm mb-1">
          Admin <span className="text-xs bg-green-100 text-green-800 px-2 rounded">Admin</span>
        </div>
        <NavLink
          to="/settings"
          onClick={handleClick}
          className="block text-sm text-gray-600 flex items-center gap-2"
        >
          <Settings size={16} /> Settings
        </NavLink>
        <button className="text-sm text-red-500 mt-2 flex items-center gap-2">
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}
