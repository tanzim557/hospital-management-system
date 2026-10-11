import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QuickBookModal from './QuickBookModal';
import TrackStatusModal from './TrackStatusModal';
import {
  Phone,
  PhoneCall,
  Activity,
  CalendarDays,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  X,
  HeartPulse,
  Brain,
  Award,
  Baby,
  Stethoscope,
  Microscope,
  Sparkles,
  ArrowRight,
  Search,
  Lock,
  ShieldCheck
} from 'lucide-react';

const specialtyDropdownItems = [
  { name: 'Cardiology & Heart', desc: 'Minimally invasive bypass, TAVI & valve care', icon: HeartPulse, path: '/specialties?cat=cardiac', color: '#0a2540' },
  { name: 'Cancer & Oncology', desc: 'Proton beam therapy & robotic surgical oncology', icon: Award, path: '/specialties?cat=cancer', color: '#db2777' },
  { name: 'Institute of Neurosciences', desc: 'Brain tumors, stereotactic & stroke care', icon: Brain, path: '/specialties?cat=neuro', color: '#088395' },
  { name: 'Robotic Orthopedics', desc: 'MAKO robotic knee & hip replacements', icon: Activity, path: '/specialties?cat=ortho', color: '#15803d' },
  { name: 'Pediatrics & NICU', desc: 'Level-III neonatal ICU & child health', icon: Baby, path: '/specialties?cat=pediatric', color: '#c2410c' },
  { name: 'Gastroenterology', desc: 'Liver cirrhosis, endotherapy & endoscopy', icon: Stethoscope, path: '/specialties?cat=gastro', color: '#7c3aed' },
];

