import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import api from '../api/axios';
import { 
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
import '../assets/styles/landing.css';
import '../assets/styles/modal.css';

/**
 * TrackAppointmentPage
 *
 * Dedicated standalone page to track doctor appointment confirmation status.
 */
export default function TrackAppointmentPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('ref') || searchParams.get('phone') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

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

  const status = result?.status || '';

  return (
    <div className="landing-page-root" style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />

      <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="modal-header-badge" style={{ marginBottom: '0.75rem' }}>
            <Compass size={14} />
            <span>REAL-TIME APPOINTMENT TRACKER</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Track Appointment Status
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.5 }}>
            Check if your doctor appointment request has been verified and finalized by the hospital front desk.
          </p>

          {/* Search Box */}
          <form onSubmit={handleFormSubmit} className="track-search-bar" style={{ maxWidth: '600px', margin: '1.75rem auto 0' }}>
            <div className="track-input-wrap">
              <Search size={18} className="track-search-icon" />
              <input
                type="text"
                className="track-search-input"
                placeholder="Enter Reference ID (#MED-APT-3) or Phone (017...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
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
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="modal-alert-error animate-shake" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {result ? (
          <div 
            className="animate-scale-up" 
            style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '1.25rem', 
              padding: '2rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Visual Stepper */}
            <div className="track-stepper-strip" style={{ marginBottom: '1.75rem' }}>
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

            {/* Status Card */}
            {status === 'confirmed' ? (
              <div className="status-hero-card card-confirmed">
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
                      <strong>Hospital Desk Instructions:</strong>
                      <p>{result.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : status === 'pending' ? (
              <div className="status-hero-card card-pending">
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
            ) : (
              <div className="status-hero-card card-cancelled">
                <div className="status-badge-row">
                  <span className="live-status-pill pill-cancelled">
                    <XCircle size={14} />
                    <span>CANCELLED / DECLINED</span>
                  </span>
                  <span className="ref-tag-code">{result.ref_code}</span>
                </div>
                <h3 className="status-headline">Appointment Not Confirmed</h3>
                <p className="status-explanation">
                  {result.notes || 'The slot could not be finalized. Please contact helpline 1066.'}
                </p>
              </div>
            )}

            {/* Doctor & Patient Grid */}
            <div className="track-details-grid" style={{ marginTop: '1.25rem' }}>
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
                      <span className="person-reason">Reason: "{result.reason}"</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => window.print()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Printer size={14} />
                <span>Print Appointment Slip</span>
              </button>

              <Link to="/book-appointment" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                <span>Book Another Appointment</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="track-empty-state" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="empty-icon-circle">
              <Compass size={36} color="var(--color-primary-500)" />
            </div>
            <h4>Check Real-Time Confirmation Status</h4>
            <p>
              When you submit a request with your name and phone number, you receive a Reference ID (e.g. <strong>#MED-APT-3</strong>).
              Enter your Reference ID or mobile number above to see if your doctor is free and your appointment has been confirmed.
            </p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
