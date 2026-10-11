import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Stethoscope, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText,
  MapPin,
  CalendarCheck,
  Check,
  Info
} from 'lucide-react';
import api from '../../api/axios';
import '../../assets/styles/modal.css';

/**
 * VerifyAppointmentModal
 *
 * Used by Admin / Receptionist to:
 * 1. Review patient name, phone number, and requested visit reason.
 * 2. Check doctor's live availability, working hours, and conflicting bookings for the chosen date.
 * 3. Select / confirm the final slot and finalize the appointment.
 */
export default function VerifyAppointmentModal({ 
  isOpen, 
  onClose, 
  appointment, 
  onAppointmentUpdated 
}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [availability, setAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (appointment) {
      // Normalize date (YYYY-MM-DD)
      const rawDate = appointment.appointment_date 
        ? appointment.appointment_date.split('T')[0] 
        : '';
      setSelectedDate(rawDate);

      // Normalize time (HH:MM)
      const rawTime = appointment.appointment_time 
        ? appointment.appointment_time.slice(0, 5) 
        : '09:00';
      setSelectedTime(rawTime);

      setAdminNotes(appointment.notes || '');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [appointment, isOpen]);

  // Fetch live doctor availability whenever doctor or date changes
  useEffect(() => {
    if (!isOpen || !appointment?.doctor_id || !selectedDate) return;

    fetchDoctorAvailability(appointment.doctor_id, selectedDate);
  }, [isOpen, appointment?.doctor_id, selectedDate]);

  const fetchDoctorAvailability = async (doctorId, date) => {
    setLoadingAvailability(true);
    setErrorMsg('');
    try {
      const res = await api.get(`/doctors/${doctorId}/availability`, {
        params: { date },
      });
      setAvailability(res.data);
    } catch (err) {
      console.error('Failed to load doctor availability:', err);
      setErrorMsg('Failed to check live doctor availability schedule.');
    } finally {
      setLoadingAvailability(false);
    }
  };

  if (!isOpen || !appointment) return null;

  const patient = appointment.patient?.user;
  const doctor = appointment.doctor?.user;
  const doctorProfile = appointment.doctor;
  const department = appointment.doctor?.department;

  const handleFinalize = async (statusToSet = 'confirmed') => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        status: statusToSet,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        notes: adminNotes.trim(),
      };

      const res = await api.put(`/appointments/${appointment.id}`, payload);
      setSuccessMsg(`Appointment #${appointment.id} successfully finalized as ${statusToSet.toUpperCase()}!`);
      
      if (onAppointmentUpdated) {
        onAppointmentUpdated(res.data.appointment);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to update appointment:', err);
      const msg = err.response?.data?.message || 'Failed to finalize appointment.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDecline = async () => {
    if (!window.confirm('Are you sure you want to decline/cancel this appointment request?')) {
      return;
    }
    await handleFinalize('cancelled');
  };

  return (
    <div className="med-modal-backdrop" onClick={onClose}>
      <div 
        className="med-modal-container verify-modal-wide animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Header */}
        <div className="verify-modal-header">
          <div className="verify-header-left">
            <div className="header-badge-tag">
              <CalendarCheck size={14} />
              <span>ADMIN WORKFLOW • VERIFY & FINALIZE</span>
            </div>
            <h2 className="verify-title">
              Verify Appointment Request <span className="ref-number">#MED-{appointment.id}</span>
            </h2>
            <p className="verify-subtitle">
              Verify doctor availability, assign final consultation slot, and confirm booking.
            </p>
          </div>
          <button className="med-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="modal-alert-error animate-shake" style={{ margin: '1rem 1.5rem 0' }}>
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="modal-alert-success animate-fade-in" style={{ margin: '1rem 1.5rem 0' }}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="verify-modal-body">
          {/* Two-Column Grid: Left = Patient & Info, Right = Doctor Schedule & Slots */}
          <div className="verify-grid-layout">
            
            {/* ─── LEFT COLUMN: Patient Info & Admin Notes ─── */}
            <div className="verify-col-patient">
              {/* Patient Card */}
              <div className="verify-card">
                <div className="card-sec-title">
                  <User size={16} color="var(--color-primary-500)" />
                  <span>Patient Information</span>
                </div>

                <div className="patient-detail-box">
                  <div className="patient-avatar-circle">
                    {patient?.name?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div className="patient-main-info">
                    <strong className="patient-name">{patient?.name || 'Walk-in Patient'}</strong>
                    <div className="patient-contact-row">
                      <Phone size={13} className="contact-icon" />
                      <a href={`tel:${patient?.phone}`} className="patient-phone-link">
                        {patient?.phone || 'No phone provided'}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="verify-data-list">
                  <div className="data-item">
                    <span className="data-lbl">Requested Visit Date:</span>
                    <span className="data-val">{appointment.appointment_date?.split('T')[0]}</span>
                  </div>
                  <div className="data-item">
                    <span className="data-lbl">Preferred Time:</span>
                    <span className="data-val">{appointment.appointment_time?.slice(0, 5) || 'Morning'}</span>
                  </div>
                  <div className="data-item">
                    <span className="data-lbl">Current Status:</span>
                    <span className={`badge ${
                      appointment.status === 'confirmed' ? 'badge-success' :
                      appointment.status === 'pending' ? 'badge-warning' :
                      appointment.status === 'cancelled' ? 'badge-danger' : 'badge-neutral'
                    }`}>
                      {appointment.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="patient-reason-box">
                    <div className="reason-label">
                      <FileText size={13} />
                      <span>Reported Symptoms / Reason:</span>
                    </div>
                    <p className="reason-text">"{appointment.reason}"</p>
                  </div>
                )}
              </div>

              {/* Admin Finalization Notes & Assignment */}
              <div className="verify-card" style={{ marginTop: '1rem' }}>
                <div className="card-sec-title">
                  <FileText size={16} color="var(--color-apollo-orange)" />
                  <span>Admin Confirmation Notes</span>
                </div>
                <p className="admin-hint-text">
                  Add room number, coordinator instructions, or follow-up instructions for the patient.
                </p>
                <textarea
                  className="modal-textarea"
                  rows="3"
                  placeholder="e.g. Confirmed for Room 204, OPD Wing B. Patient advised to arrive 15 minutes prior."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Doctor Schedule & Live Slots ─── */}
            <div className="verify-col-doctor">
              <div className="verify-card">
                <div className="card-sec-title">
                  <Stethoscope size={16} color="var(--color-primary-500)" />
                  <span>Doctor Schedule & Live Availability</span>
                </div>

                {/* Doctor Bio Strip */}
                <div className="doctor-header-box">
                  <div className="doctor-photo-wrap">
                    {doctor?.avatar ? (
                      <img src={doctor.avatar} alt="Doctor" />
                    ) : (
                      <span>{doctor?.name?.[0]?.toUpperCase() || 'D'}</span>
                    )}
                  </div>
                  <div className="doctor-text-wrap">
                    <strong className="doctor-name">
                      {doctor?.name?.startsWith('Dr.') ? doctor?.name : `Dr. ${doctor?.name}`}
                    </strong>
                    <div className="doctor-sub">
                      <span>{doctorProfile?.specialization || department?.name}</span>
                      <span>•</span>
                      <span><MapPin size={11} /> {doctorProfile?.campus || 'Dhaka Main Hospital'}</span>
                    </div>
                    <div className="doctor-opd-hours">
                      <Clock size={12} color="var(--color-primary-500)" />
                      <span>
                        OPD Hours: {doctorProfile?.available_from ? doctorProfile.available_from.slice(0, 5) : '09:00'} - {doctorProfile?.available_to ? doctorProfile.available_to.slice(0, 5) : '17:00'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date Picker Row */}
                <div className="date-selection-banner">
                  <label htmlFor="verify-date">Verify Date:</label>
                  <div className="date-input-wrap">
                    <Calendar size={15} />
                    <input
                      id="verify-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  {availability && (
                    <span className="day-name-tag">
                      {availability.day_name}
                    </span>
                  )}
                </div>

                {/* Working Day Status Notice */}
                {availability && (
                  <div className={`work-status-banner ${availability.is_working_day ? 'status-green' : 'status-amber'}`}>
                    {availability.is_working_day ? (
                      <>
                        <CheckCircle size={16} className="status-banner-icon" />
                        <div>
                          <strong>Doctor is Scheduled on {availability.day_name}s</strong>
                          <p>
                            {availability.available_count} of {availability.total_slots} slots available ({availability.booked_count} already booked).
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={16} className="status-banner-icon" />
                        <div>
                          <strong>Doctor is NOT routinely scheduled on {availability.day_name}s</strong>
                          <p>
                            Working days are: {availability.doctor?.available_days?.join(', ')}. Consider adjusting the date above.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Live Slots Grid */}
                <div className="slots-section">
                  <div className="slots-sec-header">
                    <span className="slots-label">Select Final Confirmed Slot:</span>
                    <span className="selected-slot-pill">
                      Selected: <strong>{selectedTime}</strong>
                    </span>
                  </div>

                  {loadingAvailability ? (
                    <div className="slots-loading-box">
                      <div className="spinner spinner-sm" />
                      <span>Checking doctor calendar & booked appointments...</span>
                    </div>
                  ) : (
                    <div className="slots-grid-matrix">
                      {availability?.slots?.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        const isBooked = slot.is_booked;
                        const isThisAppointment = isBooked && slot.appointment?.id === appointment.id;

                        return (
                          <button
                            key={slot.time}
                            type="button"
                            className={`slot-chip-btn ${isSelected ? 'selected' : ''} ${isBooked && !isThisAppointment ? 'booked' : ''} ${isThisAppointment ? 'current-booking' : ''}`}
                            onClick={() => setSelectedTime(slot.time)}
                            title={isBooked && !isThisAppointment ? `Booked: ${slot.appointment?.patient_name || 'Patient'}` : `Slot ${slot.label}`}
                          >
                            <span className="slot-chip-time">{slot.label}</span>
                            {isThisAppointment && <span className="slot-chip-tag">Current</span>}
                            {isBooked && !isThisAppointment && <span className="slot-chip-tag booked-tag">Busy</span>}
                            {isSelected && <Check size={12} className="slot-check-icon" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Footer */}
        <div className="verify-modal-footer">
          <div className="footer-left-info">
            <Info size={14} color="var(--text-muted)" />
            <span>Clicking "Confirm & Finalize" updates status to CONFIRMED with selected slot.</span>
          </div>

          <div className="footer-action-buttons">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleDecline}
              disabled={saving}
            >
              <XCircle size={15} />
              <span>Decline / Cancel</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-finalize-action"
              onClick={() => handleFinalize('confirmed')}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner spinner-sm" />
                  <span>Finalizing...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>Confirm & Finalize Appointment</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
