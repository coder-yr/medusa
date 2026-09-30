import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Calendar, IndianRupee, Settings, Bell, Search, Menu,
  LogOut, FileText, Activity, Brain, Stethoscope, FlaskConical, Shield,
  PlayCircle, ArrowRight, Clock, Plus, ChevronRight, Download, Mic,
  MessageSquare, Sparkles, HeartPulse, Pill, AlertTriangle, CheckCircle2,
  TrendingUp, Video, Edit3, Eye
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "sonner";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "My Patients", icon: Users },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "emr", label: "EMR / EHR", icon: FileText },
  { id: "prescriptions", label: "Prescriptions", icon: Pill },
  { id: "lab", label: "Lab Reports", icon: FlaskConical },
  { id: "abha", label: "ABHA Records", icon: Shield },
  { id: "teleconsult", label: "Video Consults", icon: Video },
  { id: "ai", label: "AI Assistant", icon: Brain },
  { id: "earnings", label: "Earnings", icon: IndianRupee },
];

const earningsData = [
  { week: "W1", amount: 12500 }, { week: "W2", amount: 18000 }, { week: "W3", amount: 15500 },
  { week: "W4", amount: 22000 }, { week: "W5", amount: 19800 }, { week: "W6", amount: 24500 },
];

const patients = [
  { id: "P-88", name: "Jane Doe", age: "28", sex: "Female", phone: "+91 98765 43210", blood: "O+", lastVisit: "Today", condition: "Fever & Headache", abha: "91-1234-5678-9012" },
  { id: "P-12", name: "Rahul Gupta", age: "42", sex: "Male", phone: "+91 99887 76655", blood: "B+", lastVisit: "May 10, 2026", condition: "Cardiac Follow-up", abha: "91-2345-6789-0123" },
  { id: "P-19", name: "Priya Sen", age: "31", sex: "Female", phone: "+91 88776 65544", blood: "A-", lastVisit: "May 2, 2026", condition: "Thyroid Review", abha: "91-3456-7890-1234" },
  { id: "P-55", name: "Arjun Mehta", age: "55", sex: "Male", phone: "+91 77665 54433", blood: "AB+", lastVisit: "Apr 28, 2026", condition: "Diabetes Management", abha: "91-4567-8901-2345" },
];

const appointments = [
  { id: "1", patient: "Jane Doe", age: "28 yrs", time: "03:40 PM", date: "Today", status: "Active", reason: "Fever & severe headache", roomId: "doctor_45_patient_88_2026", type: "Video" },
  { id: "2", patient: "Rahul Gupta", age: "42 yrs", time: "04:30 PM", date: "Today", status: "Scheduled", reason: "Follow-up on ECG report", roomId: "doctor_45_patient_12_2026", type: "Video" },
  { id: "3", patient: "Priya Sen", age: "31 yrs", time: "05:15 PM", date: "Today", status: "Scheduled", reason: "Fatigue & thyroid review", roomId: "doctor_45_patient_19_2026", type: "Walk-in" },
  { id: "4", patient: "Arjun Mehta", age: "55 yrs", time: "10:00 AM", date: "Jun 10", status: "Upcoming", reason: "Diabetes & BP check", roomId: "doctor_45_patient_55_2026", type: "Video" },
];

const labReports = [
  { id: "LR-201", patient: "Jane Doe", test: "Complete Blood Count (CBC)", ordered: "Today", status: "Pending", priority: "Urgent" },
  { id: "LR-198", patient: "Rahul Gupta", test: "Lipid Profile + ECG", ordered: "May 28", status: "Ready", priority: "Normal" },
  { id: "LR-185", patient: "Priya Sen", test: "Thyroid Panel (T3, T4, TSH)", ordered: "May 22", status: "Reviewed", priority: "Normal" },
];

