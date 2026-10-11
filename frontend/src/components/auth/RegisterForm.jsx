import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  Sparkles,
  Stethoscope,
  Clock,
  PhoneCall,
  Award,
  Star,
  ArrowRight
} from 'lucide-react';
import '../../assets/styles/auth.css';
import doctorHeroImg from '../../assets/apollo-doctor-hero.jpg';
import doctorNeuroImg from '../../assets/apollo-doctor-neuro.jpg';
import doctorOncoImg from '../../assets/apollo-doctor-onco.jpg';

/**
 * RegisterForm
 *
 * World-class Apollo-inspired split-screen patient onboarding portal.
 * Features clinical hero showcase, password strength meter, visibility toggles,
 * and high-converting healthcare UX.
 */
export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Compute password strength (0-3)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 10) score++;
    return score;
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedTerms) {
      setErrors({ general: 'Please agree to MediCore Patient Privacy & Terms of Service.' });
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match.' });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = {};
        Object.entries(err.response.data.errors).forEach(([key, messages]) => {
          apiErrors[key] = messages[0];
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Registration failed. Please check details.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-split-container">
        {/* ─── LEFT PANEL: Clinical Brand Showcase & Trust ─── */}
        <div className="auth-hero-panel">
          {/* Subtle Ambient Orbs */}
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
              Your Health Journey, <br />
              <span className="hero-gradient-text">Seamlessly Managed.</span>
            </h1>
            <p className="auth-hero-subtitle">
              Join over 200,000 registered patients. Access South Asia’s foremost medical faculty, 
              view verified diagnostic scans, and secure instant hospital appointments 24/7.
            </p>

            {/* 3 Core Value Propositions */}
            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <div className="feature-icon-circle blue">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <strong>50+ Board-Certified Specialists</strong>
                  <p>Direct priority bookings with robotic surgeons, cardiologists & oncologists.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-circle green">
                  <HeartPulse size={18} />
                </div>
                <div>
                  <strong>Encrypted Electronic Health Vault</strong>
                  <p>Instant access to laboratory reports, digital prescriptions & vitals history.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-circle orange">
                  <Clock size={18} />
                </div>
                <div>
                  <strong>Emergency 1066 Priority Admission</strong>
                  <p>Real-time ICU ambulance tracking & 24/7 rapid triage bedside check-in.</p>
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
                <span className="auth-trust-caption">Trusted by 200,000+ Families Worldwide</span>
              </div>
            </div>

            {/* Emergency Hotline Strip */}
            <div className="auth-emergency-strip">
              <PhoneCall size={14} color="#ef4444" />
              <span>Medical Emergency? Call National Hotline <strong>1066</strong></span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL: Clean Ultra-Modern Registration Form ─── */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            {/* Top Navigation Bar */}
            <div className="auth-top-nav">
              <Link to="/" className="auth-back-link">
                <ArrowLeft size={16} />
                <span>Hospital Home</span>
              </Link>

              <div className="auth-switch-prompt">
                <span>Already registered?</span>
                <Link to="/login" className="auth-switch-btn">Sign In</Link>
              </div>
            </div>

            {/* Form Header */}
            <div className="auth-form-header">
              <div className="auth-form-tag">
                <Sparkles size={13} color="var(--color-apollo-orange)" />
                <span>New Patient Registration</span>
              </div>
              <h2 className="auth-form-title">Create Patient Account</h2>
              <p className="auth-form-desc">
                Register to book doctor visits, download diagnostic reports, and manage family health.
              </p>
            </div>

            {/* General Error Banner */}
            {errors.general && (
              <div className="auth-error-banner animate-shake">
                <span>{errors.general}</span>
              </div>
            )}

            {/* Registration Form */}
            <form className="auth-modern-form" onSubmit={handleSubmit}>
              {/* 2-Column Responsive Row: Full Name & Phone */}
              <div className="form-fields-grid">
                <div className="modern-field-group">
                  <label className="modern-field-label" htmlFor="reg-name">
                    Full Name <span className="req">*</span>
                  </label>
                  <div className={`modern-input-box ${errors.name ? 'has-error' : ''}`}>
                    <User size={17} className="modern-input-icon" />
                    <input
                      id="reg-name"
                      type="text"
                      name="name"
                      placeholder="e.g. Tariq Rahman"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                  {errors.name && <span className="field-error-msg">{errors.name}</span>}
                </div>

                <div className="modern-field-group">
                  <label className="modern-field-label" htmlFor="reg-phone">
                    Phone Number
                  </label>
                  <div className={`modern-input-box ${errors.phone ? 'has-error' : ''}`}>
                    <Phone size={17} className="modern-input-icon" />
                    <input
                      id="reg-phone"
                      type="tel"
                      name="phone"
                      placeholder="+880-1700-000000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
                </div>
              </div>

              {/* Email Address */}
              <div className="modern-field-group">
                <label className="modern-field-label" htmlFor="reg-email">
                  Email Address <span className="req">*</span>
                </label>
                <div className={`modern-input-box ${errors.email ? 'has-error' : ''}`}>
                  <Mail size={17} className="modern-input-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    placeholder="tariq@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && <span className="field-error-msg">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="modern-field-group">
                <label className="modern-field-label" htmlFor="reg-password">
                  Password <span className="req">*</span>
                </label>
                <div className={`modern-input-box ${errors.password ? 'has-error' : ''}`}>
                  <Lock size={17} className="modern-input-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
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
                {errors.password && <span className="field-error-msg">{errors.password}</span>}

                {/* Real-time Password Strength Meter */}
                {formData.password && (
                  <div className="password-strength-container">
                    <div className="strength-bars">
                      <div className={`strength-bar ${pwdStrength >= 1 ? (pwdStrength === 1 ? 'weak' : pwdStrength === 2 ? 'medium' : 'strong') : ''}`} />
                      <div className={`strength-bar ${pwdStrength >= 2 ? (pwdStrength === 2 ? 'medium' : 'strong') : ''}`} />
                      <div className={`strength-bar ${pwdStrength >= 3 ? 'strong' : ''}`} />
                    </div>
                    <span className="strength-label">
                      {pwdStrength === 1 && 'Weak: add letters/numbers'}
                      {pwdStrength === 2 && 'Good: add a special symbol'}
                      {pwdStrength === 3 && 'Strong & Secure'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="modern-field-group">
                <label className="modern-field-label" htmlFor="reg-confirm">
                  Confirm Password <span className="req">*</span>
                </label>
                <div className={`modern-input-box ${errors.password_confirmation ? 'has-error' : ''}`}>
                  <ShieldCheck size={17} className="modern-input-icon" />
                  <input
                    id="reg-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    placeholder="Re-enter your password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-eye"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <span className="field-error-msg">{errors.password_confirmation}</span>
                )}
              </div>

              {/* Terms and Privacy Checkbox */}
              <label className="terms-checkbox-wrap">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                />
                <span className="terms-checkbox-text">
                  I agree to MediCore's <Link to="/about">Terms of Service</Link> and{' '}
                  <Link to="/about">Patient Health Information Privacy Policy (HIPAA)</Link>.
                </span>
              </label>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="auth-primary-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner" />
                    <span>Creating Patient Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Patient Account</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security / Trust Badges */}
            <div className="auth-security-footer">
              <div className="security-item">
                <CheckCircle2 size={13} color="#16a34a" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="security-divider" />
              <div className="security-item">
                <CheckCircle2 size={13} color="#16a34a" />
                <span>Zero Spam Guarantee</span>
              </div>
              <div className="security-divider" />
              <div className="security-item">
                <CheckCircle2 size={13} color="#16a34a" />
                <span>HIPAA Patient Privacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
