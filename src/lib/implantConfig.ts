import { StoryScene, ClinicConfig, DoctorProfile, ProcessStep, BeforeAfterCase, FAQItem } from '../types';

/**
 * REUSABLE CLINIC CONFIGURATION
 * Replace with verified clinic details and official statistics.
 */
export const CLINIC_CONFIG: ClinicConfig = {
  name: "IMPLANT DENTAL CENTER",
  tagline: "Precision that becomes part of you.",
  phone: "+44 20 7946 0912", // Placeholder: verified clinic phone
  email: "care@implantdentalcenter.com", // Placeholder: verified clinic email
  address: "48 Harley Street, Marylebone, London W1G 9PR", // Placeholder: verified clinic address
  hours: "Mon – Fri: 08:30 – 19:00 | Sat: 09:00 – 15:00",
  emergency: "24/7 Surgical Support Line",
  socials: {
    instagram: "https://instagram.com/implantdentalcenter",
    telegram: "https://t.me/implantdentalcenter",
    linkedin: "https://linkedin.com/company/implantdentalcenter"
  }
};

/**
 * SCROLL-DRIVEN 3D STORYLINE PHASES
 */
export const STORY_SCENES: StoryScene[] = [
  {
    id: "complete",
    stepNumber: "01",
    badge: "ANATOMICAL ARCHITECTURE",
    title: "Built as one.\nDesigned in layers.",
    description: "A dental implant is not simply a tooth replacement—it is a calibrated three-part biomechanical system designed to mimic the natural root and crown anatomy.",
    highlightPart: "all",
    specs: [
      { label: "Design", value: "Tri-Part Modular System" },
      { label: "Longevity", value: "Engineered for 25+ Years" },
      { label: "Integration", value: "Bone-Level Esthetics" }
    ]
  },
  {
    id: "exploded",
    stepNumber: "02",
    badge: "MODULAR PRECISION",
    title: "Every component\nhas a purpose.",
    description: "Three distinct engineering layers work in harmony: the titanium root fixture anchored in bone, the micro-machined abutment connector, and the custom ceramic crown.",
    highlightPart: "exploded",
    specs: [
      { label: "Layer 01", value: "Monolithic Ceramic Crown", desc: "Wear-resistant warm zirconia" },
      { label: "Layer 02", value: "Precision Abutment", desc: "Conical anti-rotational hex" },
      { label: "Layer 03", value: "Titanium Root Fixture", desc: "Grade 4/5 Ti-6Al-4V ELI alloy" }
    ]
  },
  {
    id: "titanium",
    stepNumber: "03",
    badge: "MATERIAL SCIENCE",
    title: "Engineered for\nosseointegration.",
    description: "Biocompatible medical-grade titanium creates a stable foundation designed to integrate naturally with the jawbone at the cellular level through micro-textured SLA surfaces.",
    highlightPart: "titanium",
    specs: [
      { label: "Titanium", value: "Biocompatible", desc: "Zero allergic response rate" },
      { label: "Precision", value: "Thread geometry", desc: "Self-tapping progressive pitch" },
      { label: "Long-term", value: "Biological stability", desc: "Primary stability up to 45 Ncm" }
    ]
  },
  {
    id: "bone-insertion",
    stepNumber: "04",
    badge: "GUIDED SURGERY",
    title: "Precision placed.\nNaturally supported.",
    description: "Digital planning and 3D surgical guides determine the exact three-dimensional angle, depth, and insertion trajectory into the jawbone before treatment begins.",
    highlightPart: "bone-insertion",
    specs: [
      { label: "Navigation", value: "0.2mm Precision", desc: "Guided surgical stent" },
      { label: "Bone Contact", value: "BIC > 75%", desc: "Direct bone-to-implant contact" },
      { label: "Invasiveness", value: "Minimally Invasive", desc: "Preserves healthy bone matrix" }
    ]
  },
  {
    id: "abutment",
    stepNumber: "05",
    badge: "BIOMECHANICAL SEAL",
    title: "The connection\nthat brings it together.",
    description: "The abutment seats with micro-gap tolerance onto the internal conical connection, sealing against bacterial infiltration and providing the transmucosal collar.",
    highlightPart: "abutment",
    specs: [
      { label: "Connection", value: "Morse Taper Conical", desc: "Bacterial-tight cold weld" },
      { label: "Torque", value: "32 Ncm Seated", desc: "Calibrated micro-screw lock" },
      { label: "Gingival Profile", value: "Emergence Profile", desc: "Natural soft-tissue contouring" }
    ]
  },
  {
    id: "crown",
    stepNumber: "06",
    badge: "CUSTOM ESTHETICS",
    title: "Made to feel\nlike your own.",
    description: "Shape, anatomical fissures, translucency, and ceramic shade are individually crafted to harmonize imperceptibly with your natural adjacent teeth and smile line.",
    highlightPart: "crown",
    specs: [
      { label: "Material", value: "Multi-Layered Zirconia", desc: "Natural enamel translucency" },
      { label: "Color Match", value: "VITA 3D-Master", desc: "Exact shade spectrophotometry" },
      { label: "Bite Function", value: "100% Masticatory Force", desc: "Full natural bite restoration" }
    ]
  }
];

