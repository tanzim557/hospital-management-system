import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../common/StatCard';
import api from '../../api/axios';
import VerifyAppointmentModal from './VerifyAppointmentModal';
import QuickBookModal from '../public/QuickBookModal';
import { 
  Users, 
  Stethoscope, 
  UserCheck, 
  Calendar, 
  Clock, 
  FileText,
  CalendarDays,
  CalendarCheck,
  AlertCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Activity,
  Sparkles,
  ChevronRight,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  ExternalLink,
  PlusCircle,
  TrendingUp,
  HeartPulse,
  Brain,
  Award,
  Baby
} from 'lucide-react';
import '../../assets/styles/dashboard.css';
import '../../assets/styles/modal.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab & search filters for recent appointments
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'confirmed'
  const [tableSearch, setTableSearch] = useState('');

  // Verification modal state
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Quick book walk-in modal
  const [walkinModalOpen, setWalkinModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setRecentAppointments(response.data.recent_appointments || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerify = (row) => {
    setSelectedAppointment(row);
    setVerifyModalOpen(true);
  };

  const handleAppointmentUpdated = (updated) => {
    setRecentAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    // Refresh aggregate stats
    fetchDashboardData();
  };

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // Filtered appointments list
  const filteredAppointments = useMemo(() => {
    return recentAppointments.filter((apt) => {
      // Status filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) {
        return false;
      }
      // Text search
      if (tableSearch) {
        const q = tableSearch.toLowerCase();
        const pName = (apt.patient?.user?.name || apt.patient?.name || '').toLowerCase();
        const pPhone = (apt.patient?.user?.phone || apt.patient?.phone || '').toLowerCase();
        const dName = (apt.doctor?.user?.name || '').toLowerCase();
        const refId = `#med-apt-${apt.id}`.toLowerCase();
        if (!pName.includes(q) && !pPhone.includes(q) && !dName.includes(q) && !refId.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [recentAppointments, statusFilter, tableSearch]);

  const pendingAppointmentsList = useMemo(() => {
    return recentAppointments.filter(a => a.status === 'pending');
  }, [recentAppointments]);

  return (
    <div className="animate-fade-in admin-dashboard-root" style={{ paddingBottom: '3.5rem' }}>
      {/* ─── 1. Executive Welcome Hero & Operations Command Banner ─── */}
      <div className="figma-welcome-banner">
        <div className="banner-orb orb-1" />
        <div className="banner-orb orb-2" />
        <div className="banner-orb orb-3" />

        <div className="banner-content">
          <div className="banner-top-badge">
            <span className="badge-glow-dot" />
            <Sparkles size={13} color="#f59e0b" />
            <span>JCI USA ACCREDITED • TERTIARY HOSPITAL COMMAND CENTER</span>
          </div>

          <div className="banner-body-row">
            <div>
              <h1 className="banner-title">
                Welcome to MediCore Operations, <span className="banner-name">{user?.name || 'Administrator'}</span>
              </h1>
              <p className="banner-subtitle">
                Centralized command console for real-time outpatient triage, specialist rosters, 
                conflicting schedule resolution, and patient token verification.
              </p>

              <div className="banner-meta-pills">
                <div className="meta-pill">
                  <CalendarDays size={14} color="#38bdf8" />
                  <span>{todayStr}</span>
                </div>
                <div className="meta-pill">
                  <span className="live-pulse-dot" />
                  <span>OPD Active • Shift: Morning / Evening</span>
                </div>
                <div className="meta-pill">
                  <Phone size={13} color="#f37021" />
                  <span>Helpline 1066 Connected</span>
                </div>
              </div>
            </div>

            {/* Quick Banner Action Buttons */}
            <div className="banner-quick-actions">
              <Link to="/doctors" className="banner-action-btn primary" title="View Doctor Roster">
                <Stethoscope size={16} />
                <span>Doctor Roster & Free Slots</span>
                <ChevronRight size={14} />
              </Link>
              <button 
                type="button" 
                className="banner-action-btn secondary"
                onClick={() => setWalkinModalOpen(true)}
                title="Book Walk-in Patient"
              >
                <PlusCircle size={16} />
                <span>+ Book Walk-in Visit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Balanced 6-Card Executive Metrics Grid ─── */}
      <div className="figma-stats-grid">
        <StatCard
          label="Pending Approvals"
          value={stats?.pending_appointments || 0}
          icon={<AlertCircle size={22} />}
          color="rose"
          badge="Action Required"
          badgePulse={stats?.pending_appointments > 0}
          subtext="Patients waiting confirmation"
          onClick={() => setStatusFilter('pending')}
        />

        <StatCard
          label="Today's Appointments"
          value={stats?.today_appointments || 0}
          icon={<CalendarCheck size={22} />}
          color="amber"
          badge="Scheduled Today"
          subtext="OPD & video consultations"
        />

        <StatCard
          label="Doctors on Duty"
          value={stats?.total_doctors || 50}
          icon={<Stethoscope size={22} />}
          color="blue"
          badge="100% Active"
          subtext="Across 21 clinical units"
        />

        <StatCard
          label="Total Bookings"
          value={stats?.total_appointments || 0}
          icon={<FileText size={22} />}
          color="indigo"
          badge="+2 Today"
          subtext="Lifetime outpatient requests"
        />

        <StatCard
          label="Patient Profiles"
          value={stats?.total_patients || 0}
          icon={<UserCheck size={22} />}
          color="green"
          badge="+12% MoM"
          subtext="Verified electronic health records"
        />

        <StatCard
          label="System Users & Staff"
          value={stats?.total_users || 0}
          icon={<ShieldCheck size={22} />}
          color="purple"
          badge="Staff Accounts"
          subtext="Clinical, nursing & desk users"
        />
      </div>

      {/* ─── 3. Action Hub: Urgent Pending Appointment Requests ─── */}
      {pendingAppointmentsList.length > 0 && (
        <div className="pending-action-hub animate-fade-in">
          <div className="pending-hub-header">
            <div className="hub-header-left">
              <div className="hub-alert-icon-box">
                <AlertCircle size={22} />
              </div>
              <div>
                <div className="hub-badge-urgent">
                  <span className="urgent-dot" />
                  <span>ACTION REQUIRED</span>
                </div>
                <h3 className="hub-title">
                  {pendingAppointmentsList.length} Appointment Request{pendingAppointmentsList.length > 1 ? 's' : ''} Need Doctor Slot Confirmation!
                </h3>
                <p className="hub-subtitle">
                  Patients submitted their name and phone number. Check doctor availability schedule below to assign final consultation tokens.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-warning btn-sm"
              onClick={() => handleOpenVerify(pendingAppointmentsList[0])}
              style={{ fontWeight: 800, fontSize: '0.8125rem', padding: '0.55rem 1.15rem' }}
            >
              <span>Verify Next Request ({pendingAppointmentsList.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Pending Requests Cards Carousel / Grid */}
          <div className="pending-cards-grid">
            {pendingAppointmentsList.slice(0, 4).map((apt) => {
              const pName = apt.patient?.user?.name || apt.patient?.name || 'Walk-in Patient';
              const pPhone = apt.patient?.user?.phone || apt.patient?.phone || 'No phone provided';
              const dName = apt.doctor?.user?.name || 'Specialist';
              const dFormat = dName.startsWith('Dr.') ? dName : `Dr. ${dName}`;
              const aptDate = apt.appointment_date ? apt.appointment_date.split('T')[0] : 'Today';
              const aptTime = apt.appointment_time ? apt.appointment_time.slice(0, 5) : '10:00';

              return (
                <div key={apt.id} className="pending-request-card">
                  <div className="req-card-top">
                    <div className="req-patient-avatar">
                      {pName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="req-patient-info">
                      <strong className="req-name">{pName}</strong>
                      <span className="req-phone">
                        <Phone size={11} /> {pPhone}
                      </span>
                    </div>
                    <span className="req-ref-pill">#{apt.id}</span>
                  </div>

                  <div className="req-card-divider" />

                  <div className="req-doctor-meta">
                    <span className="meta-label">Requested Doctor:</span>
                    <strong className="meta-doc">{dFormat}</strong>
                    <span className="meta-spec">{apt.doctor?.specialization || 'Consultant'}</span>
                  </div>

                  <div className="req-slot-box">
                    <div className="slot-item">
                      <Calendar size={13} color="#2563eb" />
                      <span>{aptDate}</span>
                    </div>
                    <div className="slot-item">
                      <Clock size={13} color="#f59e0b" />
                      <span>{aptTime}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="req-verify-btn"
                    onClick={() => handleOpenVerify(apt)}
                  >
                    <span>Verify & Assign Slot</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 4. Hospital Operations: 2-Column Analytics Widgets ─── */}
      <div className="figma-analytics-row">
        {/* Left Column: Department Load & Bed Capacity */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <span className="card-tag">Clinical Units</span>
              <h3 className="card-title">Department Consultation Load</h3>
            </div>
            <span className="capacity-badge">OPD Active</span>
          </div>

          <div className="department-load-list">
            {[
              { name: 'Cardiology & Heart Institute', doctors: '12 Active Specialists', load: 88, color: '#ef4444', icon: HeartPulse },
              { name: 'Institute of Neurosciences', doctors: '8 Active Specialists', load: 72, color: '#0284c7', icon: Brain },
              { name: 'Robotic Orthopedics & Joint Care', doctors: '6 Active Specialists', load: 64, color: '#10b981', icon: Activity },
              { name: 'Oncology & Cancer Care', doctors: '7 Active Specialists', load: 92, color: '#d97706', icon: Award },
              { name: 'Pediatrics & Neonatal Care', doctors: '5 Active Specialists', load: 50, color: '#8b5cf6', icon: Baby },
            ].map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <div key={idx} className="dept-load-item">
                  <div className="dept-load-top">
                    <div className="dept-name-box">
                      <div className="dept-mini-icon" style={{ color: dept.color, background: `${dept.color}15` }}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <strong>{dept.name}</strong>
                        <span className="dept-docs">{dept.doctors}</span>
                      </div>
                    </div>
                    <div className="dept-pct-wrap">
                      <strong style={{ color: dept.color }}>{dept.load}%</strong>
                      <span className="dept-cap-sub">Capacity</span>
                    </div>
                  </div>

                  <div className="dept-progress-bar-bg">
                    <div 
                      className="dept-progress-bar-fill" 
                      style={{ width: `${dept.load}%`, background: dept.color }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="analytics-card-footer">
            <div className="footer-metric">
              <span>Avg Wait Time</span>
              <strong>14 Mins</strong>
            </div>
            <div className="footer-divider" />
            <div className="footer-metric">
              <span>Bed Occupancy</span>
              <strong>86% Full</strong>
            </div>
            <div className="footer-divider" />
            <div className="footer-metric">
              <span>Emergency Triage</span>
              <strong style={{ color: '#10b981' }}>Normal</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Doctor Availability Live Monitor */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <span className="card-tag">Roster Snapshot</span>
              <h3 className="card-title">Live Doctor Shift & Free Slots</h3>
            </div>
            <Link to="/doctors" className="card-header-link">
              <span>Full Roster (50) →</span>
            </Link>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0 0 1rem' }}>
            Next available specialists with open consultation slots today. Click to assign or book:
          </p>

          <div className="doctor-quick-roster-list">
            {[
              {
                id: 26,
                name: 'Dr. Kazi Shafiul',
                spec: 'Advanced Laparoscopic Surgery',
                dept: 'General Surgery',
                nextSlot: '10:00 AM',
                dutyHours: '09:00 AM – 05:00 PM',
                avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
                freeCount: 14
              },
              {
                id: 22,
                name: 'Dr. Mahmudur Rashid',
                spec: 'Cardiac Electrophysiology',
                dept: 'Cardiology',
                nextSlot: '10:30 AM',
                dutyHours: '09:00 AM – 04:00 PM',
                avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
                freeCount: 12
              },
              {
                id: 48,
                name: 'Dr. Jahangir Kabir',
                spec: 'Cardiovascular Surgery',
                dept: 'Cardiac Surgery',
                nextSlot: '11:00 AM',
                dutyHours: '08:30 AM – 04:00 PM',
                avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
                freeCount: 11
              },
              {
                id: 31,
                name: 'Dr. Farzana Sharmin',
                spec: 'Child Psychiatry',
                dept: 'Psychiatry',
                nextSlot: '01:30 PM',
                dutyHours: '01:00 PM – 07:00 PM',
                avatar: 'https://images.unsplash.com/photo-1594824813596-7875908b8b0e?auto=format&fit=crop&w=400&q=80',
                freeCount: 8
              }
            ].map((doc, idx) => (
              <div key={idx} className="quick-doc-row">
                <div className="doc-avatar-box">
                  <img src={doc.avatar} alt={doc.name} className="doc-avatar-img" />
                  <span className="doc-live-badge" />
                </div>

                <div className="doc-info-col">
                  <strong>{doc.name}</strong>
                  <span className="doc-spec-text">{doc.spec}</span>
                  <div className="doc-shift-tag">
                    <Clock size={11} /> {doc.dutyHours}
                  </div>
                </div>

                <div className="doc-action-col">
                  <div className="free-slot-pill">
                    <span className="free-dot" />
                    <span>Next: <strong>{doc.nextSlot}</strong></span>
                  </div>
                  <Link
                    to={`/doctors?search=${encodeURIComponent(doc.name)}`}
                    className="doc-roster-btn"
                    title="View slot breakdown"
                  >
                    <span>View Slots ({doc.freeCount})</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link 
              to="/doctors" 
              className="btn btn-outline btn-sm" 
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8125rem', padding: '0.5rem' }}
            >
              <span>Inspect All 50 Specialists & Schedule Slots</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 5. Recent Appointments & Bookings Management Console ─── */}
      <div className="figma-table-card">
        {/* Table Header with Title & Filter Controls */}
        <div className="table-card-topbar">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Calendar size={13} />
              <span>Outpatient Desk</span>
            </div>
            <h2 className="table-card-title">Recent Appointments & Booking Stream</h2>
            <p className="table-card-subtitle">
              Verified clinical consultations, pending patient requests, and scheduled doctor OPD visits.
            </p>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="table-controls-wrap">
            {/* Filter Tabs */}
            <div className="table-tabs">
              {[
                { id: 'all', label: `All (${recentAppointments.length})` },
                { id: 'pending', label: `⚠️ Pending (${stats?.pending_appointments || 0})` },
                { id: 'confirmed', label: `✅ Confirmed (${recentAppointments.filter(a => a.status === 'confirmed').length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`table-tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="table-search-box">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search patient, doctor, phone..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="table-search-input"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <div className="btn-spinner" style={{ width: '30px', height: '30px', margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600 }}>Loading appointment records...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <Calendar size={42} style={{ margin: '0 auto 1rem', opacity: 0.35 }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
              No appointments found
            </h4>
            <p style={{ fontSize: '0.85rem' }}>
              {statusFilter !== 'all' || tableSearch 
                ? 'Try resetting the search or filter tab to view all bookings.' 
                : 'Appointments booked by patients will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="figma-table-container">
            <table className="figma-table">
              <thead>
                <tr>
                  <th>PATIENT DETAILS</th>
                  <th>ASSIGNED SPECIALIST</th>
                  <th>CONSULTATION DATE</th>
                  <th>SLOT TIME</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((row) => {
                  const pName = row.patient?.user?.name || row.patient?.name || 'Walk-in Patient';
                  const pPhone = row.patient?.user?.phone || row.patient?.phone || 'No phone';
                  const dName = row.doctor?.user?.name || 'Specialist';
                  const dFormatted = dName.startsWith('Dr.') ? dName : `Dr. ${dName}`;
                  const docAvatar = row.doctor?.user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                  const isPending = row.status === 'pending';
                  const isConfirmed = row.status === 'confirmed';

                  return (
                    <tr key={row.id} className={isPending ? 'row-pending-highlight' : ''}>
                      {/* Patient Details */}
                      <td>
                        <div className="cell-patient">
                          <div className="patient-avatar-circle">
                            {pName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="patient-name-row">
                              <strong>{pName}</strong>
                              <span className="patient-ref-id">#MED-APT-{row.id}</span>
                            </div>
                            <span className="patient-phone-sub">
                              <Phone size={11} /> {pPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Doctor & Specialty */}
                      <td>
                        <div className="cell-doctor">
                          <img 
                            src={docAvatar} 
                            alt={dFormatted} 
                            className="doc-mini-thumb" 
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div>
                            <strong className="doc-name">{dFormatted}</strong>
                            <span className="doc-dept-badge">
                              {row.doctor?.specialization || row.doctor?.department?.name || 'Consultant'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td>
                        <div className="cell-date">
                          <Calendar size={13} color="#2563eb" />
                          <span>{row.appointment_date?.split('T')[0]}</span>
                        </div>
                      </td>

                      {/* Slot Time */}
                      <td>
                        <div className="cell-time">
                          <Clock size={13} color="#f59e0b" />
                          <span>{row.appointment_time?.slice(0, 5) || '10:00'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        {isPending ? (
                          <span className="status-pill-figma pending">
                            <span className="status-dot-pulse" />
                            <span>Pending Review</span>
                          </span>
                        ) : isConfirmed ? (
                          <span className="status-pill-figma confirmed">
                            <CheckCircle2 size={12} />
                            <span>Confirmed</span>
                          </span>
                        ) : (
                          <span className="status-pill-figma neutral">
                            <span>{row.status}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        {isPending ? (
                          <button
                            type="button"
                            className="btn-figma-primary"
                            onClick={() => handleOpenVerify(row)}
                            title="Verify doctor availability and finalize slot"
                          >
                            <ShieldCheck size={14} />
                            <span>Verify & Finalize</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-figma-secondary"
                            onClick={() => handleOpenVerify(row)}
                            title="Edit or reschedule appointment"
                          >
                            <span>Manage</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL: Admin Verify & Finalize Modal ─── */}
      <VerifyAppointmentModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        appointment={selectedAppointment}
        onAppointmentUpdated={handleAppointmentUpdated}
      />

      {/* ─── MODAL: Book Walk-In Modal ─── */}
      <QuickBookModal
        isOpen={walkinModalOpen}
        onClose={() => setWalkinModalOpen(false)}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
}
