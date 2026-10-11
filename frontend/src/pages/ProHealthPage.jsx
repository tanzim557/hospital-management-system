import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import FloatingDock from '../components/public/FloatingDock';
import {
  Sparkles,
  Clock,
  Zap,
  Droplets,
  CheckCircle2,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Search,
  Check,
  ShieldCheck,
  HeartPulse,
  Award,
  CalendarDays,
  ArrowRight
} from 'lucide-react';
import '../assets/styles/landing.css';

const proHealthPackagesData = [
  {
    id: 'cardiac',
    category: 'cardiac',
    title: 'ProHealth Cardiac Care',
    badge: 'Specialized Heart Protection',
    popular: false,
    testCountText: '48+ Lab Tests Included',
    totalTestsNumber: 48,
    priceIndividual: '$120.00',
    priceFamily: '$190.00 (Couple Plan)',
    description: 'Specialized cardiovascular screening for early detection of plaque buildup, silent ischemia, lipid imbalances, and arrhythmia.',
    fasting: '10-12 Hours Overnight Fasting Required',
    reportTime: 'Reports in 6-8 Hours (Same Day Delivery)',
    sampleType: 'Blood, Urine, 12-Lead ECG & 2D Echo',
    keyHighlights: [
      'Resting 12-Lead Electrocardiogram (ECG)',
      '2D Echocardiogram with Color Doppler',
      'Comprehensive Lipid & Cholesterol Profile (8 Tests)',
      'High-Sensitivity C-Reactive Protein (hs-CRP)',
      'Senior Interventional Cardiologist Consultation',
      'Post-Check Cardiac Framingham Risk Score'
    ],
    testGroups: [
      {
        name: 'Cardiology & Heart Diagnostics (6 Tests)',
        tests: [
          'Resting 12-Lead Electrocardiogram (ECG)',
          '2D Echocardiography with Color Doppler Imaging',
          'Computerized Treadmill Stress Test (TMT / Stress ECG)',
          'High-Sensitivity C-Reactive Protein (hs-CRP Cardiac Marker)',
          'Serum Homocysteine (Vascular Inflammation Risk)',
          'Cardiovascular Framingham 10-Year Risk Score'
        ]
      },
      {
        name: 'Complete Lipid & Cholesterol Panel (8 Tests)',
        tests: [
          'Total Serum Cholesterol',
          'High-Density Lipoprotein (HDL - Good Cholesterol)',
          'Low-Density Lipoprotein (LDL - Bad Cholesterol)',
          'Very Low-Density Lipoprotein (VLDL Cholesterol)',
          'Serum Triglycerides (Fasting)',
          'Total Cholesterol / HDL Risk Ratio',
          'LDL / HDL Risk Ratio',
          'Non-HDL Cholesterol Level'
        ]
      },
      {
        name: 'Complete Blood Count & Hemogram (14 Tests)',
        tests: [
          'Hemoglobin (Hb) & Packed Cell Volume (PCV)',
          'Total RBC Count & Red Cell Indices (MCV, MCH, MCHC, RDW)',
          'Total Leukocyte Count (TLC / Total WBC)',
          'Differential WBC Count (Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils)',
          'Absolute Platelet Count',
          'Erythrocyte Sedimentation Rate (ESR Automated)',
          'Peripheral Blood Smear Examination'
        ]
      },
      {
        name: 'Diabetic & Metabolic Markers (4 Tests)',
        tests: [
          'Fasting Blood Glucose (FBS)',
          'HbA1c (Glycated Hemoglobin 3-Month Glucose Control)',
          'Estimated Average Glucose (eAG)',
          'Serum Uric Acid'
        ]
      },
      {
        name: 'Kidney, Liver & Vital Organs (7 Tests)',
        tests: [
          'Serum Creatinine with eGFR Calculation',
          'Blood Urea Nitrogen (BUN)',
          'Serum Electrolytes (Sodium, Potassium, Chloride)',
          'Serum Bilirubin (Total & Direct)',
          'SGPT / ALT & SGOT / AST Liver Enzymes',
          'Serum Alkaline Phosphatase (ALP)',
          'Complete Urine Routine & Microscopic Examination (R/M/E)'
        ]
      },
      {
        name: 'Imaging & Specialist Consultations (5 Reviews)',
        tests: [
          'Digital Chest Radiograph (PA View with Radiologist Report)',
          'Consultation with Senior Consultant Cardiologist',
          'Consultation with Internal Medicine Specialist',
          'Personalized Diet & Heart-Smart Lifestyle Prescription',
          'Comprehensive Blood Pressure & Vitals Mapping'
        ]
      }
    ]
  },
  {
    id: 'master',
    category: 'master',
    title: 'ProHealth Master Health Check',
    badge: 'Most Popular • 360° Full Body',
    popular: true,
    testCountText: '68+ Comprehensive Tests',
    totalTestsNumber: 68,
    priceIndividual: '$180.00',
    priceFamily: '$280.00 (Couple Package)',
    description: 'Apollo\'s flagship whole-body preventive health audit covering heart, lungs, liver, kidneys, pancreas, digestive organs, blood count, diabetes, and vital scans.',
    fasting: '10-12 Hours Overnight Fasting Required',
    reportTime: 'Reports in 6-8 Hours (Same Day Delivery)',
    sampleType: 'Blood, Urine, Ultrasound & Digital X-Ray',
    keyHighlights: [
      'Full Blood Hemogram (14 Parameters) & HbA1c',
      'Whole Abdominal Ultrasound (USG) & Digital Chest X-Ray',
      'Comprehensive Liver (LFT) & Kidney (KFT) Function Panels',
      'Complete Lipid Profile & Resting 12-Lead ECG',
      'Thyroid Profile (TSH) & Urine Microalbumin',
      'Internal Medicine Physician, Cardiologist & Dietitian Reviews'
    ],
    testGroups: [
      {
        name: 'Complete Blood & Hemogram Panel (14 Tests)',
        tests: [
          'Complete Blood Count (CBC Automated)',
          'Hemoglobin (Hb) & Hematocrit (PCV)',
          'Red Blood Cell Count (RBC)',
          'Mean Corpuscular Volume (MCV)',
          'Mean Corpuscular Hemoglobin (MCH)',
          'Mean Corpuscular Hemoglobin Concentration (MCHC)',
          'Red Cell Distribution Width (RDW-CV)',
          'Total Leukocyte Count (TLC)',
          'Differential Leukocyte Count (Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils)',
          'Platelet Count & Platelet Indices (MPV, PDW)',
          'Erythrocyte Sedimentation Rate (ESR)',
          'Peripheral Blood Film Examination'
        ]
      },
      {
        name: 'Diabetes & Glucose Metabolism (4 Tests)',
        tests: [
          'Fasting Blood Glucose (FBS)',
          'Post Prandial Blood Glucose (PPBS - 2h Post Meal)',
          'HbA1c (Glycated Hemoglobin 3-Month Average)',
          'Estimated Average Glucose (eAG)'
        ]
      },
      {
        name: 'Liver Function Panel (LFT) (9 Tests)',
        tests: [
          'Serum Bilirubin Total',
          'Serum Bilirubin Direct (Conjugated)',
          'Serum Bilirubin Indirect (Unconjugated)',
          'SGOT / AST (Aspartate Aminotransferase)',
          'SGPT / ALT (Alanine Aminotransferase)',
          'Alkaline Phosphatase (ALP)',
          'Total Serum Protein',
          'Serum Albumin & Serum Globulin',
          'Albumin / Globulin (A/G) Ratio',
          'Gamma-Glutamyl Transferase (GGT)'
        ]
      },
      {
        name: 'Kidney & Renal Panel (KFT) (7 Tests)',
        tests: [
          'Serum Creatinine',
          'Estimated Glomerular Filtration Rate (eGFR)',
          'Blood Urea Nitrogen (BUN)',
          'Serum Uric Acid',
          'Serum Electrolytes (Sodium, Potassium, Chloride)',
          'Spot Urine Albumin / Creatinine Ratio (Microalbuminuria)',
          'Complete Urine Routine & Microscopic Examination (R/M/E)'
        ]
      },
      {
        name: 'Cardiovascular & Lipid Profile (8 Tests)',
        tests: [
          'Total Serum Cholesterol',
          'HDL "Good" Cholesterol',
          'LDL "Bad" Cholesterol',
          'VLDL Cholesterol',
          'Serum Triglycerides',
          'Total Cholesterol / HDL Ratio',
          'LDL / HDL Risk Ratio',
          'Resting 12-Lead Electrocardiogram (ECG)'
        ]
      },
      {
        name: 'Thyroid & Endocrine Function (3 Tests)',
        tests: [
          'Ultra-sensitive Thyroid Stimulating Hormone (TSH)',
          'Free Triiodothyronine (Free T3)',
          'Free Thyroxine (Free T4)'
        ]
      },
      {
        name: 'Diagnostic Imaging & Radiology (4 Tests)',
        tests: [
          'Ultrasound Examination of Whole Abdomen & Pelvis (USG)',
          'Digital Chest Radiograph (PA View)',
          'Pulmonary Function Spirometry (PFT)',
          'Body Composition & BMI Analysis'
        ]
      },
      {
        name: 'Specialist Clinical Consultations (6 Reviews)',
        tests: [
          'Senior Consultant Physician Comprehensive Evaluation',
          'Consultant Cardiologist Review & ECG Interpretation',
          'Consultation with General Surgeon (Men) / Gynecologist (Women)',
          'Comprehensive Eye Vision & Optometry Examination',
          'Clinical Dietitian & Lifestyle Modification Plan',
          'Dental Examination & Oral Health Checkup'
        ]
      }
    ]
  },
  {
    id: 'senior',
    category: 'senior',
    title: 'ProHealth Senior Citizen Check',
    badge: 'Aged 55+ Geriatric Care',
    popular: false,
    testCountText: '76+ Advanced Tests',
    totalTestsNumber: 76,
    priceIndividual: '$220.00',
    priceFamily: '$340.00 (Both Parents)',
    description: 'Designed specifically for individuals aged 55+ with focus on bone mineral density, arthritis, cardiovascular risk, renal preservation, and early tumor markers.',
    fasting: '10-12 Hours Overnight Fasting Required',
    reportTime: 'Reports in 8 Hours (Same Day Delivery)',
    sampleType: 'Blood, Urine, DEXA Scan & USG',
    keyHighlights: [
      'DEXA Bone Mineral Density (BMD) Scan for Osteoporosis',
      'Vitamin D3 (25-OH) & Vitamin B12 Evaluation',
      'Cancer / Tumor Markers (PSA for Men / CA-125 for Women)',
      '2D Echocardiogram, Resting ECG & CIMT Carotid Doppler',
      'Full Renal, Liver, Electrolyte & Anemia Profiles',
      'Senior Geriatrician, Orthopedic & Mobility Specialist Reviews'
    ],
    testGroups: [
      {
        name: 'Bone, Joint & Mobility Screening (6 Tests)',
        tests: [
          'Dual-Energy X-Ray Absorptiometry (DEXA) Bone Mineral Density Scan',
          'Serum Calcium & Ionic Calcium',
          'Serum Inorganic Phosphorus',
          'Vitamin D3 (25-Hydroxy Cholecalciferol)',
          'Vitamin B12 (Cyanocobalamin)',
          'Rheumatoid Factor (RA Factor / Anti-CCP)'
        ]
      },
      {
        name: 'Cancer & Tumor Screening Markers (5 Tests)',
        tests: [
          'Prostate-Specific Antigen Total (PSA - for Men)',
          'CA-125 Ovarian Tumor Marker (for Women)',
          'Carcinoembryonic Antigen (CEA - Colon & GI Screening)',
          'Stool Occult Blood Screening (Immunochemical FIT)',
          'Serum Protein Electrophoresis'
        ]
      },
      {
        name: 'Cardiovascular & Vascular Age (8 Tests)',
        tests: [
          '12-Lead Electrocardiogram (ECG)',
          '2D Echocardiogram with Color Doppler Imaging',
          'Carotid Intima-Media Thickness (CIMT) Vascular Screening',
          'Comprehensive Lipid Profile (Total, HDL, LDL, VLDL, Triglycerides)',
          'High-Sensitivity C-Reactive Protein (hs-CRP)'
        ]
      },
      {
        name: 'Kidney, Liver & Metabolic Panels (22 Tests)',
        tests: [
          'Complete Liver Function Panel (LFT - 9 Parameters)',
          'Complete Renal Function Panel (KFT - 7 Parameters)',
          'Serum Electrolytes (Sodium, Potassium, Chloride, Bicarbonate)',
          'Fasting Blood Sugar & HbA1c Glycated Hemoglobin',
          'Serum Uric Acid (Gout & Joint Inflammation Risk)',
          'Complete Urine Routine & Microscopic Analysis (R/M/E)'
        ]
      },
      {
        name: 'Complete Hematology & Iron Stores (15 Tests)',
        tests: [
          'Complete Blood Count (CBC 14 Parameters)',
          'Serum Ferritin (Iron Storage Level)',
          'Serum Iron & Total Iron Binding Capacity (TIBC)',
          'Erythrocyte Sedimentation Rate (ESR)'
        ]
      },
      {
        name: 'Imaging, Hearing & Vision (6 Tests)',
        tests: [
          'Digital Chest Radiograph (PA View)',
          'Ultrasound Whole Abdomen & Pelvis with Prostatic Volume',
          'Audiometry Pure Tone Hearing Assessment',
          'Comprehensive Eye Vision, Glaucoma & Cataract Screening',
          'Cognitive & Memory Health Screening Questionnaire'
        ]
      },
      {
        name: 'Geriatric Specialist Consultations (5 Doctors)',
        tests: [
          'Consultation with Senior Consultant Geriatrician',
          'Consultation with Senior Cardiologist',
          'Consultation with Senior Orthopedic & Joint Surgeon',
          'Senior Nutritionist Dietary Guidelines for Bone & Heart Health',
          'Physiotherapy Assessment for Fall Prevention & Balance'
        ]
      }
    ]
  },
  {
    id: 'women',
    category: 'women',
    title: 'ProHealth Women\'s Wellness',
    badge: 'Comprehensive Female Health',
    popular: false,
    testCountText: '54+ Specialized Tests',
    totalTestsNumber: 54,
    priceIndividual: '$140.00',
    priceFamily: '$230.00 (Mother & Daughter)',
    description: 'Tailored for female health covering hormonal balance, reproductive wellness, cervical screening, breast cancer detection, bone density, and thyroid health.',
    fasting: '10-12 Hours Overnight Fasting Required',
    reportTime: 'Reports in 6-8 Hours (Same Day Delivery)',
    sampleType: 'Blood, Urine, Pap Smear & Imaging',
    keyHighlights: [
      'Digital Mammography (40+) OR Breast Sonomammography',
      'Liquid-Based Cytology (LBC) Pap Smear Examination',
      'Complete Thyroid Profile (Free T3, Free T4, Ultra-sensitive TSH)',
      'CA-125 Ovarian Cancer Screening Marker',
      'Vitamin D3, Serum Calcium & Ferritin Iron Stores',
      'Senior Obstetrician & Gynecologist Comprehensive Review'
    ],
    testGroups: [
      {
        name: 'Breast & Cervical Cancer Screening (5 Tests)',
        tests: [
          'Digital Bilateral Mammography (Age 40+) OR Breast Ultrasound (Below 40)',
          'Liquid-Based Cytology (LBC) Pap Smear for Cervical Cancer',
          'CA-125 Ovarian Tumor Screening Marker',
          'Clinical Breast Examination by Senior Female Specialist',
          'Pelvic Health & Uterine Wellbeing Assessment'
        ]
      },
      {
        name: 'Hormonal & Thyroid Health (6 Tests)',
        tests: [
          'Ultra-sensitive Thyroid Stimulating Hormone (TSH)',
          'Free Triiodothyronine (Free T3)',
          'Free Thyroxine (Free T4)',
          'Serum Prolactin (Hormonal Balance)',
          'Serum Follicle-Stimulating Hormone (FSH)',
          'Serum Luteinizing Hormone (LH)'
        ]
      },
      {
        name: 'Anemia, Bone & Micronutrients (8 Tests)',
        tests: [
          'Serum Ferritin (Iron Deficiency & Anemia Marker)',
          'Serum Iron & Total Iron Binding Capacity (TIBC)',
          'Vitamin D3 (25-OH Cholecalciferol)',
          'Serum Calcium & Phosphorus',
          'Complete Blood Count (CBC 14 Parameters)',
          'Erythrocyte Sedimentation Rate (ESR)'
        ]
      },
      {
        name: 'Metabolic & Vital Organ Function (17 Tests)',
        tests: [
          'Fasting Blood Sugar & HbA1c Glycated Hemoglobin',
          'Complete Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)',
          'Liver Function Panel (LFT - SGOT, SGPT, Bilirubin, Protein)',
          'Kidney Function Panel (Serum Creatinine, BUN, Uric Acid)',
          'Complete Urine Routine & Microscopic Examination (R/M/E)'
        ]
      },
      {
        name: 'Diagnostic Imaging & Cardiac (4 Tests)',
        tests: [
          'Pelvic & Lower Abdominal Ultrasound (USG)',
          'Digital Chest Radiograph (PA View)',
          'Resting 12-Lead Electrocardiogram (ECG)',
          'Body Composition & Visceral Fat Analysis'
        ]
      },
      {
        name: 'Specialist Clinical Consultations (4 Reviews)',
        tests: [
          'Consultation with Senior Obstetrician & Gynecologist',
          'Consultation with Senior Consultant Physician',
          'PCOD, Hormonal & Weight Management Clinical Dietitian Plan',
          'Eye Vision & Optometry Screening'
        ]
      }
    ]
  },
  {
    id: 'diabetes',
    category: 'diabetes',
    title: 'ProHealth Diabetes & Metabolic Shield',
    badge: 'Endocrine & Sugar Care',
    popular: false,
    testCountText: '42+ Specialized Tests',
    totalTestsNumber: 42,
    priceIndividual: '$110.00',
    priceFamily: '$180.00 (Couple Plan)',
    description: 'Dedicated evaluation for diabetes, pre-diabetes, insulin resistance, and silent target-organ damage (diabetic kidney, retinopathy, and neuropathy).',
    fasting: '10-12 Hours Overnight Fasting Required',
    reportTime: 'Reports in 6 Hours (Same Day Delivery)',
    sampleType: 'Blood, Urine & Retinal Eye Scan',
    keyHighlights: [
      'HbA1c Glycated Hemoglobin & Average Blood Glucose',
      'Spot Urine Albumin-to-Creatinine Ratio (Early Kidney Protection)',
      'Fundus Eye Photography for Diabetic Retinopathy Screening',
      'Vibration Perception Threshold (VPT) Foot Neuropathy Check',
      'Complete Lipid Profile & Serum Creatinine with eGFR',
      'Senior Endocrinologist & Diabetologist Consultation'
    ],
    testGroups: [
      {
        name: 'Diabetic & Glucose Profile (5 Tests)',
        tests: [
          'Fasting Blood Glucose (FBS)',
          'Post Prandial Blood Glucose (PPBS - 2h Post Meal)',
          'HbA1c (Glycated Hemoglobin 3-Month Trend)',
          'Estimated Average Glucose (eAG)',
          'Fasting Serum Insulin Level & HOMA-IR Index'
        ]
      },
      {
        name: 'End-Organ & Microvascular Protection (6 Tests)',
        tests: [
          'Spot Urine Albumin / Creatinine Ratio (Microalbuminuria)',
          'Diabetic Retinopathy Dilated Eye Fundus Examination',
          'Biothesiometry Foot Neuropathy & Sensation Test',
          'Serum Creatinine with Estimated GFR (eGFR)',
          'Blood Urea Nitrogen (BUN)',
          'Serum Uric Acid'
        ]
      },
      {
        name: 'Lipid & Cardiovascular Panel (8 Tests)',
        tests: [
          'Total Serum Cholesterol',
          'HDL "Good" Cholesterol',
          'LDL "Bad" Cholesterol',
          'VLDL Cholesterol',
          'Serum Triglycerides',
          'Total Cholesterol / HDL Risk Ratio',
          'Resting 12-Lead Electrocardiogram (ECG)',
          'High-Sensitivity C-Reactive Protein (hs-CRP)'
        ]
      },
      {
        name: 'Complete Blood & Organ Vitality (17 Tests)',
        tests: [
          'Complete Blood Count (CBC 14 Parameters)',
          'Liver Function Test (SGPT, SGOT, Bilirubin, ALP)',
          'Serum Electrolytes (Sodium, Potassium, Chloride)',
          'Routine & Microscopic Urine Examination (R/M/E)'
        ]
      },
      {
        name: 'Specialist Consultations (4 Reviews)',
        tests: [
          'Consultation with Senior Consultant Endocrinologist / Diabetologist',
          'Consultation with Internal Medicine Specialist',
          'Certified Diabetes Educator & Dietitian Carbohydrate Plan',
          'Diabetic Foot & Wound Prevention Counseling'
        ]
      }
    ]
  },
  {
    id: 'executive',
    category: 'executive',
    title: 'ProHealth Executive Platinum Check',
    badge: 'VIP Ultimate Whole Body',
    popular: false,
    testCountText: '85+ Elite Whole Body Tests',
    totalTestsNumber: 85,
    priceIndividual: '$290.00',
    priceFamily: '$480.00 (Executive Couple)',
    description: 'Our most comprehensive VIP diagnostic audit combining advanced cardiac imaging, total cancer screening markers, hormonal panels, and multi-specialty reviews.',
    fasting: '10-12 Hours Overnight Fasting Required',
    reportTime: 'Reports in 8 Hours + Executive Lounge Access',
    sampleType: 'Blood, Urine, Echo, USG, X-Ray & Scans',
    keyHighlights: [
      '2D Echocardiogram, Treadmill Stress Test (TMT) & Resting ECG',
      'Whole Abdominal & Pelvis Ultrasound + Digital Chest X-Ray',
      'Complete Cancer Tumor Markers (PSA, CA-125, CEA, AFP)',
      'Complete Vitamin D3, B12, Iron Profile & Hormone Panel',
      'Liver Elastography Assessment & Full Renal/Hepatic Panels',
      'Consultations with 6 Senior Super-Specialist Faculty Members'
    ],
    testGroups: [
      {
        name: 'Advanced Cardiovascular & Imaging (10 Tests)',
        tests: [
          '2D Echocardiogram with Color Doppler',
          'Computerized Treadmill Stress Test (TMT / Stress ECG)',
          '12-Lead Electrocardiogram (ECG)',
          'Carotid Intima-Media Thickness (CIMT) Vascular Scan',
          'High-Sensitivity C-Reactive Protein (hs-CRP)',
          'Serum Homocysteine & Apolipoprotein B / A1',
          'Complete Lipid Profile (8 Parameters)'
        ]
      },
      {
        name: 'Comprehensive Tumor & Cancer Markers (6 Tests)',
        tests: [
          'Prostate-Specific Antigen (PSA - for Men)',
          'CA-125 Ovarian Tumor Marker (for Women)',
          'Carcinoembryonic Antigen (CEA - Colon / GI)',
          'Alpha-Fetoprotein (AFP - Liver Malignancy Screening)',
          'CA 19-9 (Pancreatic / Biliary Tumor Marker)',
          'Stool Occult Blood Screening (Immunochemical FIT)'
        ]
      },
      {
        name: 'Complete Metabolic, Liver & Kidney Panels (26 Tests)',
        tests: [
          'Full Liver Function Panel (LFT - 9 Parameters)',
          'Full Renal Function Panel (KFT with eGFR - 7 Parameters)',
          'Serum Electrolyte Panel (Na, K, Cl, Bicarbonate)',
          'Fasting Glucose, PPBS, HbA1c & Fasting Insulin (HOMA-IR)',
          'Serum Uric Acid & Microalbuminuria Spot Urine'
        ]
      },
      {
        name: 'Vitamins, Hormones & Hematology (25 Tests)',
        tests: [
          'Vitamin D3 (25-OH Cholecalciferol)',
          'Vitamin B12 (Cyanocobalamin)',
          'Complete Iron Panel (Ferritin, Serum Iron, TIBC)',
          'Thyroid Profile (TSH, Free T3, Free T4)',
          'Complete Blood Count (CBC 14 Parameters & ESR)'
        ]
      },
      {
        name: 'Radiology, Scans & Physical Audits (8 Tests)',
        tests: [
          'Ultrasound Whole Abdomen & Pelvis with Doppler',
          'Digital Chest Radiograph (PA View)',
          'Pulmonary Function Spirometry (PFT)',
          'Pure Tone Audiometry Hearing Assessment',
          'Eye Vision, Glaucoma & Retinal Fundus Screening',
          'Body Composition, Visceral Fat & BMI Analysis'
        ]
      },
      {
        name: 'Executive Super-Specialist Consultations (6 Reviews)',
        tests: [
          'Senior Consultant Physician Comprehensive Evaluation',
          'Senior Interventional Cardiologist Review',
          'Senior General Surgeon (Men) / Gynecologist (Women) Review',
          'Senior Optometry & Ophthalmologist Eye Review',
          'Senior Dental & Oral Health Surgeon Check',
          'Executive Lifestyle & Clinical Nutrition Counseling'
        ]
      }
    ]
  }
];

