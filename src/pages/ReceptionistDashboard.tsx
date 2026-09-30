import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Calendar, IndianRupee, Settings, Bell, Menu,
  LogOut, ClipboardList, Plus, Search, Clock, CheckCircle2,
  ArrowRight, UserPlus, Phone, Mail, MapPin, Upload, FileText,
  ChevronRight, X, Check
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "register", label: "Register Patient", icon: UserPlus },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "queue", label: "Today's Queue", icon: ClipboardList },
  { id: "billing", label: "Billing", icon: IndianRupee },
];

const todayAppointments = [
  { id: "Q-01", token: "T-001", patient: "Jane Doe", doctor: "Dr. Maya Patel", time: "03:40 PM", type: "Video", status: "Active", phone: "+91 98765 43210" },
  { id: "Q-02", token: "T-002", patient: "Rahul Gupta", doctor: "Dr. Rajesh Sharma", time: "04:30 PM", type: "Video", status: "Waiting", phone: "+91 99887 76655" },
  { id: "Q-03", token: "T-003", patient: "Priya Sen", doctor: "Dr. Maya Patel", time: "05:15 PM", type: "Walk-in", status: "Waiting", phone: "+91 88776 65544" },
  { id: "Q-04", token: "T-004", patient: "Arjun Mehta", doctor: "Dr. Aisha Khan", time: "05:45 PM", type: "Walk-in", status: "Registered", phone: "+91 77665 54433" },
  { id: "Q-05", token: "T-005", patient: "Sunita Roy", doctor: "Dr. Rajesh Sharma", time: "06:00 PM", type: "Walk-in", status: "Registered", phone: "+91 66554 43322" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [queue, setQueue] = useState(todayAppointments);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [form, setForm] = useState({
    name: "", mobile: "", email: "", gender: "Female", dob: "", blood: "O+",
    address: "", city: "", emergency: "", emergencyPhone: "", insurance: "",
  });

  const userName = localStorage.getItem("userName") || "Priya Sharma";

  const handleLogout = () => { localStorage.clear(); toast.info("Logged out"); navigate("/login"); };

  const handleCheckin = (id: string, name: string) => {
    setQueue(queue.map(q => q.id === id ? { ...q, status: "Checked In" } : q));
    toast.success(`${name} checked in successfully! Token issued.`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile) { toast.error("Name and mobile are required"); return; }
    const pid = `P-${Math.floor(Math.random() * 9000 + 1000)}`;
    toast.success(`Patient ${form.name} registered successfully! ID: ${pid}`);
    setForm({ name: "", mobile: "", email: "", gender: "Female", dob: "", blood: "O+", address: "", city: "", emergency: "", emergencyPhone: "", insurance: "" });
    setActiveTab("queue");
  };

  const stats = [
    { label: "Today's Patients", val: queue.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Checked In", val: queue.filter(q => q.status === "Checked In" || q.status === "Active").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Waiting", val: queue.filter(q => q.status === "Waiting").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Appointments Today", val: "3 Online · 2 Walk-in", icon: Calendar, color: "text-violet-500", bg: "bg-violet-500/10" },
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
            <div className="size-10 rounded-xl bg-violet-500/10 text-violet-600 grid place-items-center font-bold text-sm"><ClipboardList className="size-5" /></div>
            <div>
              <p className="font-bold text-sm truncate max-w-[140px]">{userName}</p>
              <span className="text-[10px] font-bold text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Receptionist</span>
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
              <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">Front Desk <span className="text-xl">🏥</span></h1>
              <p className="text-xs text-muted-foreground mt-0.5">Receptionist Workspace · HealFlow AI · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <button onClick={() => setActiveTab("register")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2"><UserPlus className="size-4" /> Register Patient</button>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative size-9 rounded-lg border bg-card grid place-items-center hover:bg-muted transition cursor-pointer">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-card" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-card shadow-glow p-3 z-30">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b mb-2">Desk Alerts</p>
                  <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                    <p className="font-semibold text-amber-600">Walk-in Patient</p>
                    <p className="text-muted-foreground mt-0.5">Arjun Mehta arrived at front desk. Please register and assign token.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-card border rounded-2xl p-4 shadow-card card-hover">
                      <div className={`size-9 rounded-xl ${s.bg} grid place-items-center mb-3`}><Icon className={`size-4 ${s.color}`} /></div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{s.label}</p>
                      <p className="text-xl font-bold mt-1">{s.val}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border rounded-3xl p-6 shadow-card flex flex-col justify-between h-44">
                  <div>
                    <span className="text-[10px] font-bold text-violet-600 bg-violet-500/15 px-2.5 py-1 rounded-full uppercase tracking-wider">Quick Action</span>
                    <h3 className="font-bold text-lg mt-3">Register New Patient</h3>
                    <p className="text-xs text-muted-foreground mt-1">Create digital patient profile with ABHA linkage support</p>
                  </div>
                  <button onClick={() => setActiveTab("register")} className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:underline cursor-pointer">Open Registration Form <ArrowRight className="size-3.5" /></button>
                </div>
                <div className="bg-card border rounded-3xl p-6 shadow-card flex flex-col justify-between h-44">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Check-in</span>
                    <h3 className="font-bold text-lg mt-3">Today's Queue Management</h3>
                    <p className="text-xs text-muted-foreground mt-1">{queue.filter(q => q.status === "Waiting").length} patients waiting · 1 active consultation</p>
                  </div>
                  <button onClick={() => setActiveTab("queue")} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer">View Queue <ArrowRight className="size-3.5" /></button>
                </div>
              </div>

              {/* Recent check-ins */}
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {queue.slice(0, 3).map(q => (
                    <div key={q.id} className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold text-sm">{q.patient.charAt(0)}</div>
                        <div>
                          <p className="font-semibold text-sm">{q.patient}</p>
                          <p className="text-xs text-muted-foreground">{q.doctor} · {q.time} · {q.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={q.status === "Active" || q.status === "Checked In" ? "badge-active" : q.status === "Waiting" ? "badge-pending" : "badge-info"}>{q.status}</span>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">{q.token}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "register" && (
            <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Patient Registration</h2><p className="text-xs text-muted-foreground mt-0.5">Create a new patient profile — all data encrypted and HIPAA compliant</p></div>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-5 flex items-center gap-2"><UserPlus className="size-4" /> Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                      <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Ravi Kumar" className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile Number *</label>
                      <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><input type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="+91 98765 43210" className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" required /></div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                      <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="patient@email.com" className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" /></div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date of Birth</label>
                      <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender</label>
                      <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm cursor-pointer">
                        <option>Female</option><option>Male</option><option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Blood Group</label>
                      <select value={form.blood} onChange={e => setForm({...form, blood: e.target.value})} className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm cursor-pointer">
                        {bloodGroups.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</label>
                      <div className="relative"><MapPin className="absolute left-3 top-3.5 size-4 text-muted-foreground" /><textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Street, Area, City" rows={2} className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm resize-none" /></div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-5 flex items-center gap-2"><Phone className="size-4" /> Emergency Contact</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Emergency Contact Name</label>
                      <input type="text" value={form.emergency} onChange={e => setForm({...form, emergency: e.target.value})} placeholder="Guardian / Spouse name" className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Emergency Phone</label>
                      <input type="tel" value={form.emergencyPhone} onChange={e => setForm({...form, emergencyPhone: e.target.value})} placeholder="+91 99999 88888" className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Insurance Policy Number</label>
                      <input type="text" value={form.insurance} onChange={e => setForm({...form, insurance: e.target.value})} placeholder="e.g. SBI-HEALTH-12345678" className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upload Documents</label>
                      <button type="button" onClick={() => toast.info("Document upload — connect to S3")} className="w-full h-11 border-2 border-dashed rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition cursor-pointer flex items-center justify-center gap-2">
                        <Upload className="size-4" /> Upload Aadhaar / Insurance
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="px-8 h-12 bg-gradient-primary text-primary-foreground font-bold rounded-xl shadow-soft hover:opacity-95 cursor-pointer text-sm flex items-center gap-2"><Check className="size-4" /> Register Patient</button>
                  <button type="button" onClick={() => setActiveTab("dashboard")} className="px-6 h-12 border rounded-xl font-semibold text-sm hover:bg-muted cursor-pointer">Cancel</button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "queue" && (
            <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Today's Patient Queue</h2><p className="text-xs text-muted-foreground mt-0.5">Check-in patients and assign consultation tokens</p></div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Token</th>
                      <th className="pb-3 px-4">Patient</th>
                      <th className="pb-3 px-4">Doctor</th>
                      <th className="pb-3 px-4">Time</th>
                      <th className="pb-3 px-4">Type</th>
                      <th className="pb-3 px-4 text-center">Status</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {queue.map(q => (
                      <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 pr-4 font-mono font-bold text-primary">{q.token}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-xs">{q.patient.charAt(0)}</div>
                            <div><p className="font-bold">{q.patient}</p><p className="text-[10px] text-muted-foreground font-mono">{q.phone}</p></div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-xs">{q.doctor}</td>
                        <td className="py-4 px-4 font-semibold text-primary">{q.time}</td>
                        <td className="py-4 px-4"><span className="badge-info">{q.type}</span></td>
                        <td className="py-4 px-4 text-center">
                          <span className={q.status === "Active" || q.status === "Checked In" ? "badge-active" : q.status === "Waiting" ? "badge-pending" : "badge-info"}>{q.status}</span>
                        </td>
                        <td className="py-4 pl-4 text-right">
                          {q.status === "Registered" || q.status === "Waiting" ? (
                            <button onClick={() => handleCheckin(q.id, q.patient)} className="px-3 h-8 bg-gradient-primary text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 ml-auto"><Check className="size-3.5" /> Check In</button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div key="appointments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div><h2 className="text-xl font-bold">Appointment Booking</h2><p className="text-xs text-muted-foreground mt-0.5">Schedule walk-in, online and teleconsultation appointments</p></div>
                <button onClick={() => toast.success("New appointment slot modal — connect to backend")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2"><Plus className="size-4" /> Book Appointment</button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { type: "Walk-in", count: 2, icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { type: "Online", count: 2, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { type: "Teleconsult", count: 1, icon: ClipboardList, color: "text-violet-500", bg: "bg-violet-500/10" },
                ].map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <div key={i} className="bg-card border rounded-2xl p-5 shadow-card flex items-center gap-4">
                      <div className={`size-12 rounded-xl ${t.bg} grid place-items-center`}><Icon className={`size-6 ${t.color}`} /></div>
                      <div><p className="font-bold text-2xl">{t.count}</p><p className="text-sm text-muted-foreground">{t.type} today</p></div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold mb-4">All Appointments</h3>
                <div className="space-y-3">
                  {queue.map(q => (
                    <div key={q.id} className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold">{q.patient.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-sm">{q.patient}</p>
                          <p className="text-xs text-muted-foreground">{q.doctor} · {q.time} · {q.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={q.status === "Active" || q.status === "Checked In" ? "badge-active" : "badge-pending"}>{q.status}</span>
                        <button onClick={() => toast.info(`Reschedule ${q.patient}`)} className="px-2 py-1 text-xs font-semibold border rounded-lg hover:bg-muted cursor-pointer">Reschedule</button>
                        <button onClick={() => { setQueue(queue.filter(a => a.id !== q.id)); toast.error("Appointment cancelled"); }} className="size-7 rounded-lg border grid place-items-center hover:bg-destructive/10 text-destructive cursor-pointer"><X className="size-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Consultation Billing</h2><p className="text-xs text-muted-foreground mt-0.5">Generate GST invoices for consultations and procedures</p></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-3xl p-6 shadow-card space-y-4">
                  <h3 className="font-semibold">Generate Invoice</h3>
                  {[
                    { label: "Patient", placeholder: "Search patient name" },
                    { label: "Doctor", placeholder: "Select doctor" },
                    { label: "Service", placeholder: "e.g. OPD Consultation" },
                    { label: "Amount (₹)", placeholder: "e.g. 500" },
                  ].map((f, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{f.label}</label>
                      <input type="text" placeholder={f.placeholder} className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Method</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["UPI", "Card", "Cash", "Net Banking"].map(m => (
                        <button key={m} className="h-9 border rounded-xl text-xs font-semibold hover:bg-primary/10 hover:border-primary hover:text-primary transition cursor-pointer">{m}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => toast.success("GST Invoice generated and sent to patient!")} className="w-full h-12 bg-gradient-primary text-primary-foreground font-bold rounded-xl shadow-soft cursor-pointer text-sm flex items-center justify-center gap-2"><FileText className="size-4" /> Generate GST Invoice</button>
                </div>

                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Recent Invoices</h3>
                  <div className="space-y-3">
                    {[
                      { inv: "INV-2401", patient: "Jane Doe", amount: "₹500", service: "OPD Consultation", date: "Today", status: "Paid" },
                      { inv: "INV-2400", patient: "Rahul Gupta", amount: "₹1,200", service: "Cardiology OPD", date: "Today", status: "Paid" },
                      { inv: "INV-2399", patient: "Sunita Roy", amount: "₹500", service: "General OPD", date: "Yesterday", status: "Pending" },
                    ].map((inv, i) => (
                      <div key={i} className="flex justify-between items-center p-3 border rounded-xl hover:bg-muted/30">
                        <div>
                          <p className="font-bold text-sm">{inv.patient}</p>
                          <p className="text-xs text-muted-foreground">{inv.service} · {inv.date}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">{inv.inv}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{inv.amount}</p>
                          <span className={inv.status === "Paid" ? "badge-active" : "badge-pending"}>{inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
