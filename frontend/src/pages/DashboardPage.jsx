import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import DoctorDashboard from '../components/dashboard/DoctorDashboard';
import PatientDashboard from '../components/dashboard/PatientDashboard';
import StaffDashboard from '../components/dashboard/StaffDashboard';

/**
 * DashboardPage
 *
 * Renders role-tailored clinical and administrative command centers:
 * - Admin: Hospital analytics, user management, financial payroll
 * - Doctor: Physician consultation roster and patient queue
 * - Patient: Booking history, doctor discovery, visits
 * - Nurse / Receptionist / Staff: Clinical desk, verification, patient intake
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const roleName = typeof user?.role === 'object' ? user?.role?.name : user?.role;

  switch (roleName) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'patient':
      return <PatientDashboard />;
    case 'nurse':
    case 'receptionist':
    default:
      return <StaffDashboard />;
  }
}
