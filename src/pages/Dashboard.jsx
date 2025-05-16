import React from "react";
import { Star, Edit, Trash2, MoreVertical } from "lucide-react";
import { instructors, students } from "../data/instructors";
import { Link } from "react-router-dom";

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 w-full">{children}</div>
);

const InfoCard = ({ title, value, link, to }) => (
  <Card className="flex flex-col items-center justify-center">
    <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
    <div className="text-3xl font-bold">{value}</div>
    <Link to={to} className="text-sm text-teal-500 block mt-4 hover:underline">
      {link} →
    </Link>
  </Card>
);


const ProgressCard = ({ title, value, percent }) => {
  // Map percent (0-100) to strokeDasharray for 50-length arc
  const progress = (percent / 100) * 50;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg w-full">
      <h3 className="text-sm text-gray-700 font-medium">{title}</h3>
      <div className="relative flex items-center justify-center my-3">
        <svg width="150" height="100" viewBox="0 0 36 18">
          {/* Base Track */}
          <path
            d="M2 18 A16 16 0 0 1 34 18"
            fill="none"
            stroke="gray"
            strokeWidth="3"
          />
          {/* Progress Track */}
          <path
            d="M2 18 A16 16 0 0 1 34 18"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="4"
            strokeDasharray="42.2 50"
            strokeLinecap=""
          />
        </svg>

        {/* Center Text */}
        <div className="absolute text-2xl font-semibold mt-5">{value}%</div>
      </div>
      <a
        href="#"
        className="text-sm text-teal-500 hover:underline text-center block"
      >
        All goals →
      </a>
    </div>
  );
};

const UserList = ({ title, users }) => (
  <Card>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <a href="#" className="text-sm text-teal-500">
        Sort by Newest
      </a>
    </div>
    <ul className="space-y-2">
      {users.map((user, idx) => {
        const isHighlighted = idx === ""; // Highlight second item
        return (
          <li
            key={user.id}
            className={`flex items-center justify-between p-2 rounded-xl transition hover:bg-blue-50 ${
              isHighlighted ? "bg-teal-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full"
              />
              <div>
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-gray-500">
                  {user.company || user.school}
                </div>
              </div>
            </div>
            {isHighlighted && (
              <div className="flex items-center gap-2 text-gray-500">
                <Star
                  size={16}
                  className="cursor-pointer hover:text-yellow-500"
                />
                <Edit
                  size={16}
                  className="cursor-pointer hover:text-blue-500"
                />
                <Trash2
                  size={16}
                  className="cursor-pointer hover:text-red-500"
                />
                <MoreVertical size={16} className="cursor-pointer" />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  </Card>
);

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          title="Revenues"
          value="$500"
          link="Revenues report"
          to="/revenues-report"
        />
        <InfoCard
          title="Lost Membership"
          value="4%"
          link="All Membership"
          to="/memberships"
        />

      
      </div>

      {/* Instructors & Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserList title="Instructors" users={instructors} />
        <UserList title="Students" users={students} />
      </div>
    </div>
  );
}
