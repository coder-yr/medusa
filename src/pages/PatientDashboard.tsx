import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, FileText, IndianRupee, Settings, Bell, Menu,
  LogOut, Download, Upload, X, Check, Activity, ArrowRight,
  Shield, Video, CreditCard, Phone, Wallet, CheckCircle2,
  HeartPulse, Pill, FlaskConical, Clock
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "prescriptions", label: "Prescriptions", icon: FileText },
  { id: "reports", label: "Lab Reports", icon: FlaskConical },
  { id: "abha", label: "ABHA Records", icon: Shield },
  { id: "billing", label: "Billing & Payments", icon: IndianRupee },
  { id: "teleconsult", label: "Teleconsultation", icon: Video },
  { id: "settings", label: "Profile Settings", icon: Settings },
];

const appointments = [
  { id: "1", doctor: "Dr. Maya Patel", spec: "General Medicine", date: "Today, Jun 8", time: "03:40 PM", status: "Active", roomId: "doctor_45_patient_88_2026", type: "Video" },
  { id: "2", doctor: "Dr. Rajesh Sharma", spec: "Cardiology", date: "Jun 10, 2026", time: "10:00 AM", status: "Scheduled", roomId: "doctor_12_patient_88_2026", type: "Video" },
  { id: "3", doctor: "Dr. Aisha Khan", spec: "Pediatrics", date: "May 15, 2026", time: "11:30 AM", status: "Completed", roomId: "doctor_8_patient_88_2026", type: "Video" },
];

const prescriptions = [
  { id: "RX-204", date: "Today", doctor: "Dr. Maya Patel", diagnosis: "Viral URTI with Headache", meds: ["Paracetamol 650mg · Twice daily · 5 days", "Cetirizine 10mg · Once at night · 7 days", "ORS Sachets · As needed · 3 days"], followup: "Jun 15, 2026" },
  { id: "RX-101", date: "May 15, 2026", doctor: "Dr. Aisha Khan", diagnosis: "Allergic Rhinitis", meds: ["Cetirizine 10mg · Once daily", "Fluticasone Nasal Spray · Twice daily"], followup: "Jun 1, 2026" },
];

const labReports = [
  { id: "LR-201", name: "CBC + Malaria Antigen", date: "Today", status: "Processing", doctor: "Dr. Maya Patel", lab: "Apollo Diagnostics" },
  { id: "LR-185", name: "Thyroid Panel (TSH, T3, T4)", date: "May 22, 2026", status: "Ready", doctor: "Dr. Maya Patel", lab: "Medora Lab", file: "ThyroidPanel_PriyaSen.pdf" },
  { id: "LR-150", name: "Blood Panel — Routine", date: "Apr 14, 2026", status: "Ready", doctor: "Dr. Aisha Khan", lab: "Apollo Diagnostics", file: "BloodPanel.pdf" },
];

const abhaRecords = [
  { type: "Consultation", date: "Jun 8, 2026", provider: "Dr. Maya Patel · HealFlow AI", diagnosis: "Viral URTI" },
  { type: "Prescription", date: "Jun 8, 2026", provider: "Dr. Maya Patel · HealFlow AI", diagnosis: "Paracetamol 650mg, Cetirizine 10mg" },
  { type: "Lab Report", date: "May 22, 2026", provider: "Medora Diagnostics", diagnosis: "Thyroid Panel — Normal" },
  { type: "Consultation", date: "May 15, 2026", provider: "Dr. Aisha Khan · HealFlow AI", diagnosis: "Allergic Rhinitis" },
];

