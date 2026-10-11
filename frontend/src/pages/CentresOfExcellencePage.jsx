import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import FloatingDock from '../components/public/FloatingDock';
import {
  HeartPulse,
  Brain,
  Award,
  Activity,
  Baby,
  Ambulance,
  Microscope,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Building2,
  PhoneCall
} from 'lucide-react';
import '../assets/styles/landing.css';

const institutesData = [
  {
    id: 'cardiac',
    name: 'Apollo Heart Center & Cardiology Institute',
    badge: '160,000+ Cardiac Surgeries Performed',
    icon: HeartPulse,
    color: '#0a2540',
    bg: '#eff6ff',
    desc: 'Globally recognized for pioneering minimally invasive cardiac surgery, catheter-based structural heart interventions, and complex pediatric cardiology.',
    stats: [
      { label: 'Surgeries', val: '160,000+' },
      { label: 'Success Rate', val: '99.6%' },
      { label: 'Cath Labs', val: '4 Digital Units' },
      { label: 'ECMO ICU', val: '24/7 Standby' }
    ],
    features: [
      'Transcatheter Aortic Valve Implantation (TAVI / TAVR)',
      'Minimally Invasive Direct Coronary Artery Bypass (MIDCAB)',
      'Complex Pediatric Congenital Cardiac Surgery & Norwood Procedures',
      'Advanced 3D Electrophysiology Mapping & Cryoablation for Arrhythmia',
      'Dedicated Post-Operative Coronary Care Unit (CCU)'
    ],
    tech: 'Philips Azurion 7 Dual-Plane Cath Labs, Impella Heart Pumps, ECMO Life Support',
    leadSpecialist: 'Dr. Sarah Ahmed (Chief Interventional Cardiologist)',
    link: '/doctors?search=Cardiology'
  },
  {
    id: 'cancer',
    name: 'Apollo Cancer Center & Proton Beam Institute',
    badge: 'South Asia’s First Proton Beam Therapy Center',
    icon: Award,
    color: '#db2777',
    bg: '#fdf2f8',
    desc: 'Revolutionizing cancer care through ultra-precise Proton Beam Therapy, robotic surgical oncology, comprehensive bone marrow transplants, and personalized genomics.',
    stats: [
      { label: 'Patients Treated', val: '75,000+' },
      { label: 'Precision', val: 'Sub-millimeter' },
      { label: 'Robotic Units', val: 'Da Vinci Xi' },
      { label: 'Tumor Board', val: 'Multi-Disciplinary' }
    ],
    features: [
      'Proton Beam Therapy: Zero radiation exit dose to adjacent healthy tissues',
      'Da Vinci Xi 4th Gen Robotic Surgical Resection for Prostate, GI & Gynae Cancers',
      'Allogeneic & Autologous Stem Cell / Bone Marrow Transplants (BMT)',
      'Comprehensive Molecular Genetic Profiling & Targeted Immunotherapy',
      'Organ-Preserving Breast & Head-Neck Oncology Protocols'
    ],
    tech: 'IBA Proteus PLUS Proton Gantry, TrueBeam STx Linear Accelerators, PET-CT Scanners',
    leadSpecialist: 'Dr. Rajesh Patel, FACS (Director of Robotic Surgical Oncology)',
    link: '/doctors?search=Oncology'
  },
  {
    id: 'neuro',
    name: 'Institute of Neurosciences & Brain Surgery',
    badge: 'Comprehensive Stroke Response Unit & Stereotactic Suite',
    icon: Brain,
    color: '#088395',
    bg: '#f0fdfa',
    stats: [
      { label: 'Brain Surgeries', val: '25,000+' },
      { label: 'Stroke Response', val: '< 20 Mins' },
      { label: 'DBS Cases', val: '800+' },
      { label: 'Neuro-ICU Beds', val: '32 Beds' }
    ],
    features: [
      'Hyperacute Stroke Thrombolysis & Mechanical Thrombectomy 24/7',
      'Deep Brain Stimulation (DBS) for Parkinson’s & Intractable Tremors',
      'Awake Functional Neuronavigation Craniotomy for Gliomas',
      'Minimally Invasive Biportal Endoscopic Spine Surgery (UBE)',
      'Pediatric Hydrocephalus & Craniofacial Deformity Correction'
    ],
    tech: 'Medtronic StealthStation S8 Neuronavigation, Zeiss KINEVO 900 3D Neuro-Microscope',
    leadSpecialist: 'Prof. Dr. Arthur Vance, MD (Director of Neurosurgery)',
    link: '/doctors?search=Neurology'
  },
  {
    id: 'ortho',
    name: 'Robotic Orthopedics & Joint Reconstruction',
    badge: 'MAKO SmartRobotics Joint Replacement Center',
    icon: Activity,
    color: '#15803d',
    bg: '#f0fdf4',
    stats: [
      { label: 'Joint Replacements', val: '35,000+' },
      { label: 'Robotic Accuracy', val: '99.8%' },
      { label: 'First Step Post-Op', val: 'Within 24 Hours' },
      { label: 'Sports Rehab', val: 'Olympic Level' }
    ],
    features: [
      'MAKO Robotic-Assisted Partial & Total Knee Arthroplasty',
      'Muscle-Sparing Direct Anterior Hip Replacement',
      'Arthroscopic Multi-Ligament Knee Reconstruction (ACL, PCL, Meniscus)',
      'Complex Deformity Correction & Revision Arthroplasty',
      'Dedicated Fast-Track Joint Recovery & Hydrotherapy Center'
    ],
    tech: 'Stryker MAKO 3rd Gen Robotic Arm System, Computer-Assisted Ortho Navigation',
    leadSpecialist: 'Dr. Nusrat Jahan (Arthroplasty Fellow UK)',
    link: '/doctors?search=Orthopedics'
  },
  {
    id: 'transplant',
    name: 'Multi-Organ Transplant Institute',
    badge: 'World’s Leading Solid Organ Transplant Center',
    icon: ShieldCheck,
    color: '#7c3aed',
    bg: '#faf5ff',
    stats: [
      { label: 'Transplants', val: '18,500+' },
      { label: 'Liver Success', val: '96.8%' },
      { label: 'Kidney Success', val: '98.5%' },
      { label: 'Donation Units', val: 'Green Corridor' }
    ],
    features: [
      'Adult & Pediatric Living Donor Liver Transplantation',
      'Living & Deceased Donor ABO-Incompatible Kidney Transplantation',
      'Combined Kidney-Pancreas & Multi-Visceral Transplants',
      'Heart & Double-Lung Mechanical Circulatory Transplants',
      'Dedicated Positive-Pressure HEPA-Filtered Transplant ICUs'
    ],
    tech: 'Organ Care System (OCS) Warm Perfusion, Ultrasonic Surgical Aspirators (CUSA)',
    leadSpecialist: 'Dr. Ananya Sen & Transplant Surgery Faculty',
    link: '/register'
  },
  {
    id: 'pediatric',
    name: 'Children’s Hospital & Level-III NICU',
    badge: 'Round-the-Clock Emergency Pediatric & Neonatal ICU',
    icon: Baby,
    color: '#c2410c',
    bg: '#fff7ed',
    stats: [
      { label: 'NICU Admissions', val: '12,000+' },
      { label: 'Survival Rate', val: '98.2%' },
      { label: 'NICU Incubators', val: '40 Advanced Beds' },
      { label: 'Pediatric ER', val: '24/7 Response' }
    ],
    features: [
      'Extreme Preterm Infant Resuscitation (from 24 Weeks Gestation)',
      'Pediatric Minimally Invasive Laparoscopic & Thoracic Surgery',
      'Comprehensive Child Neurodevelopmental & Autism Early Intervention Clinic',
      'Neonatal Whole-Body Hypothermia Cooling for Birth Asphyxia',
      'Dedicated Pediatric Cardiac Intensive Care Unit (PICU)'
    ],
    tech: 'GE Giraffe Omnibed Carestations, Dräger High-Frequency Oscillatory Ventilators (HFOV)',
    leadSpecialist: 'Dr. Kamal Uddin (Consultant Neonatologist & Pediatrician)',
    link: '/doctors?search=Pediatrics'
  },
  {
    id: 'emergency',
    name: 'National Emergency Trauma Center & ER 1066',
    badge: 'Sub-7 Minute Ambulance Response Network',
    icon: Ambulance,
    color: '#dc2626',
    bg: '#fef2f2',
    stats: [
      { label: 'Hotline', val: 'Dial 1066' },
      { label: 'Ambulances', val: '35 Mobile ICUs' },
      { label: 'Trauma Bays', val: '12 Resuscitation Units' },
      { label: 'Telemetry', val: '5G Live Tracking' }
    ],
    features: [
      'Code STEMI: Direct-to-Cath-Lab Heart Attack Pathway in < 60 mins',
      'Code Stroke: Immediate CT Angiography & Thrombolysis in < 25 mins',
      'Polytrauma Resuscitation Suite with In-Unit Digital Radiography',
      'Mobile ICU Ambulances Equipped with Defibrillators, Transport Ventilators & Telemetry',
      'National Disaster & Mass-Casualty Disaster Preparedness Response Board'
    ],
    tech: 'Stryker Power-PRO Stretchers, Hamilton-T1 Critical Care Transport Ventilators',
    leadSpecialist: 'Dr. Tariq Zaman & Trauma Team',
    link: 'tel:1066'
  },
  {
    id: 'radiology',
    name: 'Institute of Precision Radiology & Diagnostics',
    badge: '3 Tesla Silent MRI & Dual-Source 128 Slice CT',
    icon: Microscope,
    color: '#2563eb',
    bg: '#eff6ff',
    stats: [
      { label: 'Annual Scans', val: '250,000+' },
      { label: 'Turnaround', val: '< 2 Hours' },
      { label: 'MRI Field', val: '3.0 Tesla' },
      { label: 'Lab Automation', val: '100% Robotic' }
    ],
    features: [
      '3 Tesla Silent MRI with Neuro-Perfusion & Cardiac Spectroscopy',
      '128-Slice Dual-Source Low-Radiation Cardiac CT Coronary Angiogram',
      'Whole-Body Discovery MI Digital PET-CT for Precision Cancer Staging',
      '3D Digital Sonomammography & Contrast-Enhanced Mammography',
      '100% Robotic Automated Pathology Track with Cloud Result Dispatch'
    ],
    tech: 'Siemens MAGNETOM 3T MRI, GE Revolution 128-Slice CT, Abbott Automated Track',
    leadSpecialist: 'Clinical Pathology & Imaging Board',
    link: '/prohealth'
  }
];

