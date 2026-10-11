import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Syringe,
  User,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Award,
  HeartPulse,
  Clock,
  PhoneCall,
  Star
} from 'lucide-react';
import '../../assets/styles/auth.css';
import doctorHeroImg from '../../assets/apollo-doctor-hero.jpg';
import doctorNeuroImg from '../../assets/apollo-doctor-neuro.jpg';
import doctorOncoImg from '../../assets/apollo-doctor-onco.jpg';

/**
 * LoginForm
 *
 * Modern Apollo-inspired split-screen portal login.
 * Includes interactive demo fills, password visibility toggle,
 * and high-converting healthcare trust branding.
 */
export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleDemoFill = async (email, password, roleKey) => {
    setFormData({ email, password });
    setError('');
    setLoading(true);
    setActiveDemoRole(roleKey);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
      setActiveDemoRole(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-split-container">
        {/* ─── LEFT PANEL: Clinical Brand Showcase & Trust ─── */}
        <div className="auth-hero-panel">
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />
          <div className="auth-floating-cross cross-a">+</div>
          <div className="auth-floating-cross cross-b">+</div>

          <div className="auth-hero-content">
            {/* Brand Header */}
            <Link to="/" className="auth-hero-brand" title="Return to MediCore Homepage">
              <div className="auth-hero-logo-box">
                <Building2 size={26} color="#ffffff" />
                <span className="hero-logo-dot" />
              </div>
              <div className="auth-hero-brand-text">
                <span className="auth-hero-name">Medi<span style={{ color: 'var(--color-apollo-orange, #f37021)' }}>Core</span></span>
                <span className="auth-hero-tagline">Tertiary Hospitals & Healthcare</span>
              </div>
            </Link>

            <div className="auth-jci-pill">
              <Award size={14} color="#f59e0b" />
              <span>JCI USA Accredited • 40+ Years Clinical Heritage</span>
            </div>

            {/* Main Headline */}
            <h1 className="auth-hero-title">
              Welcome to the <br />
              <span className="hero-gradient-text">MediCore Care Portal.</span>
            </h1>
            <p className="auth-hero-subtitle">
              Securely access upcoming clinical consultations, laboratory scan history, e-prescriptions, 
              and outpatient booking records from any device.
            </p>

            {/* 3 Core Value Propositions */}
            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <div className="feature-icon-circle blue">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <strong>Doctor & Faculty Consultations</strong>
                  <p>Check in for scheduled hospital OPD slots or live 15-minute video calls.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-circle green">
                  <HeartPulse size={18} />
                </div>
                <div>
                  <strong>Diagnostic Reports & Pathology</strong>
                  <p>Download signed digital PDF reports with automated biochemical trend graphs.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-circle orange">
                  <Clock size={18} />
                </div>
                <div>
                  <strong>24/7 Patient Care Concierge</strong>
                  <p>Instant appointment rescheduling, invoice management, and triage guidance.</p>
                </div>
              </div>
            </div>

            {/* Trust Testimonial & Doctor Avatars Card */}
            <div className="auth-trust-card">
              <div className="auth-avatar-stack">
                <img src={doctorHeroImg} alt="Dr. Sarah" className="auth-avatar-img" />
                <img src={doctorNeuroImg} alt="Prof. Vance" className="auth-avatar-img" />
                <img src={doctorOncoImg} alt="Dr. Patel" className="auth-avatar-img" />
                <div className="auth-avatar-count">+48</div>
              </div>
              <div className="auth-trust-meta">
                <div className="auth-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                  ))}
                  <strong style={{ marginLeft: 4, color: '#ffffff' }}>4.95 / 5.0</strong>
                </div>
                <span className="auth-trust-caption">Connecting 12,000+ Specialists Across 73 Hospitals</span>
              </div>
            </div>

            {/* Emergency Hotline Strip */}
            <div className="auth-emergency-strip">
              <PhoneCall size={14} color="#ef4444" />
              <span>Emergency 24/7 Ambulance Dispatch: <strong>1066</strong></span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL: Modern Sign In Form ─── */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            {/* Top Navigation Bar */}
            <div className="auth-top-nav">
              <Link to="/" className="auth-back-link">
                <ArrowLeft size={16} />
                <span>Hospital Home</span>
              </Link>

              <div className="auth-switch-prompt">
                <span>New patient?</span>
                <Link to="/register" className="auth-switch-btn">Create Account</Link>
              </div>
            </div>

            {/* Form Header */}
            <div className="auth-form-header">
              <div className="auth-form-tag">
                <Sparkles size={13} color="var(--color-apollo-orange)" />
                <span>Patient & Staff Login</span>
              </div>
              <h2 className="auth-form-title">Welcome Back</h2>
              <p className="auth-form-desc">
                Sign in to manage appointments, medical records, and family health profiles.
              </p>
            </div>

            {/* General Error Banner */}
            {error && (
              <div className="auth-error-banner animate-shake">
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="auth-modern-form" onSubmit={handleSubmit}>
              {/* Email Address / Username */}
              <div className="modern-field-group">
                <label className="modern-field-label" htmlFor="login-email">
                  Username or Email <span className="req">*</span>
                </label>
                <div className="modern-input-box">
                  <Mail size={17} className="modern-input-icon" />
                  <input
                    id="login-email"
                    type="text"
                    name="email"
                    placeholder="admin or you@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="modern-field-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label className="modern-field-label" htmlFor="login-password" style={{ margin: 0 }}>
                    Password <span className="req">*</span>
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Please contact hospital administration at support@medicore.com or call 1066 to reset your patient portal password.'); }} className="forgot-password-link">
                    Forgot password?
                  </a>
                </div>
                <div className="modern-input-box">
                  <Lock size={17} className="modern-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="auth-primary-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Fill Cards */}
            <div className="auth-demo-section">
              <div className="auth-demo-title">
                <Sparkles size={14} color="var(--color-apollo-orange)" />
                <span>One-Click Demo Credentials:</span>
              </div>
              <div className="auth-demo-grid">
                <button
                  type="button"
                  className={`demo-card-btn admin ${activeDemoRole === 'admin' ? 'active' : ''}`}
                  onClick={() => handleDemoFill('admin@hospital.com', 'password', 'admin')}
                  disabled={loading}
                  title="One-Click Sign In as Super Administrator"
                >
                  <div className="demo-icon-wrap admin">
                    <ShieldCheck size={14} />
                  </div>
                  <div className="demo-info">
                    <strong>{activeDemoRole === 'admin' ? 'Signing in...' : 'Admin'}</strong>
                    <span>admin@hospital.com</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`demo-card-btn doctor ${activeDemoRole === 'doctor' ? 'active' : ''}`}
                  onClick={() => handleDemoFill('doctor.sarah@hospital.com', 'password', 'doctor')}
                  disabled={loading}
                  title="One-Click Sign In as Dr. Sarah (Cardiologist)"
                >
                  <div className="demo-icon-wrap doctor">
                    <Stethoscope size={14} />
                  </div>
                  <div className="demo-info">
                    <strong>{activeDemoRole === 'doctor' ? 'Signing in...' : 'Doctor'}</strong>
                    <span>doctor.sarah@hospital.com</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`demo-card-btn nurse ${activeDemoRole === 'nurse' ? 'active' : ''}`}
                  onClick={() => handleDemoFill('nurse@hospital.com', 'password', 'nurse')}
                  disabled={loading}
                  title="One-Click Sign In as Senior Nurse"
                >
                  <div className="demo-icon-wrap nurse">
                    <Syringe size={14} />
                  </div>
                  <div className="demo-info">
                    <strong>{activeDemoRole === 'nurse' ? 'Signing in...' : 'Nurse'}</strong>
                    <span>nurse@hospital.com</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`demo-card-btn patient ${activeDemoRole === 'patient' ? 'active' : ''}`}
                  onClick={() => handleDemoFill('patient@hospital.com', 'password', 'patient')}
                  disabled={loading}
                  title="One-Click Sign In as Registered Patient"
                >
                  <div className="demo-icon-wrap patient">
                    <User size={14} />
                  </div>
                  <div className="demo-info">
                    <strong>{activeDemoRole === 'patient' ? 'Signing in...' : 'Patient'}</strong>
                    <span>patient@hospital.com</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Security / Trust Badges */}
            <div className="auth-security-footer">
              <div className="security-item">
                <CheckCircle2 size={13} color="#16a34a" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="security-divider" />
              <div className="security-item">
                <CheckCircle2 size={13} color="#16a34a" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="security-divider" />
              <div className="security-item">
                <CheckCircle2 size={13} color="#16a34a" />
                <span>24/7 Audit Logging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
