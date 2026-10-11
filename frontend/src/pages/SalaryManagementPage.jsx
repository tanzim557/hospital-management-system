import { useState, useEffect } from 'react';
import {
  Banknote,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Printer,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Award,
  UserCheck,
  Building2,
  FileText,
  CreditCard,
  ArrowRight,
  TrendingUp,
  X,
  Sparkles,
  Users,
  Calendar
} from 'lucide-react';
import api from '../api/axios';
import '../assets/styles/dashboard.css';
import '../assets/styles/modal.css';

const ROLE_CONFIGS = {
  admin: { label: 'Admin', color: '#7c3aed', bg: '#f5f3ff', icon: ShieldCheck },
  doctor: { label: 'Doctor', color: '#0284c7', bg: '#f0f9ff', icon: Stethoscope },
  nurse: { label: 'Nurse', color: '#059669', bg: '#ecfdf5', icon: Syringe },
  receptionist: { label: 'Receptionist', color: '#d97706', bg: '#fffbeb', icon: Award },
  patient: { label: 'Patient', color: '#0891b2', bg: '#ecfeff', icon: UserCheck },
};

export default function SalaryManagementPage() {
  const [salaries, setSalaries] = useState([]);
  const [metrics, setMetrics] = useState({
    total_payroll: 0,
    paid_payroll: 0,
    pending_payroll: 0,
    total_staff: 0,
    paid_count: 0,
    pending_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [disburseAllModalOpen, setDisburseAllModalOpen] = useState(false);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);

  // Forms & feedback
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    payment_method: 'Direct Bank Transfer',
    transaction_ref: '',
    notes: '',
  });
  const [adjustForm, setAdjustForm] = useState({
    base_salary: 0,
    allowances: 0,
    deductions: 0,
    notes: '',
  });

  useEffect(() => {
    fetchSalaries();
  }, [selectedMonth, statusFilter, roleFilter]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const params = { month: selectedMonth };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/admin/salaries', { params });
      if (response.data) {
        setSalaries(response.data.data || []);
        if (response.data.metrics) {
          setMetrics(response.data.metrics);
        }
      }
    } catch (err) {
      console.error('Failed to fetch salaries:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Open Pay Modal
  const handleOpenPay = (salary) => {
    setSelectedSalary(salary);
    setPaymentForm({
      payment_method: 'Direct Bank Transfer',
      transaction_ref: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      notes: `Monthly compensation for ${selectedMonth} to ${salary.user?.name}`,
    });
    setPayModalOpen(true);
  };

  // Confirm Single Payment
  const handleConfirmPay = async (e) => {
    e.preventDefault();
    if (!selectedSalary) return;
    setActionLoading(true);

    try {
      const response = await api.put(`/admin/salaries/${selectedSalary.id}/pay`, paymentForm);
      showToast(response.data.message || 'Salary marked as paid successfully!');
      setPayModalOpen(false);
      fetchSalaries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process payment.');
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Batch Disbursal
  const handleConfirmDisburseAll = async () => {
    setActionLoading(true);
    try {
      const response = await api.post('/admin/salaries/disburse-all', {
        month: selectedMonth,
        payment_method: 'Corporate Bank Auto-Disbursal',
      });
      showToast(response.data.message || 'All pending salaries disbursed successfully!');
      setDisburseAllModalOpen(false);
      fetchSalaries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to disburse salaries.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Payslip Modal
  const handleOpenPayslip = (salary) => {
    setSelectedSalary(salary);
    setPayslipModalOpen(true);
  };

  // Open Adjust Modal
  const handleOpenAdjust = (salary) => {
    setSelectedSalary(salary);
    setAdjustForm({
      base_salary: salary.base_salary,
      allowances: salary.allowances,
      deductions: salary.deductions,
      notes: salary.notes || '',
    });
    setAdjustModalOpen(true);
  };

  // Save Adjusted Salary Structure
  const handleSaveAdjust = async (e) => {
    e.preventDefault();
    if (!selectedSalary) return;
    setActionLoading(true);

    try {
      const response = await api.put(`/admin/salaries/${selectedSalary.id}`, adjustForm);
      showToast(response.data.message || 'Salary structure adjusted.');
      setAdjustModalOpen(false);
      fetchSalaries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to adjust salary.');
    } finally {
      setActionLoading(false);
    }
  };

  // Format month label
  const formatMonthTitle = (m) => {
    const [year, month] = m.split('-');
    const date = new Date(year, parseInt(month, 10) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          background: '#059669',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(5, 150, 105, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. Header & Controls ────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-primary-500)',
            fontWeight: 800,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.35rem'
          }}>
            <Sparkles size={14} />
            <span>Hospital Financial Operations & Compensation</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '1.85rem', fontWeight: 850, color: 'var(--text-primary)', margin: 0 }}>
            Staff Salary & Payroll Management
          </h1>
          <p className="page-subtitle" style={{ maxWidth: '680px', marginTop: '0.35rem' }}>
            Track and verify monthly staff compensation, review paid vs pending disbursements, and disburse salaries for doctors, nurses, and administrative faculty.
          </p>
        </div>

        {/* Action Controls: Month selector & Disburse All */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Month Selector */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '0.35rem 0.75rem' }}>
            <Calendar size={16} color="var(--color-primary-500)" style={{ marginRight: '0.45rem' }} />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 750,
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
            </select>
          </div>

          {/* 1-Click Disburse All Pending */}
          {metrics.pending_count > 0 && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setDisburseAllModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                fontWeight: 750,
                fontSize: '0.875rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
              }}
            >
              <CreditCard size={16} />
              <span>Disburse All Pending ({metrics.pending_count})</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── 2. Executive Payroll KPI Metrics Strip ─────────────── */}
      <div className="salary-kpi-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.15rem',
        marginBottom: '1.75rem'
      }}>
        {/* KPI 1: Total Monthly Budget */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.45rem',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 20px rgba(10, 37, 64, 0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78125rem', fontWeight: 750, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Monthly Payroll
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Banknote size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 850, color: '#0a2540', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            ${metrics.total_payroll.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.45rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span>{metrics.total_staff} Staff Members • {formatMonthTitle(selectedMonth)}</span>
          </div>
        </div>

        {/* KPI 2: Disbursed / Paid Amount */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.45rem',
          border: '1px solid #bbf7d0',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.06)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78125rem', fontWeight: 750, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Disbursed (Paid)
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 850, color: '#059669', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            ${metrics.paid_payroll.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.45rem', fontSize: '0.75rem', color: '#059669', fontWeight: 650 }}>
            <span>✓ {metrics.paid_count} Staff Cleared ({metrics.total_staff ? Math.round((metrics.paid_count / metrics.total_staff) * 100) : 0}%)</span>
          </div>
        </div>

        {/* KPI 3: Pending Disbursals */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.45rem',
          border: '1px solid #fed7aa',
          boxShadow: '0 4px 20px rgba(243, 112, 33, 0.06)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78125rem', fontWeight: 750, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Disbursement
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 850, color: '#ea580c', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            ${metrics.pending_payroll.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.45rem', fontSize: '0.75rem', color: '#ea580c', fontWeight: 650 }}>
            <span>● {metrics.pending_count} Staff Awaiting Payout</span>
          </div>
        </div>

        {/* KPI 4: Average Monthly Base Pay */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.45rem',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 20px rgba(10, 37, 64, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78125rem', fontWeight: 750, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Avg Net Compensation
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 850, color: '#0a2540', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            ${metrics.total_staff ? Math.round(metrics.total_payroll / metrics.total_staff).toLocaleString() : '0'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.45rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Per Active Healthcare Employee</span>
          </div>
        </div>
      </div>

      {/* ─── 3. Filter, Search & Status Tabs Bar ────────────────── */}
      <div className="salary-filter-bar" style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.15rem 1.35rem',
        border: '1px solid var(--border-color)',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Status Filter Tabs */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px' }}>
          <button
            type="button"
            className={`btn-filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
            style={{
              border: 'none',
              padding: '0.45rem 0.95rem',
              borderRadius: '9px',
              fontSize: '0.8125rem',
              fontWeight: 750,
              cursor: 'pointer',
              background: statusFilter === 'all' ? '#ffffff' : 'transparent',
              color: statusFilter === 'all' ? '#0a2540' : '#64748b',
              boxShadow: statusFilter === 'all' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            All Staff ({metrics.total_staff})
          </button>
          <button
            type="button"
            className={`btn-filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
            style={{
              border: 'none',
              padding: '0.45rem 0.95rem',
              borderRadius: '9px',
              fontSize: '0.8125rem',
              fontWeight: 750,
              cursor: 'pointer',
              background: statusFilter === 'pending' ? '#ffffff' : 'transparent',
              color: statusFilter === 'pending' ? '#ea580c' : '#64748b',
              boxShadow: statusFilter === 'pending' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            ● Pending ({metrics.pending_count})
          </button>
          <button
            type="button"
            className={`btn-filter-tab ${statusFilter === 'paid' ? 'active' : ''}`}
            onClick={() => setStatusFilter('paid')}
            style={{
              border: 'none',
              padding: '0.45rem 0.95rem',
              borderRadius: '9px',
              fontSize: '0.8125rem',
              fontWeight: 750,
              cursor: 'pointer',
              background: statusFilter === 'paid' ? '#ffffff' : 'transparent',
              color: statusFilter === 'paid' ? '#059669' : '#64748b',
              boxShadow: statusFilter === 'paid' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            ✓ Paid ({metrics.paid_count})
          </button>
        </div>

        {/* Search & Role Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Role Filter */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1.5px solid var(--border-color)', borderRadius: '10px', padding: '0.2rem 0.65rem' }}>
            <Filter size={14} color="#64748b" style={{ marginRight: '0.4rem' }} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 650,
                fontSize: '0.8125rem',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Hospital Roles</option>
              <option value="doctor">Doctors (Specialists)</option>
              <option value="nurse">Nurses</option>
              <option value="receptionist">Receptionists</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {/* Search Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); fetchSalaries(); }}
            style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: '0.75rem' }} />
            <input
              type="text"
              placeholder="Search staff name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="salary-search-input"
              style={{
                padding: '0.45rem 0.85rem 0.45rem 2.25rem',
                borderRadius: '10px',
                border: '1.5px solid var(--border-color)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                minWidth: '180px',
                width: '220px',
                background: '#f8fafc'
              }}
            />
          </form>

          {/* Refresh Button */}
          <button
            type="button"
            className="btn btn-neutral btn-sm"
            onClick={fetchSalaries}
            title="Refresh Ledger"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.75rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ─── 4. Staff Salary Table & Ledger ────────────────────── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 6px 25px rgba(10, 37, 64, 0.04)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem', color: '#0284c7' }} />
            <p style={{ fontWeight: 650 }}>Loading staff compensation records...</p>
          </div>
        ) : salaries.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <Banknote size={44} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
              No Salary Records Found
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto' }}>
              No staff members match the selected month ({formatMonthTitle(selectedMonth)}) or filter criteria.
            </p>
          </div>
        ) : (
          <div className="salary-table-wrap" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.95rem 1.25rem', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Staff Member
                  </th>
                  <th style={{ padding: '0.95rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Role & Department
                  </th>
                  <th style={{ padding: '0.95rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Base & Allowances
                  </th>
                  <th style={{ padding: '0.95rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Net Salary
                  </th>
                  <th style={{ padding: '0.95rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Payment Status
                  </th>
                  <th style={{ padding: '0.95rem 1.25rem', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Disbursal Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((item, index) => {
                  const roleName = item.user?.role?.name || 'doctor';
                  const roleConf = ROLE_CONFIGS[roleName] || ROLE_CONFIGS.doctor;
                  const RoleIcon = roleConf.icon;
                  const isPaid = item.status === 'paid';

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* 1. Staff Member Name & Info */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: roleConf.bg,
                            color: roleConf.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            flexShrink: 0,
                            border: `1.5px solid ${roleConf.color}35`
                          }}>
                            {item.user?.name ? item.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#0a2540', fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
                              {item.user?.name}
                            </div>
                            <div style={{ fontSize: '0.78125rem', color: '#64748b', marginTop: '0.15rem' }}>
                              {item.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Role & Department */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: roleConf.bg,
                            color: roleConf.color,
                            padding: '0.2rem 0.65rem',
                            borderRadius: '9999px',
                            fontWeight: 750,
                            fontSize: '0.75rem',
                            border: `1px solid ${roleConf.color}25`
                          }}>
                            <RoleIcon size={12} />
                            <span>{roleConf.label}</span>
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {item.user?.doctor?.specialization || item.user?.doctor?.department?.name || 'General Faculty'}
                          </span>
                        </div>
                      </td>

                      {/* 3. Base & Allowances Breakdown */}
                      <td style={{ padding: '1rem', fontSize: '0.8125rem' }}>
                        <div style={{ color: '#0f172a', fontWeight: 650 }}>
                          Base: ${item.base_salary.toLocaleString()}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                          +{item.allowances ? `$${item.allowances}` : '$0'} Allow. • -{item.deductions ? `$${item.deductions}` : '$0'} Ded.
                        </div>
                      </td>

                      {/* 4. Net Salary */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0a2540' }}>
                          ${item.net_salary.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>USD / Month</span>
                      </td>

                      {/* 5. Payment Status Badge */}
                      <td style={{ padding: '1rem' }}>
                        {isPaid ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-start' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              background: '#ecfdf5',
                              color: '#059669',
                              fontWeight: 750,
                              fontSize: '0.75rem',
                              border: '1px solid #bbf7d0'
                            }}>
                              <CheckCircle2 size={12} />
                              <span>Paid & Cleared</span>
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {item.payment_method || 'Bank Transfer'}
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-start' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              background: '#fff7ed',
                              color: '#ea580c',
                              fontWeight: 750,
                              fontSize: '0.75rem',
                              border: '1px solid #fed7aa'
                            }}>
                              <Clock size={12} />
                              <span>Disbursal Pending</span>
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                              Due for {formatMonthTitle(selectedMonth)}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 6. Disbursal Actions */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          {!isPaid ? (
                            <button
                              type="button"
                              onClick={() => handleOpenPay(item)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '0.4rem 0.95rem',
                                borderRadius: '8px',
                                fontSize: '0.8125rem',
                                fontWeight: 750,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                              <DollarSign size={14} />
                              <span>Pay Salary</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenPayslip(item)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: '#f0fdf4',
                                color: '#15803d',
                                border: '1px solid #bbf7d0',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 750,
                                cursor: 'pointer'
                              }}
                              title="View Official Digital Payslip"
                            >
                              <FileText size={13} />
                              <span>Payslip</span>
                            </button>
                          )}

                          {/* Quick Adjust Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenAdjust(item)}
                            className="btn btn-neutral btn-sm"
                            title="Adjust Compensation Structure"
                            style={{ padding: '0.4rem 0.65rem' }}
                          >
                            <CreditCard size={13} />
                          </button>
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

      {/* ─── MODAL 1: Individual Salary Disbursal ───────────────── */}
      {payModalOpen && selectedSalary && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setPayModalOpen(false); }}>
          <div className="modal-content provision-modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header provision-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="provision-icon-tile" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
                  <DollarSign size={22} />
                </div>
                <div>
                  <div className="provision-badge">
                    <ShieldCheck size={11} />
                    <span>Compensation Disbursal</span>
                  </div>
                  <h3 className="provision-title" style={{ fontSize: '1.2rem' }}>
                    Process Salary Payment
                  </h3>
                  <p className="provision-subtitle">Disburse approved monthly funds to staff account.</p>
                </div>
              </div>
              <button type="button" className="modal-close" onClick={() => setPayModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmPay}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 1.85rem' }}>
                {/* Staff Summary Card */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Recipient Staff</span>
                    <h4 style={{ margin: '0.15rem 0 0', color: '#0a2540', fontSize: '1rem', fontWeight: 800 }}>{selectedSalary.user?.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>{selectedSalary.user?.role?.name?.toUpperCase()} • {formatMonthTitle(selectedMonth)}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Net Disbursal</span>
                    <div style={{ fontSize: '1.45rem', fontWeight: 850, color: '#059669' }}>
                      ${selectedSalary.net_salary.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="form-field-wrapper">
                  <label className="provision-label">
                    <span>Disbursal Payment Channel</span>
                    <span className="req-dot">*</span>
                  </label>
                  <div className="provision-input-box">
                    <CreditCard size={16} className="input-leading-icon" />
                    <select
                      value={paymentForm.payment_method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                      className="provision-input"
                    >
                      <option value="Direct Bank Transfer">Direct Bank Wire / ACH</option>
                      <option value="Corporate Direct Deposit">Corporate Direct Deposit</option>
                      <option value="Company Cheque">Commercial Hospital Cheque</option>
                      <option value="Cash Disbursement">Verified Cash Payout</option>
                    </select>
                  </div>
                </div>

                {/* Transaction Reference */}
                <div className="form-field-wrapper">
                  <label className="provision-label">
                    <span>Transaction / Ref ID</span>
                    <span className="req-dot">*</span>
                  </label>
                  <div className="provision-input-box">
                    <FileText size={16} className="input-leading-icon" />
                    <input
                      type="text"
                      required
                      value={paymentForm.transaction_ref}
                      onChange={(e) => setPaymentForm({ ...paymentForm, transaction_ref: e.target.value })}
                      className="provision-input"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="form-field-wrapper">
                  <label className="provision-label">
                    <span>Audit Notes</span>
                  </label>
                  <div className="provision-input-box">
                    <FileText size={16} className="input-leading-icon" />
                    <input
                      type="text"
                      placeholder="Optional notes or remarks..."
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      className="provision-input"
                    />
                  </div>
                </div>
              </div>

              <div className="provision-footer">
                <div className="provision-security-note">
                  <ShieldCheck size={14} color="#10b981" />
                  <span>Verified Financial Audit Trail</span>
                </div>
                <div className="provision-footer-actions">
                  <button type="button" className="provision-cancel-btn" onClick={() => setPayModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="provision-submit-btn" disabled={actionLoading}>
                    {actionLoading ? 'Processing...' : 'Confirm & Disburse Funds'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: 1-Click Batch Disburse All ────────────────── */}
      {disburseAllModalOpen && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setDisburseAllModalOpen(false); }}>
          <div className="modal-content provision-modal-content" style={{ maxWidth: '480px', textAlign: 'center', padding: '2rem 1.75rem' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CreditCard size={26} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 850, color: '#0a2540', marginBottom: '0.4rem' }}>
              Batch Disburse Pending Salaries?
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              You are about to approve and disburse salaries for <strong>{metrics.pending_count} staff members</strong> totaling <strong>${metrics.pending_payroll.toLocaleString()}</strong> for <strong>{formatMonthTitle(selectedMonth)}</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button type="button" className="provision-cancel-btn" onClick={() => setDisburseAllModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="provision-submit-btn"
                onClick={handleConfirmDisburseAll}
                disabled={actionLoading}
                style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
              >
                {actionLoading ? 'Processing Batch...' : `Disburse $${metrics.pending_payroll.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: Official Digital Payslip ─────────────────── */}
      {payslipModalOpen && selectedSalary && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setPayslipModalOpen(false); }}>
          <div className="modal-content provision-modal-content" style={{ maxWidth: '580px', padding: '2rem' }}>
            {/* Header with Hospital Branding */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '2px solid #0a2540', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0a2540', letterSpacing: '-0.02em' }}>
                  MEDICORE HEALTHCARE SYSTEM
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Apollo Multi-Specialty Tertiary Hospital Network
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block',
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #bbf7d0',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '6px'
                }}>
                  PAID SALARY VOUCHER
                </span>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Ref: {selectedSalary.transaction_ref || 'TXN-DISBURSED'}
                </div>
              </div>
            </div>

            {/* Employee Meta Details */}
            <div className="payslip-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Staff Name:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{selectedSalary.user?.name}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Role & Department:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{selectedSalary.user?.role?.name?.toUpperCase()} • {selectedSalary.user?.doctor?.department?.name || 'Faculty'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Pay Period:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{formatMonthTitle(selectedMonth)}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Payment Date:</span>
                <strong style={{ display: 'block', color: '#0f172a' }}>{selectedSalary.paid_at ? new Date(selectedSalary.paid_at).toLocaleDateString() : 'Paid'}</strong>
              </div>
            </div>

            {/* Earnings & Deductions Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f1f5f9', padding: '0.5rem 0.85rem', fontWeight: 800, fontSize: '0.75rem', color: '#475569' }}>
                <span>EARNINGS BREAKDOWN</span>
                <span style={{ textAlign: 'right' }}>AMOUNT (USD)</span>
              </div>
              <div style={{ padding: '0.75rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Basic Clinical Compensation</span>
                  <strong>${selectedSalary.base_salary.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hospital Clinical Allowances</span>
                  <strong>+${selectedSalary.allowances.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                  <span>Tax & Withholding Deductions</span>
                  <strong>-${selectedSalary.deductions.toLocaleString()}</strong>
                </div>
              </div>
              <div style={{ borderTop: '2px dashed #e2e8f0', padding: '0.75rem 0.85rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#0a2540', fontSize: '0.9rem' }}>NET DISBURSED AMOUNT</span>
                <span style={{ fontWeight: 900, color: '#059669', fontSize: '1.25rem' }}>${selectedSalary.net_salary.toLocaleString()}</span>
              </div>
            </div>

            {/* Footer & Print Action */}
            <div className="payslip-footer-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Authorized by Hospital Accounts Division
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="provision-cancel-btn"
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Printer size={14} />
                  <span>Print Payslip</span>
                </button>
                <button
                  type="button"
                  className="provision-submit-btn"
                  onClick={() => setPayslipModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: Compensation Structure Adjustment ─────────── */}
      {adjustModalOpen && selectedSalary && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setAdjustModalOpen(false); }}>
          <div className="modal-content provision-modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header provision-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="provision-icon-tile">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h3 className="provision-title" style={{ fontSize: '1.2rem' }}>
                    Adjust Compensation Structure
                  </h3>
                  <p className="provision-subtitle">{selectedSalary.user?.name} • {formatMonthTitle(selectedMonth)}</p>
                </div>
              </div>
              <button type="button" className="modal-close" onClick={() => setAdjustModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdjust}>
              <div className="salary-adjust-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem 1.85rem' }}>
                {/* Base Salary */}
                <div className="form-field-wrapper span-2">
                  <label className="provision-label">
                    <span>Base Monthly Salary ($)</span>
                    <span className="req-dot">*</span>
                  </label>
                  <div className="provision-input-box">
                    <DollarSign size={16} className="input-leading-icon" />
                    <input
                      type="number"
                      min="0"
                      required
                      value={adjustForm.base_salary}
                      onChange={(e) => setAdjustForm({ ...adjustForm, base_salary: parseFloat(e.target.value) || 0 })}
                      className="provision-input"
                    />
                  </div>
                </div>

                {/* Allowances */}
                <div className="form-field-wrapper">
                  <label className="provision-label">
                    <span>Allowances ($)</span>
                  </label>
                  <div className="provision-input-box">
                    <DollarSign size={16} className="input-leading-icon" />
                    <input
                      type="number"
                      min="0"
                      value={adjustForm.allowances}
                      onChange={(e) => setAdjustForm({ ...adjustForm, allowances: parseFloat(e.target.value) || 0 })}
                      className="provision-input"
                    />
                  </div>
                </div>

                {/* Deductions */}
                <div className="form-field-wrapper">
                  <label className="provision-label">
                    <span>Deductions ($)</span>
                  </label>
                  <div className="provision-input-box">
                    <DollarSign size={16} className="input-leading-icon" />
                    <input
                      type="number"
                      min="0"
                      value={adjustForm.deductions}
                      onChange={(e) => setAdjustForm({ ...adjustForm, deductions: parseFloat(e.target.value) || 0 })}
                      className="provision-input"
                    />
                  </div>
                </div>

                {/* Calculated Net Preview */}
                <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>Calculated Net Compensation:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 850, color: '#0284c7' }}>
                    ${Math.max(0, (adjustForm.base_salary || 0) + (adjustForm.allowances || 0) - (adjustForm.deductions || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="provision-footer">
                <div className="provision-security-note">
                  <span>Saved directly to monthly ledger</span>
                </div>
                <div className="provision-footer-actions">
                  <button type="button" className="provision-cancel-btn" onClick={() => setAdjustModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="provision-submit-btn" disabled={actionLoading}>
                    {actionLoading ? 'Saving...' : 'Save Structure'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
