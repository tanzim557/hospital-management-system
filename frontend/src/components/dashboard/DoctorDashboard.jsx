import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../common/StatCard';
import DataTable from '../common/DataTable';
import api from '../../api/axios';
import { Calendar, Clock, FileText, CalendarDays } from 'lucide-react';
import '../../assets/styles/dashboard.css';

/**
 * DoctorDashboard
 *
 * Shows the doctor's own appointments and quick stats.
 */
export default function DoctorDashboard() {
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

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointment_date === todayStr);
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  const columns = [
    {
      key: 'patient',
      label: 'Patient',
      render: (row) => row.patient?.user?.name || 'N/A',
    },
    { key: 'appointment_date', label: 'Date' },
    { key: 'appointment_time', label: 'Time' },
    { key: 'reason', label: 'Reason', render: (row) => row.reason || '—' },
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
        <h2>Good day, Dr. {user?.name?.split(' ').pop()}</h2>
        <p>Review your schedule, check pending appointments, and manage patient consultations.</p>
        <div className="welcome-date" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarDays size={16} />
          <span>{today}</span>
        </div>
      </div>

      <div className="stats-grid stagger">
        <StatCard label="Today's Appointments" value={todayAppointments.length} icon={<Calendar size={24} />} color="blue" />
        <StatCard label="Pending Review" value={pendingCount} icon={<Clock size={24} />} color="amber" />
        <StatCard label="Total Appointments" value={appointments.length} icon={<FileText size={24} />} color="teal" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-grid-full">
          <DataTable
            title="My Appointments"
            columns={columns}
            data={appointments.slice(0, 10)}
            emptyMessage="No appointments assigned to you yet."
          />
        </div>
      </div>
    </div>
  );
}
