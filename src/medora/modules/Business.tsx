import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CARE_GAPS, DEMAND, EMPLOYER, FLOW, WAITING } from "../data";
import { askJSON, chatStream, withPrefs, type Msg } from "../groq";
import { AIButton, Disclaimer, Md, PageHead, Panel, Pill, inputCls, useAI } from "../ui";

const Kpi = ({ label, value, sub }: { label: string; value: string; sub?: string }) => <Panel className="!p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-display font-bold mt-1">{value}</p>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</Panel>;
const Recs = ({ items }: { items: { title: string; detail: string; impact: string }[] }) => <div className="grid sm:grid-cols-2 gap-3">{items.map((r, i) => <div key={i} className="rounded-xl border p-3 text-sm bg-emerald-50/50 dark:bg-emerald-950/20"><p className="font-semibold">{r.title}</p><p className="text-muted-foreground mt-1">{r.detail}</p><Pill cls="mt-2 bg-emerald-100 text-emerald-700">{r.impact}</Pill></div>)}</div>;
const grid = <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />;

export function Intelligence() {
  const [recs, setRecs] = useState<{ title: string; detail: string; impact: string }[]>([]); const { busy, run } = useAI("Healthcare Intelligence");
  const go = () => run("recommendations", async () => setRecs((await askJSON<{ recommendations: typeof recs }>(`You are a healthcare operations analyst for a London GP/clinic network. Return {"recommendations":[{"title":"","detail":"one or two sentences, specific to the numbers","impact":"short expected impact"}]} with 4 items.`, JSON.stringify({ flowByHour: FLOW, demandForecast: DEMAND, careGaps: CARE_GAPS }))).recommendations));
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <PageHead path="intelligence" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Kpi label="Patients today" value="266" sub="+8% vs last Tue" /><Kpi label="Avg wait" value="17 min" sub="peak 31 min at 10:00" /><Kpi label="No-show rate" value="9.4%" sub="target < 6%" /><Kpi label="Open care gaps" value="527" sub="87 high risk" /></div>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel><h3 className="font-semibold text-sm mb-2">Patient flow by hour</h3><div className="h-56"><ResponsiveContainer><AreaChart data={FLOW}>{grid}<XAxis dataKey="hour" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Area dataKey="arrivals" stroke="#2563eb" fill="#2563eb33" /><Area dataKey="waiting" stroke="#f59e0b" fill="#f59e0b33" /></AreaChart></ResponsiveContainer></div></Panel>
        <Panel><h3 className="font-semibold text-sm mb-2">Demand: actual vs forecast</h3><div className="h-56"><ResponsiveContainer><LineChart data={DEMAND}>{grid}<XAxis dataKey="day" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line dataKey="actual" stroke="#059669" strokeWidth={2} /><Line dataKey="forecast" stroke="#7c3aed" strokeDasharray="5 4" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Panel>
      </div>
      <Panel><h3 className="font-semibold text-sm mb-2">Care-gap detection</h3><div className="divide-y">{CARE_GAPS.map((g) => <div key={g.gap} className="flex items-center justify-between py-2 text-sm"><span>{g.gap}</span><span className="flex gap-2 items-center"><b>{g.n}</b><Pill cls={g.risk === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"}>{g.risk}</Pill></span></div>)}</div></Panel>
      <Panel className="space-y-3"><AIButton busy={busy} onClick={go}><Sparkles />Generate AI recommendations</AIButton>{recs.length > 0 && <Recs items={recs} />}</Panel>
      <Disclaimer>Illustrative operational data for the demo.</Disclaimer>
    </div>
  );
}

export function Employer() {
  const [plan, setPlan] = useState(""); const { busy, run } = useAI("Employer");
  const go = () => run("wellbeing plan", async () => { setPlan(""); await chatStream([{ role: "system", content: withPrefs("You design workplace wellbeing programmes for UK employers. Given anonymous aggregate stats, write a 90-day plan: 4 prioritised initiatives (what, who, how to measure), quick wins for week 1, and occupational-health coordination tips. Never reference individuals. Under 250 words, use bullets.") }, { role: "user", content: JSON.stringify(EMPLOYER) }], setPlan); });
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <PageHead path="employer" sub="Anonymous, aggregate-only insight (minimum group size of 10 applies in production)." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Kpi label="Employees" value={String(EMPLOYER.headcount)} /><Kpi label="Using Medora" value={`${Math.round(EMPLOYER.participation * 100)}%`} /><Kpi label="Absence rate" value="2.7%" sub="-0.6 pts vs Aug" /><Kpi label="Health checks booked" value="112" /></div>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel><h3 className="font-semibold text-sm mb-2">Sickness absence % by month</h3><div className="h-52"><ResponsiveContainer><LineChart data={EMPLOYER.absence}>{grid}<XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line dataKey="v" stroke="#e11d48" strokeWidth={2} /></LineChart></ResponsiveContainer></div></Panel>
        <Panel><h3 className="font-semibold text-sm mb-2">Top health themes (% of enquiries)</h3><div className="h-52"><ResponsiveContainer><BarChart data={EMPLOYER.themes} layout="vertical" margin={{ left: 40 }}>{grid}<XAxis type="number" fontSize={11} /><YAxis type="category" dataKey="t" fontSize={11} width={110} /><Tooltip /><Bar dataKey="v" fill="#7c3aed" radius={4} /></BarChart></ResponsiveContainer></div></Panel>
      </div>
      <Panel className="space-y-3"><AIButton busy={busy} onClick={go}><Sparkles />Generate 90-day wellbeing plan</AIButton>{plan && <Md text={plan} />}</Panel>
      <Disclaimer>Employers never see individual health data — only anonymised aggregates.</Disclaimer>
    </div>
  );
}

export function Clinic() {
  const [tab, setTab] = useState<"receptionist" | "waiting">("receptionist");
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([{ role: "assistant", content: "Hello, you've reached Camden Family Practice. How can I help — book, cancel, or a question about your appointment?" }]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState<Record<string, string>>({}); const { busy: b2, run } = useAI("Clinic");
  const send = async () => {
    const t = input.trim(); if (!t || busy) return; const next = [...msgs, { role: "user" as const, content: t }]; setMsgs([...next, { role: "assistant", content: "" }]); setInput(""); setBusy(true);
    try { await chatStream([{ role: "system", content: withPrefs("You are the AI receptionist for Camden Family Practice (NHS GP surgery, London). Open Mon–Fri 8am–6:30pm. Available slots: Tue 10:20, Tue 15:40, Wed 09:10, Thu 11:30. Collect name, date of birth and reason before confirming a booking. Triage: if the caller describes chest pain, breathing difficulty, stroke signs or severe bleeding, tell them to call 999 immediately. Keep replies to 1-3 short sentences, phone-call style.") }, ...(next as Msg[])], (f) => setMsgs([...next, { role: "assistant", content: f }])); }
    catch (e) { setMsgs(next); (await import("sonner")).toast.error(e instanceof Error ? e.message : "Failed"); } finally { setBusy(false); }
  };
  const nudge = (p: (typeof WAITING)[number]) => run("patient message", async () => { const r = await askJSON<{ sms: string }>(`Write a friendly SMS (max 300 chars) from Camden Family Practice reminding the patient of their upcoming appointment and making it easy to confirm or rebook. Tailor to the note. Return {"sms":""}.`, `Patient ${p.name}, ${p.proc}, waiting ${p.days} days. Note: ${p.note || "none"}. No-show risk ${Math.round(p.noShow * 100)}%.`); setMsg((m) => ({ ...m, [p.name]: r.sms })); });
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <PageHead path="clinic" />
      <div className="flex gap-2">{(["receptionist", "waiting"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-1.5 rounded-full text-sm border", tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{t === "receptionist" ? "AI receptionist" : "Waiting list & no-shows"}</button>)}</div>
      {tab === "receptionist" ? (
        <Panel className="max-w-2xl"><div className="space-y-2 max-h-[46vh] overflow-y-auto mb-3">{msgs.map((m, i) => <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "")}><div className={cn("rounded-2xl px-4 py-2 text-sm max-w-[85%]", m.role === "user" ? "bg-gradient-primary text-primary-foreground" : "bg-muted")}>{m.content || "…"}</div></div>)}</div>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}><input className={inputCls} value={input} onChange={(e) => setInput(e.target.value)} placeholder='Try: "Hi, I need an appointment for my son, he has an ear ache"' /><Button type="submit" size="icon" disabled={busy} className="rounded-xl"><Send /></Button></form></Panel>
      ) : (
        <Panel><div className="divide-y">{WAITING.map((p) => <div key={p.name} className="py-3 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><div><b>{p.name}</b> · {p.proc} <span className="text-muted-foreground">· waiting {p.days} days</span></div>
          <div className="flex items-center gap-2"><Pill cls={p.noShow > 0.4 ? "bg-red-100 text-red-700" : p.noShow > 0.2 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}>no-show risk {Math.round(p.noShow * 100)}%</Pill><AIButton size="sm" busy={b2} onClick={() => nudge(p)}>Draft reminder</AIButton></div></div>
          {p.note && <p className="text-xs text-muted-foreground mt-1">{p.note}</p>}{msg[p.name] && <p className="mt-2 text-sm rounded-lg bg-muted px-3 py-2">{msg[p.name]}</p>}</div>)}</div></Panel>
      )}
      <Disclaimer>Simulated data. Do not enter real patient details.</Disclaimer>
    </div>
  );
}
