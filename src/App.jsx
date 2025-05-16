import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ViewTicket from './pages/ViewTicket';
import TrackActivities from './pages/TrackActivities';
import Memberships from './pages/Memberships';
import RevenuesReport from './pages/RevenuesReport';
import ManageCourses from './pages/ManageCourses';
import ManageInstructor from './pages/ManageInstructor';
import ManageStudent from './pages/ManageStudent';

import { Menu } from 'lucide-react'; // or use emoji/icon if you prefer

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 mt-7">
      {/* Sidebar - Fixed on all screen sizes */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40 bg-white shadow-md
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <Sidebar onLinkClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded shadow-md"
      >
        <Menu />
      </button>

      {/* Main Content - with left margin for sidebar on desktop */}
      <main className="flex-1 ml-0 lg:ml-64 p-4 overflow-x-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-courses" element={<ManageCourses />} />
          <Route path="/track-activities" element={<TrackActivities />} />
          <Route path="/view-ticket" element={<ViewTicket />} />
          <Route path="/manage-instructor" element={<ManageInstructor />} />
          <Route path="/manage-student" element={<ManageStudent />} />
         
{/* //inside the admin panel */}
          <Route path="/memberships" element={<Memberships />} />
        
          <Route path="/revenues-report" element={<RevenuesReport />} />

        </Routes>
      </main>
    </div>
  );
}
export default App;