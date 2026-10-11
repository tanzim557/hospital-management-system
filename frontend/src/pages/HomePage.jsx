import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import FloatingDock from '../components/public/FloatingDock';
import QuickBookModal from '../components/public/QuickBookModal';
import {
  Sparkles,
  Stethoscope,
  Video,
  Microscope,
  HeartPulse,
  MapPin,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  Star,
  Activity,
  Brain,
  ShieldCheck,
  Plane,
  Building2,
  CalendarDays,
  Pill,
  PhoneCall,
  Clock,
  CheckCircle2,
  Zap
} from 'lucide-react';
import '../assets/styles/landing.css';
import doctorHeroImg from '../assets/apollo-doctor-hero.jpg';
import doctorNeuroImg from '../assets/apollo-doctor-neuro.jpg';
import doctorOncoImg from '../assets/apollo-doctor-onco.jpg';

const featuredDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Ahmed & Senior Faculty',
    role: 'Chief of Cardiology & Clinical Team',
    campus: 'Dhaka Main Hospital',
    rating: '4.95',
    reviews: '25,000+ Reviews',
    experience: '18+ Yrs Exp',
    image: doctorHeroImg,
    specialty: 'Cardiology & Heart Care'
  },
  {
    id: 2,
    name: 'Prof. Dr. Arthur Vance, MD',
    role: 'Director of Neurosurgery & Brain Institute',
    campus: 'Apollo Gulshan Super Specialty',
    rating: '5.0',
    reviews: '19,400+ Reviews',
    experience: '24+ Yrs Exp',
    image: doctorNeuroImg,
    specialty: 'Neurosurgery & Spine'
  },
  {
    id: 3,
    name: 'Dr. Rajesh Patel, FACS',
    role: 'Director of Robotic Surgical Oncology',
    campus: 'Apollo Cancer Research Institute',
    rating: '4.95',
    reviews: '21,800+ Reviews',
    experience: '20+ Yrs Exp',
    image: doctorOncoImg,
    specialty: 'Robotic Surgery & Oncology'
  }
];

