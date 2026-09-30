import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, Users, IndianRupee, FlaskConical, Pill, Download, Calendar } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "sonner";

const revenueData = [
  { month: "Jan", consultation: 180000, lab: 45000, pharmacy: 32000, total: 257000 },
  { month: "Feb", consultation: 210000, lab: 52000, pharmacy: 38000, total: 300000 },
  { month: "Mar", consultation: 195000, lab: 48000, pharmacy: 35000, total: 278000 },
  { month: "Apr", consultation: 265000, lab: 68000, pharmacy: 52000, total: 385000 },
  { month: "May", consultation: 298000, lab: 74000, pharmacy: 56000, total: 428000 },
  { month: "Jun", consultation: 345000, lab: 89000, pharmacy: 78000, total: 512000 },
];

const patientGrowth = [
  { week: "W1", new: 45, returning: 120 },
  { week: "W2", new: 52, returning: 135 },
  { week: "W3", new: 38, returning: 142 },
  { week: "W4", new: 67, returning: 158 },
  { week: "W5", new: 71, returning: 165 },
  { week: "W6", new: 83, returning: 178 },
];

const doctorPerf = [
  { name: "Dr. Maya Patel", consultations: 84, revenue: 126000, rating: 4.9, satisfaction: 96 },
  { name: "Dr. Rajesh Sharma", consultations: 112, revenue: 168000, rating: 5.0, satisfaction: 98 },
  { name: "Dr. Aisha Khan", consultations: 67, revenue: 100500, rating: 4.8, satisfaction: 94 },
  { name: "Dr. Priya Nair", consultations: 45, revenue: 67500, rating: 4.7, satisfaction: 92 },
];

const pieData = [
  { name: "Consultation", value: 345000, color: "#3b82f6" },
  { name: "Laboratory", value: 89000, color: "#10b981" },
  { name: "Pharmacy", value: 78000, color: "#f59e0b" },
  { name: "Procedures", value: 32000, color: "#8b5cf6" },
];

const labData = [
  { month: "Jan", tests: 210 }, { month: "Feb", tests: 245 }, { month: "Mar", tests: 228 },
  { month: "Apr", tests: 295 }, { month: "May", tests: 354 }, { month: "Jun", tests: 401 },
];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month");

  const kpis = [
    { label: "Total Revenue", val: "₹5.12L", sub: "June 2026", icon: IndianRupee, trend: "+19.5%", up: true, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "New Patients", val: "83", sub: "This week", icon: Users, trend: "+16.9%", up: true, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Consultations", val: "401", sub: "June 2026", icon: BarChart3, trend: "+13.3%", up: true, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Lab Tests", val: "401", sub: "June 2026", icon: FlaskConical, trend: "+11.2%", up: true, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Pharmacy Revenue", val: "₹78K", sub: "June 2026", icon: Pill, trend: "+39.3%", up: true, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Avg. CSAT Score", val: "95%", sub: "Patient satisfaction", icon: TrendingUp, trend: "+2%", up: true, color: "text-teal-500", bg: "bg-teal-500/10" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-[#0B1B2B]/30 p-4 sm:p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="size-9 rounded-xl border bg-card grid place-items-center hover:bg-muted cursor-pointer"><ArrowLeft className="size-4" /></button>
            <div>
              <h1 className="text-2xl font-bold font-display">Analytics Dashboard</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Platform-wide performance metrics · HealFlow AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-xl overflow-hidden">
              {(["week", "month", "quarter", "year"] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-3 h-9 text-xs font-semibold capitalize cursor-pointer transition ${period === p ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{p}</button>
              ))}
            </div>
            <button onClick={() => toast.success("Exporting analytics report as CSV...")} className="px-4 h-9 border rounded-xl text-sm font-semibold hover:bg-muted cursor-pointer flex items-center gap-2"><Download className="size-4" /> Export</button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i} className="bg-card border rounded-2xl p-4 shadow-card card-hover">
                <div className={`size-9 rounded-xl ${k.bg} grid place-items-center mb-3`}><Icon className={`size-4 ${k.color}`} /></div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-tight">{k.label}</p>
                <p className="text-xl font-bold mt-1">{k.val}</p>
                <p className="text-xs text-muted-foreground">{k.sub}</p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full mt-1 inline-block">{k.trend}</span>
              </div>
            );
          })}
        </div>

        {/* Revenue Breakdown */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border rounded-3xl p-6 shadow-card">
            <div className="flex justify-between items-center mb-6">
              <div><h3 className="font-semibold text-lg">Revenue Breakdown by Service</h3><p className="text-xs text-muted-foreground">Consultation · Laboratory · Pharmacy (₹)</p></div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1"><TrendingUp className="size-3" /> +19.5% MoM</span>
            </div>
            <div className="chart-container h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="consultGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="labGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    <linearGradient id="pharmaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: any, n: string) => [`₹${(v/1000).toFixed(1)}K`, n.charAt(0).toUpperCase() + n.slice(1)]} />
                  <Area type="monotone" dataKey="consultation" stroke="#3b82f6" strokeWidth={2} fill="url(#consultGrad)" />
                  <Area type="monotone" dataKey="lab" stroke="#10b981" strokeWidth={2} fill="url(#labGrad)" />
                  <Area type="monotone" dataKey="pharmacy" stroke="#f59e0b" strokeWidth={2} fill="url(#pharmaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border rounded-3xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Revenue by Category</h3>
            <div className="chart-container h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`₹${(v/1000).toFixed(0)}K`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {pieData.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className="size-2.5 rounded-full" style={{ background: p.color }} /><span>{p.name}</span></div>
                  <span className="font-bold">₹{(p.value/1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Growth + Doctor Performance */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-3xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Patient Growth (New vs Returning)</h3>
            <div className="chart-container h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="new" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New Patients" />
                  <Bar dataKey="returning" fill="#10b981" radius={[4, 4, 0, 0]} name="Returning" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border rounded-3xl p-6 shadow-card">
            <h3 className="font-semibold mb-4">Lab Test Volume Trend</h3>
            <div className="chart-container h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={labData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="tests" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: "#f59e0b" }} name="Tests" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Doctor Performance Table */}
        <div className="bg-card border rounded-3xl p-6 shadow-card overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Doctor Performance Overview</h3>
            <button onClick={() => toast.success("Exporting doctor performance report")} className="px-3 h-8 border rounded-xl text-xs font-semibold hover:bg-muted cursor-pointer flex items-center gap-1.5"><Download className="size-3.5" /> Export</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-muted-foreground font-bold text-xs uppercase tracking-wider">
                <th className="pb-3 pr-4">Doctor</th>
                <th className="pb-3 px-4">Consultations</th>
                <th className="pb-3 px-4">Revenue</th>
                <th className="pb-3 px-4">Rating</th>
                <th className="pb-3 pl-4">Patient Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {doctorPerf.map((d, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center font-bold text-sm">{d.name.charAt(4)}</div>
                      <p className="font-bold">{d.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold">{d.consultations}</td>
                  <td className="py-4 px-4 font-semibold text-primary">₹{(d.revenue/1000).toFixed(0)}K</td>
                  <td className="py-4 px-4 text-amber-500 font-bold">★ {d.rating}</td>
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-2">
                      <div className="progress-bar flex-1 max-w-24"><div className="progress-fill" style={{ width: `${d.satisfaction}%` }} /></div>
                      <span className="text-sm font-bold">{d.satisfaction}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
