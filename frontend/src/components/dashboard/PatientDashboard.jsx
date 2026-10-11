import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../common/StatCard';
import DataTable from '../common/DataTable';
import api from '../../api/axios';
import { Calendar, CheckCircle2, FileText, CalendarDays } from 'lucide-react';
import '../../assets/styles/dashboard.css';

/**
 * PatientDashboard
 *
 * Shows the patient's own appointments and profile status.
 */
export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      const data = response.data.data || response.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const upcomingCount = appointments.filter(
    (a) => ['pending', 'confirmed'].includes(a.status)
  ).length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  const columns = [
    {
      key: 'doctor',
      label: 'Doctor',
      render: (row) => row.doctor?.user?.name || 'N/A',
    },
    { key: 'appointment_date', label: 'Date' },
    { key: 'appointment_time', label: 'Time' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const statusMap = {
          pending: 'badge-warning',
          confirmed: 'badge-info',
          completed: 'badge-success',
          cancelled: 'badge-danger',
        };
        return <span className={`badge ${statusMap[row.status]}`}>{row.status}</span>;
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="welcome-banner">
        <h2>Hello, {user?.name}</h2>
        <p>View your appointments, browse doctors, and manage your health profile.</p>
        <div className="welcome-date" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarDays size={16} />
          <span>{today}</span>
        </div>
      </div>

      <div className="stats-grid stagger">
        <StatCard label="Upcoming Appointments" value={upcomingCount} icon={<Calendar size={24} />} color="blue" />
        <StatCard label="Completed Visits" value={completedCount} icon={<CheckCircle2 size={24} />} color="green" />
        <StatCard label="Total Appointments" value={appointments.length} icon={<FileText size={24} />} color="teal" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-grid-full">
          <DataTable
            title="My Appointments"
            columns={columns}
            data={appointments.slice(0, 10)}
            emptyMessage="You haven't booked any appointments yet. Visit the Doctors page to get started."
          />
        </div>
      </div>
    </div>
  );
}