export default function HomePage() {
  const navigate = useNavigate();

  // Active featured doctor in hero showcase
  const [activeDoctorIndex, setActiveDoctorIndex] = useState(0);
  const activeDoctor = featuredDoctors[activeDoctorIndex];
  const [isPaused, setIsPaused] = useState(false);

  // Quick booking search card widget state
  const [activeTab, setActiveTab] = useState('visit'); // 'visit' | 'online' | 'checkup'
  const [selectedSpecialty, setSelectedSpecialty] = useState('Cardiology');
  const [selectedLocation, setSelectedLocation] = useState('Dhaka Main Hospital');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [selectedOnlineSpecialty, setSelectedOnlineSpecialty] = useState('General Medicine & Acute Fever');

  // Modal state for direct 1-click booking
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [modalDoctor, setModalDoctor] = useState(null);

  // Auto-play carousel for hero doctor showcase
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveDoctorIndex((prev) => (prev + 1) % featuredDoctors.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNextDoctor = () => {
    setActiveDoctorIndex((prev) => (prev + 1) % featuredDoctors.length);
  };

  const handlePrevDoctor = () => {
    setActiveDoctorIndex((prev) => (prev - 1 + featuredDoctors.length) % featuredDoctors.length);
  };

  const handleOpenDirectBooking = (doc = null) => {
    setModalDoctor(doc);
    setIsBookModalOpen(true);
  };

  const handleWidgetSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'visit') {
      if (searchDoctor.trim()) {
        const queryParams = new URLSearchParams();
        queryParams.set('search', searchDoctor.trim());
        if (selectedSpecialty) queryParams.set('disease', selectedSpecialty);
        navigate(`/find-doctors?${queryParams.toString()}`);
      } else {
        // Open the instant frictionless appointment modal directly
        handleOpenDirectBooking(activeDoctor);
      }
    } else if (activeTab === 'online') {
      handleOpenDirectBooking(activeDoctor);
    } else if (activeTab === 'checkup') {
      navigate('/prohealth');
    }
  };

  return (
    <div className="landing-page-root">
      {/* ─── 1. Corporate Header with Topbar & Full Navigation ──── */}
      <PublicHeader />

      {/* ─── 2. Apollo Hero with Doctor Showcase & Integrated Search ────── */}
      <section className="apollo-hero">
        {/* Animated Background Motion Orbs & Ambient Depth */}
        <div className="hero-decor-orb hero-orb-1" />
        <div className="hero-decor-orb hero-orb-2" />
        <div className="hero-decor-orb hero-orb-3" />
        
        {/* Subtle Clinical Heartbeat Wave SVG Watermark */}
        <svg className="hero-ecg-watermark" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60 H400 L420 20 L440 100 L460 30 L480 80 L500 60 H1200" stroke="rgba(2, 132, 199, 0.06)" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div className="apollo-hero-container">
          {/* Left Column: Headline, Trust & Search Widget */}
          <div className="apollo-hero-left">
            {/* Top Glowing Heritage Badge */}
            <div className="apollo-hero-tag animate-slide-down">
              <span className="hero-tag-glow-dot" />
              <Sparkles size={14} className="tag-sparkle-icon" />
              <span>Asia's Foremost Healthcare Network • 40+ Years of Clinical Excellence</span>
            </div>

            {/* Main Typographic Headline */}
            <h1 className="apollo-hero-title animate-fade-in-up">
              Touching Lives, <br />
              <span className="hero-gradient-text">Pioneering Advanced Healthcare</span>
            </h1>

            <p className="apollo-hero-desc">
              Asia’s most trusted multi-specialty healthcare institution. Bringing together
              internationally renowned physicians, robotic precision surgery, and compassionate
              healing across 25+ specialized centers of clinical excellence.
            </p>

            {/* ─── Interactive Glassmorphic Booking Desk Card ─── */}
            <div className="apollo-quick-search-card">
              <div className="search-card-tabs">
                <button
                  type="button"
                  className={`search-tab-pill ${activeTab === 'visit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('visit')}
                >
                  <Stethoscope size={15} />
                  <span>Hospital Visit</span>
                  <span className="tab-live-dot" />
                </button>
                <button
                  type="button"
                  className={`search-tab-pill ${activeTab === 'online' ? 'active' : ''}`}
                  onClick={() => setActiveTab('online')}
                >
                  <Video size={15} />
                  <span>Video Consult</span>
                </button>
                <button
                  type="button"
                  className={`search-tab-pill ${activeTab === 'checkup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('checkup')}
                >
                  <Microscope size={15} />
                  <span>Health Checkup</span>
                </button>
              </div>

              <form onSubmit={handleWidgetSubmit} className="search-bar-form">
                {activeTab === 'visit' && (
                  <div className="search-visit-layout">
                    {/* Top Row: Specialty & Campus Selection */}
                    <div className="search-fields-row">
                      <div className="search-bar-field">
                        <label>Medical Specialty</label>
                        <div className="search-bar-input-wrap">
                          <HeartPulse size={16} className="search-bar-icon" />
                          <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                          >
                            <option value="Cardiology">Cardiology & Heart Care</option>
                            <option value="Neurology">Neurology & Spine Surgery</option>
                            <option value="Orthopedics">Robotic Orthopedics & Joint Care</option>
                            <option value="Pediatrics">Pediatrics & Neonatal Care</option>
                            <option value="Oncology">Cancer & Surgical Oncology</option>
                            <option value="Gastroenterology">Gastroenterology & Liver</option>
                            <option value="Dermatology">Dermatology & Skin Care</option>
                            <option value="Nephrology">Nephrology & Kidney Care</option>
                          </select>
                        </div>
                      </div>

                      <div className="search-bar-field">
                        <label>Hospital Campus</label>
                        <div className="search-bar-input-wrap">
                          <MapPin size={16} className="search-bar-icon" />
                          <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                          >
                            <option value="Dhaka Main Hospital">Dhaka Main Tertiary Hospital</option>
                            <option value="Gulshan Super Specialty">Apollo Gulshan Specialty Center</option>
                            <option value="Chittagong Care Center">Chittagong Regional Hospital</option>
                            <option value="Apollo Chennai Network">Apollo Chennai Global Hub</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Doctor/Symptom Search & Action Button */}
                    <div className="search-action-row">
                      <div className="search-bar-field search-bar-doctor">
                        <label>Doctor Name or Medical Symptom</label>
                        <div className="search-bar-input-wrap">
                          <Search size={16} className="search-bar-icon" />
                          <input
                            type="text"
                            placeholder="Search by doctor name (e.g. Dr. Sarah), disease, or symptom..."
                            value={searchDoctor}
                            onChange={(e) => setSearchDoctor(e.target.value)}
                          />
                        </div>
                      </div>

                      <button type="submit" className="search-bar-submit-btn">
                        <span>Book Appointment</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>

                    {/* Quick Specialty Chips Row */}
                    <div className="search-quick-tags-row">
                      <span className="tags-label">Quick Search:</span>
                      {[
                        { name: 'Cardiology', label: 'Cardiology' },
                        { name: 'Neurology', label: 'Neurology' },
                        { name: 'Orthopedics', label: 'Robotic Ortho' },
                        { name: 'Oncology', label: 'Cancer Care' },
                        { name: 'Pediatrics', label: 'Pediatrics' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`quick-tag-chip ${selectedSpecialty === item.name ? 'active' : ''}`}
                          onClick={() => setSelectedSpecialty(item.name)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'online' && (
                  <div className="search-tab-content animate-fade-in">
                    <div className="search-tab-banner video-banner">
                      <Video size={15} />
                      <span>Instant 15-Min Teleconsultation • 54 Specialists Online Now</span>
                    </div>

                    <div className="search-fields-row">
                      <div className="search-bar-field">
                        <label>Consultation Specialty</label>
                        <div className="search-bar-input-wrap">
                          <Stethoscope size={16} className="search-bar-icon" />
                          <select
                            value={selectedOnlineSpecialty}
                            onChange={(e) => setSelectedOnlineSpecialty(e.target.value)}
                          >
                            <option value="General Medicine & Acute Fever">General Medicine & Acute Fever</option>
                            <option value="Cardiology Second Opinion">Cardiology & Heart Second Opinion</option>
                            <option value="Pediatric Health Consultation">Pediatrics & Child Wellness</option>
                            <option value="Dermatology & Clinical Skin Care">Dermatology & Clinical Skin Care</option>
                            <option value="Gynecology & Women Health">Gynecology & Women's Health</option>
                            <option value="Neurology & Headache Specialist">Neurology & Headache Specialist</option>
                          </select>
                        </div>
                      </div>

                      <div className="search-bar-field">
                        <label>Preferred Language</label>
                        <div className="search-bar-input-wrap">
                          <Activity size={16} className="search-bar-icon" />
                          <select defaultValue="English">
                            <option value="English">English / Bengali</option>
                            <option value="Hindi">English / Hindi</option>
                            <option value="Arabic">Arabic (Interpreter)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="search-action-row single-action">
                      <button 
                        type="button" 
                        onClick={() => handleOpenDirectBooking(activeDoctor)} 
                        className="search-bar-submit-btn video-submit-btn" 
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <Video size={16} />
                        <span>Start Instant Video Consultation ($25)</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'checkup' && (
                  <div className="search-tab-content animate-fade-in">
                    <div className="search-tab-banner checkup-banner">
                      <Microscope size={15} />
                      <span>Apollo ProHealth™ Packages • Same Day Reports • Save 25% Online</span>
                    </div>

                    <div className="search-action-row">
                      <div className="search-bar-field" style={{ flex: 1 }}>
                        <label>Select Preventive Health Package</label>
                        <div className="search-bar-input-wrap">
                          <ShieldCheck size={16} className="search-bar-icon" />
                          <select defaultValue="master">
                            <option value="master">ProHealth Master Checkup (68+ Tests) - $180</option>
                            <option value="cardiac">ProHealth Cardiac Care (48+ Tests) - $120</option>
                            <option value="senior">ProHealth Senior Citizen (76+ Tests) - $220</option>
                            <option value="women">ProHealth Women's Wellness (54+ Tests) - $140</option>
                            <option value="diabetes">Diabetes & Metabolic Shield (42+ Tests) - $110</option>
                            <option value="executive">Executive Platinum VIP (85+ Tests) - $290</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate('/prohealth')}
                        className="search-bar-submit-btn"
                      >
                        <span>Explore Packages</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* ─── Elevated Glassmorphic Trust & Impact Ribbon ─── */}
            <div className="apollo-hero-stats">
              <div className="hero-stat-item">
                <div className="stat-number-box">
                  <strong>73+</strong>
                </div>
                <span>Hospitals</span>
              </div>
              <div className="stat-separator" />
              <div className="hero-stat-item">
                <div className="stat-number-box">
                  <strong>12,000+</strong>
                </div>
                <span>Specialists</span>
              </div>
              <div className="stat-separator" />
              <div className="hero-stat-item">
                <div className="stat-number-box">
                  <strong>200M+</strong>
                </div>
                <span>Lives Touched</span>
              </div>
              <div className="stat-separator" />
              <div className="hero-stat-item">
                <div className="stat-number-box">
                  <strong>99.4%</strong>
                </div>
                <span>Clinical Success</span>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Luxury Doctor Hero Showcase ─── */}
          <div className="apollo-hero-right">
            <div
              className="doctor-hero-frame"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="doctor-aura-glow" />

              <img
                key={activeDoctor.id}
                src={activeDoctor.image}
                alt={activeDoctor.name}
                className="doctor-hero-image animate-fade-in"
              />
              <div className="doctor-hero-glow" />

              {/* Prev / Next Navigation Arrows */}
              <button
                type="button"
                className="doc-frame-nav-btn prev"
                onClick={handlePrevDoctor}
                title="Previous Specialist"
                aria-label="Previous Specialist"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="doc-frame-nav-btn next"
                onClick={handleNextDoctor}
                title="Next Specialist"
                aria-label="Next Specialist"
              >
                <ChevronRight size={20} />
              </button>

              {/* Floating Badge Top-Left: Precision */}
              <div className="floating-badge-top-left">
                <Award size={14} color="#f37021" />
                <span>99.4% Precision Rate</span>
              </div>

              {/* Floating Badge Top-Right: Live Status */}
              <div className="floating-badge-top">
                <span className="live-status-dot" />
                <span>24/7 Verified Specialists</span>
              </div>

              {/* Floating Doctor Bio & Action Card */}
              <div className="floating-doctor-card">
                <div className="floating-card-rating">
                  <div className="stars-group">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <strong>{activeDoctor.rating} / 5.0</strong>
                  <span className="rating-count">({activeDoctor.reviews})</span>
                  <span className="doctor-exp-pill">{activeDoctor.experience}</span>
                </div>

                <h4 className="floating-doctor-name">{activeDoctor.name}</h4>
                <p className="floating-doctor-role">{activeDoctor.role} • {activeDoctor.campus}</p>

                <div className="floating-doctor-footer">
                  <div className="doctor-carousel-dots" title="Click to view specialist">
                    {featuredDoctors.map((doc, idx) => (
                      <button
                        key={doc.id}
                        type="button"
                        className={`doc-dot ${idx === activeDoctorIndex ? 'active' : ''}`}
                        onClick={() => setActiveDoctorIndex(idx)}
                        title={`View ${doc.name}`}
                        aria-label={`View ${doc.name}`}
                      />
                    ))}
                    <span className="doc-dot-label">
                      {activeDoctor.specialty}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDirectBooking(activeDoctor)}
                    className="floating-card-link-btn"
                  >
                    <span>Consult with Team</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Quick Gateway Portal Ribbon to All 6 Dedicated Pages ───── */}
      <div className="apollo-care-bar">
        <div className="care-bar-container">
          <div className="care-grid">
            <Link to="/specialties" className="care-card">
              <div className="care-icon-box care-icon-blue">
                <HeartPulse size={24} />
              </div>
              <div className="care-info">
                <h4>Medical Specialties</h4>
                <p>25+ Specialized Clinical Departments & Robotic Suites.</p>
                <span className="care-link-text">Explore Specialties <ChevronRight size={13} /></span>
              </div>
            </Link>

            <Link to="/find-doctors" className="care-card">
              <div className="care-icon-box care-icon-orange">
                <Stethoscope size={24} />
              </div>
              <div className="care-info">
                <h4>Find 50+ Doctors</h4>
                <p>Search board-certified faculty by disease or symptom.</p>
                <span className="care-link-text">Search Faculty <ChevronRight size={13} /></span>
              </div>
            </Link>

            <Link to="/prohealth" className="care-card">
              <div className="care-icon-box care-icon-green">
                <Microscope size={24} />
              </div>
              <div className="care-info">
                <h4>ProHealth Checkups</h4>
                <p>Predictive whole-body screening. Save 25% online.</p>
                <span className="care-link-text">View Packages <ChevronRight size={13} /></span>
              </div>
            </Link>

            <Link to="/centres-of-excellence" className="care-card">
              <div className="care-icon-box care-icon-purple">
                <Award size={24} />
              </div>
              <div className="care-info">
                <h4>Centres of Excellence</h4>
                <p>South Asia's premier Proton Beam & Robotic institutes.</p>
                <span className="care-link-text">Explore Institutes <ChevronRight size={13} /></span>
              </div>
            </Link>

            <Link to="/international-care" className="care-card">
              <div className="care-icon-box care-icon-teal">
                <Plane size={24} />
              </div>
              <div className="care-info">
                <h4>International Care</h4>
                <p>Medical visa, airport pickup & personal concierge.</p>
                <span className="care-link-text">Global Concierge <ChevronRight size={13} /></span>
              </div>
            </Link>

            <a href="tel:1066" className="care-card emergency-care-card">
              <div className="care-icon-box care-icon-red">
                <PhoneCall size={24} />
              </div>
              <div className="care-info">
                <h4>Emergency 1066</h4>
                <p>Rapid mobile ICU ambulance dispatch in &lt; 7 mins.</p>
                <span className="care-link-text" style={{ color: '#dc2626' }}>Call 1066 Now <ChevronRight size={13} /></span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ─── 4. Public Corporate Footer ───────────────────────── */}
      <PublicFooter />

      {/* ─── 5. Floating Interactive Action Dock (Theme + Emergency + Top) ── */}
      <FloatingDock />

      {/* ─── 6. Instant Quick Booking Modal ─── */}
      <QuickBookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        initialDoctor={modalDoctor}
        onTrackClick={() => {
          setIsBookModalOpen(false);
          navigate('/track-status');
        }}
      />
    </div>
  );
}
