export type Tone = "blue" | "purple" | "green" | "rose" | "amber" | "teal";
export const TONES: Record<Tone, { chip: string; soft: string; text: string; ring: string }> = {
  blue: { chip: "bg-blue-600", soft: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", ring: "ring-blue-200" },
  purple: { chip: "bg-violet-600", soft: "bg-violet-50 dark:bg-violet-950/40", text: "text-violet-700 dark:text-violet-300", ring: "ring-violet-200" },
  green: { chip: "bg-emerald-600", soft: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-200" },
  rose: { chip: "bg-rose-600", soft: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-300", ring: "ring-rose-200" },
  amber: { chip: "bg-amber-600", soft: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-200" },
  teal: { chip: "bg-teal-600", soft: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-700 dark:text-teal-300", ring: "ring-teal-200" },
};
export type Mod = { n: number; path: string; title: string; tag: string; tone: Tone; ai: boolean; points: string[] };
export const MODULES: Mod[] = [
  { n: 1, path: "navigator", title: "AI Healthcare Navigator", tag: "Get the right guidance, at the right time.", tone: "blue", ai: true, points: ["Symptom guidance", "Urgency assessment", "Voice + multilingual"] },
  { n: 2, path: "finder", title: "London Healthcare Finder", tag: "Find the best care, near you.", tone: "purple", ai: true, points: ["GPs, hospitals, pharmacies", "Accessibility & language filters", "AI-ranked matches"] },
  { n: 3, path: "care-agent", title: "Medora Care Agent", tag: "End-to-end care journey management.", tone: "green", ai: true, points: ["Care-plan generation", "Referral & results tracking", "Personalised next steps"] },
  { n: 4, path: "documents", title: "Medical Document AI", tag: "Turn complex documents into clear answers.", tone: "rose", ai: true, points: ["Report analysis", "Terminology explained", "Doctor question generation"] },
  { n: 5, path: "record", title: "Personal Health Record & Timeline", tag: "Your health, in one place.", tone: "blue", ai: true, points: ["Timeline & vaccinations", "Search and filter", "Export & sharing"] },
  { n: 6, path: "appointments", title: "Appointments & Preparation", tag: "Be ready, not rushed.", tone: "purple", ai: true, points: ["AI pre-appointment checklist", "Doctor question generator", "Calendar (.ics) export"] },
  { n: 7, path: "medications", title: "Medication Intelligence", tag: "Stay on track, stay safe.", tone: "teal", ai: true, points: ["Dose tracking", "Interaction & allergy alerts", "Refill reminders"] },
  { n: 8, path: "family", title: "Family Health Agent", tag: "Healthcare for your whole family.", tone: "rose", ai: true, points: ["Dependants & profiles", "Family care checklists", "Caregiver support"] },
  { n: 9, path: "copilot", title: "Doctor Copilot", tag: "Smarter tools for better care.", tone: "blue", ai: true, points: ["AI scribe (voice)", "SOAP note + patient summary", "Referral letter"] },
  { n: 10, path: "intelligence", title: "Healthcare Intelligence", tag: "Smarter insights. Better outcomes.", tone: "green", ai: true, points: ["Patient flow & demand forecast", "Care-gap detection", "AI recommendations"] },
  { n: 11, path: "accessibility", title: "Accessibility & Multilingual", tag: "Healthcare for everyone.", tone: "purple", ai: false, points: ["Large text, high contrast", "Voice input & replies", "11 languages, simple mode"] },
  { n: 12, path: "privacy", title: "Safety & Privacy", tag: "Your data. Your control.", tone: "teal", ai: false, points: ["Consent management", "Granular permissions", "Live audit trail"] },
  { n: 13, path: "employer", title: "Employer Solutions", tag: "Healthier teams. Stronger businesses.", tone: "rose", ai: true, points: ["Anonymous aggregate analytics", "Wellbeing plan generator", "Employer dashboard"] },
  { n: 14, path: "clinic", title: "Hospital & Clinic Solutions", tag: "Better workflows. Healthier communities.", tone: "blue", ai: true, points: ["AI receptionist", "No-show & waiting list", "Clinic analytics"] },
];

export type Provider = { id: string; name: string; type: "GP" | "Pharmacy" | "Urgent care" | "Hospital" | "Diagnostics" | "Specialist"; sector: "NHS" | "Private" | "Community"; area: string; hours: string; walkIn: boolean; services: string[]; languages: string[]; access: string[] };
// DEMO DIRECTORY — illustrative sample data, not a live register.
export const PROVIDERS: Provider[] = [
  { id: "p1", name: "Camden Family Practice", type: "GP", sector: "NHS", area: "Camden, NW1", hours: "Mon–Fri 8am–6:30pm", walkIn: false, services: ["Same-day appointments", "Diabetes clinic", "Asthma clinic", "Child immunisations"], languages: ["English", "Bengali", "Hindi"], access: ["Step-free", "Hearing loop", "Accessible toilet"] },
  { id: "p2", name: "Hackney Community Health Hub", type: "GP", sector: "Community", area: "Hackney, E8", hours: "Mon–Sat 8am–8pm", walkIn: true, services: ["Walk-in", "Mental health support", "Sexual health", "Health checks"], languages: ["English", "Turkish", "Polish", "Urdu"], access: ["Step-free", "BSL interpreter on request"] },
  { id: "p3", name: "Southwark Late Pharmacy", type: "Pharmacy", sector: "NHS", area: "Southwark, SE1", hours: "Daily 8am–11pm", walkIn: true, services: ["Pharmacy First (UTI, sore throat, earache)", "Blood pressure check", "Flu & COVID vaccines", "Repeat prescriptions"], languages: ["English", "Arabic", "Somali"], access: ["Step-free", "Large-print labels"] },
  { id: "p4", name: "Whitechapel Urgent Treatment Centre", type: "Urgent care", sector: "NHS", area: "Whitechapel, E1", hours: "Daily 7am–10pm", walkIn: true, services: ["Minor injuries", "Minor illness", "X-ray", "Wound care"], languages: ["English", "Bengali", "Sylheti"], access: ["Step-free", "Hearing loop", "Accessible toilet"] },
  { id: "p5", name: "Westminster Walk-in Centre", type: "Urgent care", sector: "NHS", area: "Westminster, SW1", hours: "Daily 8am–8pm", walkIn: true, services: ["Minor illness", "Emergency contraception", "Travel advice"], languages: ["English", "French", "Spanish"], access: ["Step-free"] },
  { id: "p6", name: "St Thomas' Hospital A&E", type: "Hospital", sector: "NHS", area: "Lambeth, SE1", hours: "24 hours", walkIn: true, services: ["Emergency department", "Maternity", "Cardiology", "Stroke unit"], languages: ["English", "Interpreter line (200+ languages)"], access: ["Step-free", "Hearing loop", "BSL interpreter on request", "Accessible toilet"] },
  { id: "p7", name: "University College Hospital", type: "Hospital", sector: "NHS", area: "Euston, NW1", hours: "24 hours (A&E)", walkIn: true, services: ["Emergency department", "Cancer care", "Neurology", "Orthopaedics"], languages: ["English", "Interpreter line (200+ languages)"], access: ["Step-free", "Hearing loop", "Accessible toilet"] },
  { id: "p8", name: "Harley Street Diagnostics", type: "Diagnostics", sector: "Private", area: "Marylebone, W1", hours: "Mon–Sat 8am–7pm", walkIn: false, services: ["MRI", "CT", "Ultrasound", "Blood tests (same-day results)"], languages: ["English", "Arabic", "French"], access: ["Step-free", "Accessible toilet"] },
  { id: "p9", name: "Lewisham Community Diagnostic Centre", type: "Diagnostics", sector: "NHS", area: "Lewisham, SE13", hours: "Mon–Fri 8am–8pm", walkIn: false, services: ["Blood tests", "ECG", "Ultrasound", "X-ray", "NHS referrals only"], languages: ["English", "Polish", "Yoruba"], access: ["Step-free", "Hearing loop"] },
  { id: "p10", name: "Kensington Women's Health Clinic", type: "Specialist", sector: "Private", area: "Kensington, W8", hours: "Mon–Fri 9am–6pm", walkIn: false, services: ["Gynaecology", "Menopause clinic", "Fertility advice", "Cervical screening"], languages: ["English", "Hindi", "Gujarati", "Punjabi"], access: ["Step-free", "Accessible toilet"] },
  { id: "p11", name: "Islington Physio & MSK Centre", type: "Specialist", sector: "Private", area: "Islington, N1", hours: "Mon–Sat 7:30am–8pm", walkIn: false, services: ["Physiotherapy", "Back & knee pain", "Sports injuries", "Podiatry"], languages: ["English", "Spanish"], access: ["Step-free"] },
  { id: "p12", name: "Brent Children's Clinic", type: "Specialist", sector: "NHS", area: "Wembley, HA9", hours: "Mon–Fri 8am–6pm", walkIn: false, services: ["Paediatrics", "Child asthma & allergy", "Developmental checks", "Vaccinations"], languages: ["English", "Gujarati", "Punjabi", "Urdu"], access: ["Step-free", "Play area", "Accessible toilet"] },
  { id: "p13", name: "Tower Hamlets Deaf Health Service", type: "GP", sector: "Community", area: "Bow, E3", hours: "Mon–Fri 9am–5pm", walkIn: false, services: ["BSL-first GP consultations", "Health checks", "Long-term conditions"], languages: ["English", "BSL", "Bengali"], access: ["BSL interpreter on request", "Step-free", "Video relay"] },
  { id: "p14", name: "Ealing Late Pharmacy & Clinic", type: "Pharmacy", sector: "Community", area: "Ealing, W5", hours: "Daily 8am–10pm", walkIn: true, services: ["Pharmacy First", "Travel vaccines", "Contraception service", "Minor ailments"], languages: ["English", "Polish", "Punjabi", "Hindi"], access: ["Step-free"] },
];

export const SAMPLE_REPORT = `LONDON PATHOLOGY SERVICES — BLOOD TEST REPORT
Patient: P. Sharma   DOB: 12/04/1988   Requested by: Dr A. Patel (GP)
Collected: 14/09/2026

FULL BLOOD COUNT
Haemoglobin (Hb)      108 g/L     (115–165)   LOW
MCV                   76 fL       (80–100)    LOW
WBC                   6.4 x10^9/L (4.0–11.0)
Platelets             410 x10^9/L (150–400)   HIGH

BIOCHEMISTRY
HbA1c                 47 mmol/mol (<48)
Ferritin              9 ug/L      (15–150)    LOW
eGFR                  >90 mL/min
ALT                   28 U/L      (<40)
Total cholesterol     5.8 mmol/L  (<5.0)      HIGH
LDL cholesterol       3.6 mmol/L  (<3.0)      HIGH

Comment: Microcytic hypochromic picture with low ferritin, consistent with iron deficiency. Suggest clinical correlation. Consider dietary history / menstrual history.`;

export const SAMPLE_CONSULT = `Doctor: Good morning, what brings you in today?
Patient: I've had a cough for about three weeks now, it's worse at night and I get a bit wheezy after climbing the stairs.
Doctor: Any fever, chest pain or coughing up blood?
Patient: No fever. No blood. Slight tightness in my chest when I cough a lot.
Doctor: You have asthma history, correct? Are you using your salbutamol?
Patient: Yes, maybe four or five times a week now, it used to be once a week.
Doctor: Any smoking? Any recent cold?
Patient: Never smoked. I had a cold a month ago and this cough started after that.
Doctor: On examination chest has scattered expiratory wheeze bilaterally, no crackles. Sats 97% on air, pulse 82, temperature 36.8. Peak flow 340, usually 420. I think this is an asthma flare after a viral infection. I'll start a preventer inhaler, beclometasone 200 micrograms twice a day, keep salbutamol as needed. Review in 2 weeks, and if worse or breathless at rest come back urgently or call 111.`;

// Mock operational analytics (illustrative)
export const FLOW = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"].map((h, i) => ({ hour: `${h}:00`, arrivals: [12, 24, 31, 28, 19, 17, 22, 26, 23, 15, 9][i], waiting: [4, 9, 14, 12, 7, 6, 9, 12, 10, 5, 2][i] }));
export const DEMAND = [
  { day: "Mon", actual: 142, forecast: 138 }, { day: "Tue", actual: 128, forecast: 131 }, { day: "Wed", actual: 119, forecast: 122 },
  { day: "Thu", actual: 134, forecast: 129 }, { day: "Fri", actual: 151, forecast: 148 }, { day: "Sat", forecast: 96 }, { day: "Sun", forecast: 61 }, { day: "Mon+", forecast: 156 },
];
export const CARE_GAPS = [
  { gap: "Diabetes annual review overdue", n: 87, risk: "High" }, { gap: "Hypertension check > 12 months", n: 142, risk: "Medium" },
  { gap: "Cervical screening overdue", n: 203, risk: "Medium" }, { gap: "Child MMR 2nd dose outstanding", n: 34, risk: "High" }, { gap: "Statin review due (CVD risk)", n: 61, risk: "Medium" },
];
export const WAITING = [
  { name: "A. Khan", proc: "Knee MRI", days: 41, noShow: 0.62, note: "Missed last 2 SMS reminders" }, { name: "L. Brown", proc: "Cardiology OPD", days: 33, noShow: 0.18, note: "" },
  { name: "S. Nowak", proc: "Dermatology", days: 27, noShow: 0.47, note: "Works nights — offer evening slot" }, { name: "T. Adeyemi", proc: "Physio course", days: 22, noShow: 0.11, note: "" },
  { name: "R. Das", proc: "Endoscopy", days: 19, noShow: 0.55, note: "Prefers Bengali contact" },
];
export const EMPLOYER = {
  headcount: 640, participation: 0.58,
  absence: [{ m: "Apr", v: 3.1 }, { m: "May", v: 3.4 }, { m: "Jun", v: 2.9 }, { m: "Jul", v: 3.8 }, { m: "Aug", v: 3.3 }, { m: "Sep", v: 2.7 }],
  themes: [{ t: "Stress & workload", v: 34 }, { t: "Musculoskeletal", v: 24 }, { t: "Sleep", v: 18 }, { t: "Preventive checks", v: 14 }, { t: "Other", v: 10 }],
};
