import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Stethoscope, IndianRupee, Settings, Bell, Search, Menu,
  LogOut, ShieldAlert, Activity, Building2, ClipboardList, BarChart3,
  Plug, FileText, Shield, TrendingUp, TrendingDown, ArrowUpRight,
  Check, X, CheckCircle2, AlertTriangle, Clock, Star, ChevronRight,
  Hospital, Globe, Zap, Database
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const revenueData = [
  { month: "Jan", revenue: 285000, consultations: 210 },
  { month: "Feb", revenue: 320000, consultations: 245 },
  { month: "Mar", revenue: 298000, consultations: 228 },
  { month: "Apr", revenue: 385000, consultations: 295 },
  { month: "May", revenue: 428000, consultations: 354 },
  { month: "Jun", revenue: 512000, consultations: 401 },
];

const doctorPerf = [
  { name: "Dr. Maya", consultations: 84, rating: 4.9 },
  { name: "Dr. Rajesh", consultations: 112, rating: 5.0 },
  { name: "Dr. Priya", consultations: 67, rating: 4.7 },
  { name: "Dr. Aisha", consultations: 91, rating: 4.8 },
];

const auditLogs = [
  { id: "AL-001", user: "Dr. Maya Patel", role: "Doctor", action: "Prescription Created", patient: "Jane Doe", ip: "192.168.1.45", time: "Today, 15:42:08" },
  { id: "AL-002", user: "Priya Sharma", role: "Receptionist", action: "Patient Registered", patient: "Ravi Kumar", ip: "192.168.1.12", time: "Today, 14:30:21" },
  { id: "AL-003", user: "Jane Doe", role: "Patient", action: "Record Accessed", patient: "Self", ip: "103.45.67.88", time: "Today, 13:15:05" },
  { id: "AL-004", user: "Rahul Verma", role: "Lab Tech", action: "Report Uploaded", patient: "Priya Sen", ip: "192.168.1.77", time: "Today, 12:00:44" },
  { id: "AL-005", user: "Admin Portal", role: "Admin", action: "Doctor Approved", patient: "N/A", ip: "192.168.1.1", time: "Today, 10:30:00" },
];

const hospitals = [
  { id: "H-01", name: "Apollo Multi-Specialty Hospital", city: "Mumbai", beds: 450, doctors: 68, status: "Active", plan: "Enterprise" },
  { id: "H-02", name: "Medora Diagnostic Center", city: "Pune", beds: 0, doctors: 12, status: "Active", plan: "Clinic Pro" },
  { id: "H-03", name: "HealthFirst Polyclinic", city: "Delhi", beds: 80, doctors: 24, status: "Active", plan: "Polyclinic" },
  { id: "H-04", name: "City Care Hospital", city: "Bangalore", beds: 200, doctors: 41, status: "Pending", plan: "Hospital" },
];

