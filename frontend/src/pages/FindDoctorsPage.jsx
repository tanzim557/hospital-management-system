import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import FloatingDock from '../components/public/FloatingDock';
import DataTable from '../components/common/DataTable';
import QuickBookModal from '../components/public/QuickBookModal';
import api from '../api/axios';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  Clock,
  Calendar,
  Award,
  ArrowRight,
  ShieldCheck,
  Building2,
  Activity,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Users,
  CalendarDays,
  Check
} from 'lucide-react';
import '../assets/styles/landing.css';

const POPULAR_DISEASES = [
  { id: '', label: 'All Conditions' },
  { id: 'Heart Failure', label: 'Heart Failure & CAD' },
  { id: 'Brain Tumors', label: 'Brain Tumors & Stroke' },
  { id: 'Cancer', label: 'Cancer & Chemotherapy' },
  { id: 'Osteoarthritis', label: 'Joint Osteoarthritis' },
  { id: 'Diabetes', label: 'Type 2 Diabetes' },
  { id: 'Kidney Stones', label: 'Kidney Stones & Renal' },
  { id: 'Asthma', label: 'Asthma & Lung Care' },
  { id: 'High-Risk Pregnancy', label: 'High-Risk Pregnancy' },
  { id: 'Liver Cirrhosis', label: 'Liver Cirrhosis' },
  { id: 'Psoriasis', label: 'Skin & Dermatology' }
];

