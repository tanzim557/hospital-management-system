import { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Stethoscope, 
  MapPin, 
  AlertCircle, 
  XCircle, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Printer,
  Compass
} from 'lucide-react';
import api from '../../api/axios';
import '../../assets/styles/modal.css';

/**
 * TrackStatusModal
 *
 * Allows patients to track their doctor appointment confirmation status
 * in real-time by entering their Reference ID (e.g. #MED-APT-3) or Phone Number.
 */
export default function TrackStatusModal({ isOpen, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setErrorMsg('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (searchVal) => {
    const val = (searchVal !== undefined ? searchVal : query).trim();
    if (!val) {
      setErrorMsg('Please enter your Reference ID (e.g. #MED-APT-3) or Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get('/appointments/track', {
        params: { query: val },
      });
      setResult(res.data.appointment);
    } catch (err) {
      console.error('Tracking lookup error:', err);
      const msg = err.response?.data?.message || 'No appointment found matching this Reference ID or Phone number. Please check and try again.';
      setResult(null);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const status = result?.status || '';

  return (
    <div className="med-modal-backdrop" onClick={onClose}>
      <div 
        className="med-modal-container track-modal-container animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Close Button */}
        <button 
          className="med-modal-close-btn" 
          onClick={onClose}
          aria-label="Close track modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="med-modal-header" style={{ padding: '1.5rem 1.75rem 1.25rem' }}>
          <div className="modal-header-badge">
            <Compass size={13} />
            <span>LIVE APPOINTMENT TRACKER</span>
          </div>
          <h2 className="modal-title" style={{ fontSize: '1.4rem' }}>Track Appointment Status</h2>
          <p className="modal-subtitle">
            Enter your <strong>Reference ID</strong> (e.g. <span style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>#MED-APT-3</span>) or <strong>Mobile Phone Number</strong> to check whether the admin has finalized your slot.
          </p>

          {/* Search Form Bar */}
          <form onSubmit={handleFormSubmit} className="track-search-bar" style={{ marginTop: '1.15rem' }}>
            <div className="track-input-wrap">
              <Search size={18} className="track-search-icon" />
              <input
                type="text"
                className="track-search-input"
                placeholder="Enter Ref ID (#MED-APT-3) or Phone (017...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  className="track-clear-btn"
                  onClick={() => setQuery('')}
                  title="Clear"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary track-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner spinner-sm" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Track Status</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="modal-alert-error animate-shake" style={{ margin: '1rem 1.75rem 0' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="med-modal-body" style={{ padding: '1.25rem 1.75rem 1.75rem' }}>
          {result ? (
            <div className="track-results-view animate-fade-in">
              
              {/* ─── 1. Visual Progress Stepper ────────────────────────── */}
              <div className="track-stepper-strip">
                {/* Step 1 */}
                <div className="track-step completed">
                  <div className="step-circle">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="step-text">
                    <strong>Request Received</strong>
                    <span>{result.created_at || 'Online'}</span>
                  </div>
                </div>

                <div className={`step-connector ${status === 'confirmed' || status === 'completed' ? 'active' : ''}`} />

                {/* Step 2 */}
                <div className={`track-step ${status === 'pending' ? 'current' : status === 'confirmed' || status === 'completed' ? 'completed' : ''}`}>
                  <div className="step-circle">
                    {status === 'confirmed' || status === 'completed' ? (
                      <CheckCircle2 size={16} />
                    ) : status === 'pending' ? (
                      <Clock size={16} className="step-pulse-icon" />
                    ) : (
                      <span>2</span>
                    )}
                  </div>
                  <div className="step-text">
                    <strong>Admin Schedule Check</strong>
                    <span>{status === 'pending' ? 'In Progress' : 'Verified'}</span>
                  </div>
                </div>

                <div className={`step-connector ${status === 'confirmed' || status === 'completed' ? 'active' : ''}`} />

                {/* Step 3 */}
                <div className={`track-step ${status === 'confirmed' ? 'confirmed-done' : status === 'completed' ? 'completed' : status === 'cancelled' ? 'cancelled' : ''}`}>
                  <div className="step-circle">
                    {status === 'confirmed' || status === 'completed' ? (
                      <CheckCircle2 size={16} />
                    ) : status === 'cancelled' ? (
                      <XCircle size={16} />
                    ) : (
                      <span>3</span>
                    )}
                  </div>
                  <div className="step-text">
                    <strong>
                      {status === 'cancelled' ? 'Cancelled' : 'Slot Confirmed'}
                    </strong>
                    <span>{status === 'confirmed' ? result.appointment_time || 'Finalized' : status === 'cancelled' ? 'Declined' : 'Pending'}</span>
                  </div>
                </div>
              </div>

              {/* ─── 2. Status Callout Card ────────────────────────────── */}
              {status === 'confirmed' ? (
                <div className="status-hero-card card-confirmed animate-fade-in">
                  <div className="status-badge-row">
                    <span className="live-status-pill pill-confirmed">
                      <CheckCircle2 size={14} />
                      <span>APPOINTMENT CONFIRMED & FINALIZED</span>
                    </span>
                    <span className="ref-tag-code">{result.ref_code}</span>
                  </div>

                  <h3 className="status-headline">
                    Great news! Your consultation has been confirmed.
                  </h3>
                  <p className="status-explanation">
                    Hospital admin has verified Dr. {result.doctor?.name}'s availability and scheduled your slot. Please report to the hospital reception on time.
                  </p>

                  {/* Confirmed Slot Highlight Grid */}
                  <div className="confirmed-slot-spotlight">
                    <div className="slot-spotlight-item">
                      <span className="spotlight-lbl">Confirmed Date</span>
                      <strong className="spotlight-val">
                        <Calendar size={15} color="var(--color-primary-600)" />
                        {result.appointment_date}
                      </strong>
                    </div>
                    <div className="slot-spotlight-item">
                      <span className="spotlight-lbl">Confirmed Slot</span>
                      <strong className="spotlight-val slot-time-highlight">
                        <Clock size={15} color="#059669" />
                        {result.appointment_time}
                      </strong>
                    </div>
                    <div className="slot-spotlight-item">
                      <span className="spotlight-lbl">Consultation Fee</span>
                      <strong className="spotlight-val" style={{ color: 'var(--color-primary-600)' }}>
                        ${parseFloat(result.doctor?.consultation_fee || 0).toFixed(0)}
                      </strong>
                    </div>
                  </div>

                  {result.notes && (
                    <div className="admin-instructions-strip">
                      <FileText size={15} color="#059669" className="inst-icon" />
                      <div>
                        <strong>Hospital Desk Note:</strong>
                        <p>{result.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : status === 'pending' ? (
                <div className="status-hero-card card-pending animate-fade-in">
                  <div className="status-badge-row">
                    <span className="live-status-pill pill-pending">
                      <Clock size={14} className="pulse-spin" />
                      <span>PENDING ADMIN VERIFICATION</span>
                    </span>
                    <span className="ref-tag-code">{result.ref_code}</span>
                  </div>

                  <h3 className="status-headline">
                    Your appointment request is awaiting admin schedule review.
                  </h3>
                  <p className="status-explanation">
                    Our front-desk coordinator is currently verifying <strong>{result.doctor?.name}</strong>'s live OPD hours for <strong>{result.appointment_date}</strong>. You will receive a phone call or SMS at <strong>{result.patient?.phone}</strong> once finalized.
                  </p>

                  <div className="pending-reassurance-box">
                    <ShieldCheck size={16} color="#d97706" />
                    <span>Average verification time: Under 15 minutes during hospital OPD hours.</span>
                  </div>
                </div>
              ) : status === 'cancelled' ? (
                <div className="status-hero-card card-cancelled animate-fade-in">
                  <div className="status-badge-row">
                    <span className="live-status-pill pill-cancelled">
                      <XCircle size={14} />
                      <span>APPOINTMENT CANCELLED / DECLINED</span>
                    </span>
                    <span className="ref-tag-code">{result.ref_code}</span>
                  </div>

                  <h3 className="status-headline">
                    This appointment request was not confirmed.
                  </h3>
                  <p className="status-explanation">
                    {result.notes || "The specialist was not available on this date or the slot was fully booked. Please select another date or contact our 24/7 hotline at 1066."}
                  </p>
                </div>
              ) : (
                <div className="status-hero-card card-completed animate-fade-in">
                  <div className="status-badge-row">
                    <span className="live-status-pill pill-completed">
                      <CheckCircle2 size={14} />
                      <span>CONSULTATION COMPLETED</span>
                    </span>
                    <span className="ref-tag-code">{result.ref_code}</span>
                  </div>
                  <h3 className="status-headline">Appointment Completed</h3>
                  <p className="status-explanation">
                    This consultation was successfully completed on {result.appointment_date}.
                  </p>
                </div>
              )}

              {/* ─── 3. Doctor & Patient Meta Details Grid ─────────────── */}
              <div className="track-details-grid">
                {/* Doctor Box */}
                <div className="track-meta-card">
                  <span className="track-card-lbl">Doctor & Campus</span>
                  <div className="track-person-row">
                    <div className="person-avatar-circle">
                      {result.doctor?.name?.[0]?.toUpperCase() || 'D'}
                    </div>
                    <div>
                      <strong className="person-name">{result.doctor?.name}</strong>
                      <span className="person-sub">{result.doctor?.department} • {result.doctor?.specialization}</span>
                      <span className="person-campus">
                        <MapPin size={11} /> {result.doctor?.campus || 'Dhaka Main Hospital'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient Box */}
                <div className="track-meta-card">
                  <span className="track-card-lbl">Patient Details</span>
                  <div className="track-person-row">
                    <div className="person-avatar-circle" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                      {result.patient?.name?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div>
                      <strong className="person-name">{result.patient?.name}</strong>
                      <span className="person-sub" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Phone size={12} color="var(--color-primary-600)" />
                        {result.patient?.phone}
                      </span>
                      {result.reason && (
                        <span className="person-reason" title={result.reason}>
                          Reason: "{result.reason}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="track-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handlePrintSlip}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Printer size={14} />
                  <span>Print Slip</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onClose}
                  style={{ fontWeight: 700 }}
                >
                  <span>Close</span>
                </button>
              </div>

            </div>
          ) : (
            /* Empty prompt state */
            <div className="track-empty-state">
              <div className="empty-icon-circle">
                <Search size={32} color="var(--color-primary-500)" />
              </div>
              <h4>Check Your Confirmation Status</h4>
              <p>
                When you booked an appointment, you received a Reference ID (such as <strong>#MED-APT-3</strong>).
                Type your Reference ID or Mobile Phone number in the box above to see if the admin has verified Dr. availability and confirmed your slot.
              </p>
              <div className="quick-help-badges">
                <span>✓ Real-time status update</span>
                <span>✓ View confirmed time slot</span>
                <span>✓ Room assignment & notes</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
