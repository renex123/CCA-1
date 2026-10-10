import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute, DashboardRedirect } from './components/auth/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { TimetablePage } from './pages/TimetablePage';
import { AttendancePage } from './pages/AttendancePage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { CampusServicesPage } from './pages/CampusServicesPage';
import { CampusMapPage } from './pages/CampusMapPage';
import { CampusEventsPage } from './pages/CampusEventsPage';
import { CampusAIPage } from './pages/CampusAIPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { DepartmentManagementPage } from './pages/DepartmentManagementPage';
import { AnalyticsReportsPage } from './pages/AnalyticsReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Application Routes inside Master Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard Auto-Router based on role */}
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route
                path="/dashboard/faculty"
                element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                    <FacultyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Core Shared Campus Features */}
              <Route path="/profile" element={<StudentProfilePage />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/services" element={<CampusServicesPage />} />
              <Route path="/map" element={<CampusMapPage />} />
              <Route path="/events" element={<CampusEventsPage />} />
              <Route path="/ai" element={<CampusAIPage />} />

              {/* Administrative Only Routes */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/departments"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DepartmentManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AnalyticsReportsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Error Pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
