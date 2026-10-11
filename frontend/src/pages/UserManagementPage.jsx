import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Stethoscope, 
  Syringe, 
  UserCheck, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Mail, 
  Phone, 
  Lock, 
  X, 
  RefreshCw,
  Award,
  Building2,
  DollarSign,
  User,
  Eye,
  EyeOff,
  HeartPulse,
  Sparkles,
  Check
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/dashboard.css';
import '../assets/styles/modal.css';

const ROLE_CONFIGS = {
  admin: { label: 'Admin', color: '#7c3aed', bg: '#f5f3ff', icon: ShieldCheck },
  doctor: { label: 'Doctor', color: '#0284c7', bg: '#f0f9ff', icon: Stethoscope },
  nurse: { label: 'Nurse', color: '#059669', bg: '#ecfdf5', icon: Syringe },
  receptionist: { label: 'Receptionist', color: '#d97706', bg: '#fffbeb', icon: Award },
  patient: { label: 'Patient', color: '#0891b2', bg: '#ecfeff', icon: UserCheck },
};

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
    phone: '',
    specialization: '',
    department_id: '',
    qualification: '',
    consultation_fee: 50,
  });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/admin/users', { params });
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setErrorAlert('Could not load user list from server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data || response.data || []);
    } catch (err) {
      console.warn('Could not load departments:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      status: user.status || 'active',
    });
    setErrorAlert('');
    setEditModalOpen(true);
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormLoading(true);
    setErrorAlert('');

    try {
      await api.put(`/admin/users/${selectedUser.id}`, editForm);
      showToast(`User "${editForm.name}" updated successfully.`);
      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      setErrorAlert(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setFormLoading(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (user) => {
    if (user.id === currentUser?.id) {
      alert('You cannot delete your own active admin account.');
      return;
    }
    setSelectedUser(user);
    setErrorAlert('');
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      await api.delete(`/admin/users/${selectedUser.id}`);
      showToast(`User "${selectedUser.name}" has been deleted.`);
      setDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      setErrorAlert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle User Status directly
  const handleToggleStatus = async (user) => {
    if (user.id === currentUser?.id) {
      alert('You cannot deactivate your own admin account.');
      return;
    }
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await api.put(`/admin/users/${user.id}`, { status: newStatus });
      showToast(`Status of ${user.name} changed to ${newStatus}.`);
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Failed to toggle status: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorAlert('');

    try {
      const payload = {
        name: addForm.name,
        email: addForm.email,
        password: addForm.password,
        role: addForm.role,
        phone: addForm.phone,
      };

      if (addForm.role === 'doctor') {
        payload.specialization = addForm.specialization;
        if (addForm.department_id) payload.department_id = addForm.department_id;
        payload.qualification = addForm.qualification;
        payload.consultation_fee = parseFloat(addForm.consultation_fee || 0);
      }

      await api.post('/admin/users', payload);
      showToast(`New ${addForm.role} "${addForm.name}" created successfully.`);
      setAddModalOpen(false);
      setAddForm({
        name: '',
        email: '',
        password: '',
        role: 'doctor',
        phone: '',
        specialization: '',
        department_id: '',
        qualification: '',
        consultation_fee: 50,
      });
      fetchUsers();
    } catch (err) {
      let msg = 'Failed to create user.';
      if (err.response?.data?.errors) {
        msg = Object.values(err.response.data.errors).flat().join(' ');
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setErrorAlert(msg);
    } finally {
      setFormLoading(false);
    }
  };

  // Compute stat counts
  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === 'active').length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Toast Alert */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: '#10b981',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary-500)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            <ShieldCheck size={16} />
            <span>Administrator Security & Access Control</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '1.85rem', fontWeight: 800 }}>User & Staff Management</h1>
          <p className="page-subtitle" style={{ maxWidth: '650px' }}>
            Provision, review, and manage hospital accounts for doctors, clinical specialists, nurses, receptionists, and patients.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setErrorAlert('');
            setAddModalOpen(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 4px 14px rgba(10, 37, 64, 0.2)'
          }}
        >
          <UserPlus size={18} />
          <span>Add New User / Staff</span>
        </button>
      </div>

      {/* Quick Role & Search Filter Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '1.25rem',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        {/* Role Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {[
            { id: '', label: 'All Users', icon: Users },
            { id: 'admin', label: 'Admins', icon: ShieldCheck },
            { id: 'doctor', label: 'Doctors', icon: Stethoscope },
            { id: 'nurse', label: 'Nurses', icon: Syringe },
            { id: 'receptionist', label: 'Receptionists', icon: Award },
            { id: 'patient', label: 'Patients', icon: UserCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: isActive ? '1px solid var(--color-primary-500)' : '1px solid #e2e8f0',
                  background: isActive ? 'var(--color-primary-500)' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1, maxWidth: '360px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem'
              }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0.5rem 0.85rem' }}>
            Filter
          </button>
          <button 
            type="button" 
            className="btn btn-neutral btn-sm" 
            onClick={() => { setSearchTerm(''); setRoleFilter(''); fetchUsers(); }} 
            title="Reset Filters"
          >
            <RefreshCw size={14} />
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <div className="btn-spinner" style={{ width: '28px', height: '28px', margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600 }}>Loading user accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>No users found</h3>
            <p style={{ fontSize: '0.875rem' }}>Try clearing the search or role filter to see all users.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>User / Identity</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Contact Phone</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Account Status</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Registered Date</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => {
                  const roleName = item.role?.name || 'user';
                  const roleConf = ROLE_CONFIGS[roleName] || { label: roleName, color: '#64748b', bg: '#f1f5f9', icon: Users };
                  const RoleIcon = roleConf.icon;
                  const isCurrent = item.id === currentUser?.id;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                      {/* Name & Avatar */}
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: roleConf.bg,
                            color: roleConf.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            border: `1px solid ${roleConf.color}30`
                          }}>
                            {item.name?.slice(0, 2).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span>{item.name}</span>
                              {isCurrent && (
                                <span style={{ fontSize: '0.6875rem', background: '#e0e7ff', color: '#4338ca', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                                  YOU
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.78125rem', color: '#64748b' }}>{item.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Pill */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: roleConf.bg,
                          color: roleConf.color,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          border: `1px solid ${roleConf.color}25`
                        }}>
                          <RoleIcon size={12} />
                          <span>{item.role?.display_name || roleConf.label}</span>
                        </span>
                      </td>

                      {/* Phone */}
                      <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                        {item.phone || <span style={{ color: '#94a3b8' }}>—</span>}
                      </td>

                      {/* Status Toggle */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          disabled={isCurrent}
                          title={isCurrent ? 'Cannot deactivate self' : 'Click to toggle status'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: isCurrent ? 'not-allowed' : 'pointer',
                            background: item.status === 'active' ? '#ecfdf5' : '#fef2f2',
                            color: item.status === 'active' ? '#059669' : '#dc2626',
                          }}
                        >
                          {item.status === 'active' ? (
                            <>
                              <CheckCircle2 size={12} />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={12} />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Registered */}
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8125rem' }}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn btn-neutral btn-sm"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit user details"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Edit2 size={13} />
                          </button>
                          {!isCurrent && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleOpenDelete(item)}
                              title="Delete account"
                              style={{ padding: '0.35rem 0.6rem' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL: Add New User / Staff (Figma-Grade Luxury UI) ─── */}
      {addModalOpen && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setAddModalOpen(false); }}>
          <div className="modal-content provision-modal-content">
            {/* Elevated Header */}
            <div className="modal-header provision-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="provision-icon-tile">
                  <UserPlus size={22} />
                </div>
                <div>
                  <div className="provision-badge">
                    <ShieldCheck size={11} />
                    <span>Identity & Staff Provisioning</span>
                  </div>
                  <h3 className="provision-title">Provision New User Account</h3>
                  <p className="provision-subtitle">Create authenticated hospital credentials and staff clinical profiles.</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setAddModalOpen(false)}
                title="Close modal"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {errorAlert && (
              <div style={{ margin: '1rem 1.85rem 0', padding: '0.85rem 1rem', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertTriangle size={16} />
                <span style={{ fontWeight: 600 }}>{errorAlert}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem 1.85rem' }}>
                
                {/* 1. Interactive Role Selector Cards */}
                <div className="provision-role-section">
                  <label className="provision-label">
                    <span>Select Hospital Role</span>
                    <span className="req-dot">*</span>
                  </label>
                  <div className="provision-role-grid">
                    {[
                      { role: 'doctor', name: 'Doctor', icon: Stethoscope, color: '#0284c7', bg: '#f0f9ff' },
                      { role: 'nurse', name: 'Nurse', icon: Syringe, color: '#059669', bg: '#ecfdf5' },
                      { role: 'receptionist', name: 'Receptionist', icon: Award, color: '#d97706', bg: '#fffbeb' },
                      { role: 'admin', name: 'Admin', icon: ShieldCheck, color: '#7c3aed', bg: '#f5f3ff' },
                      { role: 'patient', name: 'Patient', icon: UserCheck, color: '#0891b2', bg: '#ecfeff' },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = addForm.role === item.role;
                      return (
                        <div
                          key={item.role}
                          className={`provision-role-card ${isSelected ? 'active' : ''}`}
                          style={{
                            '--card-color': item.color,
                            '--card-bg': item.bg,
                            '--card-glow': `${item.color}30`
                          }}
                          onClick={() => setAddForm({ ...addForm, role: item.role })}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="provision-role-card-icon" style={{ color: item.color }}>
                            <Icon size={16} />
                          </div>
                          <span className="provision-role-card-name">{item.name}</span>
                          {isSelected && (
                            <div className="provision-role-card-indicator">
                              <Check size={9} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Full Name Input */}
                <div className="form-field-wrapper span-2">
                  <label className="provision-label">
                    <span>Full Legal Name</span>
                    <span className="req-dot">*</span>
                  </label>
                  <div className="provision-input-box">
                    <User size={16} className="input-leading-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sabrina Khan or Jane Doe"
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      className="provision-input"
                    />
                  </div>
                </div>

                {/* 3. Email Address */}
                <div className="form-field-wrapper">
                  <label className="provision-label">
                    <span>Email Address</span>
                    <span className="req-dot">*</span>
                  </label>
                  <div className="provision-input-box">
                    <Mail size={16} className="input-leading-icon" />
                    <input
                      type="email"
                      required
                      placeholder="doctor@hospital.com"
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                      className="provision-input"
                    />
                  </div>
                </div>

                {/* 4. Password with Show/Hide toggle */}
                <div className="form-field-wrapper">
                  <label className="provision-label">
                    <span>Initial Password</span>
                    <span className="req-dot">*</span>
                  </label>
                  <div className="provision-input-box">
                    <Lock size={16} className="input-leading-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="Min 8 characters"
                      value={addForm.password}
                      onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                      className="provision-input"
                    />
                    <button
                      type="button"
                      className="input-trailing-action"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* 5. Phone Number */}
                <div className="form-field-wrapper span-2">
                  <label className="provision-label">
                    <span>Direct Phone / Mobile</span>
                    <span className="optional-tag">Optional</span>
                  </label>
                  <div className="provision-input-box">
                    <Phone size={16} className="input-leading-icon" />
                    <input
                      type="text"
                      placeholder="+880-1700-000000"
                      value={addForm.phone}
                      onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                      className="provision-input"
                    />
                  </div>
                </div>

                {/* 6. Elevated Doctor Clinical Profile Box (Conditional) */}
                {addForm.role === 'doctor' && (
                  <div className="provision-doctor-box animate-fade-in">
                    <div className="provision-doctor-header">
                      <div className="provision-doctor-title-wrap">
                        <Stethoscope size={16} color="#0284c7" />
                        <span className="provision-doctor-title">Doctor Clinical Profile Details</span>
                      </div>
                      <span className="provision-doctor-badge">Registry Metadata</span>
                    </div>

                    <div className="provision-doctor-grid">
                      {/* Specialization */}
                      <div className="form-field-wrapper">
                        <label className="provision-label">
                          <span>Specialization</span>
                          <span className="req-dot">*</span>
                        </label>
                        <div className="provision-input-box">
                          <HeartPulse size={15} className="input-leading-icon" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Interventional Cardiology"
                            value={addForm.specialization}
                            onChange={(e) => setAddForm({ ...addForm, specialization: e.target.value })}
                            className="provision-input"
                          />
                        </div>
                      </div>

                      {/* Department */}
                      <div className="form-field-wrapper">
                        <label className="provision-label">
                          <span>Department Campus</span>
                        </label>
                        <div className="provision-input-box">
                          <Building2 size={15} className="input-leading-icon" />
                          <select
                            value={addForm.department_id}
                            onChange={(e) => setAddForm({ ...addForm, department_id: e.target.value })}
                            className="provision-input"
                          >
                            <option value="">Select Department</option>
                            {departments.map((d) => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Qualification */}
                      <div className="form-field-wrapper">
                        <label className="provision-label">
                          <span>Medical Qualification</span>
                        </label>
                        <div className="provision-input-box">
                          <Award size={15} className="input-leading-icon" />
                          <input
                            type="text"
                            placeholder="e.g. MBBS, FCPS, FRCP (UK)"
                            value={addForm.qualification}
                            onChange={(e) => setAddForm({ ...addForm, qualification: e.target.value })}
                            className="provision-input"
                          />
                        </div>
                      </div>

                      {/* Consultation Fee */}
                      <div className="form-field-wrapper">
                        <label className="provision-label">
                          <span>Consultation Fee ($)</span>
                        </label>
                        <div className="provision-input-box">
                          <DollarSign size={15} className="input-leading-icon" />
                          <input
                            type="number"
                            min="0"
                            placeholder="50"
                            value={addForm.consultation_fee}
                            onChange={(e) => setAddForm({ ...addForm, consultation_fee: e.target.value })}
                            className="provision-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Elevated Footer */}
              <div className="provision-footer">
                <div className="provision-security-note">
                  <ShieldCheck size={14} color="#10b981" />
                  <span>Instant RBAC Provisioning • 256-bit Hash</span>
                </div>

                <div className="provision-footer-actions">
                  <button
                    type="button"
                    className="provision-cancel-btn"
                    onClick={() => setAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="provision-submit-btn"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Provisioning...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Edit User ─── */}
      {editModalOpen && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setEditModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ fontSize: '1.15rem' }}>Edit User Details</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>Update contact information and account active status.</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {errorAlert && (
              <div style={{ margin: '1rem 1.5rem 0', padding: '0.75rem', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem' }}>
                {errorAlert}
              </div>
            )}

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label className="field-label">Full Name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div>
                  <label className="field-label">Email Address <span className="req">*</span></label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div>
                  <label className="field-label">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div>
                  <label className="field-label">Account Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="modal-input"
                    style={{ background: '#ffffff' }}
                  >
                    <option value="active">Active (Access Allowed)</option>
                    <option value="inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-neutral" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Delete Confirmation ─── */}
      {deleteModalOpen && selectedUser && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setDeleteModalOpen(false); }}>
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center', padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Delete User Account?
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete <strong>{selectedUser.name}</strong> ({selectedUser.email})? This action cannot be reversed.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button type="button" className="btn btn-neutral" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={formLoading}>
                {formLoading ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
