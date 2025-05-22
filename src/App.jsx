import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import ViewTicket from './pages/ViewTicket';
import TrackActivities from './pages/TrackActivities';
import Memberships from './pages/Allmember/Memberships';
import RevenuesReport from './pages/RevenueReport/RevenuesReport';
import ManageCourses from './pages/ManageCourses';
import ManageInstructor from './pages/ManageInstructor';
import ManageStudent from './pages/ManageStudent';
import CreateCourse from './components/Instructor_createCourse_component/createCourse';
import Setting from './pages/setting';
import { Menu } from 'lucide-react';
import { useAuth } from './AuthContext';
import MyCourses from './components/Instructor_myCourse_component/mycources';

// Child component to ensure useAuth is called inside AuthProvider
function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide sidebar on login page
  const isLoginPage = location.pathname === '/login';
  const showSidebar = isAuthenticated && !isLoginPage;

  return (
    <div className="min-h-screen flex bg-gray-50 mt-7">
      {/* Sidebar - Fixed on all screen sizes, only shown when authenticated and not on login page */}
      {showSidebar && (
        <>
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
        </>
      )}

      {/* Main Content - Adjust margin based on sidebar visibility */}
      <main className={`flex-1 ${showSidebar ? 'lg:ml-64' : 'ml-0'} p-4 overflow-x-auto`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-courses"
            element={
              <ProtectedRoute>
                <ManageCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-activities"
            element={
              <ProtectedRoute>
                <TrackActivities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-ticket"
            element={
              <ProtectedRoute>
                <ViewTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-instructor"
            element={
              <ProtectedRoute>
                <ManageInstructor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-student"
            element={
              <ProtectedRoute>
                <ManageStudent />
              </ProtectedRoute>
            }
          />
            <Route
            path="dashboard/create-course"
            element={
              <ProtectedRoute>
               <CreateCourse />
              </ProtectedRoute>
            }
          />

          
            <Route
            path="/dashboard/my-courses"
            element={
              <ProtectedRoute>
               <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memberships"
            element={
              <ProtectedRoute>
                <Memberships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revenues-report"
            element={
              <ProtectedRoute>
                <RevenuesReport />
              </ProtectedRoute>
            }
          />
           <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />
        </Routes>
        
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;