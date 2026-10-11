import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import FloatingDock from '../components/public/FloatingDock';
import {
  HeartPulse,
  Brain,
  Award,
  Activity,
  Baby,
  Stethoscope,
  Microscope,
  ShieldCheck,
  Ambulance,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  ChevronRight
} from 'lucide-react';
import '../assets/styles/landing.css';

const specialtiesData = [
  {
    id: 'cardiac',
    name: 'Cardiology & Heart Center',
    category: 'cardiac',
    tagline: 'Comprehensive Cardiovascular Care & Minimally Invasive Interventions',
    icon: HeartPulse,
    color: '#0a2540',
    bg: '#eff6ff',
    stats: '160,000+ Surgeries • 99.4% Success',
    procedures: ['TAVI (Transcatheter Aortic Valve)', 'Minimally Invasive Coronary Bypass', 'Robotic Cardiac Surgery', 'Electrophysiology & Pacemaker', 'Pediatric Heart Surgery'],
    conditions: ['Coronary Artery Disease', 'Heart Failure', 'Arrhythmia & Atrial Fibrillation', 'Valvular Heart Disease', 'Congenital Heart Defects'],
    doctorsCount: '14 Specialists Available',
    leadDoctor: 'Dr. Sarah Ahmed (Chief Cardiologist)'
  },
  {
    id: 'cancer',
    name: 'Cancer Institute & Oncology',
    category: 'cancer',
    tagline: 'South Asia’s First Proton Beam Therapy & Robotic Surgical Oncology',
    icon: Award,
    color: '#db2777',
    bg: '#fdf2f8',
    stats: 'Proton Beam • Da Vinci Robotic Surgical Suite',
    procedures: ['Proton Beam Therapy', 'Da Vinci Robotic Tumor Resection', 'Targeted Immunotherapy & Chemotherapy', 'Bone Marrow Transplant', 'Stereotactic Radiosurgery (CyberKnife)'],
    conditions: ['Breast & Gynecological Cancers', 'Lung & Thoracic Malignancies', 'Colorectal & Gastrointestinal Cancer', 'Prostate & Bladder Tumors', 'Leukemia & Lymphoma'],
    doctorsCount: '12 Specialists Available',
    leadDoctor: 'Dr. Rajesh Patel, FACS (Robotic Oncology)'
  },
  {
    id: 'neuro',
    name: 'Institute of Neurosciences',
    category: 'neuro',
    tagline: 'Advanced Brain Tumor Resection, Stroke Response & Spine Surgery',
    icon: Brain,
    color: '#088395',
    bg: '#f0fdfa',
    stats: '24/7 Stroke Thrombectomy • Micro-Neurosurgery',
    procedures: ['Deep Brain Stimulation (DBS)', 'Awake Craniotomy Brain Surgery', 'Endoscopic Minimally Invasive Spine Surgery', 'Endovascular Stroke Thrombectomy', 'Pediatric Neurosurgery'],
    conditions: ['Brain Tumors & Gliomas', 'Acute Ischemic & Hemorrhagic Stroke', 'Epilepsy & Seizure Disorders', 'Parkinson’s Disease & Tremors', 'Sciatica, Slipped Disc & Spine Trauma'],
    doctorsCount: '10 Specialists Available',
    leadDoctor: 'Prof. Dr. Arthur Vance, MD (Director)'
  },
  {
    id: 'ortho',
    name: 'Robotic Orthopedics & Joint Care',
    category: 'ortho',
    tagline: 'MAKO SmartRobotics Joint Replacements & Sports Medicine',
    icon: Activity,
    color: '#15803d',
    bg: '#f0fdf4',
    stats: 'Sub-millimeter Precision • Rapid 24h Post-Op Mobility',
    procedures: ['MAKO Robotic Total Knee Replacement', 'Robotic Anterior Hip Replacement', 'Arthroscopic ACL / Meniscus Reconstruction', 'Complex Pelvic & Trauma Reconstruction', 'Spine Fusion & Disc Arthroplasty'],
    conditions: ['Severe Knee & Hip Osteoarthritis', 'Sports Ligament Tears (ACL, PCL, Meniscus)', 'Rotator Cuff & Shoulder Dislocation', 'Spinal Stenosis & Spondylolisthesis', 'Bone Fractures & Non-unions'],
    doctorsCount: '9 Specialists Available',
    leadDoctor: 'Dr. Nusrat Jahan (Arthroplasty Fellow)'
  },
  {
    id: 'pediatric',
    name: 'Pediatrics & Neonatal ICU (NICU)',
    category: 'pediatric',
    tagline: 'Level-III Dedicated Neonatal Intensive Care & Pediatric Surgery',
    icon: Baby,
    color: '#c2410c',
    bg: '#fff7ed',
    stats: 'Level-III NICU • 24/7 Pediatric Emergency Response',
    procedures: ['Neonatal Intensive Care & Ventilation', 'Pediatric Laparoscopic Surgery', 'Congenital Anomaly Correction', 'Child Neuro-Developmental Assessment', 'Pediatric Asthma & Allergy Management'],
    conditions: ['Premature & Low-Birth-Weight Infants', 'Neonatal Jaundice & Sepsis', 'Childhood Pneumonia & Asthma', 'Congenital Heart & Hernia Defects', 'Pediatric Infections & Viral Illnesses'],
    doctorsCount: '8 Specialists Available',
    leadDoctor: 'Dr. Kamal Uddin (Consultant Neonatologist)'
  },
  {
    id: 'gastro',
    name: 'Gastroenterology & Hepatology',
    category: 'gastro',
    tagline: 'Comprehensive Digestive Health, Liver Center & Therapeutic Endoscopy',
    icon: Stethoscope,
    color: '#7c3aed',
    bg: '#faf5ff',
    stats: 'High-Definition Capsule Endoscopy • ERCP Unit',
    procedures: ['Therapeutic ERCP & EUS Diagnostics', 'Third Space Endoscopy (POEM / ESD)', 'Liver Cirrhosis Management & Biopsy', 'Colonoscopy & Polypectomy', 'Bariatric Weight Management Endoscopy'],
    conditions: ['GERD, Acid Reflux & Peptic Ulcers', 'Fatty Liver & NASH Fibrosis', 'Viral Hepatitis B & C', 'Inflammatory Bowel Disease (Crohn’s / UC)', 'Pancreatitis & Gallstones'],
    doctorsCount: '8 Specialists Available',
    leadDoctor: 'Dr. Tanvir Chowdhury (FACG)'
  },
  {
    id: 'nephro',
    name: 'Nephrology, Urology & Renal Transplant',
    category: 'nephro',
    tagline: 'State-of-the-Art Dialysis Suites & Kidney Transplantation',
    icon: Microscope,
    color: '#2563eb',
    bg: '#eff6ff',
    stats: '1,500+ Renal Transplants • 24-Bed Hemodialysis',
    procedures: ['Living Donor Kidney Transplantation', 'High-Flux Nocturnal Hemodialysis', 'Laser Lithotripsy for Kidney Stones (RIRS)', 'Robotic Prostatectomy & Bladder Surgery', 'Continuous Renal Replacement Therapy (CRRT)'],
    conditions: ['Chronic Kidney Disease (CKD Stage 1-5)', 'Large Kidney & Ureteric Stones', 'Glomerulonephritis & Nephrotic Syndrome', 'Prostate Enlargement (BPH)', 'Urinary Tract Infections & Incontinence'],
    doctorsCount: '7 Specialists Available',
    leadDoctor: 'Dr. Ananya Sen (FASN USA)'
  },
  {
    id: 'gynae',
    name: 'Obstetrics & Women’s Health',
    category: 'gynae',
    tagline: 'High-Risk Maternal Care, Laparoscopic Gynecology & Fetal Medicine',
    icon: ShieldCheck,
    color: '#e11d48',
    bg: '#fff1f2',
    stats: 'Natural Birthing Suites • Fetal Echo Diagnostics',
    procedures: ['Advanced 3D/4D Fetal Screening Ultrasound', 'Minimally Invasive Laparoscopic Hysterectomy', 'Painless Labor & Delivery Suites', 'Hysteroscopic Myomectomy & Polypectomy', 'PCOS & Infertility Reproductive Management'],
    conditions: ['High-Risk Pregnancies & Preeclampsia', 'Uterine Fibroids & Adenomyosis', 'Endometriosis & Pelvic Pain', 'Polycystic Ovarian Syndrome (PCOS)', 'Cervical & Endometrial Disorders'],
    doctorsCount: '9 Specialists Available',
    leadDoctor: 'Dr. Shamima Nasrin (MRCOG London)'
  },
  {
    id: 'emergency',
    name: 'Emergency & Trauma Care (1066)',
    category: 'emergency',
    tagline: 'Rapid 7-Min Ambulance Response & Dedicated Level-1 Trauma Suite',
    icon: Ambulance,
    color: '#dc2626',
    bg: '#fef2f2',
    stats: 'Emergency Helpline 1066 • Mobile ICU Fleet',
    procedures: ['Advanced Cardiac Life Support (ACLS)', 'Polytrauma Emergency Resuscitation', 'Rapid Golden-Hour Angioplasty (Code STEMI)', 'Hyperacute Stroke Thrombolysis (Code Stroke)', 'Burn & Toxic Exposure Critical Care'],
    conditions: ['Sudden Chest Pain & Heart Attack', 'Acute Paralysis & Stroke Symptoms', 'Severe Road Accidents & Multiple Trauma', 'Respiratory Distress & Anaphylaxis', 'Acute Sepsis & Poisoning'],
    doctorsCount: '24/7 Dedicated Trauma Board',
    leadDoctor: 'Dr. Tariq Zaman (Head of Emergency Medicine)'
  }
];

