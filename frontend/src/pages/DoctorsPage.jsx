import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Activity,
  Award,
  ArrowRight,
  ShieldCheck,
  Building2,
  CalendarDays,
  User,
  Phone,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';
import QuickBookModal from '../components/public/QuickBookModal';
import api from '../api/axios';
import '../assets/styles/dashboard.css';
import '../assets/styles/modal.css';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to format ISO date to YYYY-MM-DD in local time
function getLocalDateString(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format 24h HH:mm to 12h AM/PM
function formatTime12(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours, 10);
  const m = minutes ? minutes.slice(0, 2) : '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

// Generate 30-min slot array between from (e.g. 09:00) and to (e.g. 17:00)
function generateSlots(fromStr = '09:00', toStr = '17:00') {
  const slots = [];
  const fromClean = fromStr.slice(0, 5);
  const toClean = toStr.slice(0, 5);

  let [h, m] = fromClean.split(':').map(Number);
  const [endH, endM] = toClean.split(':').map(Number);
  const endTotal = endH * 60 + endM;

  while (h * 60 + m < endTotal) {
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const time24 = `${hh}:${mm}`;
    slots.push({
      time: time24,
      label: formatTime12(time24),
    });

    m += 30;
    if (m >= 60) {
      h += Math.floor(m / 60);
      m = m % 60;
    }
  }
  return slots;
}

export default function DoctorsPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  // State
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [selectedDept, setSelectedDept] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'free_today' | 'off_duty'
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Modals
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [prefilledSlot, setPrefilledSlot] = useState(null);

  // Doctor Detail / Roster Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState(null);
  const [detailAvailability, setDetailAvailability] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Derive day of week for selectedDate
  const currentDayName = useMemo(() => {
    if (!selectedDate) return '';
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return DAYS_OF_WEEK[dateObj.getDay()];
  }, [selectedDate]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [docsRes, deptsRes, aptsRes] = await Promise.all([
        api.get('/doctors', { params: { per_page: 100 } }),
        api.get('/departments'),
        api.get('/appointments', { params: { per_page: 200 } }).catch(() => ({ data: { data: [] } }))
      ]);

      setDoctors(docsRes.data.data || docsRes.data || []);
      setDepartments(deptsRes.data.data || deptsRes.data || []);
      setAppointments(aptsRes.data?.data || aptsRes.data || []);
    } catch (err) {
      console.error('Failed to load doctors roster:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open booking modal prefilled with doctor, date, and specific time slot
  const handleOpenBooking = (doc, slotTime = null) => {
    setBookingDoctor(doc);
    setPrefilledSlot({
      date: selectedDate,
      time: slotTime
    });
    setBookModalOpen(true);
  };

  // Open full detailed daily schedule modal for a specific doctor
  const handleOpenDoctorDetail = async (doc) => {
    setSelectedDoctorDetail(doc);
    setDetailModalOpen(true);
    setLoadingDetail(true);
    try {
      const res = await api.get(`/doctors/${doc.id}/availability`, {
        params: { date: selectedDate }
      });
      setDetailAvailability(res.data);
    } catch (err) {
      console.error('Could not fetch doctor schedule:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Quick Date Navigation
  const handleShiftDate = (days) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    setSelectedDate(getLocalDateString(dateObj));
  };

  const handleSetToday = () => {
    setSelectedDate(getLocalDateString());
  };

  const handleSetTomorrow = () => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 1);
    setSelectedDate(getLocalDateString(dateObj));
  };

  // Check appointments map for doctor on selected date
  const bookedSlotsMap = useMemo(() => {
    const map = {}; // key: `${doctor_id}_${slotTime}` => appointment
    appointments.forEach((apt) => {
      if (apt.status === 'cancelled') return;
      const aptDate = apt.appointment_date ? apt.appointment_date.split('T')[0] : '';
      if (aptDate === selectedDate && apt.doctor_id) {
        const timeKey = apt.appointment_time ? apt.appointment_time.slice(0, 5) : '';
        map[`${apt.doctor_id}_${timeKey}`] = apt;
      }
    });
    return map;
  }, [appointments, selectedDate]);

  // Compute processed doctors with availability
  const processedDoctors = useMemo(() => {
    return doctors.map((doc) => {
      const availableDays = Array.isArray(doc.available_days)
        ? doc.available_days
        : (typeof doc.available_days === 'string' ? JSON.parse(doc.available_days || '[]') : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

      const isWorkingToday = availableDays.includes(currentDayName);
      const fromStr = doc.available_from ? doc.available_from.slice(0, 5) : '09:00';
      const toStr = doc.available_to ? doc.available_to.slice(0, 5) : '17:00';
      const allSlots = isWorkingToday ? generateSlots(fromStr, toStr) : [];

      const slotsWithStatus = allSlots.map((slot) => {
        const booked = bookedSlotsMap[`${doc.id}_${slot.time}`];
        return {
          ...slot,
          isBooked: !!booked,
          appointment: booked || null
        };
      });

      const freeSlots = slotsWithStatus.filter(s => !s.isBooked);
      const bookedSlots = slotsWithStatus.filter(s => s.isBooked);

      return {
        ...doc,
        availableDays,
        isWorkingToday,
        fromStr,
        toStr,
        slots: slotsWithStatus,
        freeSlots,
        bookedSlots,
        totalSlotsCount: slotsWithStatus.length,
        freeSlotsCount: freeSlots.length,
      };
    });
  }, [doctors, currentDayName, bookedSlotsMap]);

  // Filter doctors based on department, availability filter, and search
  const filteredDoctors = useMemo(() => {
    return processedDoctors.filter((doc) => {
      // Dept filter
      if (selectedDept && String(doc.department_id) !== String(selectedDept)) {
        return false;
      }

      // Availability filter
      if (availabilityFilter === 'free_today') {
        if (!doc.isWorkingToday || doc.freeSlotsCount === 0) return false;
      } else if (availabilityFilter === 'off_duty') {
        if (doc.isWorkingToday) return false;
      }

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const docName = (doc.user?.name || '').toLowerCase();
        const spec = (doc.specialization || '').toLowerCase();
        const dept = (doc.department?.name || '').toLowerCase();
        if (!docName.includes(query) && !spec.includes(query) && !dept.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [processedDoctors, selectedDept, availabilityFilter, searchTerm]);

  // Overall statistics for the selected date
  const stats = useMemo(() => {
    const totalWorking = processedDoctors.filter(d => d.isWorkingToday).length;
    const totalFreeSlots = processedDoctors.reduce((acc, d) => acc + (d.isWorkingToday ? d.freeSlotsCount : 0), 0);
    const totalBookedToday = processedDoctors.reduce((acc, d) => acc + (d.isWorkingToday ? d.bookedSlots.length : 0), 0);
    return {
      totalDoctors: processedDoctors.length,
      totalWorking,
      totalFreeSlots,
      totalBookedToday
    };
  }, [processedDoctors]);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3.5rem' }}>
      {/* ─── 1. Header Banner & Title ─── */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-apollo-orange)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            <Clock size={16} />
            <span>Hospital Clinical Roster & Doctor Free Slots</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '1.85rem', fontWeight: 800 }}>Doctor Availability & Schedule</h1>
          <p className="page-subtitle" style={{ maxWidth: '750px' }}>
            Live roster showing which doctors are working, their scheduled hours, and real-time free consultation slots for any date.
          </p>
        </div>

        <Link to="/appointments" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <CalendarDays size={16} />
          <span>All Appointments</span>
        </Link>
      </div>

      {/* ─── 2. Interactive Date Selector Strip ─── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '1.15rem 1.25rem',
        border: '1px solid var(--border-color)',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        {/* Date Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              className="btn btn-neutral btn-sm"
              onClick={() => handleShiftDate(-1)}
              title="Previous Day"
              style={{ padding: '0.45rem 0.65rem' }}
            >
              <ChevronLeft size={16} />
            </button>

            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '0.45rem 0.85rem 0.45rem 2.2rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  background: '#f8fafc',
                  cursor: 'pointer'
                }}
              />
              <Calendar size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2563eb', pointerEvents: 'none' }} />
            </div>

            <button
              type="button"
              className="btn btn-neutral btn-sm"
              onClick={() => handleShiftDate(1)}
              title="Next Day"
              style={{ padding: '0.45rem 0.65rem' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick Date Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={handleSetToday}
              className={`btn btn-sm ${selectedDate === getLocalDateString() ? 'btn-primary' : 'btn-neutral'}`}
              style={{ fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleSetTomorrow}
              className="btn btn-neutral btn-sm"
              style={{ fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
            >
              Tomorrow
            </button>
          </div>

          <div style={{
            background: '#eff6ff',
            color: '#1d4ed8',
            padding: '0.4rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <CalendarDays size={15} />
            <span>Roster For: <strong>{currentDayName}</strong> ({selectedDate})</span>
          </div>
        </div>

        {/* Live Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', padding: '0 0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Working Today</span>
            <strong style={{ fontSize: '1.15rem', color: '#059669' }}>{stats.totalWorking} Docs</strong>
          </div>
          <div style={{ height: '24px', width: '1px', background: '#e2e8f0' }} />
          <div style={{ textAlign: 'center', padding: '0 0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Free Slots</span>
            <strong style={{ fontSize: '1.15rem', color: '#2563eb' }}>{stats.totalFreeSlots} Slots</strong>
          </div>
          <div style={{ height: '24px', width: '1px', background: '#e2e8f0' }} />
          <div style={{ textAlign: 'center', padding: '0 0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Booked</span>
            <strong style={{ fontSize: '1.15rem', color: '#d97706' }}>{stats.totalBookedToday} Slots</strong>
          </div>
        </div>
      </div>

      {/* ─── 3. Filters & Search Bar ─── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}>
        {/* Availability Filter Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {[
            { id: 'all', label: 'All Doctors', icon: Stethoscope },
            { id: 'free_today', label: `🟢 Free Slots Available (${stats.totalWorking})`, icon: CheckCircle2 },
            { id: 'off_duty', label: `⚪ Off Duty on ${currentDayName}`, icon: XCircle },
          ].map(tab => {
            const isActive = availabilityFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAvailabilityFilter(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: isActive ? '1px solid var(--color-apollo-orange)' : '1px solid #e2e8f0',
                  background: isActive ? 'var(--color-apollo-orange)' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Department & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', flexGrow: 1, justifyContent: 'flex-end' }}>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.8125rem',
              color: '#334155',
              background: '#ffffff',
              maxWidth: '200px'
            }}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8125rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── 4. Doctor Cards Roster Grid ─── */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          <div className="btn-spinner" style={{ width: '32px', height: '32px', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 600 }}>Loading doctors schedule and live availability...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '4rem 2rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <Stethoscope size={44} style={{ margin: '0 auto 1rem', opacity: 0.35, color: '#64748b' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>No doctors found</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Try selecting a different date, department, or clearing the search filter.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredDoctors.map((doc) => {
            const docName = doc.user?.name || 'Specialist';
            const formattedName = docName.startsWith('Dr.') ? docName : `Dr. ${docName}`;
            const avatar = doc.user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={doc.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: doc.isWorkingToday ? '1px solid #cbd5e1' : '1px solid #e2e8f0',
                  padding: '1.25rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  opacity: doc.isWorkingToday ? 1 : 0.75,
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Card Top: Doctor Info & Quick Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                      <img
                        src={avatar}
                        alt={formattedName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {formattedName}
                        </h3>
                        {doc.isWorkingToday ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: '#ecfdf5',
                            color: '#059669',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            border: '1px solid #a7f3d0'
                          }}>
                            <CheckCircle2 size={12} />
                            <span>ON DUTY TODAY • {doc.freeSlotsCount} Free Slots</span>
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: '#f1f5f9',
                            color: '#64748b',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <XCircle size={12} />
                            <span>Off Duty on {currentDayName}</span>
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <strong style={{ color: 'var(--color-apollo-orange)' }}>{doc.specialization}</strong>
                        <span>•</span>
                        <span>{doc.department?.name || 'Specialty Care'}</span>
                        <span>•</span>
                        <span>{doc.qualification || 'Senior Consultant'}</span>
                        <span>•</span>
                        <strong style={{ color: '#0f172a' }}>Fee: ${parseFloat(doc.consultation_fee || 50).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-neutral btn-sm"
                      onClick={() => handleOpenDoctorDetail(doc)}
                      style={{ fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
                    >
                      <span>Full Schedule & History</span>
                    </button>
                    {doc.isWorkingToday && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenBooking(doc)}
                        style={{ fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
                      >
                        <span>Book Visit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Middle: Duty Hours & Schedule Info Bar */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '10px',
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} color="#2563eb" />
                    <span>Duty Shift: <strong>{formatTime12(doc.fromStr)} – {formatTime12(doc.toStr)}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#64748b' }}>Working Days:</span>
                    {doc.availableDays.map((d, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: d === currentDayName ? '#e0f2fe' : '#ffffff',
                          color: d === currentDayName ? '#0284c7' : '#475569',
                          fontWeight: d === currentDayName ? 800 : 500,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          border: d === currentDayName ? '1px solid #7dd3fc' : '1px solid #e2e8f0',
                          fontSize: '0.75rem'
                        }}
                      >
                        {d.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Kon Kon Time a Free Ase (Interactive Time Slots) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} color="#059669" />
                      <span>Live Time Slots for {selectedDate} ({currentDayName}):</span>
                    </span>
                    {doc.isWorkingToday && (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Click any <strong>Free slot</strong> to assign/book appointment
                      </span>
                    )}
                  </div>

                  {!doc.isWorkingToday ? (
                    <div style={{ padding: '0.85rem', background: '#fafafa', borderRadius: '8px', border: '1px dashed #e2e8f0', color: '#64748b', fontSize: '0.8125rem', textAlign: 'center' }}>
                      Doctor does not take appointments on {currentDayName}s. Please pick one of their working days: {doc.availableDays.join(', ')}.
                    </div>
                  ) : doc.slots.length === 0 ? (
                    <div style={{ padding: '0.85rem', color: '#64748b', fontSize: '0.8125rem' }}>
                      No time slots configured.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {doc.slots.map((slot, sIdx) => {
                        const isFree = !slot.isBooked;
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => isFree && handleOpenBooking(doc, slot.time)}
                            disabled={!isFree}
                            title={isFree ? `Book ${slot.label}` : `Booked: ${slot.appointment?.patient_name || 'Reserved'}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '8px',
                              fontSize: '0.78125rem',
                              fontWeight: 700,
                              cursor: isFree ? 'pointer' : 'not-allowed',
                              transition: 'all 0.15s ease',
                              border: isFree ? '1px solid #10b981' : '1px solid #fca5a5',
                              background: isFree ? '#ecfdf5' : '#fef2f2',
                              color: isFree ? '#047857' : '#b91c1c',
                              opacity: isFree ? 1 : 0.85,
                            }}
                          >
                            {isFree ? (
                              <>
                                <Check size={12} color="#059669" />
                                <span>{slot.label} • Free</span>
                              </>
                            ) : (
                              <>
                                <X size={12} color="#dc2626" />
                                <span>{slot.label} • Booked</span>
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── MODAL: Full Detailed Doctor Schedule & Slot Inspector ─── */}
      {detailModalOpen && selectedDoctorDetail && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setDetailModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 className="modal-title" style={{ fontSize: '1.2rem' }}>
                    {selectedDoctorDetail.user?.name}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    {selectedDoctorDetail.specialization} • {selectedDoctorDetail.department?.name}
                  </p>
                </div>
              </div>
              <button type="button" className="modal-close" onClick={() => setDetailModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {loadingDetail ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  <div className="btn-spinner" style={{ width: '28px', height: '28px', margin: '0 auto 1rem' }} />
                  <p>Loading schedule and patient appointments...</p>
                </div>
              ) : detailAvailability ? (
                <div>
                  {/* Summary Bar */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Date</span>
                      <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>{detailAvailability.date}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Day</span>
                      <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>{detailAvailability.day_name}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Free Slots</span>
                      <strong style={{ fontSize: '0.875rem', color: '#059669' }}>{detailAvailability.available_count}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Booked</span>
                      <strong style={{ fontSize: '0.875rem', color: '#dc2626' }}>{detailAvailability.booked_count}</strong>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                    Timeline Slots Breakdown ({detailAvailability.day_name}):
                  </h4>

                  <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {detailAvailability.slots?.map((slot, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: slot.is_booked ? '1px solid #fecaca' : '1px solid #a7f3d0',
                          background: slot.is_booked ? '#fef2f2' : '#f0fdf4'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a', width: '80px' }}>
                            {slot.label}
                          </span>
                          {slot.is_booked ? (
                            <span style={{ color: '#b91c1c', fontSize: '0.8125rem', fontWeight: 600 }}>
                              Booked • {slot.appointment?.patient_name || 'Patient'} ({slot.appointment?.patient_phone || 'Phone verified'})
                            </span>
                          ) : (
                            <span style={{ color: '#059669', fontSize: '0.8125rem', fontWeight: 600 }}>
                              Available for Booking
                            </span>
                          )}
                        </div>

                        {!slot.is_booked && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setDetailModalOpen(false);
                              handleOpenBooking(selectedDoctorDetail, slot.time);
                            }}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                          >
                            Assign / Book
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>Could not load schedule.</p>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-neutral" onClick={() => setDetailModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Quick Book / Assign Appointment ─── */}
      <QuickBookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        initialDoctor={bookingDoctor}
        initialDate={prefilledSlot?.date}
        initialTime={prefilledSlot?.time}
        onSuccess={() => {
          fetchInitialData();
        }}
      />
    </div>
  );
}
