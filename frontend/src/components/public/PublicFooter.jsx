import { Link } from 'react-router-dom';
import {
  Building2,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  HeartPulse,
  Activity,
  Calendar,
  Globe
} from 'lucide-react';

export default function PublicFooter() {
  return (
    <>
      {/* ─── Apollo 1066 Emergency Trauma Strip ───────────── */}
      <div style={{ padding: '0 var(--space-8)', maxWidth: '1320px', margin: '0 auto' }}>
        <div className="emergency-hotline-strip">
          <div className="hotline-info">
            <h3>Facing a Medical Emergency? Dial 1066</h3>
            <p>National emergency trauma response network with rapid mobile ICU ambulances on standby 24/7/365.</p>
          </div>
          <a href="tel:1066" className="hotline-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <PhoneCall size={22} />
            <span>Call Hotline: 1066 / +880-1700-000000</span>
          </a>
        </div>
      </div>

      {/* ─── Mega Corporate Apollo Footer ─────────────────── */}
      <footer id="about-footer" className="apollo-footer">
        <div className="footer-top-grid">
          {/* Column 1: Brand & Accreditation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: 38, height: 38, background: 'var(--color-apollo-orange)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Activity size={22} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>MediCore Hospitals</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#8faec0', marginBottom: 'var(--space-4)' }}>
              Inspired by the highest global benchmarks of Apollo Hospitals Enterprise standards.
              Dedicated to clinical precision, robotic surgical advancement, and compassionate healing.
            </p>
            <div style={{ fontSize: '0.8125rem', color: '#638596', lineHeight: 1.6 }}>
              <strong style={{ color: '#93c5fd', display: 'block', marginBottom: '0.25rem' }}>Recognitions & Accreditations:</strong>
              JCI (Joint Commission International USA) • NABH • NABL Certified Diagnostic Labs • ISO 9001:2015
            </div>
          </div>

          {/* Column 2: Clinical Specialties */}
          <div>
            <h4>Clinical Specialties</h4>
            <ul>
              <li><Link to="/specialties?cat=cardiac">Cardiology & Heart Institute</Link></li>
              <li><Link to="/specialties?cat=cancer">Cancer & Oncology Center</Link></li>
              <li><Link to="/specialties?cat=neuro">Institute of Neurosciences</Link></li>
              <li><Link to="/specialties?cat=ortho">Robotic Joint Orthopedics</Link></li>
              <li><Link to="/specialties?cat=pediatric">Pediatrics & Neonatal ICU</Link></li>
              <li><Link to="/specialties?cat=gastro">Gastroenterology & Liver</Link></li>
              <li><Link to="/specialties">View All Specialties →</Link></li>
            </ul>
          </div>

          {/* Column 3: Patient Services */}
          <div>
            <h4>Patient Services</h4>
            <ul>
              <li><Link to="/doctors">Find a Doctor</Link></li>
              <li><Link to="/prohealth">Book ProHealth Checkup</Link></li>
              <li><Link to="/centres-of-excellence">Centres of Excellence</Link></li>
              <li><Link to="/international-care">International Patient Desk</Link></li>
              <li><Link to="/about">About Hospital & Heritage</Link></li>
              <li><Link to="/login">Patient Portal Login</Link></li>
              <li><Link to="/register">Register New Patient</Link></li>
            </ul>
          </div>

          {/* Column 4: Hospital Contacts */}
          <div>
            <h4>Hospital Contacts</h4>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={14} color="var(--color-apollo-orange)" />
                <span><strong style={{ color: '#ffffff' }}>Emergency 24x7:</strong> 1066</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="#ffffff" />
                <span><strong style={{ color: '#ffffff' }}>Appointments:</strong> +880-1700-000000</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} color="#ffffff" />
                <span>info@medicore-hospitals.com</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} color="#ffffff" />
                <span>House 42, Road 11, Dhanmondi, Dhaka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© 2026 MediCore Hospitals & Health Network. All rights reserved.</span>
          <span>Modeled with clinical excellence after Apollo Hospitals Enterprise Standards</span>
        </div>
      </footer>
    </>
  );
}
