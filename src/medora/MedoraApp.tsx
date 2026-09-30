import { lazy, Suspense, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { ArrowRight, Brain, Building2, CalendarCheck, Clock, FileText, Globe, Hospital, KeyRound, MapPin, Menu, Pill, Route as RouteI, ShieldCheck, Stethoscope, Users, X, Activity, ChevronRight, Sparkles, Search, Calendar, BookOpen, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MODULES, TONES } from "./data";
import { getKey, setKey } from "./groq";
import { useActive, usePrefs, resetAll, usePData, seedAppts, seedEvents, seedMeds } from "./store";
import Navigator from "./modules/Navigator";
import Finder from "./modules/Finder";
import CareAgent from "./modules/CareAgent";
import Documents from "./modules/Documents";
import Record from "./modules/Record";
import Appointments from "./modules/Appointments";
import Medications from "./modules/Medications";
import Family from "./modules/Family";
import Copilot from "./modules/Copilot";
import { Accessibility, Privacy } from "./modules/Settings";
const Biz = { Intelligence: lazy(() => import("./modules/Business").then((m) => ({ default: m.Intelligence }))), Employer: lazy(() => import("./modules/Business").then((m) => ({ default: m.Employer }))), Clinic: lazy(() => import("./modules/Business").then((m) => ({ default: m.Clinic }))) };

const ICONS = [Brain, MapPin, RouteI, FileText, Clock, CalendarCheck, Pill, Users, Stethoscope, Activity, Globe, ShieldCheck, Building2, Hospital];
const JOURNEY = [["Understand", "navigator"], ["Find", "finder"], ["Book", "appointments"], ["Prepare", "appointments"], ["Attend", "copilot"], ["Follow up", "care-agent"]] as const;

function Hub() {
  const { profile } = useActive();
  const [appts] = usePData("appts", seedAppts);
  const [events] = usePData("events", seedEvents);
  const [meds] = usePData("meds", seedMeds);

  const upcomingAppt = appts.find((a) => a.status === "Upcoming") || appts[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* 1. Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900">
            Good morning, {profile.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-lg text-slate-600">How can Medora help you today?</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700 shadow-sm">
            <MapPin className="size-4 text-slate-500" /> London
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100 shadow-sm">
            NHS / Private / Community
          </span>
        </div>
      </header>

      {/* 2. Hero AI Navigator */}
      <section className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white overflow-hidden shadow-xl border border-indigo-800">
        <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none">
          <Sparkles className="size-48 text-violet-400" />
        </div>
        <div className="relative p-6 md:p-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="size-6 text-violet-400" />
            How can we help you today?
          </h2>
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-indigo-300" />
              <input 
                type="text" 
                placeholder="Tell Medora what you need help with..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-violet-400 backdrop-blur-md transition-all shadow-inner"
              />
            </div>
            <Link to="/medora/navigator" className="px-8 py-4 rounded-2xl bg-white text-indigo-950 font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-lg">
              Ask Medora
              <ArrowRight className="size-5" />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["I have a symptom", "Find a GP", "Understand a report", "Prepare for an appointment"].map(q => (
              <Link key={q} to="/medora/navigator" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium backdrop-blur-sm">
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Healthcare Journey */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-slate-900">Your Healthcare Journey</h3>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-0 justify-between relative">
          <div className="hidden md:block absolute left-8 right-8 top-6 h-0.5 bg-slate-100 z-0" />
          {[
            { l: "Understand", p: "navigator", active: false, icon: BookOpen },
            { l: "Find", p: "finder", active: false, icon: Search },
            { l: "Book", p: "appointments", active: false, icon: Calendar },
            { l: "Prepare", p: "appointments", active: true, icon: ClipboardList },
            { l: "Attend", p: "copilot", active: false, icon: MapPin },
            { l: "Follow up", p: "care-agent", active: false, icon: Activity }
          ].map((step, i) => (
            <Link key={step.l} to={`/medora/${step.p}`} className={cn("relative z-10 flex flex-col items-center gap-3 group w-[4.5rem] md:w-24", step.active ? "opacity-100" : "opacity-60 hover:opacity-100 transition-opacity")}>
              <div className={cn("size-12 rounded-2xl flex items-center justify-center border-2 transition-transform group-hover:scale-110 shadow-sm", step.active ? "bg-indigo-50 border-indigo-500 text-indigo-600" : "bg-white border-slate-200 text-slate-500")}>
                <step.icon className="size-5" />
              </div>
              <span className={cn("text-xs font-bold text-center", step.active ? "text-indigo-900" : "text-slate-500")}>{step.l}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Grid for 4, 5, 6, 7 */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* 4. Upcoming Appointment & 6. AI Insight */}
        <div className="md:col-span-2 space-y-6">
          {upcomingAppt ? (
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center transition-all hover:shadow-md">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-indigo-700 text-xs font-bold shadow-sm border border-indigo-100 mb-4">
                  <Calendar className="size-3.5" /> Upcoming Appointment
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900">{upcomingAppt.title}</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600 font-medium">
                  <p className="flex items-center gap-2"><MapPin className="size-4 text-indigo-400" /> {upcomingAppt.place}</p>
                  <p className="flex items-center gap-2"><Clock className="size-4 text-indigo-400" /> {new Date(upcomingAppt.date).toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' })} at {upcomingAppt.time}</p>
                  <p className="flex items-center gap-2"><Stethoscope className="size-4 text-indigo-400" /> {upcomingAppt.with}</p>
                </div>
              </div>
              <div className="w-full sm:w-auto flex flex-col gap-3 shrink-0">
                <Link to="/medora/appointments" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-center shadow-sm">
                  Prepare for appointment
                </Link>
                <Link to="/medora/appointments" className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors text-center shadow-sm">
                  View appointment
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center h-48 shadow-sm">
              <Calendar className="size-8 text-slate-300 mb-3" />
              <h3 className="font-medium text-slate-900">No upcoming appointments</h3>
              <Link to="/medora/finder" className="mt-3 text-sm text-indigo-600 font-medium hover:underline">Find care in London</Link>
            </div>
          )}

          {/* AI Insight */}
          <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 p-5 flex items-start gap-4 shadow-sm">
            <div className="size-10 rounded-full bg-white shadow-sm text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h4 className="font-bold text-violet-950 mb-1">Medora Insight</h4>
              <p className="text-sm text-violet-900/80 leading-relaxed font-medium">
                {upcomingAppt 
                  ? "Your appointment is coming up. Medora can help you prepare your questions and documents to ensure you get the most out of your visit."
                  : "You're up to date. Based on your health record, consider scheduling your annual health review this month."}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Health Overview & 7. Quick actions */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/medora/finder" className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200 transition-all flex flex-col gap-3 group shadow-sm">
              <Search className="size-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 text-sm">Find Care</span>
            </Link>
            <Link to="/medora/appointments" className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200 transition-all flex flex-col gap-3 group shadow-sm">
              <Calendar className="size-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 text-sm">Appointments</span>
            </Link>
            <Link to="/medora/record" className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200 transition-all flex flex-col gap-3 group shadow-sm">
              <FileText className="size-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 text-sm">Health Record</span>
            </Link>
            <Link to="/medora/documents" className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200 transition-all flex flex-col gap-3 group shadow-sm">
              <BookOpen className="size-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 text-sm">Documents</span>
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Health Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Activity className="size-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Health Events</span>
                </div>
                <span className="text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-200">{events.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Pill className="size-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Medications</span>
                </div>
                <span className="text-sm font-bold text-slate-900 bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-200">{meds.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Explore Medora */}
      <section className="pt-10 mt-6 border-t border-slate-200">
        <h3 className="text-xl font-bold mb-6 text-slate-900">Explore Medora</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MODULES.map((m, i) => { const I = ICONS[i]; const t = TONES[m.tone]; return (
            <Link key={m.path} to={`/medora/${m.path}`} className={cn("group flex flex-col justify-between rounded-2xl p-4 border transition-all hover:shadow-md hover:-translate-y-0.5 bg-white", t.soft, "border-slate-200 hover:border-slate-300")}>
              <div>
                <div className="flex items-center justify-between">
                  <span className={cn("grid place-items-center size-8 rounded-full text-white text-sm font-bold shadow-sm", t.chip)}>{m.n}</span>
                  <I className={cn("size-5", t.text)} />
                </div>
                <h4 className="font-display font-bold mt-4 text-slate-900 leading-snug">{m.title}</h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{m.tag}</p>
              </div>
              {m.ai && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-1 rounded-md">
                    <Sparkles className="size-3" /> Live Groq AI
                  </span>
                </div>
              )}
            </Link>); })}
        </div>
      </section>
    </div>
  );
}

export default function MedoraApp() {
  const [prefs] = usePrefs(); const { profile, profiles, setActive } = useActive(); const loc = useLocation();
  const [keyOpen, setKeyOpen] = useState(false); const [key, setK] = useState(getKey()); const [menu, setMenu] = useState(false);

  useEffect(() => {
    const r = document.documentElement;
    r.style.fontSize = ["100%", "112.5%", "125%"][prefs.large]; r.classList.toggle("medora-contrast", prefs.contrast);
    return () => { r.style.fontSize = ""; r.classList.remove("medora-contrast"); };
  }, [prefs.large, prefs.contrast]);
  useEffect(() => { const f = () => setKeyOpen(true); window.addEventListener("medora:key", f); if (!getKey()) setKeyOpen(true); return () => window.removeEventListener("medora:key", f); }, []);
  useEffect(() => setMenu(false), [loc.pathname]);

  const nav = (
    <nav className="space-y-0.5">
      <NavLink to="/medora" end className={({ isActive }) => cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium", isActive ? "bg-primary/10 text-primary" : "hover:bg-muted")}>Overview</NavLink>
      {MODULES.map((m) => <NavLink key={m.path} to={`/medora/${m.path}`} className={({ isActive }) => cn("flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm", isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground/80")}>
        <span className={cn("grid place-items-center size-5 rounded-full text-white text-[10px] font-bold shrink-0", TONES[m.tone].chip)}>{m.n}</span><span className="truncate">{m.title}</span></NavLink>)}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 h-14 border-b bg-background/85 backdrop-blur flex items-center gap-3 px-4">
        <button className="lg:hidden" aria-label="Menu" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        <Link to="/medora" className="flex items-center gap-2 font-display font-bold"><span className="grid place-items-center size-8 rounded-xl bg-gradient-primary text-primary-foreground"><Stethoscope className="size-4" /></span>Medora</Link>
        <div className="ml-auto flex items-center gap-2">
          <select aria-label="Active family member" value={profile.id} onChange={(e) => setActive(e.target.value)} className="rounded-full border bg-card px-3 py-1.5 text-sm">{profiles.map((p) => <option key={p.id} value={p.id}>{p.name}{p.relation !== "Myself" ? ` (${p.relation})` : ""}</option>)}</select>
          <Button variant="outline" size="icon" className="rounded-full relative" aria-label="Groq API key" onClick={() => setKeyOpen(true)}><KeyRound /><span className={cn("absolute -top-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background", getKey() ? "bg-emerald-500" : "bg-red-500")} /></Button>
          <Link to="/" className="hidden sm:block text-xs text-muted-foreground hover:text-foreground">← Website</Link>
        </div>
      </header>
      <div className="flex">
        <aside className={cn("w-64 shrink-0 border-r p-3 overflow-y-auto bg-background", "fixed lg:sticky top-14 z-20 h-[calc(100vh-3.5rem)] transition-transform", menu ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>{nav}</aside>
        <main className="flex-1 min-w-0 p-4 md:p-8">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
            <Routes>
              <Route index element={<Hub />} />
              <Route path="navigator" element={<Navigator />} /><Route path="finder" element={<Finder />} /><Route path="care-agent" element={<CareAgent />} />
              <Route path="documents" element={<Documents />} /><Route path="record" element={<Record />} /><Route path="appointments" element={<Appointments />} />
              <Route path="medications" element={<Medications />} /><Route path="family" element={<Family />} /><Route path="copilot" element={<Copilot />} />
              <Route path="intelligence" element={<Biz.Intelligence />} /><Route path="employer" element={<Biz.Employer />} /><Route path="clinic" element={<Biz.Clinic />} />
              <Route path="accessibility" element={<Accessibility />} /><Route path="privacy" element={<Privacy />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Dialog open={keyOpen} onOpenChange={setKeyOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Connect Groq</DialogTitle><DialogDescription>Paste your Groq API key (free at console.groq.com/keys). It is stored only in this browser and sent only to api.groq.com.</DialogDescription></DialogHeader>
          <input value={key} onChange={(e) => setK(e.target.value)} type="password" placeholder="gsk_…" className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
          <div className="flex justify-between gap-2"><Button variant="ghost" onClick={() => { resetAll(); toast.success("Demo data reset"); }}>Reset demo data</Button><Button className="rounded-full" onClick={() => { setKey(key); setKeyOpen(false); toast.success(key ? "Groq connected" : "Key removed"); }}>Save</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