/**
 * EDITABLE CLINICAL CREDIBILITY STATISTICS
 * Replace with verified clinic audit data.
 */
export const CLINIC_STATISTICS = [
  {
    value: "15+",
    unit: "Years",
    label: "Clinical experience",
    description: "Specialized exclusively in advanced surgical implantology and complex full-arch rehabilitation."
  },
  {
    value: "5,000+",
    unit: "Cases",
    label: "Implant procedures",
    description: "Documented successful placements using digitally guided surgical protocols."
  },
  {
    value: "99.2%",
    unit: "Rate",
    label: "Osseointegration success",
    description: "Backed by strict biological protocols and 5-year post-operative verification."
  },
  {
    value: "0.2mm",
    unit: "Tolerance",
    label: "Digital planning accuracy",
    description: "Sub-millimeter 3D CBCT planning for zero-risk nerve and sinus preservation."
  }
];

/**
 * DOCTOR / SURGEON PROFILE
 */
export const LEAD_SURGEON: DoctorProfile = {
  name: "Dr. Alexander V. Sinclair",
  title: "Chief of Implantology & Oral Surgery",
  credentials: [
    "DDS, MSc in Oral Implantology (Goethe Univ. Frankfurt)",
    "Fellow, International Team for Implantology (ITI)",
    "Diplomate, European Association for Osseointegration (EAO)",
    "Lecturer in Digital Guided Implant Dentistry"
  ],
  bio: "Dr. Sinclair has dedicated over 16 years exclusively to the science of osseointegration and restorative aesthetics. Combining micro-surgical protocols with high-resolution digital scanning, his practice prioritizes minimally invasive implant placement with lasting biological stability.",
  quote: "“A truly successful dental implant is one you never have to think about again. It belongs entirely to your biology, function, and expression.”",
  stats: [
    { value: "16+ Yrs", label: "Specialist Practice" },
    { value: "5,200+", label: "Implants Placed" },
    { value: "48", label: "Clinical Publications" }
  ]
};

/**
 * 6-STEP PATIENT TREATMENT JOURNEY
 */