export default function CentresOfExcellencePage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredInstitutes = institutesData.filter((inst) => {
    if (activeTab === 'all') return true;
    return inst.id === activeTab;
  });

  return (
    <div className="landing-page-root">
      <PublicHeader />

      {/* Page Hero Header */}
      <section className="page-hero-banner">
        <div className="page-hero-inner">
          <div className="section-tag" style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}>
            <Sparkles size={14} />
            <span>Pioneering Healthcare Innovation • 8 Dedicated Clinical Institutes</span>
          </div>
          <h1 className="page-hero-title">Apollo Centres of Clinical Excellence</h1>
          <p className="page-hero-desc">
            Bringing together internationally renowned professors, state-of-the-art robotic surgical suites,
            and specialized tertiary intensive care units to deliver breakthrough outcomes for the most complex medical conditions.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <Link to="/doctors" className="btn btn-orange btn-lg">
              <span>Find Institute Specialists</span>
              <ArrowRight size={16} />
            </Link>
            <a href="tel:1066" className="btn btn-outline btn-lg" style={{ color: '#0a2540', borderColor: '#cbd5e1' }}>
              <PhoneCall size={16} color="#dc2626" />
              <span>Emergency 1066</span>
            </a>
          </div>
        </div>
      </section>

      {/* Milestone Strip */}
      <section style={{ padding: '0 var(--space-8)' }}>
        <div className="milestones-banner" style={{ margin: '0 auto', maxWidth: '1320px' }}>
          <div className="milestone-item">
            <strong>160K<span>+</span></strong>
            <p>Heart Surgeries</p>
          </div>
          <div className="milestone-item">
            <strong>18.5K<span>+</span></strong>
            <p>Organ Transplants</p>
          </div>
          <div className="milestone-item">
            <strong>75K<span>+</span></strong>
            <p>Cancer Patients</p>
          </div>
          <div className="milestone-item">
            <strong>99.4<span>%</span></strong>
            <p>Clinical Success</p>
          </div>
          <div className="milestone-item">
            <strong>24/7</strong>
            <p>Level-1 ER 1066</p>
          </div>
        </div>
      </section>

      {/* Institutes Grid Area */}
      <section className="apollo-section" style={{ paddingTop: '2.5rem' }}>
        <div className="inner-wrap">
          {/* Institute Filter Tabs */}
          <div className="filter-tabs-wrap" style={{ marginBottom: '2.5rem' }}>
            {[
              { id: 'all', label: 'All 8 Institutes' },
              { id: 'cardiac', label: 'Heart Center' },
              { id: 'cancer', label: 'Cancer & Proton' },
              { id: 'neuro', label: 'Neurosciences' },
              { id: 'ortho', label: 'Robotic Ortho' },
              { id: 'transplant', label: 'Organ Transplant' },
              { id: 'pediatric', label: 'Children’s Hospital' },
              { id: 'emergency', label: 'ER Trauma 1066' },
              { id: 'radiology', label: 'Precision Labs' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-pill ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Deep-Dive Institute Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {filteredInstitutes.map((inst) => {
              const Icon = inst.icon;
              return (
                <div key={inst.id} className="excellence-institute-card animate-fade-in">
                  <div className="excellence-card-header">
                    <div className="excellence-title-wrap">
                      <div className="excellence-icon" style={{ background: inst.bg, color: inst.color }}>
                        <Icon size={32} />
                      </div>
                      <div>
                        <span className="excellence-badge">{inst.badge}</span>
                        <h2 className="excellence-heading">{inst.name}</h2>
                        <p className="excellence-desc">{inst.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Ribbon */}
                  <div className="excellence-stats-grid">
                    {inst.stats.map((s, idx) => (
                      <div key={idx} className="excellence-stat-box">
                        <strong>{s.val}</strong>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Highlights & Clinical Technology */}
                  <div className="excellence-body-grid">
                    <div>
                      <h4 className="excellence-subhead">Clinical Breakthroughs & Key Programs</h4>
                      <ul className="excellence-feature-list">
                        {inst.features.map((f, fIdx) => (
                          <li key={fIdx}>
                            <CheckCircle2 size={16} color="#15803d" style={{ flexShrink: 0 }} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="excellence-sidebar-box">
                      <div>
                        <h4 className="excellence-subhead">Clinical Equipment & Suites</h4>
                        <p className="excellence-tech-text">{inst.tech}</p>
                      </div>

                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Institute Leadership:
                        </span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '0.2rem' }}>
                          {inst.leadSpecialist}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                        <Link to={inst.link} className="btn btn-orange btn-sm" style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}>
                          Consult Doctors
                        </Link>
                        <Link to="/appointments" className="btn btn-outline btn-sm">
                          Book Visit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PublicFooter />
      <FloatingDock />
    </div>
  );
}