export default function PublicHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [specialtiesDropdownOpen, setSpecialtiesDropdownOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSpecialtiesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* ─── 1. Top Emergency & Accreditations Utility Bar ─────────── */}
      <div className="apollo-topbar">
        <div className="apollo-topbar-inner">
          <div className="topbar-left">
            <a href="tel:1066" className="topbar-emergency" title="Instant Emergency 1066 Hotline">
              <span className="emergency-pulse-dot" />
              <span>24/7 EMERGENCY: <strong>1066</strong></span>
            </a>
            <span className="topbar-divider" />
            <a href="tel:+8801700000000" className="topbar-item" title="Call Hospital Appointments Desk">
              <Phone size={13} className="topbar-icon" />
              <span>Helpline: +880-1700-000000</span>
            </a>
          </div>

          <div className="topbar-right">
            <span className="topbar-badge-apollo hide-mobile">
              <Sparkles size={12} />
              <span>JCI USA Accredited • Apollo Standards</span>
            </span>
            <span className="topbar-divider hide-mobile" />
            <Link to="/login" className="topbar-staff-link hide-mobile" title="Hospital Doctors & Staff Portal">
              <Lock size={11} />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 2. Main Corporate Header ─────────────────────────── */}
      <header className="apollo-header">
        <div className="apollo-header-inner">
          <Link to="/" className="apollo-brand" aria-label="MediCore Hospitals Homepage">
            <div className="apollo-logo-badge">
              <Activity size={24} />
              <span className="logo-beacon-dot" />
            </div>
            <div className="apollo-brand-title">
              <span className="apollo-brand-name">
                Medi<span className="apollo-brand-accent">Core</span>
              </span>
              <span className="apollo-brand-sub">Hospitals & Research</span>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="apollo-nav-menu">
            {/* Specialties with Dropdown */}
            <div
              className="nav-item-dropdown-container"
              ref={dropdownRef}
              onMouseEnter={() => setSpecialtiesDropdownOpen(true)}
              onMouseLeave={() => setSpecialtiesDropdownOpen(false)}
            >
              <NavLink
                to="/specialties"
                className={({ isActive }) => `apollo-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSpecialtiesDropdownOpen(false)}
              >
                <span>Specialties</span>
                <ChevronDown
                  size={13}
                  className={`nav-chevron ${specialtiesDropdownOpen ? 'rotated' : ''}`}
                />
              </NavLink>

              {specialtiesDropdownOpen && (
                <div className="specialties-mega-dropdown animate-fade-in">
                  <div className="dropdown-grid">
                    {specialtyDropdownItems.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={idx}
                          to={item.path}
                          className="dropdown-specialty-item"
                          onClick={() => setSpecialtiesDropdownOpen(false)}
                        >
                          <div className="dropdown-icon-box" style={{ color: item.color, background: `${item.color}15` }}>
                            <Icon size={18} />
                          </div>
                          <div className="dropdown-item-content">
                            <strong>{item.name}</strong>
                            <p>{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="dropdown-footer">
                    <span>Explore all 25+ medical departments & surgical units</span>
                    <Link
                      to="/specialties"
                      className="dropdown-footer-link"
                      onClick={() => setSpecialtiesDropdownOpen(false)}
                    >
                      <span>View All Specialties</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/find-doctors"
              className={({ isActive }) => `apollo-nav-link ${isActive ? 'active' : ''}`}
            >
              Find Doctors
            </NavLink>

            <NavLink
              to="/prohealth"
              className={({ isActive }) => `apollo-nav-link ${isActive ? 'active' : ''}`}
            >
              <span>ProHealth Checkups</span>
              <span className="nav-badge-pill">Popular</span>
            </NavLink>

            <NavLink
              to="/centres-of-excellence"
              className={({ isActive }) => `apollo-nav-link ${isActive ? 'active' : ''}`}
            >
              Centres of Excellence
            </NavLink>

            <NavLink
              to="/international-care"
              className={({ isActive }) => `apollo-nav-link ${isActive ? 'active' : ''}`}
            >
              International Care
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `apollo-nav-link ${isActive ? 'active' : ''}`}
            >
              About Hospital
            </NavLink>
          </nav>

          {/* Action CTAs */}
          <div className="apollo-header-actions">
            {isAuthenticated ? (
              <div className="header-auth-group">
                <Link to="/dashboard" className="header-dashboard-pill" title="Go to Dashboard">
                  <div className="header-avatar-circle">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="header-user-name">{user?.name?.split(' ')[0] || 'User'}</span>
                  <LayoutDashboard size={14} className="header-dash-icon" />
                </Link>
                <button onClick={logout} className="header-signout-btn" title="Sign Out">
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <button 
                  type="button" 
                  onClick={() => setIsTrackModalOpen(true)} 
                  className="header-track-btn"
                  title="Track Appointment Confirmation Status by Ref ID or Phone"
                >
                  <Search size={14} className="track-btn-icon" />
                  <span>Track Status</span>
                </button>

                <Link 
                  to="/login" 
                  className="header-admin-btn"
                  title="Hospital Administrator & Staff Login"
                >
                  <ShieldCheck size={14} className="admin-btn-icon" />
                  <span>Admin Login</span>
                </Link>
              </>
            )}

            <button 
              type="button" 
              onClick={() => setIsBookModalOpen(true)} 
              className="apollo-btn-book"
            >
              <CalendarDays size={16} />
              <span>Book Appointment</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="apollo-mobile-drawer">
            <Link to="/specialties" onClick={() => setMobileMenuOpen(false)}>Specialties</Link>
            <Link to="/doctors" onClick={() => setMobileMenuOpen(false)}>Find Doctors</Link>
            <Link to="/prohealth" onClick={() => setMobileMenuOpen(false)}>ProHealth Checkups</Link>
            <Link to="/centres-of-excellence" onClick={() => setMobileMenuOpen(false)}>Centres of Excellence</Link>
            <Link to="/international-care" onClick={() => setMobileMenuOpen(false)}>International Care</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Hospital</Link>

            <div className="mobile-drawer-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn btn-outline btn-full" onClick={() => setMobileMenuOpen(false)}>
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="btn btn-ghost btn-full"
                    style={{ color: '#dc2626' }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-full" 
                    onClick={() => { setMobileMenuOpen(false); setIsTrackModalOpen(true); }}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <Search size={15} />
                    <span>Track Status</span>
                  </button>

                  <Link 
                    to="/login" 
                    className="btn btn-outline btn-full" 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <ShieldCheck size={15} color="var(--color-primary-600)" />
                    <span>Admin Login</span>
                  </Link>
                </>
              )}
              <button 
                type="button" 
                className="apollo-btn-book btn-full" 
                onClick={() => { setMobileMenuOpen(false); setIsBookModalOpen(true); }}
              >
                <CalendarDays size={16} />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Frictionless Quick Book Modal */}
      <QuickBookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onTrackClick={(ref) => {
          setTrackQuery(ref);
          setIsTrackModalOpen(true);
        }}
      />

      {/* Real-time Appointment Status Tracker Modal */}
      <TrackStatusModal
        isOpen={isTrackModalOpen}
        onClose={() => {
          setIsTrackModalOpen(false);
          setTrackQuery('');
        }}
        initialQuery={trackQuery}
      />
    </>
  );
}
