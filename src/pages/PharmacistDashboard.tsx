import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Pill, Package, ShoppingCart, IndianRupee, LogOut,
  Bell, AlertTriangle, Plus, Search, Check, Clock, FileText,
  ArrowRight, TrendingDown, BarChart3, Menu
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "prescriptions", label: "Prescriptions Queue", icon: FileText },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "stock", label: "Stock Management", icon: ShoppingCart },
  { id: "billing", label: "Pharmacy Billing", icon: IndianRupee },
];

const prescriptionQueue = [
  { id: "RX-204", patient: "Jane Doe", doctor: "Dr. Maya Patel", date: "Today, 15:45", medicines: [{ name: "Paracetamol 650mg", qty: 10, available: true }, { name: "Cetirizine 10mg", qty: 7, available: true }, { name: "ORS Sachets", qty: 3, available: true }], status: "Pending" },
  { id: "RX-198", patient: "Rahul Gupta", doctor: "Dr. Rajesh Sharma", date: "Today, 14:00", medicines: [{ name: "Aspirin 75mg", qty: 30, available: true }, { name: "Atenolol 50mg", qty: 30, available: false }, { name: "Nitroglycerine 0.5mg", qty: 5, available: true }], status: "Partial" },
  { id: "RX-185", patient: "Priya Sen", doctor: "Dr. Maya Patel", date: "Yesterday", medicines: [{ name: "Levothyroxine 50mcg", qty: 30, available: true }], status: "Dispensed" },
];

const inventory = [
  { id: "MED-001", name: "Paracetamol 650mg", brand: "Crocin", category: "Analgesic", stock: 450, unit: "Tablets", expiry: "Dec 2027", batch: "PCR-2025-A", price: 1.5, reorder: 100 },
  { id: "MED-002", name: "Cetirizine 10mg", brand: "Okacet", category: "Antihistamine", stock: 280, unit: "Tablets", expiry: "Jun 2027", batch: "CTZ-2025-B", price: 2.0, reorder: 50 },
  { id: "MED-003", name: "Aspirin 75mg", brand: "Ecosprin", category: "Antiplatelet", stock: 520, unit: "Tablets", expiry: "Mar 2028", batch: "ASP-2025-C", price: 0.8, reorder: 100 },
  { id: "MED-004", name: "Atenolol 50mg", brand: "Tenormin", category: "Beta Blocker", stock: 12, unit: "Tablets", expiry: "Sep 2026", batch: "ATN-2024-D", price: 3.5, reorder: 60 },
  { id: "MED-005", name: "Metformin 500mg", brand: "Glycomet", category: "Antidiabetic", stock: 380, unit: "Tablets", expiry: "Feb 2027", batch: "MET-2025-E", price: 1.2, reorder: 80 },
  { id: "MED-006", name: "Amoxicillin 500mg", brand: "Mox", category: "Antibiotic", stock: 8, unit: "Capsules", expiry: "Jun 2025", batch: "AMX-2024-F", price: 5.0, reorder: 50 },
];