export default function FindDoctorsPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialDisease = searchParams.get('disease') || '';
  const initialDept = searchParams.get('department_id') || '';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedDisease, setSelectedDisease] = useState(initialDisease);
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [departments, setDepartments] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);

  const handleOpenBooking = (doc) => {
    setBookingDoctor(doc);
    setBookModalOpen(true);
  };

  useEffect(() => {
    fetchDepartments();
    fetchDoctors({ search: initialSearch, disease: initialDisease, department_id: initialDept });
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data || response.data || []);
    } catch (err) {
      console.warn('Could not fetch departments list:', err);
    }
  };

  const fetchDoctors = async (queryOverrides = {}) => {
    setLoading(true);
    try {
      const params = {
        per_page: 50,
        ...queryOverrides
      };

      if (search) params.search = search;
      if (selectedDisease) params.disease = selectedDisease;
      if (selectedDept) params.department_id = selectedDept;

      const response = await api.get('/doctors', { params });
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch doctors list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleDiseaseClick = (diseaseId) => {
    setSelectedDisease(diseaseId);
    fetchDoctors({ disease: diseaseId });
  };

  const handleDeptChange = (deptId) => {
    setSelectedDept(deptId);
    fetchDoctors({ department_id: deptId });
  };

  const tableColumns = [
    {
      key: 'doctor',
      label: 'Doctor & Profile',
      render: (row) => {
        const name = row.user?.name || 'Specialist';
        const formattedName = name.startsWith('Dr.') ? name : `Dr. ${name}`;
        const avatar = row.user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0 }}>
              <img
                src={avatar}
                alt={formattedName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{formattedName}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.qualification || 'MBBS, Specialist'}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'specialization',
      label: 'Specialty & Department',
      render: (row) => (
        <div>
          <span style={{ fontWeight: 700, color: 'var(--color-apollo-orange)', display: 'block' }}>
            {row.specialization}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.department?.name || 'Clinical Care'}
          </span>
        </div>
      )
    },
    {
      key: 'treated_diseases',
      label: 'Treated Diseases',
      render: (row) => {
        const diseases = Array.isArray(row.treated_diseases)
          ? row.treated_diseases
          : (typeof row.treated_diseases === 'string' ? JSON.parse(row.treated_diseases || '[]') : []);
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: '320px' }}>
            {diseases.slice(0, 3).map((d, i) => (
              <span key={i} className="disease-tag-pill">{d}</span>
            ))}
            {diseases.length > 3 && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', alignSelf: 'center' }}>+{diseases.length - 3} more</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'campus',
      label: 'Campus & Exp',
      render: (row) => (
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
            {row.campus || 'Dhaka Main Hospital'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.experience_years ? `${row.experience_years}+ Yrs Exp` : '15+ Yrs Exp'}
          </span>
        </div>
      )
    },
    {
      key: 'consultation_fee',
      label: 'Fee',
      render: (row) => (
        <strong style={{ color: 'var(--color-primary-500)', fontSize: '0.95rem' }}>
          ${parseFloat(row.consultation_fee || 0).toFixed(2)}
        </strong>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <button 
          type="button"
          onClick={() => handleOpenBooking(row)} 
          className="btn btn-orange btn-sm" 
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.78125rem' }}
        >
          Book Visit
        </button>
      )
    }
  ];

  return (
    <div className="landing-page-root">
      <PublicHeader />

      {/* Page Hero Header */}
      <section className="page-hero-banner">
        <div className="page-hero-inner">
          <div className="section-tag" style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}>
            <Award size={14} />
            <span>50+ Board-Certified Specialists • 20 Clinical Departments</span>
          </div>
          <h1 className="page-hero-title">Find Doctors & Specialist Directory</h1>
          <p className="page-hero-desc">
            Search our tertiary care faculty by doctor name, medical department, or specific health condition.
            Review clinical credentials, visiting schedules, consultation fees, and book guaranteed appointments.
          </p>

          {/* Integrated Search & Filter Row */}
          <form onSubmit={handleSearchSubmit} className="doctors-search-form">
            <div className="search-input-field" style={{ flex: 2 }}>
              <Search size={16} className="search-field-icon" />
              <input
                type="text"
                placeholder="Search by doctor name (e.g. Sarah, Arthur), disease, or symptom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="search-input-field" style={{ flex: 1.2 }}>
              <Building2 size={16} className="search-field-icon" />
              <select
                value={selectedDept}
                onChange={(e) => handleDeptChange(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-orange">
              <span>Search Doctors</span>
              <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="apollo-section" style={{ paddingTop: '2.5rem', maxWidth: '1360px', margin: '0 auto' }}>
        {/* Quick Disease Filter Pills */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.78125rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={14} color="var(--color-apollo-orange)" />
            <span>Filter by Medical Condition / Treated Disease:</span>
          </div>
          <div className="filter-tabs-wrap" style={{ justifyContent: 'flex-start', flexWrap: 'wrap', gap: '0.45rem' }}>
            {POPULAR_DISEASES.map((dis) => (
              <button
                key={dis.id}
                type="button"
                className={`filter-pill ${selectedDisease === dis.id ? 'active' : ''}`}
                onClick={() => handleDiseaseClick(dis.id)}
              >
                <span>{dis.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Bar with View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{doctors.length}</strong> board-certified specialists
            {selectedDisease && <span> for: <strong style={{ color: 'var(--color-apollo-orange)' }}>"{selectedDisease}"</strong></span>}
            {search && <span> matching: <strong style={{ color: 'var(--color-apollo-orange)' }}>"{search}"</strong></span>}
          </div>

          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Card View"
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="List / Table View"
            >
              <List size={15} />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Doctors Listing */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading medical faculty directory...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#f8fafc', borderRadius: 'var(--radius-xl)', border: '1px dashed #cbd5e1' }}>
            <Users size={36} style={{ color: '#94a3b8', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>No doctors found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0.5rem auto 1.5rem auto', fontSize: '0.875rem' }}>
              We could not find any doctors matching your search criteria. Try selecting "All Conditions" or resetting the search.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedDisease('');
                setSelectedDept('');
                fetchDoctors({ search: '', disease: '', department_id: '' });
              }}
              className="btn btn-primary"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <DataTable
            columns={tableColumns}
            data={doctors}
            keyField="id"
            emptyMessage="No doctors matching criteria."
          />
        ) : (
          <div className="doctors-modern-grid">
            {doctors.map((doc) => {
              const name = doc.user?.name || 'Specialist';
              const formattedName = name.startsWith('Dr.') ? name : `Dr. ${name}`;
              const avatar = doc.user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
              const diseases = Array.isArray(doc.treated_diseases)
                ? doc.treated_diseases
                : (typeof doc.treated_diseases === 'string' ? JSON.parse(doc.treated_diseases || '[]') : []);

              const displayDiseases = diseases.slice(0, 3);
              const remainingCount = diseases.length - 3;

              return (
                <div key={doc.id} className="doctor-modern-card animate-fade-in">
                  {/* Top Doctor Profile Strip */}
                  <div className="doc-modern-header">
                    <div className="doc-modern-avatar-wrap">
                      <img
                        src={avatar}
                        alt={formattedName}
                        className="doc-modern-avatar"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <span className="doc-modern-live-dot" title="Verified Available" />
                    </div>

                    <div className="doc-modern-meta">
                      <h3 className="doc-modern-name">{formattedName}</h3>
                      <div className="doc-modern-spec">{doc.specialization}</div>
                      <div className="doc-modern-dept">{doc.department?.name || 'Specialty Care'}</div>
                      <div className="doc-modern-rating">
                        <Star size={12} fill="#f59e0b" color="#f59e0b" />
                        <strong>4.9</strong>
                        <span>(1,800+ reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Micro Info Stats Strip */}
                  <div className="doc-modern-stats-strip">
                    <div className="doc-stat-pill">
                      <span className="stat-label">EXP</span>
                      <strong className="stat-val">{doc.experience_years ? `${doc.experience_years}+ Yrs` : '15+ Yrs'}</strong>
                    </div>
                    <div className="doc-stat-pill fee">
                      <span className="stat-label">FEE</span>
                      <strong className="stat-val">${parseFloat(doc.consultation_fee || 0).toFixed(2)}</strong>
                    </div>
                    <div className="doc-stat-pill qual">
                      <span className="stat-label">DEGREE</span>
                      <strong className="stat-val">{doc.qualification?.split(',')[0] || 'MBBS, MD'}</strong>
                    </div>
                  </div>

                  {/* Schedule 1-Liner */}
                  <div className="doc-modern-schedule">
                    <Clock size={13} color="var(--color-apollo-orange)" style={{ flexShrink: 0 }} />
                    <span>
                      {doc.available_days ? (Array.isArray(doc.available_days) ? doc.available_days.slice(0, 3).join(', ') : doc.available_days) : 'Mon, Wed, Sat'} • ({doc.available_from?.slice(0, 5) || '09:00'} - {doc.available_to?.slice(0, 5) || '17:00'})
                    </span>
                  </div>

                  {/* Compact Treated Conditions */}
                  {diseases.length > 0 && (
                    <div className="doc-modern-conditions">
                      <span className="conditions-label">Treated Conditions:</span>
                      <div className="conditions-chips">
                        {displayDiseases.map((dis, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleDiseaseClick(dis)}
                            className="condition-chip"
                            title={`Filter by ${dis}`}
                          >
                            {dis}
                          </button>
                        ))}
                        {remainingCount > 0 && (
                          <span className="condition-chip more">+{remainingCount} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Symmetrical Action Buttons */}
                  <div className="doc-modern-actions">
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(doc)}
                      className="doc-modern-btn-book"
                    >
                      <CalendarDays size={14} />
                      <span>Book Visit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(doc)}
                      className="doc-modern-btn-profile"
                    >
                      <span>Check Slots</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <PublicFooter />
      <FloatingDock />

      {/* Frictionless Public Quick Book Modal */}
      <QuickBookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        preselectedDoctor={bookingDoctor}
      />
    </div>
  );
}
