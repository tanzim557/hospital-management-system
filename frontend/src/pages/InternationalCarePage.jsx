import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import FloatingDock from '../components/public/FloatingDock';
import {
  Plane,
  Globe,
  CheckCircle2,
  FileText,
  Video,
  Clock,
  Building2,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Send,
  MapPin
} from 'lucide-react';
import '../assets/styles/landing.css';

const internationalSteps = [
  {
    step: '01',
    title: 'Free Pre-Travel Video Consult & Estimate',
    desc: 'Upload your medical reports for review by our Senior Clinical Board. Receive a formal second opinion and detailed cost estimate within 24 hours.',
    icon: Video
  },
  {
    step: '02',
    title: 'Medical Visa Invitation Letter within 24 Hours',
    desc: 'Our International Desk issues certified Visa Invitation Letters for patient and attendant(s) to expedite Embassy medical visa processing.',
    icon: FileText
  },
  {
    step: '03',
    title: 'Airport Transfer & Dedicated Interpreter',
    desc: 'Complimentary chauffeured airport pickup directly to the hospital or partner guest house. Multi-lingual interpreters assigned for seamless communication.',
    icon: Plane
  },
  {
    step: '04',
    title: 'Priority Admission & VIP Private Suites',
    desc: 'Skip all OPD waiting queues with direct priority access to specialist clinics, private executive rooms, and dedicated Patient Relationship Managers.',
    icon: Building2
  },
  {
    step: '05',
    title: 'Post-Discharge Telemedicine & Continuity',
    desc: 'Return home with complete digital medical records, translated discharge summaries, and ongoing remote video follow-ups with your operating surgeon.',
    icon: CheckCircle2
  }
];

const transferHubs = [
  {
    name: 'Apollo Hospitals Chennai, India',
    location: 'Greams Road, Chennai',
    tag: 'Flagship Super Specialty Hub',
    desc: 'South Asia’s premier medical destination. Global center of excellence for Proton Beam Cancer Therapy, Robotic Cardiac Surgery, and Living-Donor Organ Transplants.',
    specialties: ['Proton Beam Therapy', 'Heart & Lung Transplants', 'Minimally Invasive Cardiac', 'Bone Marrow Transplant']
  },
  {
    name: 'Apollo Hospitals Hyderabad, India',
    location: 'Jubilee Hills, Hyderabad',
    tag: 'Robotics & Neurosciences Center',
    desc: 'Renowned for cutting-edge MAKO robotic joint replacements, comprehensive epilepsy surgery, and complex pediatric neurovascular interventions.',
    specialties: ['MAKO Robotic Joint Arthroplasty', 'Comprehensive Epilepsy Center', 'Stereotactic Neurosurgery', 'Cornea & Retina Center']
  },
  {
    name: 'MediCore Hospital Dhaka, Bangladesh',
    location: 'Dhanmondi, Dhaka',
    tag: 'Tertiary Care & Referral Hub',
    desc: 'Full-service tertiary care hospital with 24/7 Level-1 Trauma response, automated diagnostic laboratories, adult & pediatric ICUs, and OPD super-specialty clinics.',
    specialties: ['24/7 Emergency & ICU', 'Comprehensive Cardiology', 'Minimally Invasive Laparoscopy', 'Neonatal Level-III NICU']
  }
];