export default function PharmacistDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [queue, setQueue] = useState(prescriptionQueue);
  const [inv, setInv] = useState(inventory);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "Anjali Singh";

  const handleLogout = () => { localStorage.clear(); toast.info("Logged out"); navigate("/login"); };

  const handleDispense = (id: string) => {
    setQueue(queue.map(q => q.id === id ? { ...q, status: "Dispensed" } : q));
    toast.success("Medicines dispensed! Invoice generated.");
  };

  const lowStock = inv.filter(m => m.stock <= m.reorder);
  const expiryAlert = inv.filter(m => m.expiry.includes("2025"));

  const stats = [
    { label: "Pending Prescriptions", val: queue.filter(q => q.status === "Pending").length, icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Dispensed Today", val: queue.filter(q => q.status === "Dispensed").length, icon: Check, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Low Stock Alerts", val: lowStock.length, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Total SKUs", val: inv.length, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  const filteredInv = inv.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.brand.toLowerCase().includes(searchQuery.toLowerCase()));

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
            <div className="size-10 rounded-xl bg-rose-500/10 text-rose-600 grid place-items-center"><Pill className="size-5" /></div>
            <div>
              <p className="font-bold text-sm truncate max-w-[140px]">{userName}</p>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Pharmacist</span>
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
              <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">Pharmacy <span className="text-xl">💊</span></h1>
              <p className="text-xs text-muted-foreground mt-0.5">Pharmacist Workspace · HealFlow AI · Inventory & Dispensing</p>
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
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b mb-2">Pharmacy Alerts</p>
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs">
                      <p className="font-semibold text-rose-600">Low Stock: Atenolol 50mg</p>
                      <p className="text-muted-foreground mt-0.5">Only 12 tablets remaining. Reorder level: 60. Create purchase order.</p>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                      <p className="font-semibold text-amber-600">Expiry Alert: Amoxicillin 500mg</p>
                      <p className="text-muted-foreground mt-0.5">Batch AMX-2024-F expires Jun 2025. Only 8 units remaining.</p>
                    </div>
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

              {/* Alerts */}
              {(lowStock.length > 0 || expiryAlert.length > 0) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {lowStock.length > 0 && (
                    <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5">
                      <h3 className="font-bold text-rose-600 flex items-center gap-2 mb-3"><TrendingDown className="size-4" /> Low Stock Alert</h3>
                      {lowStock.map((m, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-rose-500/10 last:border-0">
                          <p className="text-sm font-semibold">{m.name}</p>
                          <span className="text-xs font-bold text-rose-600">{m.stock} left (min: {m.reorder})</span>
                        </div>
                      ))}
                      <button onClick={() => setActiveTab("stock")} className="mt-3 text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer">Create Purchase Order <ArrowRight className="size-3" /></button>
                    </div>
                  )}
                  {expiryAlert.length > 0 && (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                      <h3 className="font-bold text-amber-600 flex items-center gap-2 mb-3"><AlertTriangle className="size-4" /> Expiry Alert</h3>
                      {expiryAlert.map((m, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-amber-500/10 last:border-0">
                          <p className="text-sm font-semibold">{m.name}</p>
                          <span className="text-xs font-bold text-amber-600">Exp: {m.expiry} · {m.stock} units</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pending Prescriptions */}
              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Pending Prescriptions</h3>
                  <button onClick={() => setActiveTab("prescriptions")} className="text-xs font-bold text-primary hover:underline cursor-pointer">View All</button>
                </div>
                <div className="space-y-3">
                  {queue.filter(q => q.status !== "Dispensed").map(rx => (
                    <div key={rx.id} className="p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold">{rx.patient}</p>
                          <p className="text-xs text-muted-foreground">{rx.doctor} · {rx.date}</p>
                        </div>
                        <span className={rx.status === "Partial" ? "badge-pending" : "badge-info"}>{rx.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{rx.medicines.length} medicines · {rx.medicines.filter(m => !m.available).length > 0 ? `${rx.medicines.filter(m => !m.available).length} out of stock` : "All available"}</p>
                      <button onClick={() => handleDispense(rx.id)} className="mt-3 w-full h-9 bg-gradient-primary text-primary-foreground rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"><Pill className="size-3.5" /> Dispense & Bill</button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "prescriptions" && (
            <motion.div key="prescriptions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Prescription Queue</h2><p className="text-xs text-muted-foreground mt-0.5">Incoming digital prescriptions from doctors — verify and dispense</p></div>
              <div className="space-y-4">
                {queue.map(rx => (
                  <div key={rx.id} className={`bg-card border rounded-2xl p-6 shadow-card ${rx.status === "Dispensed" ? "opacity-70" : ""}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-mono text-muted-foreground">{rx.id}</span>
                        <h4 className="font-bold text-lg">{rx.patient}</h4>
                        <p className="text-xs text-muted-foreground">{rx.doctor} · {rx.date}</p>
                      </div>
                      <span className={rx.status === "Dispensed" ? "badge-active" : rx.status === "Partial" ? "badge-pending" : "badge-info"}>{rx.status}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Medicines</p>
                      {rx.medicines.map((m, i) => (
                        <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl border ${m.available ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
                          <div>
                            <p className="font-semibold text-sm">{m.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {m.qty}</p>
                          </div>
                          <span className={m.available ? "badge-active" : "badge-error"}>{m.available ? "In Stock" : "Out of Stock"}</span>
                        </div>
                      ))}
                    </div>
                    {rx.status !== "Dispensed" && (
                      <button onClick={() => handleDispense(rx.id)} className="w-full h-10 bg-gradient-primary text-primary-foreground rounded-xl font-bold text-sm cursor-pointer flex items-center justify-center gap-2"><Check className="size-4" /> Dispense All & Generate Bill</button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "inventory" && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div><h2 className="text-xl font-bold">Drug Inventory</h2><p className="text-xs text-muted-foreground mt-0.5">Batch-tracked medicine stock with expiry monitoring</p></div>
                <button onClick={() => toast.success("Add medicine modal — connect to backend")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2"><Plus className="size-4" /> Add Medicine</button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input type="text" placeholder="Search medicines by name or brand..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card outline-none focus:ring-2 ring-primary/30 text-sm" />
              </div>
              <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Medicine</th>
                      <th className="pb-3 px-4">Category</th>
                      <th className="pb-3 px-4">Stock</th>
                      <th className="pb-3 px-4">Batch</th>
                      <th className="pb-3 px-4">Expiry</th>
                      <th className="pb-3 px-4">MRP</th>
                      <th className="pb-3 pl-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredInv.map(m => {
                      const isLow = m.stock <= m.reorder;
                      const isExpiring = m.expiry.includes("2025");
                      return (
                        <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-4 pr-4">
                            <p className="font-bold">{m.name}</p>
                            <p className="text-[10px] text-muted-foreground">{m.brand} · {m.unit}</p>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground text-xs">{m.category}</td>
                          <td className="py-4 px-4">
                            <span className={`font-bold ${isLow ? "text-rose-600" : "text-foreground"}`}>{m.stock}</span>
                            <span className="text-xs text-muted-foreground"> / {m.reorder} min</span>
                          </td>
                          <td className="py-4 px-4 font-mono text-xs text-muted-foreground">{m.batch}</td>
                          <td className="py-4 px-4 text-xs">
                            <span className={isExpiring ? "text-amber-600 font-semibold" : "text-muted-foreground"}>{m.expiry}</span>
                          </td>
                          <td className="py-4 px-4 font-semibold">₹{m.price.toFixed(2)}</td>
                          <td className="py-4 pl-4 text-right">
                            {isLow ? <span className="badge-error">Low Stock</span> : isExpiring ? <span className="badge-pending">Expiring</span> : <span className="badge-active">OK</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "stock" && (
            <motion.div key="stock" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Stock Management</h2><p className="text-xs text-muted-foreground mt-0.5">Create purchase orders and manage stock replenishment</p></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-3xl p-6 shadow-card space-y-4">
                  <h3 className="font-semibold flex items-center gap-2"><ShoppingCart className="size-4" /> Create Purchase Order</h3>
                  {[
                    { label: "Supplier Name", placeholder: "e.g. Medline Pharma Distributors" },
                    { label: "Medicine", placeholder: "Select or type medicine name" },
                    { label: "Quantity Required", placeholder: "e.g. 500 tablets" },
                    { label: "Expected Delivery", placeholder: "Select date" },
                  ].map((f, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{f.label}</label>
                      <input type={f.label.includes("Delivery") ? "date" : "text"} placeholder={f.placeholder} className="w-full h-11 px-4 rounded-xl border bg-background/50 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                  ))}
                  <button onClick={() => toast.success("Purchase order created and sent to supplier!")} className="w-full h-12 bg-gradient-primary text-primary-foreground font-bold rounded-xl cursor-pointer text-sm flex items-center justify-center gap-2"><ShoppingCart className="size-4" /> Submit Purchase Order</button>
                </div>

                <div className="bg-card border rounded-3xl p-6 shadow-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="size-4 text-rose-500" /> Items Requiring Reorder</h3>
                  <div className="space-y-3">
                    {lowStock.map((m, i) => (
                      <div key={i} className="p-3 border rounded-xl bg-rose-500/5 border-rose-500/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-sm">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.brand} · Current: {m.stock} · Min: {m.reorder}</p>
                          </div>
                          <span className="badge-error">Reorder</span>
                        </div>
                        <button onClick={() => toast.success(`Quick order placed for ${m.name}`)} className="mt-2 w-full h-8 bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer">Quick Order</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div><h2 className="text-xl font-bold">Pharmacy Billing</h2><p className="text-xs text-muted-foreground mt-0.5">Generate GST-compliant pharmacy invoices and process payments</p></div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Today's Revenue", val: "₹8,420", icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "Bills Generated", val: "24", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { label: "Pending Payments", val: "₹1,200", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
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

              <div className="bg-card border rounded-3xl p-6 shadow-card">
                <h3 className="font-semibold mb-4">Recent Pharmacy Bills</h3>
                <div className="space-y-3">
                  {[
                    { bill: "PH-2401", patient: "Jane Doe", items: 3, amount: "₹245", gst: "₹44.1", total: "₹289.10", date: "Today", paid: true },
                    { bill: "PH-2399", patient: "Rahul Gupta", items: 2, amount: "₹820", gst: "₹147.6", total: "₹967.60", date: "Today", paid: true },
                    { bill: "PH-2395", patient: "Priya Sen", items: 1, amount: "₹380", gst: "₹68.4", total: "₹448.40", date: "Yesterday", paid: false },
                  ].map((b, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="font-bold">{b.patient}</p>
                        <p className="text-xs text-muted-foreground">{b.items} items · {b.date}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{b.bill} · GST: {b.gst}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{b.total}</p>
                        <span className={b.paid ? "badge-active" : "badge-error"}>{b.paid ? "Paid" : "Pending"}</span>
                        <div className="mt-1">
                          <button onClick={() => toast.success(`Downloading bill ${b.bill}`)} className="text-[10px] font-bold text-primary hover:underline cursor-pointer">PDF</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
