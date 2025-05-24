import { useState, useEffect } from 'react';
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
import CourseEditor from './components/Instructor_createCourse_component/courseEditor';
import Setting from './pages/setting';
import { Menu } from 'lucide-react';
import { useAuth } from './AuthContext';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(true);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isLoginPage = location.pathname === '/login';
  const showSidebar = isAuthenticated && !isLoginPage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setShowMenuButton(false);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setShowMenuButton(true);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
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

          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 backdrop-blur-sm bg-transparent lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {!sidebarOpen && showMenuButton && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed top-4 right-1 z-50 p-2 bg-white rounded shadow-md"
            >
              <Menu />
            </button>
          )}
        </>
      )}

      <main className={`flex-1 ${showSidebar ? 'lg:ml-64' : 'ml-0'} overflow-x-auto`}>
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
            path="/dashboard/create-course"
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/course-editor/:courseId"
            element={
              <ProtectedRoute>
                <CourseEditor />
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