export default function SpecialtiesPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filteredSpecialties = specialtiesData.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(query) ||
      item.tagline.toLowerCase().includes(query) ||
      item.conditions.some((c) => c.toLowerCase().includes(query)) ||
      item.procedures.some((p) => p.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="landing-page-root">
      <PublicHeader />

      {/* Page Hero Header */}
      <section className="page-hero-banner">
        <div className="page-hero-inner">
          <div className="section-tag" style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}>
            <Sparkles size={14} />
            <span>25+ Medical Departments • Cutting-Edge Robotic Suites</span>
          </div>
          <h1 className="page-hero-title">Medical Specialties & Dedicated Institutes</h1>
          <p className="page-hero-desc">
            Explore MediCore’s world-renowned centers of clinical excellence. From minimally invasive robotic
            surgery to groundbreaking proton beam cancer therapy, our specialized faculties provide
            compassionate, world-standard care for every medical condition.
          </p>

          {/* Search bar inside Hero */}
          <div className="page-hero-search-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by specialty, surgery, or medical condition (e.g. Heart Bypass, TAVI, Brain Tumor, Knee Osteoarthritis)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="page-hero-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="clear-search-btn"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Specialty Filter Navigation Bar */}
      <section className="apollo-section" style={{ paddingTop: '2rem' }}>
        <div className="inner-wrap">
          <div className="filter-tabs-wrap" style={{ marginBottom: '2.5rem' }}>
            {[
              { id: 'all', label: 'All Specialties' },
              { id: 'cardiac', label: 'Cardiology' },
              { id: 'cancer', label: 'Cancer & Oncology' },
              { id: 'neuro', label: 'Neurosciences' },
              { id: 'ortho', label: 'Orthopedics' },
              { id: 'pediatric', label: 'Pediatrics' },
              { id: 'gastro', label: 'Gastroenterology' },
              { id: 'nephro', label: 'Nephrology & Kidney' },
              { id: 'gynae', label: 'Women’s Health' },
              { id: 'emergency', label: 'Emergency 1066' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-pill ${activeCategory === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setSearchTerm('');
                }}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Specialties Detailed Cards Grid */}
          <div className="specialties-detailed-grid">
            {filteredSpecialties.map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.id} className="specialty-card-full animate-fade-in">
                  <div className="spec-card-head">
                    <div className="spec-icon-box" style={{ background: spec.bg, color: spec.color }}>
                      <Icon size={32} />
                    </div>
                    <div className="spec-meta">
                      <h3>{spec.name}</h3>
                      <p className="spec-tagline">{spec.tagline}</p>
                      <span className="spec-stat-badge">
                        <Award size={13} color="var(--color-apollo-orange)" />
                        <span>{spec.stats}</span>
                      </span>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="spec-details-body">
                    {/* Key Procedures */}
                    <div className="spec-detail-block">
                      <span className="spec-block-title">Key Procedures & Surgeries</span>
                      <ul className="spec-list">
                        {spec.procedures.map((proc, idx) => (
                          <li key={idx}>
                            <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                            <span>{proc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Treated Conditions */}
                    <div className="spec-detail-block">
                      <span className="spec-block-title">Common Conditions Treated</span>
                      <div className="spec-pills-wrap">
                        {spec.conditions.map((cond, idx) => (
                          <Link
                            key={idx}
                            to={`/doctors?disease=${encodeURIComponent(cond)}`}
                            className="spec-condition-tag"
                            title={`Find doctors treating ${cond}`}
                          >
                            <span>{cond}</span>
                            <ChevronRight size={11} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Faculty & Actions Strip */}
                  <div className="spec-card-footer">
                    <div className="spec-lead-doc">
                      <Users size={15} color="var(--color-apollo-orange)" />
                      <span>{spec.doctorsCount} • Led by {spec.leadDoctor}</span>
                    </div>
                    <div className="spec-actions">
                      <Link
                        to={`/doctors?search=${encodeURIComponent(spec.name.split(' ')[0])}`}
                        className="btn btn-outline btn-sm"
                      >
                        View Specialists
                      </Link>
                      <Link
                        to="/appointments"
                        className="btn btn-orange btn-sm"
                      >
                        Book Consultation
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSpecialties.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No specialties matching "{searchTerm}" found.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="btn btn-primary"
              >
                Reset Specialty Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Patient Support Banner */}
      <section style={{ padding: '0 var(--space-8) 3rem var(--space-8)', maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #0a2540 0%, #0f3d68 100%)', borderRadius: 'var(--radius-2xl)', padding: '2.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-apollo-orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Need Help Choosing the Right Specialty?
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.35rem 0' }}>
              Speak with our Clinical Triage Nurse
            </h3>
            <p style={{ color: '#94a3b8', margin: 0, maxWidth: '600px', fontSize: '0.9rem' }}>
              Unsure which medical specialist or diagnostic scan is right for your symptoms? Our senior nurse coordinator is available 24/7 to guide you to the right clinical department.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="tel:1066" className="btn btn-orange btn-lg">
              Call Hotline: 1066
            </a>
            <Link to="/doctors" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
              Browse All Doctors
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <FloatingDock />
    </div>
  );
}
