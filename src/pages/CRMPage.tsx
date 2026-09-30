import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Users, Phone, Mail, MessageSquare, TrendingUp,
  Plus, Search, Filter, MoreHorizontal, Star, Calendar,
  Target, UserPlus, ArrowUpRight, Check, Clock
} from "lucide-react";
import { toast } from "sonner";

const leads = [
  { id: "L-001", name: "Ananya Krishnan", phone: "+91 87654 32109", source: "Website", status: "Hot Lead", interest: "Cardiology", date: "Today", score: 92 },
  { id: "L-002", name: "Vikram Nair", phone: "+91 76543 21098", source: "WhatsApp", status: "Warm Lead", interest: "General OPD", date: "Yesterday", score: 68 },
  { id: "L-003", name: "Meera Joshi", phone: "+91 65432 10987", source: "Referral", status: "Hot Lead", interest: "Gynecology", date: "Jun 6", score: 88 },
  { id: "L-004", name: "Sanjay Patil", phone: "+91 54321 09876", source: "Google Ads", status: "Cold Lead", interest: "Orthopedics", date: "Jun 4", score: 34 },
  { id: "L-005", name: "Deepa Sharma", phone: "+91 43210 98765", source: "Facebook", status: "Converted", interest: "Dermatology", date: "Jun 2", score: 100 },
];

const followUps = [
  { id: "FU-01", patient: "Rahul Gupta", reason: "Post-cardiac follow-up", due: "Today", priority: "High", doctor: "Dr. Rajesh Sharma", status: "Pending" },
  { id: "FU-02", patient: "Priya Sen", reason: "Thyroid medication review", due: "Tomorrow", priority: "Medium", doctor: "Dr. Maya Patel", status: "Pending" },
  { id: "FU-03", patient: "Arjun Mehta", reason: "Diabetes check — HbA1c", due: "Jun 12", priority: "High", doctor: "Dr. Aisha Khan", status: "Scheduled" },
  { id: "FU-04", patient: "Sunita Roy", reason: "Post-op wound check", due: "Jun 15", priority: "Low", doctor: "Dr. Maya Patel", status: "Pending" },
];

const campaigns = [
  { id: "C-01", name: "Summer Health Checkup Drive", channel: "WhatsApp + SMS", sent: 1240, opened: 876, converted: 124, status: "Active", start: "Jun 1" },
  { id: "C-02", name: "Diabetes Awareness Month", channel: "Email + WhatsApp", sent: 890, opened: 623, converted: 87, status: "Active", start: "Jun 5" },
  { id: "C-03", name: "Cardiology OPD Camp", channel: "SMS", sent: 450, opened: 380, converted: 56, status: "Completed", start: "May 20" },
];