export default function ProHealthPage() {
  const [packagePlan, setPackagePlan] = useState('individual'); // 'individual' | 'family'
  const [selectedPackageCategory, setSelectedPackageCategory] = useState('all');
  const [expandedPackageId, setExpandedPackageId] = useState(null);
  const [activeTestModalPackage, setActiveTestModalPackage] = useState(null);
  const [testModalSearch, setTestModalSearch] = useState('');

  return (
    <div className="landing-page-root">
      <PublicHeader />

      {/* Page Hero Header */}
      <section className="page-hero-banner">
        <div className="page-hero-inner">
          <div className="section-tag" style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}>
            <Sparkles size={14} />
            <span>AI-Powered Predictive Risk Scoring • Same-Day Digital Reports</span>
          </div>
          <h1 className="page-hero-title">Apollo ProHealth™ Preventive Health Checkups</h1>
          <p className="page-hero-desc">
            Personalized whole-body screening programs combining advanced laboratory tests, genetic markers,
            and comprehensive clinical specialist reviews. Detect chronic illnesses up to 5 years before symptoms arise.
          </p>

          {/* Toggle Individual vs Family */}
          <div className="prohealth-toggle-wrapper" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            <div className="prohealth-toggle-box">
              <button
                type="button"
                className={`prohealth-toggle-btn ${packagePlan === 'individual' ? 'active' : ''}`}
                onClick={() => setPackagePlan('individual')}
              >
                Individual Screenings
              </button>
              <button
                type="button"
                className={`prohealth-toggle-btn ${packagePlan === 'family' ? 'active' : ''}`}
                onClick={() => setPackagePlan('family')}
              >
                Family & Couple Plans
              </button>
            </div>
            <div className="discount-pulse-badge">
              <Sparkles size={14} color="#ea580c" />
              <span>Save 25% on Online Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="apollo-section" style={{ paddingTop: '2.5rem' }}>
        <div className="inner-wrap">
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {[
              { id: 'all', label: 'All Packages (6)' },
              { id: 'master', label: 'Full Body Master' },
              { id: 'cardiac', label: 'Cardiac & Heart' },
              { id: 'senior', label: 'Senior Citizen (55+)' },
              { id: 'women', label: 'Women\'s Wellness' },
              { id: 'diabetes', label: 'Diabetes Shield' },
              { id: 'executive', label: 'Executive Platinum' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedPackageCategory(cat.id)}
                className={`filter-pill ${selectedPackageCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Packages Grid */}
          <div className="prohealth-grid">
            {proHealthPackagesData
              .filter((pkg) => selectedPackageCategory === 'all' || pkg.category === selectedPackageCategory)
              .map((pkg) => {
                const isExpanded = expandedPackageId === pkg.id;
                const price = packagePlan === 'individual' ? pkg.priceIndividual : pkg.priceFamily;

                return (
                  <div key={pkg.id} className={`prohealth-card ${pkg.popular ? 'featured' : ''}`}>
                    {pkg.popular && <span className="prohealth-badge">Most Popular</span>}

                    <span
                      className="prohealth-tests-count"
                      style={pkg.popular ? { background: '#fff3ec', color: 'var(--color-apollo-orange)' } : {}}
                    >
                      {pkg.testCountText}
                    </span>

                    <h3>{pkg.title}</h3>
                    <p>{pkg.description}</p>

                    <div className="prohealth-price" style={pkg.popular ? { color: 'var(--color-apollo-orange)' } : {}}>
                      {price}
                    </div>

                    {/* Clinical Quick Tags */}
                    <div className="prohealth-quick-tags">
                      <span className="prohealth-quick-tag">
                        <Clock size={11} color="var(--color-apollo-orange)" />
                        <span>{pkg.fasting.split(' ')[0]} {pkg.fasting.split(' ')[1]} Fasting</span>
                      </span>
                      <span className="prohealth-quick-tag">
                        <Zap size={11} color="#0284c7" />
                        <span>Same-Day Reports</span>
                      </span>
                      <span className="prohealth-quick-tag">
                        <Droplets size={11} color="#e11d48" />
                        <span>Blood & Scans</span>
                      </span>
                    </div>

                    {/* Key Highlights */}
                    <ul className="prohealth-features" style={{ marginBottom: 'var(--space-4)' }}>
                      {pkg.keyHighlights.slice(0, 4).map((hl, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={15} color="#15803d" style={{ flexShrink: 0 }} />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Inline Accordion Button */}
                    <button
                      type="button"
                      className="prohealth-tests-toggle-btn"
                      onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FlaskConical size={14} color="var(--color-apollo-orange)" />
                        <span>{isExpanded ? 'Hide Included Tests' : `View Included Tests (${pkg.totalTestsNumber})`}</span>
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Expanded Test Groups List */}
                    {isExpanded && (
                      <div className="prohealth-card-expanded">
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary-600)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>ALL INCLUDED TEST GROUPS:</span>
                          <span style={{ color: 'var(--color-apollo-orange)', background: '#fff7ed', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            {pkg.totalTestsNumber} Parameters
                          </span>
                        </div>
                        {pkg.testGroups.map((grp, gIdx) => (
                          <div key={gIdx} className="test-group-box">
                            <div className="test-group-title">
                              <CheckCircle2 size={12} color="#16a34a" />
                              <span>{grp.name}</span>
                            </div>
                            <div className="test-pills-wrap">
                              {grp.tests.map((testItem, tIdx) => (
                                <div key={tIdx} className="test-pill-item">
                                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-apollo-orange)', display: 'inline-block', flexShrink: 0 }} />
                                  <span>{testItem}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="prohealth-actions-row">
                      <Link
                        to="/appointments"
                        className={pkg.popular ? 'btn btn-orange' : 'btn btn-outline'}
                        style={{ textAlign: 'center', justifyContent: 'center' }}
                      >
                        Book Package
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTestModalPackage(pkg);
                          setTestModalSearch('');
                        }}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}
                        title="View Full Test Breakdown & Preparation"
                      >
                        <Eye size={15} />
                        <span>Breakdown</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Test Breakdown Modal */}
          {activeTestModalPackage && (
            <div className="prohealth-modal-overlay" onClick={() => setActiveTestModalPackage(null)}>
              <div className="prohealth-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="prohealth-modal-header">
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="prohealth-badge" style={{ position: 'static' }}>
                        {activeTestModalPackage.badge}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-600)', background: 'var(--color-primary-50)', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                        {activeTestModalPackage.testCountText}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {activeTestModalPackage.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                      {activeTestModalPackage.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTestModalPackage(null)}
                    style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ padding: '0.75rem var(--space-8)', background: '#f8fafc', borderBottom: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569' }}>
                    <Clock size={14} color="var(--color-apollo-orange)" />
                    <strong>Fasting:</strong> <span>{activeTestModalPackage.fasting}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569' }}>
                    <Zap size={14} color="#0284c7" />
                    <strong>Turnaround:</strong> <span>{activeTestModalPackage.reportTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569' }}>
                    <Droplets size={14} color="#e11d48" />
                    <strong>Specimen:</strong> <span>{activeTestModalPackage.sampleType}</span>
                  </div>
                </div>

                <div style={{ padding: 'var(--space-4) var(--space-8) 0 var(--space-8)' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search specific test parameter (e.g. Creatinine, HbA1c, 2D Echo, Vitamin D, TSH)..."
                      value={testModalSearch}
                      onChange={(e) => setTestModalSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem 0.6rem 2.25rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1.5px solid var(--border-color)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    />
                    {testModalSearch && (
                      <button
                        type="button"
                        onClick={() => setTestModalSearch('')}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="prohealth-modal-body">
                  {activeTestModalPackage.testGroups
                    .filter((group) => {
                      if (!testModalSearch) return true;
                      const q = testModalSearch.toLowerCase();
                      const groupMatches = group.name.toLowerCase().includes(q);
                      const testsMatch = group.tests.some((t) => t.toLowerCase().includes(q));
                      return groupMatches || testsMatch;
                    })
                    .map((group, idx) => {
                      const filteredTests = testModalSearch
                        ? group.tests.filter((t) => t.toLowerCase().includes(testModalSearch.toLowerCase()) || group.name.toLowerCase().includes(testModalSearch.toLowerCase()))
                        : group.tests;

                      return (
                        <div key={idx} style={{ marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <FlaskConical size={16} color="var(--color-apollo-orange)" />
                              <span>{group.name}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                              {filteredTests.length} Tests
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.5rem' }}>
                            {filteredTests.map((testName, tIdx) => (
                              <div
                                key={tIdx}
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: 'var(--radius-md)',
                                  fontSize: '0.8125rem',
                                  color: 'var(--text-primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}
                              >
                                <Check size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                                <span>{testName}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="prohealth-modal-footer">
                  <div>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block' }}>Package Price:</span>
                    <strong style={{ fontSize: '1.35rem', color: 'var(--color-primary-600)' }}>
                      {packagePlan === 'individual' ? activeTestModalPackage.priceIndividual : activeTestModalPackage.priceFamily}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTestModalPackage(null)}
                      className="btn btn-outline"
                    >
                      Close
                    </button>
                    <Link
                      to="/appointments"
                      className="btn btn-orange"
                      onClick={() => setActiveTestModalPackage(null)}
                    >
                      Book This Health Check
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose ProHealth Strip */}
      <section style={{ padding: '0 var(--space-8) 3.5rem var(--space-8)', maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-2xl)', padding: '2.5rem', border: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem auto' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-apollo-orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Why MediCore ProHealth?
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-500)', margin: '0.35rem 0' }}>
              The Gold Standard in Preventive Healthcare
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Unlike generic blood test packages, Apollo ProHealth combines clinical pathology with doctor consultations, digital imaging, and lifestyle intervention.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0' }}>
              <div style={{ width: 40, height: 40, background: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>NABL & CAP Certified Labs</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                100% automated robotic diagnostic analyzers guaranteeing laboratory precision and zero human error.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0' }}>
              <div style={{ width: 40, height: 40, background: '#fdf2f8', color: '#db2777', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Award size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>Senior Doctor Reviews</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Every report is clinically analyzed by a Senior Consultant Physician and Interventional Cardiologist.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0' }}>
              <div style={{ width: 40, height: 40, background: '#f0fdf4', color: '#16a34a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Zap size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>Same-Day Digital Delivery</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                Receive high-resolution digital reports directly in your patient portal within 6-8 hours of specimen collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
      <FloatingDock />
    </div>
  );
}