export const TREATMENT_PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Clinical Consultation & 3D Diagnostics",
    description: "Comprehensive oral examination combined with ultra-low-dose 3D Cone Beam Computed Tomography (CBCT) and intraoral optical scans.",
    duration: "45–60 mins",
    details: ["3D volumetric bone mapping", "Digital smile design preview", "Personalized risk & health assessment"]
  },
  {
    number: "02",
    title: "Digital Planning & Virtual Surgery",
    description: "Your implant position, angulation, and bone density are simulated virtually to fabricate a custom CAD/CAM 3D surgical guide.",
    duration: "2–3 days lab prep",
    details: ["Nerve canal & sinus safety margins", "Custom surgical template generation", "Exact component pre-selection"]
  },
  {
    number: "03",
    title: "Minimally Invasive Guided Placement",
    description: "The titanium implant is placed through the 3D surgical guide with local anesthesia, ensuring gentle execution and rapid recovery.",
    duration: "30–45 mins per site",
    details: ["Flapless or micro-incision technique", "Precision torque verification", "Immediate provisional tooth if indicated"]
  },
  {
    number: "04",
    title: "Biological Healing & Osseointegration",
    description: "Bone cells naturally attach to the titanium surface micro-pores. A temporary aesthetic crown maintains function and gum contour.",
    duration: "8–12 weeks",
    details: ["Microscopic cellular bone bridging", "Periodic stability checkups", "No functional disruption to daily life"]
  },
  {
    number: "05",
    title: "Digital Impression & Ceramic Crafting",
    description: "High-precision optical scanning of the integrated implant collar to custom-mill your monolithic zirconia or porcelain crown.",
    duration: "1 week lab milling",
    details: ["Optical color spectrophotometry", "CAD/CAM micron-fit milling", "Individualized hand-glazing"]
  },
  {
    number: "06",
    title: "Final Crown Delivery & Long-term Care",
    description: "The permanent crown is securely torqued onto the precision abutment. Occlusion is calibrated down to the micron.",
    duration: "30 mins",
    details: ["Bite balance harmonization", "Lifetime maintenance passport", "Scheduled hygiene checks"]
  }
];

/**
 * BEFORE / AFTER CASES
 */
export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: "case-single-incisor",
    title: "Upper Central Incisor Restoration",
    category: "Single Tooth Aesthetic Zone",
    patientAge: "34 Years Old",
    treatmentDuration: "10 Weeks (Immediate Placement)",
    description: "Traumatic fracture of tooth #11 restored with an immediate bone-level titanium implant, custom zirconia abutment, and multi-layered ceramic crown preserving natural interdental papillae.",
    beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80",
    afterImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
    shade: "VITA 3D 1M1 (High Translucency)",
    implantType: "Straumann BLX Ø 3.75mm"
  },
  {
    id: "case-molar-replacement",
    title: "Lower First Molar Functional Replacement",
    category: "Posterior High-Load Zone",
    patientAge: "46 Years Old",
    treatmentDuration: "12 Weeks",
    description: "Chronic failed root canal replaced with a wide-platform Grade 4 titanium implant. Restored 100% chewing capability with monolithic high-strength zirconia.",
    beforeImage: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80",
    afterImage: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=900&q=80",
    shade: "VITA 3D 2M2 (Natural Enamel)",
    implantType: "Nobel Biocare Conical Ø 4.5mm"
  }
];

/**
 * FAQ ITEMS
 */
export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is a dental implant?",
    answer: "A dental implant is a biocompatible medical-grade titanium fixture designed to replace the natural root of a missing tooth. Once inserted into the jawbone, it undergoes osseointegration—fusing directly with bone tissue—to anchor a custom abutment and ceramic crown."
  },
  {
    question: "How long does implant treatment take?",
    answer: "The surgical placement itself typically takes 30 to 45 minutes per implant. The biological integration (osseointegration) requires 8 to 12 weeks for bone cells to securely bond with the titanium. During this healing phase, you are provided with a discreet aesthetic temporary tooth."
  },
  {
    question: "Is implant placement painful?",
    answer: "The procedure is performed under gentle local anesthesia and is completely painless during surgery. Because bone tissue has very few nerve endings, post-operative discomfort is generally milder than a standard tooth extraction and easily managed with mild over-the-counter pain relief for 1–2 days."
  },
  {
    question: "How long can dental implants last?",
    answer: "With proper oral hygiene and routine dental checkups, quality dental implants have documented clinical survival rates exceeding 25 to 30 years, often lasting a lifetime. The ceramic crown may experience normal surface wear over decades and can be renewed independently."
  },
  {
    question: "Can anyone receive a dental implant?",
    answer: "Most healthy adults with fully formed jawbones are ideal candidates. Factors such as general medical health, smoking status, and bone volume are assessed during the 3D CBCT diagnostic scan. Even patients with past bone loss can receive implants via modern regenerative grafting techniques."
  },
  {
    question: "How do I know whether I need bone grafting?",
    answer: "Bone volume is evaluated accurately during your 3D digital CBCT scan. If a tooth has been missing for an extended period and natural bone resorption has occurred, a localized micro-graft or sinus lift can be performed—frequently at the same time as implant placement."
  }
];
