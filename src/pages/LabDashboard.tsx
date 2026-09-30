import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FlaskConical, ClipboardList, LogOut, Bell,
  CheckCircle2, Clock, Upload, FileText, AlertTriangle,
  Plus, Eye, Check, Download, Activity, Menu
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Lab Orders", icon: ClipboardList },
  { id: "samples", label: "Sample Collection", icon: FlaskConical },
  { id: "reports", label: "Report Generation", icon: FileText },
  { id: "history", label: "Report Archive", icon: Activity },
];

const labOrders = [
  { id: "LO-201", patient: "Jane Doe", patientId: "P-88", doctor: "Dr. Maya Patel", tests: ["CBC", "Malaria Antigen"], priority: "Urgent", ordered: "Today, 15:45", status: "Pending" },
  { id: "LO-198", patient: "Rahul Gupta", patientId: "P-12", doctor: "Dr. Rajesh Sharma", tests: ["Lipid Profile", "ECG"], priority: "Normal", ordered: "May 28, 10:00", status: "Sample Collected" },
  { id: "LO-185", patient: "Priya Sen", patientId: "P-19", doctor: "Dr. Maya Patel", tests: ["TSH", "T3", "T4"], priority: "Normal", ordered: "May 22, 11:30", status: "Report Ready" },
  { id: "LO-170", patient: "Arjun Mehta", patientId: "P-55", doctor: "Dr. Aisha Khan", tests: ["HbA1c", "Fasting Glucose", "Creatinine"], priority: "Normal", ordered: "May 18, 09:15", status: "Report Delivered" },
];

const testTemplates = [
  { name: "Complete Blood Count (CBC)", params: 24, time: "2 hrs", category: "Hematology" },
  { name: "Lipid Profile", params: 6, time: "4 hrs", category: "Biochemistry" },
  { name: "Liver Function Test (LFT)", params: 12, time: "4 hrs", category: "Biochemistry" },
  { name: "Thyroid Panel (TSH, T3, T4)", params: 3, time: "6 hrs", category: "Endocrinology" },
  { name: "Kidney Function Test (RFT)", params: 8, time: "4 hrs", category: "Biochemistry" },
  { name: "HbA1c + Glucose", params: 2, time: "2 hrs", category: "Diabetes" },
  { name: "Malaria Antigen (NS1 + Ab)", params: 2, time: "1 hr", category: "Infectious" },
  { name: "Urine Routine & Microscopy", params: 18, time: "2 hrs", category: "Urology" },
];

