import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Dedicated Pages
import HomePage from './pages/HomePage';
import SpecialtiesPage from './pages/SpecialtiesPage';
import FindDoctorsPage from './pages/FindDoctorsPage';
import ProHealthPage from './pages/ProHealthPage';
import CentresOfExcellencePage from './pages/CentresOfExcellencePage';
import InternationalCarePage from './pages/InternationalCarePage';
import AboutHospitalPage from './pages/AboutHospitalPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import TrackAppointmentPage from './pages/TrackAppointmentPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import UserManagementPage from './pages/UserManagementPage';
import SalaryManagementPage from './pages/SalaryManagementPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout Components
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Styles
import './assets/styles/index.css';
import './assets/styles/components.css';

/**
 * AppLayout
 *
 * Authenticated layout shell with sidebar and navbar.
 * Wraps all protected routes.
 */
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile sidebar backdrop — clicking it closes the sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar
          title="MediCore HMS"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/**
 * App
 *
 * Root component with routing configuration.
 * - Public separate pages: HomePage (Hero only), Specialties, Find Doctors,
 *   ProHealth Checkups, Centres of Excellence, International Care, About Hospital
 * - Auth routes: login, register
 * - Protected routes: dashboard, patients, doctors roster & availability, appointments, user management
 */
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Standalone Dedicated Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/specialties" element={<SpecialtiesPage />} />
            <Route path="/find-doctors" element={<FindDoctorsPage />} />
            <Route path="/prohealth" element={<ProHealthPage />} />
            <Route path="/centres-of-excellence" element={<CentresOfExcellencePage />} />
            <Route path="/excellence" element={<CentresOfExcellencePage />} />
            <Route path="/international-care" element={<InternationalCarePage />} />
            <Route path="/about" element={<AboutHospitalPage />} />
            <Route path="/book-appointment" element={<BookAppointmentPage />} />
            <Route path="/book" element={<BookAppointmentPage />} />
            <Route path="/track-appointment" element={<TrackAppointmentPage />} />
            <Route path="/track-status" element={<TrackAppointmentPage />} />
            <Route path="/track" element={<TrackAppointmentPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes — wrapped in AppLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/dashboard/doctors" element={<DoctorsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/admin/salary" element={<SalaryManagementPage />} />
              <Route path="/salary" element={<SalaryManagementPage />} />
              <Route path="/admin/payroll" element={<SalaryManagementPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
