import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../common/StatCard';
import DataTable from '../common/DataTable';
import api from '../../api/axios';
import { 
  Calendar, 
  Clock, 
  Users, 
  Stethoscope, 
  CalendarDays, 
  ArrowRight, 
  Activity, 
  UserCheck, 
  Phone,
  ShieldCheck
} from 'lucide-react';
import '../../assets/styles/dashboard.css';

/**
 * StaffDashboard
 *
 * Dedicated clinical dashboard for Nurses, Receptionists, and Front Desk Staff.
 * Offers fast access to daily appointments, patient intake, and doctor availability.
 */
export default function StaffDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [apptsRes, patientsRes, docsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/patients').catch(() => ({ data: { data: [] } })),
        api.get('/doctors?per_page=100').catch(() => ({ data: { data: [] } })),
      ]);

      const appts = apptsRes.data?.data || apptsRes.data || [];
      const patients = patientsRes.data?.data || patientsRes.data || [];
      const docs = docsRes.data?.data || docsRes.data || [];

      setAppointments(Array.isArray(appts) ? appts : []);
      setPatientsCount(patients.length);
      setDoctorsCount(docs.length);
    } catch (error) {
      console.error('Failed to load staff dashboard:', error);
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
  const todayAppointments = appointments.filter((a) => a.appointment_date?.startsWith(todayStr));
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  const roleTitle = user?.role === 'nurse' ? 'Senior Nursing Officer' : (user?.role_display || 'Clinical Staff');

  const columns = [
    {
      key: 'id',
      label: 'Ref ID',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary-600)', fontSize: '0.8125rem' }}>
          #MED-{row.id}
        </span>
      ),
    },
    {
      key: 'patient',
      label: 'Patient Name & Phone',
      render: (row) => {
        const pName = row.patient?.user?.name || 'Walk-in Patient';
        const pPhone = row.patient?.user?.phone;
        return (
          <div>
            <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.875rem' }}>{pName}</strong>
            {pPhone && (
              <span style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Phone size={11} /> {pPhone}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'doctor',
      label: 'Consulting Physician',
      render: (row) => {
        const dName = row.doctor?.user?.name || 'Doctor';
        return (
          <div>
            <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              {dName.startsWith('Dr.') ? dName : `Dr. ${dName}`}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-600)', fontWeight: 600 }}>
              {row.doctor?.department?.name || 'Clinical Dept'}
            </span>
          </div>
        );
      },
    },
    { key: 'appointment_time', label: 'Slot Time' },
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
        return <span className={`badge ${statusMap[row.status] || 'badge-warning'}`}>{row.status}</span>;
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
      {/* ─── Top Clinical Banner ─── */}
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0d9488 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', fontSize: '0.78125rem', fontWeight: 600, color: '#ecfdf5', marginBottom: '0.5rem' }}>
              <Activity size={13} />
              <span>Nursing & Clinical Reception Station</span>
            </div>
            <h2>Welcome, {user?.name}</h2>
            <p style={{ color: '#d1fae5', maxWidth: '600px' }}>
              You are signed in as <strong>{roleTitle}</strong>. Monitor incoming patient requests, verify doctor schedules, and assist patients with walk-in consultations.
            </p>
          </div>
          <div className="welcome-date" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', color: '#ffffff' }}>
            <CalendarDays size={16} />
            <span>{today}</span>
          </div>
        </div>
      </div>

      {/* ─── Metric Stat Cards ─── */}
      <div className="stats-grid stagger">
        <StatCard 
          label="Today's Patient Visits" 
          value={todayAppointments.length} 
          icon={<Calendar size={24} />} 
          color="blue" 
        />
        <StatCard 
          label="Pending Verification" 
          value={pendingCount} 
          icon={<Clock size={24} />} 
          color="amber" 
        />
        <StatCard 
          label="Confirmed Visits" 
          value={confirmedCount} 
          icon={<UserCheck size={24} />} 
          color="green" 
        />
        <StatCard 
          label="Doctors on Duty" 
          value={doctorsCount || 51} 
          icon={<Stethoscope size={24} />} 
          color="teal" 
        />
      </div>

      {/* ─── Quick Clinical Action Bar ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        margin: '1.5rem 0'
      }}>
        <Link 
          to="/appointments" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s'
          }}
        >
          <div>
            <strong style={{ display: 'block', fontSize: '0.9375rem', marginBottom: '0.2rem' }}>Verify Appointments</strong>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{pendingCount} patient requests waiting</span>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <Clock size={18} />
          </div>
        </Link>

        <Link 
          to="/patients" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s'
          }}
        >
          <div>
            <strong style={{ display: 'block', fontSize: '0.9375rem', marginBottom: '0.2rem' }}>Patient Registry</strong>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{patientsCount || 5} registered records</span>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <Users size={18} />
          </div>
        </Link>

        <Link 
          to="/doctors" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s'
          }}
        >
          <div>
            <strong style={{ display: 'block', fontSize: '0.9375rem', marginBottom: '0.2rem' }}>Doctor Roster & Shifts</strong>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>51 Specialists across 21 Departments</span>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Stethoscope size={18} />
          </div>
        </Link>
      </div>

      {/* ─── Active Appointments Table ─── */}
      <div className="dashboard-grid">
        <div className="dashboard-grid-full">
          <DataTable
            title="Incoming Patient Consultations"
            columns={columns}
            data={appointments.slice(0, 10)}
            emptyMessage="No pending patient appointments right now."
          />
        </div>
      </div>
    </div>
  );
}