const integrations = [
  { name: "ABHA / NHA Gateway", desc: "Ayushman Bharat Health Account API", status: "Connected", icon: Shield },
  { name: "WhatsApp Business API", desc: "Meta Cloud API v18.0", status: "Connected", icon: Globe },
  { name: "Razorpay Payment Gateway", desc: "UPI, Cards, Net Banking", status: "Connected", icon: IndianRupee },
  { name: "AWS S3 Storage", desc: "Reports, prescriptions, media files", status: "Connected", icon: Database },
  { name: "Twilio Video (WebRTC)", desc: "Telemedicine video sessions", status: "Connected", icon: Activity },
  { name: "MSG91 SMS Gateway", desc: "OTP & notification delivery", status: "Warning", icon: Zap },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const navItems = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "hospitals", label: "Hospitals & Clinics", icon: Hospital },
  { id: "doctors", label: "Manage Doctors", icon: Stethoscope },
  { id: "staff", label: "Staff & Roles", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "billing", label: "Revenue & Plans", icon: IndianRupee },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "nabh", label: "NABH Compliance", icon: Shield },
  { id: "audit", label: "Audit Logs", icon: FileText },
  { id: "settings", label: "System Settings", icon: Settings },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [doctorsList, setDoctorsList] = useState([
    { id: "D-201", name: "Dr. Maya Patel", spec: "General Medicine", status: "Active", experience: "12 yrs", rating: "4.9", consultations: "84", nmc: "MCI-45821" },
    { id: "D-202", name: "Dr. Rajesh Sharma", spec: "Cardiology", status: "Active", experience: "18 yrs", rating: "5.0", consultations: "112", nmc: "MCI-33921" },
    { id: "D-203", name: "Dr. Priya Nair", spec: "Neurology", status: "Pending Approval", experience: "11 yrs", rating: "N/A", consultations: "0", nmc: "MCI-78234" },
    { id: "D-204", name: "Dr. Aisha Khan", spec: "Pediatrics", status: "Active", experience: "9 yrs", rating: "4.8", consultations: "91", nmc: "MCI-56789" },
  ]);

  const [staffList] = useState([
    { id: "S-01", name: "Priya Sharma", role: "Receptionist", email: "priya@healflow.ai", status: "Active", since: "Jan 2026" },
    { id: "S-02", name: "Rahul Verma", role: "Lab Technician", email: "rahul@healflow.ai", status: "Active", since: "Feb 2026" },
    { id: "S-03", name: "Anjali Singh", role: "Pharmacist", email: "anjali@healflow.ai", status: "Active", since: "Mar 2026" },
    { id: "S-04", name: "Suresh Babu", role: "Receptionist", email: "suresh@healflow.ai", status: "Inactive", since: "Apr 2026" },
  ]);

  const userName = localStorage.getItem("userName") || "Admin Portal";

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const handleDoctorApprove = (id: string, name: string) => {
    setDoctorsList(doctorsList.map(doc => doc.id === id ? { ...doc, status: "Active" } : doc));
    toast.success(`${name}'s credentials verified and approved!`);
  };

  const complianceItems = [
    { label: "Consent Forms Collected", score: 94, status: "high" },
    { label: "Audit Trail Coverage", score: 100, status: "high" },
    { label: "Staff Training Records", score: 78, status: "medium" },
    { label: "Incident Documentation", score: 85, status: "high" },
    { label: "Policy Repository", score: 60, status: "medium" },
    { label: "Fire Safety Compliance", score: 92, status: "high" },
  ];

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
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 grid place-items-center font-bold text-sm"><Building2 className="size-5" /></div>
            <div>
              <p className="font-bold text-sm truncate max-w-[140px]">{userName}</p>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Super Admin</span>
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
              <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                Super Admin Console <span className="text-xl">🛡️</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Platform-wide control center · HealFlow AI v2.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input type="text" placeholder="Search platform..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-48 h-9 pl-9 rounded-lg border bg-card text-xs outline-none focus:ring-1 ring-primary/40 focus:w-60 transition-all" />
            </div>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative size-9 rounded-lg border bg-card grid place-items-center hover:bg-muted transition cursor-pointer">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-card" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-card shadow-glow p-3 z-30">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b mb-2">Admin Alerts</p>
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                      <p className="font-semibold text-amber-600">Pending Doctor Verification</p>
                      <p className="text-muted-foreground mt-0.5">Dr. Priya Nair uploaded credentials for review.</p>
                      <button onClick={() => { setActiveTab("doctors"); setShowNotifications(false); }} className="mt-1 font-bold text-primary hover:underline">Review Now</button>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs">
                      <p className="font-semibold text-rose-600">MSG91 API Warning</p>
                      <p className="text-muted-foreground mt-0.5">SMS gateway credit balance low. Top up required.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="size-9 rounded-lg border bg-gradient-primary text-primary-foreground grid place-items-center font-bold text-xs">SA</div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* ─── OVERVIEW ─── */}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Hospitals", val: "4", sub: "Across 4 cities", icon: Hospital, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+1 this month" },
                  { label: "Registered Doctors", val: "354", sub: "3 pending verification", icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+12 this month" },
                  { label: "Total Patients", val: "12,480", sub: "4,200 ABHA linked", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10", trend: "+340 this month" },
                  { label: "Platform Revenue", val: "₹5.12L", sub: "June 2026", icon: IndianRupee, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+19.5% MoM" },
                  { label: "Live Consultations", val: "28", sub: "Via video rooms", icon: Activity, color: "text-rose-500", bg: "bg-rose-500/10", trend: "Peak hours" },
                  { label: "Lab Reports Today", val: "147", sub: "38 pending review", icon: ClipboardList, color: "text-cyan-500", bg: "bg-cyan-500/10", trend: "Normal load" },
                  { label: "ABHA Linked", val: "4,200", sub: "33.7% of patients", icon: Shield, color: "text-indigo-500", bg: "bg-indigo-500/10", trend: "+280 this week" },
                  { label: "NABH Score", val: "87%", sub: "Last audit: May 2026", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", trend: "+5% from last" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-card border rounded-2xl p-4 shadow-card card-hover">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`size-9 rounded-xl ${s.bg} grid place-items-center`}><Icon className={`size-4 ${s.color}`} /></div>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{s.trend}</span>
                      </div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{s.label}</p>
                      <p className="text-xl font-bold mt-1">{s.val}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                    </div>
                  );
                })}
              </div>

              {/* Revenue Chart */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border rounded-3xl p-6 shadow-card">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-semibold text-lg">Revenue & Consultation Trends</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Platform-wide financial performance · 2026</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1"><TrendingUp className="size-3" /> +19.5%</span>
                  </div>
                  <div className="chart-container h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.05} />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(v: any) => [`₹${(v/1000).toFixed(0)}K`, "Revenue"]} />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Doctor Performance</h3>
                  <div className="chart-container h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={doctorPerf} layout="vertical">
                        <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={60} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="consultations" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="size-4 text-amber-500" /> Pending Doctor Approvals</h3>
                <div className="space-y-3">
                  {doctorsList.filter(d => d.status === "Pending Approval").map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border bg-amber-500/5 border-amber-500/20">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-amber-500/10 text-amber-600 grid place-items-center font-bold text-sm">{doc.name.charAt(4)}</div>
                        <div>
                          <p className="font-semibold text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.spec} · {doc.experience} · NMC: {doc.nmc}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleDoctorApprove(doc.id, doc.name)} className="px-3 h-8 bg-gradient-primary text-white text-xs font-bold rounded-lg shadow-soft hover:opacity-95 cursor-pointer flex items-center gap-1">
                          <Check className="size-3.5" /> Approve
                        </button>
                        <button className="px-3 h-8 border text-xs font-bold rounded-lg hover:bg-muted cursor-pointer">Reject</button>
                      </div>
                    </div>
                  ))}
                  {doctorsList.filter(d => d.status === "Pending Approval").length === 0 && (
                    <p className="text-sm text-center text-muted-foreground py-4">✅ All doctor applications verified. No pending tasks.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── HOSPITALS ─── */}
          {activeTab === "hospitals" && (
            <motion.div key="hospitals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Hospitals & Clinics Registry</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage all registered healthcare facilities on the platform</p>
                </div>
                <button onClick={() => toast.success("Add facility modal — connect to backend")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2">
                  <Building2 className="size-4" /> Add Facility
                </button>
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Facility</th>
                      <th className="pb-3 px-4">City</th>
                      <th className="pb-3 px-4">Beds / Doctors</th>
                      <th className="pb-3 px-4">Plan</th>
                      <th className="pb-3 px-4 text-center">Status</th>
                      <th className="pb-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {hospitals.map(h => (
                      <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold text-xs">{h.name.charAt(0)}</div>
                            <div>
                              <p className="font-bold">{h.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{h.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{h.city}</td>
                        <td className="py-4 px-4 text-muted-foreground">{h.beds > 0 ? `${h.beds} beds` : "OPD only"} · {h.doctors} docs</td>
                        <td className="py-4 px-4"><span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{h.plan}</span></td>
                        <td className="py-4 px-4 text-center"><span className={h.status === "Active" ? "badge-active" : "badge-pending"}>{h.status}</span></td>
                        <td className="py-4 pl-4 text-right">
                          <button onClick={() => toast.info(`Viewing ${h.name}`)} className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold hover:bg-muted cursor-pointer">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── DOCTORS ─── */}
          {activeTab === "doctors" && (
            <motion.div key="doctors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Doctor Registry</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">NMC-verified specialists on the HealFlow platform</p>
                </div>
                <button onClick={() => toast.success("Invite doctor — connect to backend")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2">
                  <Stethoscope className="size-4" /> Invite Doctor
                </button>
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Doctor</th>
                      <th className="pb-3 px-4">Specialization</th>
                      <th className="pb-3 px-4">NMC Reg</th>
                      <th className="pb-3 px-4">Rating</th>
                      <th className="pb-3 px-4 text-center">Status</th>
                      <th className="pb-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {doctorsList.map(doc => (
                      <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold text-sm">{doc.name.charAt(4)}</div>
                            <div>
                              <p className="font-bold">{doc.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{doc.id} · {doc.experience} · {doc.consultations} consults</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground font-medium">{doc.spec}</td>
                        <td className="py-4 px-4 font-mono text-xs text-muted-foreground">{doc.nmc}</td>
                        <td className="py-4 px-4 text-amber-500 font-bold">★ {doc.rating}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={doc.status === "Active" ? "badge-active" : "badge-pending"}>{doc.status}</span>
                        </td>
                        <td className="py-4 pl-4 text-right">
                          {doc.status !== "Active" ? (
                            <button onClick={() => handleDoctorApprove(doc.id, doc.name)} className="px-2.5 h-8 bg-gradient-primary text-white text-xs font-bold rounded-lg shadow-soft hover:opacity-95 cursor-pointer">Approve</button>
                          ) : (
                            <button onClick={() => toast.error(`Deactivating ${doc.name}`)} className="px-2.5 h-8 border text-xs font-semibold rounded-lg hover:bg-red-500/10 hover:text-red-500 cursor-pointer">Deactivate</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── STAFF ─── */}
          {activeTab === "staff" && (
            <motion.div key="staff" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div><h2 className="text-xl font-bold">Staff & Role Management</h2><p className="text-xs text-muted-foreground mt-0.5">Manage receptionists, lab technicians, pharmacists and admin accounts</p></div>
                <button onClick={() => toast.success("Add staff member — connect to backend")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2"><Users className="size-4" /> Add Staff</button>
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Staff Member</th>
                      <th className="pb-3 px-4">Role</th>
                      <th className="pb-3 px-4">Email</th>
                      <th className="pb-3 px-4">Since</th>
                      <th className="pb-3 px-4 text-center">Status</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {staffList.map(s => (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-xl bg-muted text-foreground grid place-items-center font-bold text-sm">{s.name.charAt(0)}</div>
                            <div><p className="font-bold">{s.name}</p><p className="text-[10px] text-muted-foreground font-mono">{s.id}</p></div>
                          </div>
                        </td>
                        <td className="py-4 px-4"><span className="badge-info">{s.role}</span></td>
                        <td className="py-4 px-4 text-muted-foreground text-xs">{s.email}</td>
                        <td className="py-4 px-4 text-muted-foreground">{s.since}</td>
                        <td className="py-4 px-4 text-center"><span className={s.status === "Active" ? "badge-active" : "badge-error"}>{s.status}</span></td>
                        <td className="py-4 pl-4 text-right">
                          <button onClick={() => toast.info(`Managing ${s.name}`)} className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold hover:bg-muted cursor-pointer">Edit Role</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── ANALYTICS ─── */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Platform Analytics</h2><p className="text-xs text-muted-foreground mt-0.5">Comprehensive performance metrics across all facilities</p></div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Monthly Revenue (₹)</h3>
                  <div className="chart-container h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(v: any) => [`₹${(v/1000).toFixed(1)}K`]} />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#g1)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Consultation Volume</h3>
                  <div className="chart-container h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="consultations" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── BILLING & PLANS ─── */}
          {activeTab === "billing" && (
            <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Revenue & Subscription Plans</h2><p className="text-xs text-muted-foreground mt-0.5">Manage facility subscriptions, payouts, and commission tracking</p></div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { plan: "Clinic Pro", price: "₹2,999/mo", facilities: 12, color: "border-blue-500/30 bg-blue-500/5" },
                  { plan: "Polyclinic", price: "₹7,499/mo", facilities: 6, color: "border-violet-500/30 bg-violet-500/5" },
                  { plan: "Hospital Enterprise", price: "₹24,999/mo", facilities: 3, color: "border-amber-500/30 bg-amber-500/5" },
                ].map((p, i) => (
                  <div key={i} className={`bg-card border-2 rounded-3xl p-6 shadow-card ${p.color}`}>
                    <p className="font-bold text-lg">{p.plan}</p>
                    <p className="text-3xl font-bold mt-2">{p.price}</p>
                    <p className="text-sm text-muted-foreground mt-2">{p.facilities} active facilities</p>
                    <button onClick={() => toast.info(`Managing ${p.plan} subscribers`)} className="mt-4 w-full h-9 border rounded-xl text-sm font-semibold hover:bg-muted cursor-pointer">Manage</button>
                  </div>
                ))}
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold mb-4">Recent Payouts</h3>
                <div className="space-y-3">
                  {[
                    { label: "Dr. Maya Patel — Consultation Fees", amount: "₹18,500", date: "Today", status: "Settled" },
                    { label: "Dr. Rajesh Sharma — Monthly Payout", amount: "₹24,000", date: "Yesterday", status: "Settled" },
                    { label: "Apollo Hospital — Commission Transfer", amount: "₹1,24,000", date: "Jun 5", status: "Processing" },
                    { label: "Medora Center — Lab Revenue Share", amount: "₹42,000", date: "Jun 3", status: "Settled" },
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-xl hover:bg-muted/30 transition-colors">
                      <div><p className="text-sm font-semibold">{p.label}</p><p className="text-xs text-muted-foreground">{p.date}</p></div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{p.amount}</p>
                        <span className={p.status === "Settled" ? "badge-active" : "badge-pending"}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── INTEGRATIONS ─── */}
          {activeTab === "integrations" && (
            <motion.div key="integrations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">API Integrations</h2><p className="text-xs text-muted-foreground mt-0.5">Manage third-party services, API keys, and webhook configurations</p></div>
              <div className="grid md:grid-cols-2 gap-4">
                {integrations.map((integ, i) => {
                  const Icon = integ.icon;
                  return (
                    <div key={i} className="bg-card border rounded-2xl p-4 shadow-card flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="size-5" /></div>
                        <div>
                          <p className="font-semibold text-sm">{integ.name}</p>
                          <p className="text-xs text-muted-foreground">{integ.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={integ.status === "Connected" ? "badge-active" : "badge-pending"}>{integ.status}</span>
                        <button onClick={() => toast.info(`Configuring ${integ.name}`)} className="size-8 rounded-lg border grid place-items-center hover:bg-muted cursor-pointer"><Settings className="size-3.5" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── NABH COMPLIANCE ─── */}
          {activeTab === "nabh" && (
            <motion.div key="nabh" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">NABH Compliance Dashboard</h2><p className="text-xs text-muted-foreground mt-0.5">National Accreditation Board for Hospitals readiness tracker</p></div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-card border rounded-3xl p-6 shadow-card text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Overall Compliance Score</p>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="size-28 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-muted opacity-20" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="251" strokeDashoffset={`${251 * (1 - 0.87)}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-3xl font-bold">87%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Last audit: May 2026</p>
                  <span className="badge-active mt-2 inline-block">Audit Ready</span>
                </div>
                <div className="md:col-span-2 bg-card border rounded-3xl p-6 shadow-card space-y-4">
                  <h3 className="font-semibold">Compliance Checklist</h3>
                  {complianceItems.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className={`text-sm font-bold compliance-${item.status}`}>{item.score}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${item.score}%`, backgroundImage: item.status === "high" ? "var(--gradient-success)" : "var(--gradient-warning)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── AUDIT LOGS ─── */}
          {activeTab === "audit" && (
            <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div><h2 className="text-xl font-bold">NABH Audit Logs</h2><p className="text-xs text-muted-foreground mt-0.5">Complete timestamped action trail — every user interaction recorded</p></div>
                <button onClick={() => toast.success("Exporting audit report as CSV...")} className="px-4 h-9 border rounded-xl text-sm font-semibold hover:bg-muted cursor-pointer flex items-center gap-2"><FileText className="size-4" /> Export CSV</button>
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Log ID</th>
                      <th className="pb-3 px-4">User</th>
                      <th className="pb-3 px-4">Role</th>
                      <th className="pb-3 px-4">Action</th>
                      <th className="pb-3 px-4">Patient</th>
                      <th className="pb-3 px-4">IP Address</th>
                      <th className="pb-3 pl-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{log.id}</td>
                        <td className="py-3 px-4 font-semibold text-sm">{log.user}</td>
                        <td className="py-3 px-4"><span className="badge-info">{log.role}</span></td>
                        <td className="py-3 px-4 text-sm">{log.action}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{log.patient}</td>
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{log.ip}</td>
                        <td className="py-3 pl-4 text-xs text-muted-foreground whitespace-nowrap">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── SETTINGS ─── */}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">System Settings</h2><p className="text-xs text-muted-foreground mt-0.5">Configure global platform preferences and security policies</p></div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "Platform Name", val: "HealFlow AI" },
                  { label: "Primary Contact Email", val: "admin@healflow.ai" },
                  { label: "Support Phone", val: "+91 1800-HEALFLOW" },
                  { label: "GST Number", val: "27ABCDE1234F1Z5" },
                  { label: "NABH Registration", val: "NABH-HF-2024-1823" },
                  { label: "Data Retention Policy", val: "7 years (HIPAA + MCI)" },
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</label>
                    <input type="text" defaultValue={s.val} className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
                  </div>
                ))}
              </div>
              <button onClick={() => toast.success("System settings saved!")} className="px-6 h-12 bg-gradient-primary text-primary-foreground font-bold rounded-xl shadow-soft hover:opacity-95 cursor-pointer text-sm">Save Settings</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