export default function LabDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState(labOrders);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "Rahul Verma";

  const handleLogout = () => { localStorage.clear(); toast.info("Logged out"); navigate("/login"); };

  const markSampleCollected = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "Sample Collected" } : o));
    toast.success("Sample collected and logged!");
  };

  const markReportReady = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "Report Ready" } : o));
    toast.success("Report uploaded and doctor notified!");
  };

  const stats = [
    { label: "Pending Orders", val: orders.filter(o => o.status === "Pending").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Samples Collected", val: orders.filter(o => o.status === "Sample Collected").length, icon: FlaskConical, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Reports Ready", val: orders.filter(o => o.status === "Report Ready").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Delivered Today", val: orders.filter(o => o.status === "Report Delivered").length, icon: Activity, color: "text-violet-500", bg: "bg-violet-500/10" },
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
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 grid place-items-center"><FlaskConical className="size-5" /></div>
            <div>
              <p className="font-bold text-sm truncate max-w-[140px]">{userName}</p>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Lab Tech</span>
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
              <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">Laboratory <span className="text-xl">🔬</span></h1>
              <p className="text-xs text-muted-foreground mt-0.5">Lab Technician Workspace · HealFlow AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative size-9 rounded-lg border bg-card grid place-items-center hover:bg-muted transition cursor-pointer">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-card" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-card shadow-glow p-3 z-30">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b mb-2">Lab Alerts</p>
                  <div className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs">
                    <p className="font-semibold text-rose-600">Urgent CBC Order</p>
                    <p className="text-muted-foreground mt-0.5">Dr. Maya Patel ordered urgent CBC for Jane Doe. Priority processing required.</p>
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
                      <p className="text-3xl font-bold mt-1">{s.val}</p>
                    </div>
                  );
                })}
              </div>

              {/* Workflow Visual */}
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold mb-6">Lab Workflow Progress</h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {["Order Received", "Sample Collected", "Processing", "Report Generated", "Doctor Review", "Patient Notified"].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 shrink-0">
                      <div className={`px-3 py-2 rounded-xl text-xs font-bold ${i < 3 ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground border"}`}>{step}</div>
                      {i < 5 && <div className={`w-8 h-0.5 ${i < 2 ? "bg-primary" : "bg-border"}`} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Orders */}
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center gap-2"><AlertTriangle className="size-4 text-rose-500" /> Urgent Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-primary hover:underline cursor-pointer">View All</button>
                </div>
                {orders.filter(o => o.priority === "Urgent").map(o => (
                  <div key={o.id} className="p-4 rounded-2xl border bg-rose-500/5 border-rose-500/20">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">{o.id}</span>
                        <p className="font-bold">{o.patient}</p>
                        <p className="text-xs text-muted-foreground">{o.doctor} · Ordered: {o.ordered}</p>
                      </div>
                      <span className="badge-error">Urgent</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {o.tests.map((t, i) => <span key={i} className="text-[10px] font-bold bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full">{t}</span>)}
                    </div>
                    <button onClick={() => markSampleCollected(o.id)} className="w-full h-9 bg-gradient-primary text-primary-foreground rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-2"><FlaskConical className="size-3.5" /> Mark Sample Collected</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">All Lab Orders</h2><p className="text-xs text-muted-foreground mt-0.5">Doctor-ordered diagnostic tests — manage workflow and status</p></div>
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="bg-card border rounded-2xl p-5 shadow-card">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-muted-foreground">{o.id}</span>
                          <span className={o.priority === "Urgent" ? "badge-error" : "badge-info"}>{o.priority}</span>
                        </div>
                        <h4 className="font-bold">{o.patient} <span className="text-xs font-mono text-muted-foreground ml-1">{o.patientId}</span></h4>
                        <p className="text-xs text-muted-foreground">{o.doctor} · {o.ordered}</p>
                      </div>
                      <span className={o.status === "Report Delivered" || o.status === "Report Ready" ? "badge-active" : o.status === "Sample Collected" ? "badge-info" : "badge-pending"}>{o.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {o.tests.map((t, i) => <span key={i} className="text-xs font-bold bg-muted px-2.5 py-1 rounded-lg">{t}</span>)}
                    </div>
                    <div className="flex gap-2">
                      {o.status === "Pending" && <button onClick={() => markSampleCollected(o.id)} className="flex-1 h-9 bg-gradient-primary text-primary-foreground rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"><FlaskConical className="size-3.5" /> Collect Sample</button>}
                      {o.status === "Sample Collected" && <button onClick={() => markReportReady(o.id)} className="flex-1 h-9 bg-gradient-success text-white rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"><Upload className="size-3.5" /> Upload Report</button>}
                      {o.status === "Report Ready" && <button onClick={() => toast.success("Report PDF shared with doctor and patient")} className="flex-1 h-9 border rounded-xl font-bold text-xs cursor-pointer hover:bg-muted flex items-center justify-center gap-1.5"><Check className="size-3.5 text-emerald-500" /> Delivered</button>}
                      <button onClick={() => toast.info(`Viewing order ${o.id}`)} className="h-9 px-3 border rounded-xl text-xs font-semibold hover:bg-muted cursor-pointer flex items-center gap-1"><Eye className="size-3.5" /> View</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "samples" && (
            <motion.div key="samples" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Sample Collection</h2><p className="text-xs text-muted-foreground mt-0.5">Track and log patient sample collection status</p></div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Order ID</th>
                      <th className="pb-3 px-4">Patient</th>
                      <th className="pb-3 px-4">Tests</th>
                      <th className="pb-3 px-4">Priority</th>
                      <th className="pb-3 px-4 text-center">Status</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 pr-4 font-mono text-xs text-muted-foreground">{o.id}</td>
                        <td className="py-4 px-4 font-bold">{o.patient}</td>
                        <td className="py-4 px-4 text-xs text-muted-foreground">{o.tests.join(", ")}</td>
                        <td className="py-4 px-4"><span className={o.priority === "Urgent" ? "badge-error" : "badge-info"}>{o.priority}</span></td>
                        <td className="py-4 px-4 text-center"><span className={o.status.includes("Report") || o.status === "Sample Collected" ? "badge-active" : "badge-pending"}>{o.status}</span></td>
                        <td className="py-4 pl-4 text-right">
                          {o.status === "Pending" ? (
                            <button onClick={() => markSampleCollected(o.id)} className="px-3 h-8 bg-gradient-primary text-white text-xs font-bold rounded-lg cursor-pointer">Collect</button>
                          ) : <span className="text-xs text-muted-foreground">Done</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "reports" && (
            <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Report Generation</h2><p className="text-xs text-muted-foreground mt-0.5">Upload results and generate patient reports</p></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card border rounded-3xl p-6 shadow-card space-y-4">
                  <h3 className="font-semibold">Upload Report</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Lab Order</label>
                    <select className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm cursor-pointer">
                      {orders.filter(o => o.status === "Sample Collected").map(o => <option key={o.id}>{o.id} — {o.patient} ({o.tests.join(", ")})</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upload PDF Report</label>
                    <button onClick={() => toast.info("File picker — connect to S3")} className="w-full h-20 border-2 border-dashed rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition cursor-pointer flex flex-col items-center justify-center gap-2">
                      <Upload className="size-6" /> Click to upload PDF report
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Result Notes</label>
                    <textarea rows={3} placeholder="Enter key findings..." className="w-full px-4 py-3 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm resize-none" />
                  </div>
                  <button onClick={() => { markReportReady(orders.find(o => o.status === "Sample Collected")?.id || ""); }} className="w-full h-12 bg-gradient-primary text-primary-foreground font-bold rounded-xl cursor-pointer text-sm flex items-center justify-center gap-2"><Upload className="size-4" /> Submit Report</button>
                </div>

                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4">Test Templates</h3>
                  <div className="space-y-2.5">
                    {testTemplates.slice(0, 6).map((t, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/30 transition-colors">
                        <div>
                          <p className="font-semibold text-sm">{t.name}</p>
                          <p className="text-[10px] text-muted-foreground">{t.params} parameters · {t.time} · {t.category}</p>
                        </div>
                        <button onClick={() => toast.info(`Loading template: ${t.name}`)} className="px-2.5 py-1.5 border rounded-lg text-xs font-semibold hover:bg-muted cursor-pointer">Use</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Report Archive</h2><p className="text-xs text-muted-foreground mt-0.5">All delivered lab reports — searchable archive</p></div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Order ID</th>
                      <th className="pb-3 px-4">Patient</th>
                      <th className="pb-3 px-4">Tests</th>
                      <th className="pb-3 px-4">Doctor</th>
                      <th className="pb-3 px-4 text-center">Status</th>
                      <th className="pb-3 pl-4 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 pr-4 font-mono text-xs text-muted-foreground">{o.id}</td>
                        <td className="py-4 px-4 font-bold">{o.patient}</td>
                        <td className="py-4 px-4 text-xs text-muted-foreground">{o.tests.join(", ")}</td>
                        <td className="py-4 px-4 text-muted-foreground text-xs">{o.doctor}</td>
                        <td className="py-4 px-4 text-center"><span className={o.status.includes("Report") ? "badge-active" : "badge-pending"}>{o.status}</span></td>
                        <td className="py-4 pl-4 text-right">
                          <button onClick={() => toast.success(`Downloading report for ${o.patient}`)} className="size-8 rounded-lg border grid place-items-center hover:bg-muted cursor-pointer"><Download className="size-3.5 text-primary" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
