import { useState, useEffect } from 'react';
import { 
  X, 
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
  Search
} from 'lucide-react';
import api from '../../api/axios';
import '../../assets/styles/modal.css';

/**
 * QuickBookModal
 *
 * Frictionless doctor appointment booking modal.
 * Patient only provides Name and Phone number (+ doctor & preferred date).
 * Request is submitted as 'pending' for Admin to verify doctor availability and confirm.
 */
export default function QuickBookModal({ 
  isOpen, 
  onClose, 
  preselectedDoctor = null,
  initialDoctor = null,
  initialDate = null,
  initialTime = null,
  onSuccess = null,
  onTrackClick = null 
}) {
  const targetedDoctor = initialDoctor || preselectedDoctor;
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlotTime, setSelectedSlotTime] = useState('10:00');
  const [reason, setReason] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Set appointment date
  useEffect(() => {
    if (initialDate) {
      setAppointmentDate(initialDate);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setAppointmentDate(`${yyyy}-${mm}-${dd}`);
    }

    if (initialTime) {
      setSelectedSlotTime(initialTime);
    }
  }, [initialDate, initialTime, isOpen]);

  // Fetch doctors list when opened
  useEffect(() => {
    if (!isOpen) return;

    fetchDoctors();
  }, [isOpen]);

  // Handle preselected / initial doctor
  useEffect(() => {
    if (targetedDoctor?.id) {
      setSelectedDoctorId(String(targetedDoctor.id));
    }
  }, [targetedDoctor, isOpen]);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await api.get('/doctors?per_page=50');
      const list = response.data.data || [];
      setDoctors(list);
      if (!selectedDoctorId && list.length > 0 && !preselectedDoctor) {
        setSelectedDoctorId(String(list[0].id));
      }
    } catch (err) {
      console.error('Failed to load doctors list:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset form states on close
      setSuccessData(null);
      setErrorMsg('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const activeDoctor = doctors.find((d) => String(d.id) === String(selectedDoctorId)) || preselectedDoctor;

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
        reason: reason.trim() || 'Online consultation request',
      };

      const res = await api.post('/appointments/public-book', payload);
      setSuccessData(res.data.appointment);
      if (typeof onSuccess === 'function') {
        onSuccess(res.data.appointment);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      const msg = err.response?.data?.message || 'Failed to submit appointment request. Please check your information and try again.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSuccessData(null);
    setErrorMsg('');
    setPatientName('');
    setPatientPhone('');
    setReason('');
    onClose();
  };

  // Get minimum date (today)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="med-modal-backdrop" onClick={handleModalClose}>
      <div 
        className="med-modal-container animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button 
          className="med-modal-close-btn" 
          onClick={handleModalClose}
          aria-label="Close booking modal"
        >
          <X size={20} />
        </button>

        {successData ? (
          /* ─── SUCCESS CONFIRMATION STATE ─────────────────────── */
          <div className="med-booking-success-view animate-fade-in">
            <div className="success-icon-badge">
              <CheckCircle2 size={48} className="success-check-icon" />
            </div>

            <div className="success-tag-pill">
              <ShieldCheck size={14} />
              <span>REQUEST RECEIVED • STATUS: PENDING ADMIN REVIEW</span>
            </div>

            <h2 className="success-title">Appointment Request Submitted!</h2>
            <p className="success-desc">
              Thank you, <strong>{patientName}</strong>! Your appointment request has been dispatched to MediCore Hospital's front-desk administrator.
            </p>

            <div className="booking-summary-card">
              <div className="summary-row">
                <span className="summary-label">Reference ID:</span>
                <strong className="summary-value ref-badge">#MED-APT-{successData.id}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Doctor:</span>
                <strong className="summary-value">
                  {successData.doctor?.user?.name || activeDoctor?.user?.name || 'Selected Specialist'}
                </strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Specialty:</span>
                <span className="summary-value">
                  {successData.doctor?.department?.name || activeDoctor?.department?.name || 'Clinical Care'}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Requested Date:</span>
                <strong className="summary-value">{appointmentDate}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Preferred Slot:</span>
                <span className="summary-value">{selectedSlotTime}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Contact Phone:</span>
                <strong className="summary-value">{patientPhone}</strong>
              </div>
            </div>

            <div className="admin-review-notice">
              <AlertCircle size={18} className="notice-icon" />
              <p>
                <strong>What happens next?</strong> Our hospital administrator will verify the doctor's real-time schedule and call or SMS your phone at <strong>{patientPhone}</strong> to confirm your final consultation token and room number.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-outline btn-lg" 
                style={{ flex: 1 }}
                onClick={handleModalClose}
              >
                <span>Done</span>
              </button>
              <button 
                type="button" 
                className="btn btn-primary btn-lg" 
                style={{ 
                  flex: 1.3, 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.45rem', 
                  fontWeight: 700 
                }}
                onClick={() => {
                  const refCode = `#MED-APT-${successData.id}`;
                  handleModalClose();
                  if (onTrackClick) {
                    onTrackClick(refCode);
                  }
                }}
              >
                <Search size={15} />
                <span>Track Status Now</span>
              </button>
            </div>
          </div>
        ) : (
          /* ─── BOOKING FORM STATE ────────────────────────────── */
          <div className="med-modal-body">
            {/* Modal Header */}
            <div className="med-modal-header">
              <div className="modal-header-badge">
                <Sparkles size={13} />
                <span>QUICK APPOINTMENT • NO PASSWORD OR LOGIN REQUIRED</span>
              </div>
              <h2 className="modal-title">Book Doctor Appointment</h2>
              <p className="modal-subtitle">
                Enter your name and phone number. Our admin will check the doctor's availability and finalize your appointment.
              </p>
            </div>

            {errorMsg && (
              <div className="modal-alert-error animate-shake">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="quick-book-form">
              {/* Row 1: Patient Name & Phone */}
              <div className="form-double-grid">
                <div className="form-field-group">
                  <label htmlFor="patient-name">
                    <span>Patient Full Name</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="modal-input-wrap">
                    <User size={17} className="input-icon" />
                    <input
                      id="patient-name"
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
                  <label htmlFor="patient-phone">
                    <span>Mobile Phone Number</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="modal-input-wrap">
                    <Phone size={17} className="input-icon" />
                    <input
                      id="patient-phone"
                      type="tel"
                      className="modal-input"
                      placeholder="e.g. 01712-345678"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                    />
                  </div>
                  <span className="field-hint">Admin will call this number to confirm slot</span>
                </div>
              </div>

              {/* Row 2: Select Doctor */}
              <div className="form-field-group">
                <label htmlFor="doctor-select">
                  <span>Select Doctor & Specialty</span>
                  <span className="req-star">*</span>
                </label>
                <div className="modal-input-wrap">
                  <Stethoscope size={17} className="input-icon" />
                  <select
                    id="doctor-select"
                    className="modal-input modal-select"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    required
                    disabled={loadingDoctors}
                  >
                    {loadingDoctors ? (
                      <option>Loading specialist directory...</option>
                    ) : (
                      doctors.map((doc) => {
                        const name = doc.user?.name || 'Doctor';
                        const docTitle = name.startsWith('Dr.') ? name : `Dr. ${name}`;
                        const dept = doc.department?.name || doc.specialization || 'General Care';
                        return (
                          <option key={doc.id} value={doc.id}>
                            {docTitle} — {dept} (${parseFloat(doc.consultation_fee || 0).toFixed(0)})
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                {/* Doctor Quick Info Preview Pill */}
                {activeDoctor && (
                  <div className="doctor-preview-strip animate-fade-in">
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
                  <label htmlFor="appointment-date">
                    <span>Preferred Date</span>
                    <span className="req-star">*</span>
                  </label>
                  <div className="modal-input-wrap">
                    <Calendar size={17} className="input-icon" />
                    <input
                      id="appointment-date"
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
                <label htmlFor="patient-reason">
                  <span>Symptoms / Reason for Visit (Optional)</span>
                </label>
                <div className="modal-textarea-wrap">
                  <FileText size={17} className="textarea-icon" />
                  <textarea
                    id="patient-reason"
                    rows="2"
                    className="modal-textarea"
                    placeholder="e.g. Chest pain for 2 days, routine blood pressure checkup, fever..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div className="modal-action-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleModalClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-submit-book"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="spinner spinner-sm" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Appointment Request</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              <div className="modal-trust-footer">
                <ShieldCheck size={14} color="var(--color-primary-500)" />
                <span>Admin will verify doctor availability & finalize your appointment slot.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