const emrTimeline = [
  { date: "Today, 15:30", event: "Consultation", detail: "Video call · Fever & headache · Jane Doe", color: "bg-blue-500" },
  { date: "Today, 15:45", event: "Prescription Issued", detail: "Paracetamol 650mg, Cetirizine 10mg · 5 days", color: "bg-violet-500" },
  { date: "Today, 16:00", event: "Lab Order", detail: "CBC + Malaria Panel ordered at Apollo Lab", color: "bg-amber-500" },
  { date: "May 15, 2026", event: "Follow-up Done", detail: "Allergic rhinitis resolved · Case closed", color: "bg-emerald-500" },
  { date: "Apr 02, 2026", event: "First Consultation", detail: "Acute Pharyngitis · Dr. Maya Patel", color: "bg-teal-500" },
];

const abhaRecords = [
  { id: "ABHA-001", patient: "Jane Doe", abhaId: "91-1234-5678-9012", linked: "Yes", lastSync: "Today", records: 8, consent: "Granted" },
  { id: "ABHA-002", patient: "Rahul Gupta", abhaId: "91-2345-6789-0123", linked: "Yes", lastSync: "May 28", records: 24, consent: "Granted" },
  { id: "ABHA-003", patient: "Priya Sen", abhaId: "91-3456-7890-1234", linked: "Yes", lastSync: "May 20", records: 12, consent: "Pending" },
];

