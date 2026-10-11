import { Link } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import FloatingDock from '../components/public/FloatingDock';
import {
  Building2,
  Award,
  ShieldCheck,
  Heart,
  Users,
  Activity,
  Globe,
  CheckCircle2,
  Clock,
  PhoneCall,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import '../assets/styles/landing.css';

const milestones = [
  { val: '73+', label: 'Hospitals & Medical Centers' },
  { val: '10,000+', label: 'Modern Inpatient Beds' },
  { val: '12,000+', label: 'Specialist Physicians' },
  { val: '200M+', label: 'Lives Touched Worldwide' },
  { val: '160K+', label: 'Cardiac Surgeries Done' },
  { val: '99.4%', label: 'Clinical Precision Rate' }
];

const hospitalCampuses = [
  {
    name: 'MediCore Dhaka Main Tertiary Hospital',
    type: 'Main Academic & Surgical Center',
    address: 'House 42, Road 11, Dhanmondi, Dhaka',
    phone: '+880-1700-000000',
    beds: '650 Beds',
    emergency: '24/7 Level-1 Trauma ER 1066',
    specialties: ['Cardiology', 'Neurosurgery', 'Robotic Oncology', 'Transplants', 'NICU']
  },
  {
    name: 'Apollo Gulshan Super Specialty Center',
    type: 'Day Surgery & Executive OPD',
    address: 'Plot 18, Road 103, Gulshan-2, Dhaka',
    phone: '+880-1711-222333',
    beds: '150 Beds',
    emergency: '24/7 Urgent Care',
    specialties: ['ProHealth Preventive Checkups', 'Dermatology', 'Gastroenterology', 'Ophthalmology']
  },
  {
    name: 'Chittagong Regional Center of Excellence',
    type: 'Tertiary Referral Center',
    address: 'CDA Avenue, Agrabad Commercial Area, Chittagong',
    phone: '+880-1722-444555',
    beds: '350 Beds',
    emergency: '24/7 Mobile ICU ER 1066',
    specialties: ['Interventional Cardiology', 'Orthopedics', 'Pediatrics', 'Dialysis Suites']
  },
  {
    name: 'Apollo Hospitals Chennai (Global Partner)',
    type: 'International Proton & Transplant Hub',
    address: '21 Greams Road, Thousand Lights, Chennai, India',
    phone: '+91-44-2829-0200',
    beds: '1,200 Beds',
    emergency: 'Proton Beam & Heart Transplant Care',
    specialties: ['Proton Beam Therapy', 'Heart & Lung Transplants', 'Bone Marrow Transplants']
  }
];

const clinicalValues = [
  {
    title: 'Clinical Excellence',
    desc: 'Uncompromising adherence to evidence-based international clinical protocols, yielding industry-leading surgical success rates.',
    icon: Award,
    color: '#0a2540'
  },
  {
    title: 'Patient-Centric Empathy',
    desc: 'Compassionate healing tailored to the dignity, comfort, and psychological wellbeing of every patient and their family.',
    icon: Heart,
    color: '#ea580c'
  },
  {
    title: 'Robotic & Medical Innovation',
    desc: 'Investing in cutting-edge medical breakthroughs including MAKO robotics, Proton Therapy, and AI predictive diagnostic tools.',
    icon: Activity,
    color: '#088395'
  },
  {
    title: 'Integrity & Transparency',
    desc: 'Transparent ethical medical billing, honest second opinions, and zero unnecessary medical procedures.',
    icon: ShieldCheck,
    color: '#15803d'
  }
];

export default function AboutHospitalPage() {
  return (
    <div className="landing-page-root">
      <PublicHeader />

      {/* Page Hero Header */}
      <section className="page-hero-banner">
        <div className="page-hero-inner">
          <div className="section-tag" style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}>
            <Sparkles size={14} />
            <span>40+ Years of Healthcare Leadership • JCI USA Accredited</span>
          </div>
          <h1 className="page-hero-title">About MediCore Hospitals & Health Network</h1>
          <p className="page-hero-desc">
            Inspired by the highest global benchmarks of the Apollo Hospitals Enterprise, MediCore is committed to
            transforming healthcare through world-class clinical expertise, advanced surgical precision, and compassionate human care.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <Link to="/doctors" className="btn btn-orange btn-lg">
              <span>Meet Our Specialists</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/specialties" className="btn btn-outline btn-lg" style={{ color: '#0a2540', borderColor: '#cbd5e1' }}>
              <span>Explore Clinical Specialties</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Milestones Banner */}
      <section style={{ padding: '0 var(--space-8)' }}>
        <div className="milestones-banner" style={{ margin: '0 auto', maxWidth: '1320px' }}>
          {milestones.map((m, idx) => (
            <div key={idx} className="milestone-item">
              <strong>{m.val}</strong>
              <p>{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="apollo-section">
        <div className="inner-wrap">
          <div className="about-hero-grid">
            <div>
              <div className="section-tag">Our Healthcare Legacy</div>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-primary-500)', marginBottom: '1rem' }}>
                Touching Lives, Pioneering Healthcare
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                MediCore was established with a singular mission: to make international-standard tertiary medical treatment
                accessible, affordable, and compassionate without requiring patients to travel overseas for complex procedures.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Over four decades, our network has pioneered South Asia’s foremost cardiac programs, robotic surgery suites,
                pediatric intensive care units, and solid organ transplant protocols, touching more than 200 million lives.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#15803d" />
                  <span>Ranked among the Top 5 Multi-Specialty Hospital Networks in the Region</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#15803d" />
                  <span>First hospital network in Bangladesh with JCI (Joint Commission International) Gold Seal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#15803d" />
                  <span>Sub-7 minute ambulance emergency response with national hotline 1066</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-2xl)', padding: '2.5rem', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-600)', marginBottom: '1.25rem' }}>
                Accreditations & Quality Benchmarks
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, background: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>Joint Commission International (JCI USA)</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, display: 'block', marginTop: '0.2rem' }}>
                      Certified Gold Seal of Approval for patient safety, clinical quality, and infection control protocols.
                    </span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, background: '#fdf2f8', color: '#db2777', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>NABH & NABL Accredited Diagnostics</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, display: 'block', marginTop: '0.2rem' }}>
                      Automated laboratory precision, dual-verification pathology, and ISO 15189 laboratory compliance.
                    </span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, background: '#f0fdf4', color: '#16a34a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Building2 size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>ISO 9001:2015 Healthcare Enterprise</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, display: 'block', marginTop: '0.2rem' }}>
                      Continuous quality management, emergency preparedness, and high-reliability operational excellence.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Strip */}
      <section className="apollo-section bg-alt">
        <div className="inner-wrap">
          <div className="section-head">
            <div className="section-tag">Ethical Philosophy</div>
            <h2 className="section-heading">Our Core Healthcare Values</h2>
            <p className="section-desc">
              Every clinical decision, diagnostic test, and surgical procedure is guided by our four founding pillars of excellence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {clinicalValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} style={{ background: '#ffffff', padding: '2rem 1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', transition: 'transform 0.2s ease', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: `${val.color}15`, color: val.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{val.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hospital Campuses & Facilities */}
      <section className="apollo-section">
        <div className="inner-wrap">
          <div className="section-head">
            <div className="section-tag">Network Facilities</div>
            <h2 className="section-heading">Our Hospitals & Clinical Campuses</h2>
            <p className="section-desc">
              State-of-the-art facilities equipped with modern operating theaters, intensive care units, and outpatient clinics across South Asia.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {hospitalCampuses.map((camp, idx) => (
              <div key={idx} style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-apollo-orange)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                  {camp.type}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                  {camp.name}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <MapPin size={14} color="var(--color-apollo-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{camp.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <PhoneCall size={14} color="var(--color-primary-600)" />
                    <span>{camp.phone} • {camp.beds}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} color="#dc2626" />
                    <span style={{ fontWeight: 600, color: '#dc2626' }}>{camp.emergency}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Specialty Centers:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {camp.specialties.map((sp, sIdx) => (
                      <span key={sIdx} style={{ fontSize: '0.7rem', fontWeight: 600, background: '#f1f5f9', color: '#475569', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
      <FloatingDock />
    </div>
  );
}