export default function InternationalCarePage() {
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    specialty: 'Cardiology',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="landing-page-root">
      <PublicHeader />

      {/* Page Hero Header */}
      <section className="page-hero-banner">
        <div className="page-hero-inner">
          <div className="section-tag" style={{ background: '#eff6ff', color: 'var(--color-primary-500)', borderColor: '#bfdbfe' }}>
            <Plane size={14} />
            <span>Global Medical Tourism • Dedicated Patient Concierge</span>
          </div>
          <h1 className="page-hero-title">International Patient Care Concierge</h1>
          <p className="page-hero-desc">
            Thousands of international patients from over 45 countries choose MediCore and Apollo Hospitals each year
            for complex surgeries, organ transplants, and advanced cancer treatment. We ensure your medical journey is seamless from arrival to recovery.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <a href="#inquiry-section" className="btn btn-orange btn-lg">
              <span>Request Free Medical Estimate</span>
              <ArrowRight size={16} />
            </a>
            <a href="tel:+8801700000000" className="btn btn-outline btn-lg" style={{ color: '#0a2540', borderColor: '#cbd5e1' }}>
              <Phone size={16} />
              <span>International Desk: +880-1700-000000</span>
            </a>
          </div>
        </div>
      </section>

      {/* Step-by-Step International Patient Journey */}
      <section className="apollo-section">
        <div className="inner-wrap">
          <div className="section-head">
            <div className="section-tag">Smooth Travel Experience</div>
            <h2 className="section-heading">Your 5-Step International Journey</h2>
            <p className="section-desc">
              From the moment you contact our team to post-treatment recovery back home, our International Concierge coordinates every detail.
            </p>
          </div>

          <div className="international-steps-grid">
            {internationalSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="international-step-card animate-fade-in">
                  <div className="step-num-pill">{s.step}</div>
                  <div className="step-icon-wrap">
                    <Icon size={24} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Transfer Hubs */}
      <section className="apollo-section bg-alt">
        <div className="inner-wrap">
          <div className="section-head">
            <div className="section-tag">Direct Referral Network</div>
            <h2 className="section-heading">Apollo Global Medical Hubs</h2>
            <p className="section-desc">
              Direct seamless transfers between MediCore Dhaka, Apollo Chennai, and Apollo Hyderabad for specialized proton beam therapy and complex transplants.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {transferHubs.map((hub, idx) => (
              <div key={idx} className="transfer-hub-card animate-fade-in">
                <span className="hub-tag">{hub.tag}</span>
                <h3 className="hub-title">{hub.name}</h3>
                <div className="hub-loc">
                  <MapPin size={14} color="var(--color-apollo-orange)" />
                  <span>{hub.location}</span>
                </div>
                <p className="hub-desc">{hub.desc}</p>
                <div className="hub-specialties-wrap">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Key Specialities:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {hub.specialties.map((sp, sIdx) => (
                      <span key={sIdx} className="hub-spec-pill">{sp}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form & Assistance Strip */}
      <section id="inquiry-section" className="apollo-section">
        <div className="inner-wrap">
          <div className="international-inquiry-box">
            <div>
              <div className="section-tag" style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}>
                <Users size={14} />
                <span>Dedicated Relationship Manager</span>
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-primary-500)', marginBottom: '0.75rem' }}>
                Request a Free Treatment Plan & Cost Quote
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Fill out the form with your medical details. A senior medical consultant and international coordinator will contact you via WhatsApp or Email within 24 hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#15803d" />
                  <span>No obligation, 100% confidential second opinion</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#15803d" />
                  <span>Guaranteed Visa Invitation Letter within 24 hours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#15803d" />
                  <span>All major international currencies and medical insurances accepted</span>
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, background: 'var(--color-apollo-orange)', color: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={18} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Emergency International Helpline:</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-primary-600)', fontWeight: 700 }}>+880-1700-000000 / intl@medicore.com</span>
                </div>
              </div>
            </div>

            {/* The Form */}
            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ width: 56, height: 56, background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Inquiry Received!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Thank you, {inquiryForm.name}. Our International Patient Concierge will review your request and get in touch with a preliminary treatment plan and cost estimate within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setInquiryForm({ name: '', email: '', phone: '', country: '', specialty: 'Cardiology', message: '' });
                    }}
                    className="btn btn-outline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>International Inquiry Form</h3>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', background: '#ffffff', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', background: '#ffffff', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1-555-0192"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', background: '#ffffff', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Country of Residence *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. United Kingdom, UAE"
                        value={inquiryForm.country}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, country: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', background: '#ffffff', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Medical Specialty *</label>
                      <select
                        value={inquiryForm.specialty}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, specialty: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', background: '#ffffff', fontSize: '0.875rem' }}
                      >
                        <option value="Cardiology">Cardiology & Heart</option>
                        <option value="Oncology">Oncology & Proton Beam</option>
                        <option value="Neurosurgery">Neurosciences & Spine</option>
                        <option value="Orthopedics">Robotic Orthopedics</option>
                        <option value="Transplant">Organ Transplants</option>
                        <option value="Gastroenterology">Gastroenterology</option>
                        <option value="Other">Other Medical Need</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Brief Medical History & Questions</label>
                    <textarea
                      rows={3}
                      placeholder="Describe current symptoms, diagnosis, or required surgery..."
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', background: '#ffffff', fontSize: '0.875rem', resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-orange btn-full" style={{ justifyContent: 'center' }}>
                    <Send size={15} />
                    <span>Submit Medical Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
      <FloatingDock />
    </div>
  );
}
