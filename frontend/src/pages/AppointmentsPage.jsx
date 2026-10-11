import { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VerifyAppointmentModal from '../components/dashboard/VerifyAppointmentModal';
import QuickBookModal from '../components/public/QuickBookModal';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  User, 
  Plus, 
  CalendarCheck,
  Filter,
  Sparkles,
  Search,
  MapPin
} from 'lucide-react';
import '../assets/styles/modal.css';

/**
 * AppointmentsPage
 *
 * Lists appointments with role-filtered access.
 * Admin/Receptionist can:
 * - See incoming patient requests (Name + Phone).
 * - Filter by Pending, Confirmed, Completed, Cancelled.
 * - Verify doctor availability and finalize the slot.
 */
export default function AppointmentsPage() {
  const { user } = useAuth();
  const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;
  const isAdminOrStaff = ['admin', 'receptionist', 'nurse'].includes(userRole);

  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await api.get('/appointments', { params });
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerify = (row) => {
    setSelectedAppointment(row);
    setVerifyModalOpen(true);
  };

  const handleAppointmentUpdated = (updatedApp) => {
    setAppointments((prev) => 
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
    );
    // Refresh to get updated counters
    fetchAppointments();
  };

  // Compute counts
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  // Filter by local search query (patient name, phone, doctor name)
  const filteredAppointments = appointments.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const patName = app.patient?.user?.name?.toLowerCase() || '';
    const patPhone = app.patient?.user?.phone?.toLowerCase() || '';
    const docName = app.doctor?.user?.name?.toLowerCase() || '';
    const reason = app.reason?.toLowerCase() || '';
    return patName.includes(q) || patPhone.includes(q) || docName.includes(q) || reason.includes(q);
  });

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary-600)', fontSize: '0.8125rem' }}>
          #MED-{row.id}
        </span>
      ),
    },
    {
      key: 'patient',
      label: 'Patient Details',
      render: (row) => {
        const patUser = row.patient?.user;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {patUser?.name || 'Walk-in Patient'}
            </strong>
            {patUser?.phone ? (
              <a 
                href={`tel:${patUser.phone}`} 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.3rem', 
                  fontSize: '0.8125rem', 
                  color: 'var(--color-primary-600)',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
                title="Click to call patient"
              >
                <Phone size={12} />
                <span>{patUser.phone}</span>
              </a>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No phone</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'doctor',
      label: 'Doctor & Department',
      render: (row) => {
        const name = row.doctor?.user?.name || 'Doctor';
        const docTitle = name.startsWith('Dr.') ? name : `Dr. ${name}`;
        const dept = row.doctor?.department?.name || row.doctor?.specialization || 'General';
        const campus = row.doctor?.campus || 'Dhaka Main Hospital';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              {docTitle}
            </strong>
            <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
              {dept}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <MapPin size={10} /> {campus}
            </span>
          </div>
        );
      },
    },
    { 
      key: 'appointment_date', 
      label: 'Date & Time',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            {row.appointment_date?.split('T')[0]}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <Clock size={12} color="var(--color-primary-500)" />
            {row.appointment_time?.slice(0, 5) || 'Morning'}
          </span>
        </div>
      )
    },
    { 
      key: 'reason', 
      label: 'Symptoms / Notes', 
      render: (row) => (
        <div style={{ maxWidth: 220, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
          {row.reason || '—'}
        </div>
      )
    },
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
        const labelMap = {
          pending: 'Pending Review',
          confirmed: 'Confirmed',
          completed: 'Completed',
          cancelled: 'Cancelled',
        };
        return (
          <span className={`badge ${statusMap[row.status] || 'badge-neutral'}`} style={{ fontWeight: 700 }}>
            {labelMap[row.status] || row.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Admin Action',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {row.status === 'pending' ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleOpenVerify(row)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                boxShadow: '0 2px 6px rgba(14, 165, 233, 0.3)',
              }}
              title="Check doctor schedule and finalize slot"
            >
              <CalendarCheck size={14} />
              <span>Verify & Finalize</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleOpenVerify(row)}
              style={{
                fontSize: '0.78125rem',
                padding: '0.35rem 0.75rem',
              }}
              title="View or modify appointment"
            >
              <span>Manage Slot</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  const statusTabs = [
    { id: '', label: 'All Appointments' },
    { id: 'pending', label: 'Pending Review', count: pendingCount, isAlert: true },
    { id: 'confirmed', label: 'Confirmed', count: confirmedCount },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary-600)', fontSize: '0.78125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            <CalendarCheck size={14} />
            <span>CLINICAL SCHEDULING & FRONT-DESK</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '1.85rem', fontWeight: 800 }}>Appointments Management</h1>
          <p className="page-subtitle">
            Review incoming patient requests, verify doctor availability in real-time, and finalize consultation slots.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setBookModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700,
            }}
          >
            <Plus size={16} />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Pending Approvals Urgent Attention Alert Banner */}
      {pendingCount > 0 && !statusFilter && (
        <div 
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.05))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '0.85rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                background: '#fef3c7', 
                color: '#d97706', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertCircle size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {pendingCount} Pending Patient Appointment Request{pendingCount > 1 ? 's' : ''} Awaiting Admin Verification!
              </strong>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Patients submitted their name and phone number. Check the doctor's free slots and finalize their tokens.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-warning btn-sm"
            onClick={() => setStatusFilter('pending')}
            style={{
              fontWeight: 700,
              fontSize: '0.8125rem',
              padding: '0.45rem 1rem',
              whiteSpace: 'nowrap',
            }}
          >
            View Pending Requests ({pendingCount})
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '1rem', 
          flexWrap: 'wrap',
          marginBottom: '1.25rem' 
        }}
      >
        {/* Status Pill Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: isActive ? 'var(--color-primary-500)' : 'var(--border-color)',
                  background: isActive ? 'var(--color-primary-500)' : 'var(--bg-surface)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(14, 165, 233, 0.25)' : 'none',
                }}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '9999px',
                      background: isActive 
                        ? 'rgba(255, 255, 255, 0.25)' 
                        : tab.isAlert ? '#fef3c7' : 'var(--bg-base)',
                      color: isActive 
                        ? '#fff' 
                        : tab.isAlert ? '#d97706' : 'var(--text-primary)',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search patient, phone, doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '2.4rem',
              height: 38,
              fontSize: '0.8125rem',
              borderRadius: '0.65rem',
            }}
          />
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem' }}>
          <div className="spinner spinner-lg" />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Loading appointment records...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredAppointments}
          emptyMessage={
            searchQuery 
              ? `No appointments found matching "${searchQuery}".` 
              : statusFilter 
                ? `No ${statusFilter} appointments found.` 
                : 'No appointments scheduled yet.'
          }
        />
      )}

      {/* Admin Verify & Finalize Modal */}
      <VerifyAppointmentModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        appointment={selectedAppointment}
        onAppointmentUpdated={handleAppointmentUpdated}
      />

      {/* Frictionless Public/Walk-in Quick Booking Modal */}
      <QuickBookModal
        isOpen={bookModalOpen}
        onClose={() => {
          setBookModalOpen(false);
          fetchAppointments();
        }}
      />
    </div>
  );
}