const invoices = [
  { id: "INV-2401", date: "Today", service: "OPD Consultation — Dr. Maya Patel", amount: 500, gst: 90, total: 590, status: "Paid", method: "UPI" },
  { id: "INV-2380", date: "May 22, 2026", service: "Lab Tests — Thyroid Panel", amount: 800, gst: 144, total: 944, status: "Paid", method: "Card" },
  { id: "INV-2351", date: "May 15, 2026", service: "Pharmacy — Prescription RX-101", amount: 245, gst: 44, total: 289, status: "Paid", method: "Cash" },
  { id: "INV-2310", date: "Apr 14, 2026", service: "Lab Tests — Blood Panel", amount: 600, gst: 108, total: 708, status: "Pending", method: "UPI" },
];

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [consentStatus, setConsentStatus] = useState<Record<string, boolean>>({ "Apollo": true, "Medora": true, "HealthFirst": false });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedReports, setUploadedReports] = useState(labReports);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "Jane Doe";
  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2);

  const handleLogout = () => { localStorage.clear(); toast.info("Logged out"); navigate("/login"); };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadedReports(prev => [{ id: `LR-${Math.floor(Math.random() * 900 + 200)}`, name: "Uploaded_Report.pdf", date: "Today", status: "Ready", doctor: "Self Uploaded", lab: "External Lab" }, ...prev]);
            toast.success("Report uploaded and shared with your doctor!");
          }, 400);
          return 100;
        }
        return p + 20;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-[#0B1B2B]/30 flex flex-col md:flex-row pt-0">
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-35 md:hidden transition-opacity" 
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border shrink-0 flex flex-col justify-between py-6 transition-transform duration-300 md:translate-x-0 md:static md:h-screen overflow-y-auto scrollbar-hide ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="space-y-5 px-4">
          <div className="flex items-center gap-3 px-2">
            <div className="size-10 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold">{initials}</div>
            <div>
              <p className="font-bold text-sm truncate max-w-[140px]">{userName}</p>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Patient</span>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                    active ? "sidebar-active" : "text-foreground/75 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileOpen(true)} 
              className="md:hidden size-10 rounded-xl border bg-card grid place-items-center hover:bg-muted cursor-pointer shrink-0"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">Welcome, {userName.split(" ")[0]}! <span className="text-xl">👋</span></h1>
              <p className="text-xs text-muted-foreground mt-0.5">HealFlow AI · Your personal health portal · Secure & HIPAA compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <button onClick={() => navigate("/booking")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer hidden sm:flex items-center gap-2"><Calendar className="size-4" /> Book Appointment</button>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative size-9 rounded-lg border bg-card grid place-items-center hover:bg-muted transition cursor-pointer">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-card" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-card/95 backdrop-blur-md shadow-glow p-3 z-30">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b mb-2">Notifications</p>
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-primary/5 border text-xs">
                      <p className="font-semibold text-primary">Join Consultation Room</p>
                      <p className="text-muted-foreground mt-0.5">Video session with Dr. Maya Patel starts in 10 minutes!</p>
                      <button onClick={() => navigate("/doctor/consultation/doctor_45_patient_88_2026")} className="mt-1.5 font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">Join Now <ArrowRight className="size-3" /></button>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
                      <p className="font-semibold text-blue-600">Lab Report Ready</p>
                      <p className="text-muted-foreground mt-0.5">Your Thyroid Panel report is available for download.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="size-9 rounded-lg border bg-gradient-primary text-primary-foreground grid place-items-center font-bold text-xs">{initials}</div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Consultation", val: "1 Live", sub: "Dr. Maya Patel · 03:40 PM", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "Total Appointments", val: "3", sub: "1 today · 1 upcoming · 1 past", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { label: "Prescriptions", val: "2", sub: "Latest: Viral URTI", icon: Pill, color: "text-violet-500", bg: "bg-violet-500/10" },
                  { label: "Lab Reports", val: `${uploadedReports.length}`, sub: "1 processing · 2 ready", icon: FlaskConical, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-card border rounded-2xl p-4 shadow-card card-hover">
                      <div className={`size-9 rounded-xl ${s.bg} grid place-items-center mb-3`}><Icon className={`size-4 ${s.color}`} /></div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{s.label}</p>
                      <p className="text-xl font-bold mt-1">{s.val}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                    </div>
                  );
                })}
              </div>

              {/* Active Consultation Banner */}
              <div className="bg-gradient-primary rounded-3xl p-5 md:p-6 text-primary-foreground shadow-glow flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse">Live Session Ready</span>
                  <h2 className="text-xl md:text-2xl font-bold mt-2">Your Consultation Room Is Open!</h2>
                  <p className="text-sm opacity-90 mt-1">Video session with <b>Dr. Maya Patel</b> · General Medicine · AI-powered telemedicine room</p>
                </div>
                <button onClick={() => navigate("/doctor/consultation/doctor_45_patient_88_2026")}
                  className="bg-white text-primary px-6 h-12 rounded-xl font-bold shadow-soft hover:scale-105 transition flex items-center gap-2 shrink-0 cursor-pointer text-sm">
                  <Activity className="size-4 text-emerald-500 animate-pulse" /> Join Consultation Room
                </button>
              </div>

              {/* Health Summary */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Health Summary</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Blood Group", val: "O Positive", icon: HeartPulse, color: "text-rose-500" },
                      { label: "Allergies", val: "Sulfonamides, Peanuts", icon: AlertTriangle, color: "text-amber-500" },
                      { label: "Chronic Conditions", val: "Allergic Rhinitis", icon: Activity, color: "text-violet-500" },
                      { label: "ABHA ID", val: "91-1234-5678-9012", icon: Shield, color: "text-blue-500" },
                    ].map((h, i) => {
                      const Icon = h.icon;
                      return (
                        <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                          <Icon className={`size-4 ${h.color} shrink-0`} />
                          <div className="flex-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">{h.label}</p>
                            <p className="text-sm font-semibold">{h.val}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Upcoming Appointments</h3>
                  <div className="space-y-3">
                    {appointments.slice(0, 2).map(apt => (
                      <div key={apt.id} className="p-3 border rounded-xl hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-sm">{apt.doctor}</p>
                            <p className="text-xs text-muted-foreground">{apt.spec}</p>
                            <p className="text-xs font-semibold text-primary mt-1">{apt.date} · {apt.time}</p>
                          </div>
                          <span className={apt.status === "Active" ? "badge-active animate-pulse" : "badge-info"}>{apt.status}</span>
                        </div>
                        {apt.status === "Active" && (
                          <button onClick={() => navigate(`/doctor/consultation/${apt.roomId}`)} className="mt-2 w-full h-8 bg-gradient-primary text-primary-foreground rounded-lg font-bold text-xs cursor-pointer">Join Room</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div key="appointments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div><h2 className="text-xl font-bold">My Appointments</h2><p className="text-xs text-muted-foreground mt-0.5">Book, manage and join your consultations</p></div>
                <button onClick={() => navigate("/booking")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2"><Calendar className="size-4" /> Book New</button>
              </div>
              <div className="space-y-4">
                {appointments.map(apt => (
                  <div key={apt.id} className="bg-card border rounded-2xl p-5 shadow-card flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold">{apt.doctor.split(" ")[1]?.[0]}</div>
                      <div>
                        <p className="font-bold">{apt.doctor}</p>
                        <p className="text-sm text-muted-foreground">{apt.spec} · {apt.type}</p>
                        <p className="text-xs font-semibold text-primary mt-1">{apt.date} · {apt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <span className={apt.status === "Active" ? "badge-active animate-pulse" : apt.status === "Scheduled" ? "badge-info" : "badge-pending"}>{apt.status}</span>
                      {apt.status === "Active" && (
                        <button onClick={() => navigate(`/doctor/consultation/${apt.roomId}`)} className="px-4 h-9 bg-gradient-primary text-primary-foreground rounded-xl font-bold text-sm cursor-pointer flex items-center gap-1.5"><Video className="size-4" /> Join</button>
                      )}
                      {apt.status === "Scheduled" && (
                        <div className="flex gap-2">
                          <button onClick={() => toast.success("Reschedule modal")} className="px-3 h-8 border rounded-lg text-xs font-semibold hover:bg-muted cursor-pointer">Reschedule</button>
                          <button onClick={() => toast.error("Appointment cancelled")} className="px-3 h-8 border rounded-lg text-xs font-semibold hover:bg-destructive/10 text-destructive cursor-pointer">Cancel</button>
                        </div>
                      )}
                      {apt.status === "Completed" && (
                        <button onClick={() => setActiveTab("prescriptions")} className="text-xs font-bold text-primary hover:underline cursor-pointer">View Prescription</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "prescriptions" && (
            <motion.div key="prescriptions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">My Prescriptions</h2><p className="text-xs text-muted-foreground mt-0.5">Digital NMC-compliant prescriptions from your doctors</p></div>
              <div className="grid md:grid-cols-2 gap-4">
                {prescriptions.map(pr => (
                  <div key={pr.id} className="bg-card border rounded-2xl p-6 shadow-card card-hover">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{pr.id}</span>
                        <h4 className="font-bold text-lg mt-2">{pr.doctor}</h4>
                        <p className="text-xs text-muted-foreground">{pr.date}</p>
                      </div>
                      <button onClick={() => toast.success(`Downloading ${pr.id} PDF`)} className="size-9 rounded-xl border grid place-items-center hover:bg-muted cursor-pointer"><Download className="size-4 text-primary" /></button>
                    </div>
                    <div className="border-t pt-3 mb-3">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Diagnosis</p>
                      <p className="text-sm font-semibold mt-1">{pr.diagnosis}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Medicines</p>
                      <ul className="space-y-1.5">
                        {pr.meds.map((m, i) => <li key={i} className="text-xs flex gap-2"><CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />{m}</li>)}
                      </ul>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Follow-up</p>
                      <p className="text-xs font-semibold text-primary mt-1">{pr.followup}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => toast.success("Sending to WhatsApp")} className="flex-1 h-9 bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 rounded-xl text-xs font-bold cursor-pointer">WhatsApp</button>
                      <button onClick={() => toast.success("PDF downloaded")} className="flex-1 h-9 border rounded-xl text-xs font-bold hover:bg-muted cursor-pointer">Download PDF</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "reports" && (
            <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Lab Reports</h2><p className="text-xs text-muted-foreground mt-0.5">Your diagnostic test orders and results</p></div>
              <div className="bg-card border rounded-3xl p-8 text-center shadow-card">
                <div className="size-16 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto mb-4"><Upload className="size-8" /></div>
                <h3 className="font-bold text-lg">Upload External Report</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">Share blood panels, X-rays, MRI scans with your doctor. Files are encrypted end-to-end.</p>
                <button onClick={handleUpload} disabled={isUploading} className="mt-5 inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm cursor-pointer hover:opacity-95 disabled:opacity-60">
                  {isUploading ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</> : <><Upload className="size-4" /> Select File</>}
                </button>
                {isUploading && (
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${uploadProgress}%` }} /></div>
                    <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-3">Accepts PDF, PNG, JPG · Max 25MB · 256-bit encrypted</p>
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card space-y-4">
                <h3 className="font-semibold">Your Reports ({uploadedReports.length})</h3>
                {uploadedReports.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold text-xs shrink-0"><FlaskConical className="size-5" /></div>
                      <div>
                        <p className="font-semibold text-sm">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.lab} · {r.date} · {r.doctor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={r.status === "Ready" ? "badge-active" : r.status === "Processing" ? "badge-pending animate-pulse" : "badge-info"}>{r.status}</span>
                      {r.status === "Ready" && <button onClick={() => toast.success(`Downloading ${r.name}`)} className="size-8 rounded-lg border grid place-items-center hover:bg-muted cursor-pointer"><Download className="size-3.5 text-primary" /></button>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "abha" && (
            <motion.div key="abha" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">ABHA Health Records</h2><p className="text-xs text-muted-foreground mt-0.5">Ayushman Bharat Health Account — unified health record system</p></div>
              <div className="bg-gradient-primary rounded-3xl p-6 text-primary-foreground shadow-glow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-xl bg-white/20 grid place-items-center"><Shield className="size-6" /></div>
                  <div>
                    <p className="font-bold text-lg">ABHA Card</p>
                    <p className="text-sm opacity-80">Linked · Active · Verified</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full">LINKED</span>
                </div>
                <p className="font-mono text-2xl tracking-widest font-bold">91-1234-5678-9012</p>
                <p className="text-sm opacity-80 mt-2">{userName} · Last sync: Today</p>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => toast.success("ABHA records fetched from NHA server")} className="px-4 h-9 bg-white text-primary rounded-xl font-bold text-sm cursor-pointer">Fetch Records</button>
                  <button onClick={() => toast.info("Download ABHA card as PDF")} className="px-4 h-9 bg-white/20 text-white rounded-xl font-bold text-sm cursor-pointer">Download Card</button>
                </div>
              </div>

              {/* Consent Management */}
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold mb-4">Consent Management</h3>
                <p className="text-xs text-muted-foreground mb-4">Control which healthcare providers can access your ABHA records</p>
                <div className="space-y-3">
                  {Object.entries(consentStatus).map(([provider, granted]) => (
                    <div key={provider} className="flex items-center justify-between p-3 border rounded-xl">
                      <div>
                        <p className="font-semibold text-sm">{provider} Healthcare</p>
                        <p className="text-xs text-muted-foreground">Record access · {granted ? "Active consent" : "Access denied"}</p>
                      </div>
                      <button
                        onClick={() => { setConsentStatus(c => ({ ...c, [provider]: !c[provider] })); toast.success(`Consent ${!consentStatus[provider] ? "granted" : "revoked"} for ${provider}`); }}
                        className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${granted ? "bg-emerald-500" : "bg-muted border"}`}
                      >
                        <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${granted ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Timeline */}
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold mb-6">Health Records Timeline</h3>
                <div className="space-y-0">
                  {abhaRecords.map((r, i) => (
                    <div key={i} className="timeline-item pb-6">
                      <div className="timeline-dot" />
                      <div className="ml-1">
                        <p className="text-[10px] text-muted-foreground font-mono">{r.date}</p>
                        <p className="font-bold text-sm mt-0.5">{r.type}</p>
                        <p className="text-xs text-muted-foreground">{r.provider}</p>
                        <p className="text-xs text-foreground/70 mt-0.5">{r.diagnosis}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Billing & Payments</h2><p className="text-xs text-muted-foreground mt-0.5">View invoices, outstanding payments and transaction history</p></div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Total Paid", val: "₹2,531.70", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "Outstanding", val: "₹708", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                  { label: "Total Invoices", val: invoices.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-card border rounded-2xl p-5 shadow-card card-hover">
                      <div className={`size-10 rounded-xl ${s.bg} grid place-items-center mb-3`}><Icon className={`size-5 ${s.color}`} /></div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{s.label}</p>
                      <p className="text-2xl font-bold mt-1">{s.val}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card space-y-3">
                <h3 className="font-semibold mb-2">Invoice History</h3>
                {invoices.map(inv => (
                  <div key={inv.id} className="flex justify-between items-center p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-bold text-sm">{inv.service}</p>
                      <p className="text-xs text-muted-foreground">{inv.date} · Paid via {inv.method}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{inv.id} · GST: ₹{inv.gst}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{inv.total}</p>
                      <span className={inv.status === "Paid" ? "badge-active" : "badge-error"}>{inv.status}</span>
                      <div className="mt-1 flex gap-2 justify-end">
                        {inv.status === "Pending" && <button onClick={() => toast.success("Redirecting to payment gateway")} className="text-[10px] font-bold text-primary hover:underline cursor-pointer">Pay Now</button>}
                        <button onClick={() => toast.success(`Downloading ${inv.id}`)} className="text-[10px] font-bold text-muted-foreground hover:text-primary hover:underline cursor-pointer">PDF</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "teleconsult" && (
            <motion.div key="teleconsult" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Teleconsultation</h2><p className="text-xs text-muted-foreground mt-0.5">Join video consultations and view your telemedicine history</p></div>
              <div className="space-y-4">
                {appointments.map(apt => (
                  <div key={apt.id} className="bg-card border rounded-2xl p-5 shadow-card flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center"><Video className="size-6" /></div>
                      <div>
                        <p className="font-bold">{apt.doctor}</p>
                        <p className="text-sm text-muted-foreground">{apt.spec} · {apt.type}</p>
                        <p className="text-xs font-semibold text-primary mt-1">{apt.date} · {apt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={apt.status === "Active" ? "badge-active animate-pulse" : apt.status === "Scheduled" ? "badge-info" : "badge-pending"}>{apt.status}</span>
                      <button onClick={() => navigate(`/doctor/consultation/${apt.roomId}`)} className="px-4 h-9 bg-gradient-primary text-primary-foreground rounded-xl font-bold text-sm cursor-pointer flex items-center gap-2"><Video className="size-4" /> {apt.status === "Active" ? "Join Now" : "Revisit Room"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Profile Settings</h2><p className="text-xs text-muted-foreground mt-0.5">Manage your health profile and account preferences</p></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-3xl p-6 shadow-card space-y-4">
                  <h3 className="font-semibold">Personal Information</h3>
                  {[
                    { label: "Full Name", val: userName },
                    { label: "Email", val: "patient@example.com" },
                    { label: "Phone", val: "+91 98765 43210" },
                    { label: "Date of Birth", val: "1998-04-15" },
                    { label: "Blood Group", val: "O Positive" },
                    { label: "Emergency Contact", val: "+91 99999 88888" },
                  ].map((s, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</label>
                      <input type="text" defaultValue={s.val} className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                  ))}
                  <button onClick={() => toast.success("Profile saved!")} className="w-full h-12 bg-gradient-primary text-primary-foreground font-bold rounded-xl cursor-pointer text-sm">Save Changes</button>
                </div>
                <div className="bg-card border rounded-3xl p-6 shadow-card space-y-4">
                  <h3 className="font-semibold">Medical History</h3>
                  {[
                    { label: "Allergies", val: "Sulfonamides, Peanuts" },
                    { label: "Chronic Conditions", val: "Allergic Rhinitis" },
                    { label: "Current Medications", val: "None" },
                    { label: "Past Surgeries", val: "Appendectomy (2019)" },
                    { label: "Insurance Policy", val: "SBI-HEALTH-12345678" },
                  ].map((s, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</label>
                      <input type="text" defaultValue={s.val} className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                  ))}
                  <button onClick={() => toast.success("Medical history updated!")} className="w-full h-12 bg-gradient-primary text-primary-foreground font-bold rounded-xl cursor-pointer text-sm">Save Medical History</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}
