import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import api from '../api/axios';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  HeartPulse
} from 'lucide-react';
import '../assets/styles/landing.css';
import '../assets/styles/modal.css';

/**
 * BookAppointmentPage
 *
 * Standalone dedicated page for frictionless appointment booking.
 * Anyone can submit their Name and Phone number to request a doctor's appointment.
 */
export default function BookAppointmentPage() {
  const [searchParams] = useSearchParams();
  const preselectedDocId = searchParams.get('doctor');

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDocId || '');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlotTime, setSelectedSlotTime] = useState('10:00');
  const [reason, setReason] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setAppointmentDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await api.get('/doctors?per_page=50');
      const list = response.data.data || [];
      setDoctors(list);
      if (!selectedDoctorId && list.length > 0) {
        setSelectedDoctorId(String(list[0].id));
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const activeDoctor = doctors.find((d) => String(d.id) === String(selectedDoctorId));

  const timeSlots = [
    { label: '09:00 AM', value: '09:00' },
    { label: '09:30 AM', value: '09:30' },
    { label: '10:00 AM', value: '10:00' },
    { label: '10:30 AM', value: '10:30' },
    { label: '11:00 AM', value: '11:00' },
    { label: '11:30 AM', value: '11:30' },
    { label: '02:00 PM', value: '14:00' },
    { label: '02:30 PM', value: '14:30' },
    { label: '03:00 PM', value: '15:00' },
    { label: '03:30 PM', value: '15:30' },
    { label: '04:00 PM', value: '16:00' },
    { label: '04:30 PM', value: '16:30' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!patientPhone.trim()) {
      setErrorMsg('Please enter your mobile phone number.');
      return;
    }

    if (!selectedDoctorId) {
      setErrorMsg('Please select a doctor.');
      return;
    }

    if (!appointmentDate) {
      setErrorMsg('Please select a preferred appointment date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        patient_name: patientName.trim(),
        patient_phone: patientPhone.trim(),
        doctor_id: parseInt(selectedDoctorId, 10),
        appointment_date: appointmentDate,
        appointment_time: selectedSlotTime,
        reason: reason.trim() || 'Online consultation booking',
      };

      const res = await api.post('/appointments/public-book', payload);
      setSuccessData(res.data.appointment);
    } catch (err) {
      console.error('Booking submission error:', err);
      const msg = err.response?.data?.message || 'Failed to submit appointment request.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="landing-page-root" style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />

      <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '820px', margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb / Top Tag */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="modal-header-badge" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>FRICTIONLESS APPOINTMENT • JUST NAME & PHONE</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Book Your Doctor Consultation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
            Submit your details below. Our hospital admin will verify Dr. {activeDoctor?.user?.name || 'Specialist'}'s schedule and call you to confirm your exact token.
          </p>
        </div>

        {successData ? (
          <div className="booking-summary-card animate-scale-up" style={{ padding: '2.5rem', borderRadius: '1.25rem', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="success-icon-badge">
                <CheckCircle2 size={48} />
              </div>
              <div className="success-tag-pill">
                <ShieldCheck size={14} />
                <span>REQUEST RECEIVED • STATUS: PENDING ADMIN REVIEW</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
                Appointment Request Submitted!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
                Thank you, <strong>{patientName}</strong>! Your appointment request has been dispatched to MediCore Hospital's front desk.
              </p>

              <div style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: '0.85rem', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="summary-row">
                  <span className="summary-label">Reference ID:</span>
                  <strong className="summary-value ref-badge">#MED-APT-{successData.id}</strong>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Doctor:</span>
                  <strong className="summary-value">
                    {successData.doctor?.user?.name || activeDoctor?.user?.name || 'Specialist'}
                  </strong>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Specialty:</span>
                  <span className="summary-value">
                    {successData.doctor?.department?.name || activeDoctor?.department?.name || 'Care Unit'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Requested Date:</span>
                  <strong className="summary-value">{appointmentDate}</strong>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Preferred Time:</span>
                  <span className="summary-value">{selectedSlotTime}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Contact Phone:</span>
                  <strong className="summary-value">{patientPhone}</strong>
                </div>
              </div>

              <div className="admin-review-notice">
                <AlertCircle size={20} className="notice-icon" />
                <p>
                  <strong>What happens next?</strong> Our hospital administrator will check the doctor's real-time schedule and call you at <strong>{patientPhone}</strong> within 15 minutes to confirm your final token and room number.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                <Link to="/" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontWeight: 600 }}>
                  Back to Home
                </Link>
                <Link to="/doctors" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}>
                  Browse All Doctors
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="animate-fade-in"
            style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '1.25rem', 
              padding: '2.25rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {errorMsg && (
              <div className="modal-alert-error animate-shake" style={{ margin: '0 0 1.5rem' }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Row 1: Patient Name & Phone */}
              <div className="form-double-grid">
                <div className="form-field-group">
                  <label htmlFor="public-patient-name">
                    <span>Patient Full Name</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="modal-input-wrap">
                    <User size={17} className="input-icon" />
                    <input
                      id="public-patient-name"
                      type="text"
                      className="modal-input"
                      placeholder="e.g. Karim Ahmed"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="public-patient-phone">
                    <span>Mobile Phone Number</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="modal-input-wrap">
                    <Phone size={17} className="input-icon" />
                    <input
                      id="public-patient-phone"
                      type="tel"
                      className="modal-input"
                      placeholder="e.g. 01712-345678"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                    />
                  </div>
                  <span className="field-hint">Admin will call this phone number to finalize your slot</span>
                </div>
              </div>

              {/* Row 2: Select Doctor */}
              <div className="form-field-group">
                <label htmlFor="public-doctor-select">
                  <span>Select Doctor & Department</span>
                  <span className="req-star">*</span>
                </label>
                <div className="modal-input-wrap">
                  <Stethoscope size={17} className="input-icon" />
                  <select
                    id="public-doctor-select"
                    className="modal-input modal-select"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    required
                    disabled={loadingDoctors}
                  >
                    {loadingDoctors ? (
                      <option>Loading specialists...</option>
                    ) : (
                      doctors.map((doc) => {
                        const name = doc.user?.name || 'Doctor';
                        const docTitle = name.startsWith('Dr.') ? name : `Dr. ${name}`;
                        const dept = doc.department?.name || doc.specialization || 'Clinical Care';
                        return (
                          <option key={doc.id} value={doc.id}>
                            {docTitle} — {dept} (${parseFloat(doc.consultation_fee || 0).toFixed(0)})
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                {/* Doctor Preview Strip */}
                {activeDoctor && (
                  <div className="doctor-preview-strip animate-fade-in" style={{ marginTop: '0.65rem' }}>
                    <div className="preview-avatar">
                      {activeDoctor.user?.avatar ? (
                        <img src={activeDoctor.user.avatar} alt="Doctor" />
                      ) : (
                        <span>{activeDoctor.user?.name?.[0]?.toUpperCase() || 'D'}</span>
                      )}
                    </div>
                    <div className="preview-info">
                      <strong>
                        {activeDoctor.user?.name?.startsWith('Dr.') ? activeDoctor.user?.name : `Dr. ${activeDoctor.user?.name}`}
                      </strong>
                      <div className="preview-meta">
                        <span>{activeDoctor.specialization || activeDoctor.department?.name}</span>
                        <span>•</span>
                        <span className="preview-campus">
                          <MapPin size={11} /> {activeDoctor.campus || 'Dhaka Main Hospital'}
                        </span>
                        <span>•</span>
                        <span className="preview-hours">
                          <Clock size={11} /> OPD: {activeDoctor.available_from ? `${activeDoctor.available_from.slice(0, 5)} - ${activeDoctor.available_to.slice(0, 5)}` : '09:00 - 17:00'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3: Preferred Date & Time Slots */}
              <div className="form-double-grid">
                <div className="form-field-group">
                  <label htmlFor="public-appointment-date">
                    <span>Preferred Visit Date</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="modal-input-wrap">
                    <Calendar size={17} className="input-icon" />
                    <input
                      id="public-appointment-date"
                      type="date"
                      min={todayStr}
                      className="modal-input"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label>
                    <span>Preferred Time Slot</span>
                  </label>
                  <div className="modal-input-wrap">
                    <Clock size={17} className="input-icon" />
                    <select
                      className="modal-input modal-select"
                      value={selectedSlotTime}
                      onChange={(e) => setSelectedSlotTime(e.target.value)}
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: Reason or Symptoms */}
              <div className="form-field-group">
                <label htmlFor="public-reason">
                  <span>Symptoms / Reason for Consultation (Optional)</span>
                </label>
                <div className="modal-textarea-wrap">
                  <FileText size={17} className="textarea-icon" />
                  <textarea
                    id="public-reason"
                    rows="3"
                    className="modal-textarea"
                    placeholder="Describe your health symptoms or reason for visit (e.g. routine heart checkup, knee pain, persistent cough)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '0.75rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={submitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    padding: '0.9rem',
                    boxShadow: '0 6px 18px rgba(14, 165, 233, 0.3)',
                  }}
                >
                  {submitting ? (
                    <>
                      <div className="spinner spinner-sm" />
                      <span>Submitting Request to Admin...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Appointment Request</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              <div className="modal-trust-footer" style={{ marginTop: '0.5rem' }}>
                <ShieldCheck size={15} color="var(--color-primary-500)" />
                <span>No password or account required. Hospital Admin will verify schedule and call to finalize.</span>
              </div>
            </form>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
