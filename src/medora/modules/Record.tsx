import { useState } from "react";
import { Download, Plus, Search, Syringe, FlaskConical, Stethoscope, Pill as PillI, FileText, StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chat, withPrefs } from "../groq";
import { ageOf, today, uid, useActive, usePData, seedEvents, seedMeds, type Ev, type Med } from "../store";
import { AIButton, CopyBtn, Md, PageHead, Panel, fmtDate, inputCls, useAI } from "../ui";

const ICON = { visit: Stethoscope, test: FlaskConical, vaccine: Syringe, medication: PillI, document: FileText, note: StickyNote };
const FILTERS = ["all", "visit", "test", "vaccine", "medication", "document", "note"] as const;

export default function Record() {
  const { profile } = useActive();
  const [events, setEvents] = usePData<Ev[]>("events", seedEvents); const [meds] = usePData<Med[]>("meds", seedMeds);
  const [f, setF] = useState<(typeof FILTERS)[number]>("all"); const [q, setQ] = useState(""); const [summary, setSummary] = useState("");
  const [nw, setNw] = useState<Omit<Ev, "id">>({ date: today(), type: "visit", title: "", detail: "" }); const [adding, setAdding] = useState(false);
  const { busy, run } = useAI("Health Record");
  const shown = [...events].filter((e) => (f === "all" || e.type === f) && (e.title + e.detail).toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date));
  const vax = events.filter((e) => e.type === "vaccine");
  const add = () => { if (!nw.title.trim()) return; setEvents((e) => [{ id: uid(), ...nw }, ...e]); setNw({ date: today(), type: "visit", title: "", detail: "" }); setAdding(false); };
  const exportJson = () => { const b = new Blob([JSON.stringify({ profile, medications: meds, timeline: events }, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `medora-${profile.name.replace(/\s+/g, "-")}.json`; a.click(); toast.success("Exported"); };
  const summarise = () => run("record summary", async () => setSummary(await chat([{ role: "system", content: withPrefs("Write a concise clinical-handover style health summary a patient can share with a new GP: demographics, conditions, allergies, current medications, recent events, vaccinations. Use short headed sections and bullets. No invented facts.") }, { role: "user", content: JSON.stringify({ profile: { ...profile, age: ageOf(profile.dob) }, meds, events }) }])));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <PageHead path="record" sub={`${profile.name} · ${ageOf(profile.dob)} yrs · Allergies: ${profile.allergies || "none"}`}
        right={<div className="flex gap-2"><Button variant="outline" className="rounded-full" onClick={exportJson}><Download />Export</Button><Button className="rounded-full" onClick={() => setAdding(!adding)}><Plus />Add entry</Button></div>} />
      {adding && <Panel className="grid sm:grid-cols-[130px_140px_1fr] gap-2">
        <input type="date" value={nw.date} onChange={(e) => setNw({ ...nw, date: e.target.value })} className={inputCls} />
        <select value={nw.type} onChange={(e) => setNw({ ...nw, type: e.target.value as Ev["type"] })} className={inputCls}>{FILTERS.slice(1).map((t) => <option key={t}>{t}</option>)}</select>
        <input value={nw.title} onChange={(e) => setNw({ ...nw, title: e.target.value })} placeholder="Title" className={inputCls} />
        <input value={nw.detail} onChange={(e) => setNw({ ...nw, detail: e.target.value })} placeholder="Details" className={cn(inputCls, "sm:col-span-2")} />
        <Button onClick={add} className="rounded-xl">Save</Button></Panel>}
      <div className="grid md:grid-cols-[1fr_260px] gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[160px]"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your record…" className={cn(inputCls, "pl-9")} /></div>
            <div className="flex gap-1 flex-wrap">{FILTERS.map((t) => <button key={t} onClick={() => setF(t)} className={cn("px-2.5 py-1 rounded-full text-xs border capitalize", f === t ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{t}</button>)}</div>
          </div>
          <Panel>{shown.length ? shown.map((e) => { const I = ICON[e.type]; return (
            <div key={e.id} className="timeline-item pb-5 group"><span className="timeline-dot" />
              <div className="flex items-start justify-between gap-2"><div><p className="text-xs text-muted-foreground">{fmtDate(e.date)}</p><p className="font-medium flex items-center gap-1.5 text-sm"><I className="size-3.5 text-primary" />{e.title}</p><p className="text-sm text-muted-foreground">{e.detail}</p></div>
                <button aria-label="Delete" onClick={() => setEvents((x) => x.filter((y) => y.id !== e.id))} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button></div></div>); }) : <p className="text-sm text-muted-foreground text-center py-8">Nothing here yet.</p>}</Panel>
        </div>
        <div className="space-y-4">
          <Panel><h3 className="font-semibold text-sm mb-2">Vaccinations</h3>{vax.length ? vax.map((v) => <p key={v.id} className="text-sm">{v.title}<span className="block text-xs text-muted-foreground">{fmtDate(v.date)}</span></p>) : <p className="text-xs text-muted-foreground">None recorded</p>}</Panel>
          <Panel><h3 className="font-semibold text-sm mb-2">Current medicines</h3>{meds.length ? meds.map((m) => <p key={m.id} className="text-sm">{m.name} <span className="text-muted-foreground">{m.dose}</span></p>) : <p className="text-xs text-muted-foreground">None recorded</p>}</Panel>
          <Panel className="space-y-2"><h3 className="font-semibold text-sm">Share with a clinician</h3><AIButton busy={busy} size="sm" onClick={summarise}>Generate AI summary</AIButton></Panel>
        </div>
      </div>
      {summary && <Panel><div className="flex justify-between mb-2"><h3 className="font-semibold text-sm">Health summary</h3><CopyBtn text={summary} /></div><Md text={summary} /></Panel>}
    </div>
  );
}