const aiSuggestions = [
  { med: "Paracetamol 650mg", dose: "Twice daily after meals", duration: "5 days", reason: "Fever management" },
  { med: "Cetirizine 10mg", dose: "Once at bedtime", duration: "7 days", reason: "Allergic component" },
  { med: "ORS Sachets", dose: "As needed with water", duration: "3 days", reason: "Hydration support" },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [aiScribeActive, setAiScribeActive] = useState(false);
  const [scribeText, setScribeText] = useState("");
  const [aiSuggestionsApproved, setAiSuggestionsApproved] = useState<boolean[]>([false, false, false]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "Dr. Maya Patel";

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const handleAiScribe = () => {
    setAiScribeActive(true);
    setTimeout(() => {
      setScribeText("Patient presents with fever (38.8°C) since 2 days, associated with severe frontal headache, mild rhinorrhea, and fatigue. No vomiting. No history of malaria. No known drug allergies. On examination: Throat mildly congested. No lymphadenopathy. Vitals stable. Impression: Viral URTI with headache.");
      setAiScribeActive(false);
      toast.success("AI Scribe transcription complete!");
    }, 2500);
  };

  const approveAiSuggestion = (idx: number) => {
    const updated = [...aiSuggestionsApproved];
    updated[idx] = true;
    setAiSuggestionsApproved(updated);
    toast.success(`${aiSuggestions[idx].med} added to prescription`);
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
            <div className="size-10 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold text-sm">
              {userName.split(" ").filter((_, i) => i > 0).map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-sm text-foreground leading-tight truncate max-w-[140px]">{userName}</p>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Doctor</span>
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
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-4 mt-4">
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
              <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">Hello, {userName}! <span className="text-xl">🩺</span></h1>
              <p className="text-xs text-muted-foreground mt-0.5">HealFlow AI · Doctor Workspace · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input type="text" placeholder="Search patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-48 h-9 pl-9 rounded-lg border bg-card text-xs outline-none focus:ring-1 ring-primary/40 focus:w-60 transition-all" />
            </div>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative size-9 rounded-lg border bg-card grid place-items-center hover:bg-muted transition cursor-pointer">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-card" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-card/95 backdrop-blur-md shadow-glow p-3 z-30">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b mb-2">Doctor Alerts</p>
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                      <p className="font-semibold text-emerald-600">Patient Joined Room</p>
                      <p className="text-muted-foreground mt-0.5">Jane Doe is waiting in the video session room.</p>
                      <button onClick={() => navigate("/doctor/consultation/doctor_45_patient_88_2026")} className="mt-1.5 font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer">Enter Room <PlayCircle className="size-3" /></button>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                      <p className="font-semibold text-amber-600">Lab Report Ready</p>
                      <p className="text-muted-foreground mt-0.5">Rahul Gupta's Lipid Profile report is available.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="size-9 rounded-lg border bg-gradient-primary text-primary-foreground grid place-items-center font-bold text-xs">MP</div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* ─── DASHBOARD ─── */}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Today's Consults", val: "3", sub: "1 Active · 2 Scheduled", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { label: "Total Patients", val: "148", sub: "Digital records stored", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "Pending Lab Reports", val: "1", sub: "CBC for Jane Doe", icon: FlaskConical, color: "text-amber-500", bg: "bg-amber-500/10" },
                  { label: "Monthly Revenue", val: "₹1,24,000", sub: "June 2026 · 84 consults", icon: IndianRupee, color: "text-violet-500", bg: "bg-violet-500/10" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-card border rounded-2xl p-4 shadow-card card-hover">
                      <div className={`size-9 rounded-xl ${s.bg} grid place-items-center mb-3`}><Icon className={`size-4 ${s.color}`} /></div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{s.label}</p>
                      <p className="text-2xl font-bold mt-1">{s.val}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                    </div>
                  );
                })}
              </div>

              {/* Active Consultation Banner */}
              <div className="bg-gradient-primary rounded-3xl p-5 md:p-6 text-primary-foreground shadow-glow flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse">Live Session</span>
                  <h2 className="text-xl md:text-2xl font-bold mt-2">Jane Doe is waiting in your consultation room</h2>
                  <p className="text-sm opacity-90 mt-1">Video call · Whiteboard · AI Scribe · Prescription builder — all ready</p>
                </div>
                <button onClick={() => navigate("/doctor/consultation/doctor_45_patient_88_2026")}
                  className="bg-white text-primary px-6 h-12 rounded-xl font-bold shadow-soft hover:scale-105 transition flex items-center gap-2 shrink-0 cursor-pointer text-sm">
                  <PlayCircle className="size-4 text-emerald-500" /> Join Consultation Room
                </button>
              </div>

              {/* Quick Actions + Appointments */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl border bg-gradient-to-br from-primary/10 to-primary/5 shadow-card flex flex-col justify-between h-44 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 size-20 rounded-full bg-primary/20 blur-2xl group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] font-bold text-primary bg-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">AI Scribe</span>
                    <h3 className="font-bold text-base mt-3">Start AI Medical Scribe</h3>
                    <p className="text-xs text-muted-foreground mt-1">Voice-to-clinical-notes powered by AI</p>
                  </div>
                  <button onClick={() => setActiveTab("ai")} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer">Open AI Panel <ArrowRight className="size-3.5" /></button>
                </div>

                <div className="p-5 rounded-3xl border bg-card shadow-card flex flex-col justify-between h-44 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 size-20 rounded-full bg-emerald-500/10 blur-2xl group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Prescriptions</span>
                    <h3 className="font-bold text-base mt-3">NMC Prescription Builder</h3>
                    <p className="text-xs text-muted-foreground mt-1">Generate & share compliant Rx digitally</p>
                  </div>
                  <button onClick={() => navigate("/doctor/prescription")} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline cursor-pointer">Open Builder <ArrowRight className="size-3.5" /></button>
                </div>

                <div className="p-5 rounded-3xl border bg-card shadow-card flex flex-col justify-between h-44 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 size-20 rounded-full bg-amber-500/10 blur-2xl group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Lab Orders</span>
                    <h3 className="font-bold text-base mt-3">Lab Report Review</h3>
                    <p className="text-xs text-muted-foreground mt-1">1 pending CBC report ready for review</p>
                  </div>
                  <button onClick={() => setActiveTab("lab")} className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline cursor-pointer">View Reports <ArrowRight className="size-3.5" /></button>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-semibold text-lg">Today's Appointment Schedule</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Click "Launch Room" to begin video consultation</p>
                  </div>
                  <button onClick={() => setActiveTab("appointments")} className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">View All <ChevronRight className="size-3.5" /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                        <th className="pb-3 pr-4">Patient</th>
                        <th className="pb-3 px-4">Time</th>
                        <th className="pb-3 px-4">Reason</th>
                        <th className="pb-3 px-4">Type</th>
                        <th className="pb-3 px-4 text-center">Status</th>
                        <th className="pb-3 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {appointments.filter(a => a.date === "Today").map(apt => (
                        <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-xs">{apt.patient.charAt(0)}</div>
                              <div><p className="font-bold">{apt.patient}</p><p className="text-[10px] text-muted-foreground">{apt.age}</p></div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-primary">{apt.time}</td>
                          <td className="py-4 px-4 text-muted-foreground text-xs max-w-[160px] truncate">{apt.reason}</td>
                          <td className="py-4 px-4"><span className="badge-info">{apt.type}</span></td>
                          <td className="py-4 px-4 text-center">
                            <span className={apt.status === "Active" ? "badge-active animate-pulse" : "badge-info"}>{apt.status}</span>
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <button onClick={() => navigate(`/doctor/consultation/${apt.roomId}`)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-soft transition cursor-pointer ${apt.status === "Active" ? "bg-gradient-primary text-primary-foreground" : "border hover:bg-muted"}`}>
                              <PlayCircle className="size-3.5" /> Launch Room
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── PATIENTS ─── */}
          {activeTab === "patients" && (
            <motion.div key="patients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div><h2 className="text-xl font-bold">My Patients</h2><p className="text-xs text-muted-foreground mt-0.5">Complete patient registry with digital health records</p></div>
                <button onClick={() => toast.success("Patient registration — use receptionist portal")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2"><Plus className="size-4" /> Add Patient</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {patients.map(p => (
                  <div key={p.id} className="bg-card border rounded-2xl p-5 shadow-card card-hover">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold text-lg">{p.name.charAt(0)}</div>
                        <div>
                          <p className="font-bold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.sex} · {p.age} yrs · Blood: {p.blood}</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{p.id}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">ABHA Linked</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div><p className="text-muted-foreground">Phone</p><p className="font-semibold mt-0.5">{p.phone}</p></div>
                      <div><p className="text-muted-foreground">Last Visit</p><p className="font-semibold mt-0.5">{p.lastVisit}</p></div>
                      <div className="col-span-2"><p className="text-muted-foreground">Current Condition</p><p className="font-semibold mt-0.5">{p.condition}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setActiveTab("emr")} className="flex-1 h-9 border rounded-xl text-xs font-bold hover:bg-muted cursor-pointer flex items-center justify-center gap-1"><Eye className="size-3.5" /> View EMR</button>
                      <button onClick={() => navigate("/doctor/prescription")} className="flex-1 h-9 bg-gradient-primary text-primary-foreground rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1"><Edit3 className="size-3.5" /> New Rx</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── APPOINTMENTS ─── */}
          {activeTab === "appointments" && (
            <motion.div key="appointments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div><h2 className="text-xl font-bold">Appointment Management</h2><p className="text-xs text-muted-foreground mt-0.5">All scheduled consultations — video, walk-in & upcoming</p></div>
                <button onClick={() => navigate("/doctor/calendar")} className="px-4 h-9 border rounded-xl text-sm font-semibold hover:bg-muted cursor-pointer flex items-center gap-2"><Calendar className="size-4" /> Calendar View</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {appointments.map(apt => (
                  <div key={apt.id} className="bg-card border rounded-2xl p-5 shadow-card card-hover space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-primary">{apt.date} · {apt.time}</p>
                        <h4 className="font-bold mt-1">{apt.patient}</h4>
                        <p className="text-[10px] text-muted-foreground">Age: {apt.age} · {apt.type}</p>
                      </div>
                      <span className={apt.status === "Active" ? "badge-active animate-pulse" : apt.status === "Scheduled" ? "badge-info" : "badge-pending"}>{apt.status}</span>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Reason</p>
                      <p className="text-xs font-medium mt-1">{apt.reason}</p>
                    </div>
                    <button onClick={() => navigate(`/doctor/consultation/${apt.roomId}`)}
                      className="w-full h-10 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs shadow-soft hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5">
                      <PlayCircle className="size-4" /> Launch Consultation Room
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── EMR / EHR ─── */}
          {activeTab === "emr" && (
            <motion.div key="emr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Electronic Medical Records (EMR)</h2><p className="text-xs text-muted-foreground mt-0.5">Complete patient health timeline — consultation to follow-up</p></div>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Patient Summary — Jane Doe</h3>
                  {[
                    { label: "Age / Gender", val: "28 yrs · Female" },
                    { label: "Blood Group", val: "O Positive" },
                    { label: "Allergies", val: "Sulfonamides, Peanuts" },
                    { label: "Chronic Conditions", val: "Allergic Rhinitis" },
                    { label: "Current Vitals", val: "BP: 118/76 · HR: 88 · Temp: 38.8°C" },
                    { label: "ABHA ID", val: "91-1234-5678-9012" },
                  ].map((item, i) => (
                    <div key={i} className="py-2.5 border-b last:border-0">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold mt-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-2 bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-6">Clinical History Timeline</h3>
                  <div className="space-y-0">
                    {emrTimeline.map((item, i) => (
                      <div key={i} className="timeline-item pb-6">
                        <div className={`timeline-dot ${item.color}`} />
                        <div className="ml-1">
                          <p className="text-[10px] text-muted-foreground font-mono">{item.date}</p>
                          <p className="font-bold text-sm mt-0.5">{item.event}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── PRESCRIPTIONS ─── */}
          {activeTab === "prescriptions" && (
            <motion.div key="prescriptions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div><h2 className="text-xl font-bold">Prescription Management</h2><p className="text-xs text-muted-foreground mt-0.5">NMC-compliant digital prescriptions with PDF & WhatsApp sharing</p></div>
                <button onClick={() => navigate("/doctor/prescription")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2"><Plus className="size-4" /> New Prescription</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { id: "RX-204", patient: "Jane Doe", date: "Today", diagnosis: "Viral URTI with Headache", meds: ["Paracetamol 650mg · Twice daily · 5 days", "Cetirizine 10mg · Once at night · 7 days", "ORS Sachets · As needed"] },
                  { id: "RX-198", patient: "Rahul Gupta", date: "May 10, 2026", diagnosis: "Stable Angina — Post ECG Review", meds: ["Aspirin 75mg · Once daily after breakfast", "Atenolol 50mg · Once daily morning", "Nitroglycerine sublingual · PRN"] },
                ].map(rx => (
                  <div key={rx.id} className="bg-card border rounded-2xl p-5 shadow-card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{rx.id}</span>
                        <h4 className="font-bold mt-2">{rx.patient}</h4>
                        <p className="text-xs text-muted-foreground">{rx.date}</p>
                      </div>
                      <button onClick={() => toast.success(`Downloading ${rx.id} as PDF`)} className="size-9 rounded-xl border grid place-items-center hover:bg-muted cursor-pointer"><Download className="size-4 text-primary" /></button>
                    </div>
                    <div className="border-t pt-3 mb-3">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Diagnosis</p>
                      <p className="text-sm font-semibold mt-1">{rx.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Medicines</p>
                      <ul className="space-y-1.5">
                        {rx.meds.map((m, i) => <li key={i} className="text-xs flex gap-2"><CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />{m}</li>)}
                      </ul>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => toast.success("Sending via WhatsApp...")} className="flex-1 h-9 bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-500/20 transition">WhatsApp Share</button>
                      <button onClick={() => toast.success(`PDF generated for ${rx.id}`)} className="flex-1 h-9 border rounded-xl text-xs font-bold hover:bg-muted cursor-pointer">Download PDF</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── LAB REPORTS ─── */}
          {activeTab === "lab" && (
            <motion.div key="lab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Lab Orders & Reports</h2><p className="text-xs text-muted-foreground mt-0.5">Review and manage diagnostic test orders and results</p></div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Order ID</th>
                      <th className="pb-3 px-4">Patient</th>
                      <th className="pb-3 px-4">Test Ordered</th>
                      <th className="pb-3 px-4">Date Ordered</th>
                      <th className="pb-3 px-4">Priority</th>
                      <th className="pb-3 px-4 text-center">Status</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {labReports.map(lr => (
                      <tr key={lr.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 pr-4 font-mono text-xs text-muted-foreground">{lr.id}</td>
                        <td className="py-4 px-4 font-bold">{lr.patient}</td>
                        <td className="py-4 px-4 text-muted-foreground text-xs">{lr.test}</td>
                        <td className="py-4 px-4 text-muted-foreground">{lr.ordered}</td>
                        <td className="py-4 px-4"><span className={lr.priority === "Urgent" ? "badge-error" : "badge-info"}>{lr.priority}</span></td>
                        <td className="py-4 px-4 text-center"><span className={lr.status === "Ready" ? "badge-active" : lr.status === "Reviewed" ? "badge-info" : "badge-pending"}>{lr.status}</span></td>
                        <td className="py-4 pl-4 text-right">
                          <button onClick={() => toast.success(`Viewing report ${lr.id}`)} className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold hover:bg-muted cursor-pointer">{lr.status === "Ready" ? "Review Report" : "View"}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── ABHA RECORDS ─── */}
          {activeTab === "abha" && (
            <motion.div key="abha" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">ABHA Health Records</h2><p className="text-xs text-muted-foreground mt-0.5">Ayushman Bharat Health Account integration — patient consent & records</p></div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Patient</th>
                      <th className="pb-3 px-4">ABHA ID</th>
                      <th className="pb-3 px-4">Records</th>
                      <th className="pb-3 px-4">Last Sync</th>
                      <th className="pb-3 px-4 text-center">Consent</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {abhaRecords.map(r => (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 pr-4 font-bold">{r.patient}</td>
                        <td className="py-4 px-4 font-mono text-xs text-primary">{r.abhaId}</td>
                        <td className="py-4 px-4 font-semibold">{r.records} records</td>
                        <td className="py-4 px-4 text-muted-foreground">{r.lastSync}</td>
                        <td className="py-4 px-4 text-center"><span className={r.consent === "Granted" ? "badge-active" : "badge-pending"}>{r.consent}</span></td>
                        <td className="py-4 pl-4 text-right">
                          <button onClick={() => toast.success(`Fetching ABHA records for ${r.patient}`)} className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold hover:bg-muted cursor-pointer">Fetch Records</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── VIDEO CONSULTS ─── */}
          {activeTab === "teleconsult" && (
            <motion.div key="teleconsult" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Video Consultation History</h2><p className="text-xs text-muted-foreground mt-0.5">Telemedicine sessions — WebRTC powered secure video calls</p></div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map(apt => (
                  <div key={apt.id} className="bg-card border rounded-2xl p-5 shadow-card card-hover">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-3"><Video className="size-5" /></div>
                    <p className="font-bold">{apt.patient}</p>
                    <p className="text-xs text-muted-foreground">{apt.date} · {apt.time}</p>
                    <p className="text-xs mt-2 text-muted-foreground">{apt.reason}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className={apt.status === "Active" ? "badge-active animate-pulse" : "badge-info"}>{apt.status}</span>
                      <button onClick={() => navigate(`/doctor/consultation/${apt.roomId}`)} className="px-3 h-8 bg-gradient-primary text-primary-foreground rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"><PlayCircle className="size-3.5" /> Join</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── AI ASSISTANT ─── */}
          {activeTab === "ai" && (
            <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">AI Medical Assistant</h2><p className="text-xs text-muted-foreground mt-0.5">AI Scribe · Prescription Suggestions · Report Analyzer · Follow-up Automation</p></div>

              {/* AI Scribe */}
              <div className="ai-panel rounded-3xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-primary/20 text-primary grid place-items-center"><Mic className="size-5" /></div>
                  <div>
                    <h3 className="font-bold">AI Medical Scribe</h3>
                    <p className="text-xs text-muted-foreground">Speak naturally — AI generates structured clinical notes</p>
                  </div>
                  <button onClick={handleAiScribe} disabled={aiScribeActive}
                    className="ml-auto px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2 disabled:opacity-70">
                    {aiScribeActive ? <><div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Listening...</> : <><Mic className="size-3.5" /> Start Scribe</>}
                  </button>
                </div>
                {scribeText && (
                  <div className="bg-card/80 rounded-2xl p-4 border">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">AI-Generated Clinical Notes</p>
                    <p className="text-sm leading-relaxed">{scribeText}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => toast.success("Notes saved to EMR")} className="px-3 h-8 bg-gradient-primary text-primary-foreground rounded-lg text-xs font-bold cursor-pointer">Save to EMR</button>
                      <button onClick={() => setScribeText("")} className="px-3 h-8 border rounded-lg text-xs font-semibold hover:bg-muted cursor-pointer">Clear</button>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Prescription Suggestions */}
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-violet-500/10 text-violet-600 grid place-items-center"><Sparkles className="size-5" /></div>
                  <div>
                    <h3 className="font-bold">AI Prescription Assistant</h3>
                    <p className="text-xs text-muted-foreground">Suggested medications for Viral URTI — requires your approval</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {aiSuggestions.map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${aiSuggestionsApproved[i] ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/30"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm">{s.med}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{s.dose} · {s.duration}</p>
                          <p className="text-xs text-primary mt-1">Reason: {s.reason}</p>
                        </div>
                        {aiSuggestionsApproved[i] ? (
                          <span className="badge-active flex items-center gap-1"><CheckCircle2 className="size-3" /> Approved</span>
                        ) : (
                          <button onClick={() => approveAiSuggestion(i)} className="px-3 h-8 bg-gradient-primary text-primary-foreground rounded-lg text-xs font-bold cursor-pointer">Approve</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {aiSuggestionsApproved.every(Boolean) && (
                  <button onClick={() => navigate("/doctor/prescription")} className="mt-4 w-full h-10 bg-gradient-primary text-primary-foreground rounded-xl font-bold text-sm cursor-pointer flex items-center justify-center gap-2">
                    <Edit3 className="size-4" /> Generate Full Prescription
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── EARNINGS ─── */}
          {activeTab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Earnings Overview</h2><p className="text-xs text-muted-foreground mt-0.5">Consultation revenue, payouts and financial analytics</p></div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Today's Revenue", val: "₹4,500", icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "This Month", val: "₹1,24,000", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { label: "Total Consultations", val: "354", icon: Stethoscope, color: "text-violet-500", bg: "bg-violet-500/10" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-card border rounded-2xl p-5 shadow-card card-hover">
                      <div className={`size-10 rounded-xl ${s.bg} grid place-items-center mb-3`}><Icon className={`size-5 ${s.color}`} /></div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{s.label}</p>
                      <p className="text-3xl font-bold mt-1">{s.val}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold mb-4">Weekly Earnings (Last 6 Weeks)</h3>
                <div className="chart-container h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                      <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v: any) => [`₹${(v/1000).toFixed(1)}K`, "Earnings"]} />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
