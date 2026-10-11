import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Settings,
  LogOut,
  Building2,
  Activity,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Banknote
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';

  const userRoleStr = typeof user?.role === 'object' ? user?.role?.name : user?.role;
  const userRoleDisplay = user?.role_display || (typeof user?.role === 'object' ? user?.role?.display_name : null) || (userRoleStr ? userRoleStr.charAt(0).toUpperCase() + userRoleStr.slice(1) : 'Staff');

  const menuItems = getMenuItemsForRole(user?.role);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* ─── Sidebar Header: Brand Showcase ─── */}
      <div className="sidebar-header">
        <div className="sidebar-logo-box">
          <Activity size={22} className="sidebar-logo-icon" />
          <span className="sidebar-pulse-dot" />
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">
            Medi<span style={{ color: 'var(--color-apollo-orange, #f37021)' }}>Core</span>
          </div>
          <div className="sidebar-brand-sub">Tertiary Hospital • {userRoleDisplay}</div>
        </div>
      </div>

      {/* ─── Navigation Links ─── */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">
          <span>Main Menu</span>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
              end={item.path === '/dashboard'}
            >
              <div className="sidebar-icon-wrap">
                <Icon size={18} />
              </div>
              <span className="sidebar-link-text">{item.label}</span>
              {item.badge && (
                <span className={`sidebar-badge ${item.badgeColor || 'neutral'}`}>
                  {item.badgePulse && <span className="sidebar-badge-dot" />}
                  <span>{item.badge}</span>
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ─── Emergency & Hospital Quick Support Box ─── */}
      <div className="sidebar-emergency-card">
        <div className="emergency-card-icon">
          <PhoneCall size={16} />
        </div>
        <div>
          <strong>Emergency Helpline</strong>
          <span>Dial <strong>1066</strong> (24/7 Dispatch)</span>
        </div>
      </div>

      {/* ─── User Profile & Logout ─── */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={handleLogout} title="Click to Sign Out">
          <div className="sidebar-avatar-wrap">
            <div className="sidebar-avatar">{initials}</div>
            <span className="sidebar-online-indicator" />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Staff Member'}</div>
            <div className="sidebar-user-role">{userRoleDisplay}</div>
          </div>
          <button 
            type="button" 
            className="sidebar-logout-btn" 
            title="Log Out"
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function getMenuItemsForRole(role) {
  const roleName = typeof role === 'object' ? role?.name : (role || 'patient');
  const items = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      roles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient'],
    },
    { 
      path: '/patients', 
      label: 'Patients', 
      icon: Users, 
      roles: ['admin', 'doctor', 'nurse', 'receptionist'],
    },
    { 
      path: '/doctors', 
      label: 'Doctor Roster', 
      icon: Stethoscope, 
      roles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient'],
    },
    { 
      path: '/appointments', 
      label: 'Appointments', 
      icon: Calendar, 
      roles: ['admin', 'doctor', 'nurse', 'receptionist', 'patient'],
      badge: 'Active',
      badgeColor: 'amber',
      badgePulse: true
    },
    { 
      path: '/admin/users', 
      label: 'User Management', 
      icon: Settings, 
      roles: ['admin'],
    },
    { 
      path: '/admin/salary', 
      label: 'Staff Salary & Payroll', 
      icon: Banknote, 
      roles: ['admin'],
    },
  ];

  return items.filter((item) => item.roles.includes(roleName));
}
