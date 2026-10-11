import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  Bell, 
  Search, 
  Stethoscope, 
  Calendar, 
  AlertCircle, 
  User, 
  LogOut, 
  ExternalLink,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ title, onMenuToggle, pendingCount = 4 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/appointments?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* ─── Left Section: Menu Toggle, Brand / Title, Search ─── */}
      <div className="navbar-left">
        <button 
          className="menu-toggle" 
          onClick={onMenuToggle} 
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-title-wrap hide-mobile">
          <span className="navbar-tag">Tertiary Hospital</span>
          <h1 className="navbar-title">HMS Command Center</h1>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="navbar-search-box">
          <Search size={15} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search patient, doctor, or reference ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
          <kbd className="navbar-search-kbd">⌘K</kbd>
        </form>
      </div>

      {/* ─── Right Section: Live Status, Quick Links, Notifications, Profile ─── */}
      <div className="navbar-right">
        {/* Live Hospital OPD Status Pill */}
        <div className="navbar-status-pill hide-tablet">
          <span className="status-live-dot" />
          <span>OPD Services Active</span>
          <span className="status-divider">•</span>
          <span className="status-time">24/7 Helpline 1066</span>
        </div>

        {/* Quick Doctor Roster Shortcut */}
        <Link 
          to="/doctors" 
          className="navbar-quick-action hide-mobile"
          title="Inspect Doctor Free Slots Roster"
        >
          <Stethoscope size={15} color="var(--color-apollo-orange)" />
          <span>Doctor Roster</span>
        </Link>

        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button"
            className="navbar-icon-btn" 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Hospital Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {pendingCount > 0 && (
              <span className="navbar-badge-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="navbar-dropdown notifications-menu animate-fade-in">
              <div className="dropdown-header">
                <strong>Pending Alerts</strong>
                <span className="dropdown-count-tag">{pendingCount} Action{pendingCount > 1 ? 's' : ''}</span>
              </div>
              <div className="dropdown-body">
                <Link 
                  to="/appointments" 
                  className="dropdown-item alert-item"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <div className="dropdown-icon-circle amber">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.8125rem', color: '#0f172a' }}>
                      {pendingCount} Pending Appointment Requests
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Patients requested visits. Verify doctor slots and finalize.
                    </span>
                  </div>
                </Link>
              </div>
              <div className="dropdown-footer">
                <Link 
                  to="/appointments" 
                  onClick={() => setNotificationsOpen(false)}
                  style={{ color: 'var(--color-primary-500)', fontWeight: 700, fontSize: '0.78125rem' }}
                >
                  Go to Appointments Management →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Quick Pill */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="navbar-user-chip"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            title="Account Options"
          >
            <div className="navbar-avatar">
              {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="navbar-user-meta hide-mobile">
              <span className="navbar-user-name">{user?.name || 'User'}</span>
              <span className="navbar-user-role">{user?.role_display || (typeof user?.role === 'object' ? user?.role?.display_name : user?.role) || 'Staff'}</span>
            </div>
            <ChevronDown size={14} className="navbar-chevron" />
          </button>

          {profileDropdownOpen && (
            <div className="navbar-dropdown profile-menu animate-fade-in">
              <div className="profile-dropdown-header">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
                <span className="role-pill-mini">{user?.role_display || (typeof user?.role === 'object' ? user?.role?.display_name : user?.role) || 'Staff'}</span>
              </div>
              <div className="dropdown-divider" />
              {(user?.role === 'admin' || user?.role?.name === 'admin') ? (
                <Link 
                  to="/admin/users" 
                  className="dropdown-link-item"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <User size={15} />
                  <span>Staff & User Management</span>
                </Link>
              ) : (
                <Link 
                  to="/appointments" 
                  className="dropdown-link-item"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <Calendar size={15} />
                  <span>My Appointments</span>
                </Link>
              )}
              <Link 
                to="/doctors" 
                className="dropdown-link-item"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <Stethoscope size={15} />
                <span>Doctor Availability Roster</span>
              </Link>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span>Sign Out of Console</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
