import { useState } from "react";
import { AlertTriangle, BellRing, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { askJSON } from "../groq";
import { today, uid, useActive, usePData, seedMeds, type Med } from "../store";
import { AIButton, Disclaimer, PageHead, Panel, Pill, fmtDate, inputCls, useAI } from "../ui";

type Check = { overall: string; issues: { medicines: string; severity: "high" | "moderate" | "low"; explanation: string; advice: string }[]; allergy_alerts: string[]; general_advice: string };
const SEV = { high: "bg-red-100 text-red-700", moderate: "bg-amber-100 text-amber-800", low: "bg-sky-100 text-sky-700" };

export default function Medications() {
  const { profile } = useActive(); const [meds, setMeds] = usePData<Med[]>("meds", seedMeds);
  const [taken, setTaken] = usePData<Record<string, boolean>>("taken", () => ({}));
  const [nw, setNw] = useState({ name: "", dose: "", times: "08:00", notes: "", refill: "" }); const [adding, setAdding] = useState(false);
  const [res, setRes] = useState<Check | null>(null); const { busy, run } = useAI("Medication");
  const doses = meds.flatMap((m) => m.times.map((t) => ({ m, t, key: `${today()}|${m.id}|${t}` }))).sort((a, b) => a.t.localeCompare(b.t));
  const done = doses.filter((d) => taken[d.key]).length; const now = new Date().toTimeString().slice(0, 5);
  const nextDue = doses.find((d) => !taken[d.key] && d.t >= now) ?? doses.find((d) => !taken[d.key]);
  const add = () => { if (!nw.name.trim()) return; setMeds((m) => [...m, { id: uid(), name: nw.name, dose: nw.dose, times: nw.times.split(",").map((s) => s.trim()).filter(Boolean), notes: nw.notes, refill: nw.refill }]); setNw({ name: "", dose: "", times: "08:00", notes: "", refill: "" }); setAdding(false); };
  const check = () => run("interaction check", async () => setRes(await askJSON<Check>(`Review this medicine list for a UK patient for interactions and allergy conflicts. Schema: {"overall":"1-2 sentence verdict","issues":[{"medicines":"A + B","severity":"high|moderate|low","explanation":"","advice":"what to ask pharmacist/GP"}],"allergy_alerts":[""],"general_advice":""}. If no issues, return empty arrays. Do not tell the patient to stop any medicine; advise speaking to a pharmacist or GP.`, `Patient: ${profile.name}; conditions: ${profile.conditions || "none"}; allergies: ${profile.allergies}\nMedicines: ${meds.map((m) => `${m.name} ${m.dose} ${m.notes}`).join("; ")}`)));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <PageHead path="medications" sub={`${profile.name} · allergies: ${profile.allergies || "none"}`} right={<Button className="rounded-full" onClick={() => setAdding(!adding)}><Plus />Add medicine</Button>} />
      {adding && <Panel className="grid sm:grid-cols-3 gap-2">
        <input className={inputCls} placeholder="Name" value={nw.name} onChange={(e) => setNw({ ...nw, name: e.target.value })} />
        <input className={inputCls} placeholder="Dose (e.g. 10 mg)" value={nw.dose} onChange={(e) => setNw({ ...nw, dose: e.target.value })} />
        <input className={inputCls} placeholder="Times, comma separated" value={nw.times} onChange={(e) => setNw({ ...nw, times: e.target.value })} />
        <input className={inputCls} placeholder="Notes" value={nw.notes} onChange={(e) => setNw({ ...nw, notes: e.target.value })} />
        <input type="date" className={inputCls} value={nw.refill} onChange={(e) => setNw({ ...nw, refill: e.target.value })} />
        <Button onClick={add} className="rounded-xl">Save</Button></Panel>}
      <div className="grid md:grid-cols-2 gap-4">
        <Panel>
          <div className="flex justify-between items-center mb-3"><h3 className="font-semibold">Today's doses</h3><Pill>{done}/{doses.length} taken</Pill></div>
          <div className="h-2 rounded-full bg-muted overflow-hidden mb-3"><div className="h-full bg-gradient-success transition-all" style={{ width: `${doses.length ? (done / doses.length) * 100 : 0}%` }} /></div>
          {nextDue && <p className="text-xs rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 px-3 py-2 mb-3 flex items-center gap-2"><BellRing className="size-3.5" />Next: {nextDue.m.name} {nextDue.m.dose} at {nextDue.t}<button className="ml-auto underline" onClick={() => toast(`💊 Time for ${nextDue.m.name} ${nextDue.m.dose}`, { description: nextDue.m.notes || "Reminder (demo)" })}>test reminder</button></p>}
          {doses.length ? doses.map((d) => <label key={d.key} className="flex items-center gap-3 py-2 border-b last:border-0 text-sm cursor-pointer"><input type="checkbox" checked={!!taken[d.key]} onChange={() => setTaken((t) => ({ ...t, [d.key]: !t[d.key] }))} /><span className="w-12 text-muted-foreground">{d.t}</span><span className={cn(taken[d.key] && "line-through text-muted-foreground")}>{d.m.name} {d.m.dose}</span></label>) : <p className="text-sm text-muted-foreground">No scheduled doses.</p>}
        </Panel>
        <Panel>
          <h3 className="font-semibold mb-3">All medicines</h3>
          {meds.map((m) => { const days = m.refill ? Math.ceil((new Date(m.refill).getTime() - Date.now()) / 864e5) : null; return (
            <div key={m.id} className="flex items-start justify-between gap-2 py-2 border-b last:border-0 text-sm group">
              <div><p className="font-medium">{m.name} <span className="text-muted-foreground font-normal">{m.dose}</span></p><p className="text-xs text-muted-foreground">{m.times.length ? m.times.join(", ") : "As needed"}{m.notes && ` · ${m.notes}`}</p>
                {days !== null && <Pill cls={days <= 7 ? "bg-red-100 text-red-700 mt-1" : "mt-1"}>Refill {days <= 0 ? "due now" : `in ${days} days`} · {fmtDate(m.refill!)}</Pill>}</div>
              <button aria-label="Remove" onClick={() => setMeds((x) => x.filter((y) => y.id !== m.id))} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button></div>); })}
          {!meds.length && <p className="text-sm text-muted-foreground">No medicines recorded.</p>}
          <AIButton busy={busy} disabled={!meds.length} onClick={check} className="mt-3"><AlertTriangle />Check interactions & allergies</AIButton>
        </Panel>
      </div>
      {res && <Panel className="space-y-3"><p className="text-sm font-medium">{res.overall}</p>
        {res.allergy_alerts?.map((a, i) => <p key={i} className="text-sm rounded-lg bg-red-50 text-red-800 px-3 py-2">⚠ {a}</p>)}
        {res.issues?.map((s, i) => <div key={i} className="text-sm border rounded-xl p-3"><div className="flex gap-2 items-center"><Pill cls={SEV[s.severity]}>{s.severity}</Pill><b>{s.medicines}</b></div><p className="mt-1">{s.explanation}</p><p className="text-muted-foreground mt-1">→ {s.advice}</p></div>)}
        <p className="text-sm text-muted-foreground">{res.general_advice}</p></Panel>}
      <Disclaimer>Never stop or change a prescribed medicine without speaking to your GP or pharmacist.</Disclaimer>
    </div>
  );
}