const metrics = [
  { label: "Total Leads", val: "128", sub: "This month", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+23%" },
  { label: "Conversion Rate", val: "34.2%", sub: "Leads to patients", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+5.8%" },
  { label: "Follow-ups Due", val: "12", sub: "Today + Tomorrow", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", trend: "4 urgent" },
  { label: "Patient Retention", val: "87.4%", sub: "Monthly retention", icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10", trend: "+2.1%" },
];

export default function CRMPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"leads" | "followups" | "campaigns">("leads");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-[#0B1B2B]/30 p-4 sm:p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="size-9 rounded-xl border bg-card grid place-items-center hover:bg-muted cursor-pointer"><ArrowLeft className="size-4" /></button>
          <div>
            <h1 className="text-2xl font-bold font-display">CRM — Patient Relationship Management</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Leads · Follow-ups · Marketing Campaigns · Retention Analytics</p>
          </div>
          <button onClick={() => toast.success("Add new lead / patient")} className="ml-auto px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl shadow-soft cursor-pointer flex items-center gap-2"><Plus className="size-4" /> Add Lead</button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="bg-card border rounded-2xl p-4 shadow-card card-hover">
                <div className={`size-9 rounded-xl ${m.bg} grid place-items-center mb-3`}><Icon className={`size-4 ${m.color}`} /></div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{m.label}</p>
                <p className="text-xl font-bold mt-1">{m.val}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{m.trend}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex border-b gap-1">
          {[
            { id: "leads", label: "Lead Management" },
            { id: "followups", label: "Follow-up Tracker" },
            { id: "campaigns", label: "Campaigns" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 text-sm font-semibold transition cursor-pointer border-b-2 -mb-px ${activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "leads" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><input type="text" placeholder="Search leads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-xl border bg-card outline-none focus:ring-2 ring-primary/30 text-sm" /></div>
              <button className="px-4 h-10 border rounded-xl text-sm font-semibold hover:bg-muted cursor-pointer flex items-center gap-2"><Filter className="size-4" /> Filter</button>
            </div>
            <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                    <th className="pb-3 pr-4">Lead</th>
                    <th className="pb-3 px-4">Source</th>
                    <th className="pb-3 px-4">Interest</th>
                    <th className="pb-3 px-4">Score</th>
                    <th className="pb-3 px-4 text-center">Status</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLeads.map(l => (
                    <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold text-sm">{l.name.charAt(0)}</div>
                          <div><p className="font-bold">{l.name}</p><p className="text-xs text-muted-foreground font-mono">{l.phone}</p></div>
                        </div>
                      </td>
                      <td className="py-4 px-4"><span className="badge-info">{l.source}</span></td>
                      <td className="py-4 px-4 text-muted-foreground">{l.interest}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="progress-bar w-16"><div className="progress-fill" style={{ width: `${l.score}%`, backgroundImage: l.score > 80 ? "var(--gradient-success)" : l.score > 50 ? "var(--gradient-warning)" : "var(--gradient-danger)" }} /></div>
                          <span className="text-xs font-bold">{l.score}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={l.status === "Hot Lead" ? "badge-error" : l.status === "Warm Lead" ? "badge-pending" : l.status === "Converted" ? "badge-active" : "badge-info"}>{l.status}</span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => toast.success(`Calling ${l.name}`)} className="size-8 rounded-lg border grid place-items-center hover:bg-muted cursor-pointer"><Phone className="size-3.5" /></button>
                          <button onClick={() => toast.success(`Messaging ${l.name}`)} className="size-8 rounded-lg border grid place-items-center hover:bg-muted cursor-pointer"><MessageSquare className="size-3.5" /></button>
                          <button onClick={() => toast.success(`Converting ${l.name} to patient`)} className="px-2.5 h-8 bg-gradient-primary text-white text-xs font-bold rounded-lg cursor-pointer">Convert</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "followups" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                    <th className="pb-3 pr-4">Patient</th>
                    <th className="pb-3 px-4">Reason</th>
                    <th className="pb-3 px-4">Doctor</th>
                    <th className="pb-3 px-4">Due</th>
                    <th className="pb-3 px-4">Priority</th>
                    <th className="pb-3 px-4 text-center">Status</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {followUps.map(f => (
                    <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 pr-4 font-bold">{f.patient}</td>
                      <td className="py-4 px-4 text-muted-foreground text-xs">{f.reason}</td>
                      <td className="py-4 px-4 text-muted-foreground text-xs">{f.doctor}</td>
                      <td className="py-4 px-4 font-semibold text-primary">{f.due}</td>
                      <td className="py-4 px-4"><span className={f.priority === "High" ? "badge-error" : f.priority === "Medium" ? "badge-pending" : "badge-info"}>{f.priority}</span></td>
                      <td className="py-4 px-4 text-center"><span className={f.status === "Scheduled" ? "badge-active" : "badge-pending"}>{f.status}</span></td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => toast.success(`Sending reminder to ${f.patient} via WhatsApp`)} className="px-2.5 h-8 bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 rounded-lg text-xs font-bold cursor-pointer">WhatsApp</button>
                          <button onClick={() => toast.success(`Follow-up scheduled for ${f.patient}`)} className="px-2.5 h-8 border rounded-lg text-xs font-bold hover:bg-muted cursor-pointer">Schedule</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "campaigns" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Active and past marketing campaigns</p>
              <button onClick={() => toast.success("Campaign builder — connect to WhatsApp Business API")} className="px-4 h-9 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-xl cursor-pointer flex items-center gap-2"><Plus className="size-4" /> New Campaign</button>
            </div>
            <div className="space-y-4">
              {campaigns.map(c => (
                <div key={c.id} className="bg-card border rounded-2xl p-5 shadow-card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold">{c.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.channel} · Started {c.start}</p>
                    </div>
                    <span className={c.status === "Active" ? "badge-active animate-pulse" : "badge-info"}>{c.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-xl">
                      <p className="text-lg font-bold">{c.sent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Sent</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-xl">
                      <p className="text-lg font-bold">{c.opened.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Opened ({Math.round(c.opened/c.sent*100)}%)</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <p className="text-lg font-bold text-emerald-600">{c.converted}</p>
                      <p className="text-xs text-muted-foreground">Converted ({Math.round(c.converted/c.sent*100)}%)</p>
                    </div>
                  </div>
                  <div className="mt-3 progress-bar"><div className="progress-fill" style={{ width: `${Math.round(c.converted/c.sent*100)}%` }} /></div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
