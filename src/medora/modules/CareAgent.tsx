import { useState } from "react";
import { CalendarPlus, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { askJSON } from "../groq";
import { addDays, uid, useActive, useLS, usePData, seedAppts, seedEvents, type Appt, type Ev, type Plan } from "../store";
import { AIButton, Disclaimer, Md, PageHead, Panel, Pill, fmtDate, inputCls, useAI } from "../ui";
import { chat, withPrefs } from "../groq";

const EXAMPLES = ["My GP referred me for a knee MRI and physio after a running injury", "Newly diagnosed with type 2 diabetes — what happens now?", "My mum needs a hip replacement, she's on the waiting list"];
const KIND: Record<string, string> = { appointment: "bg-violet-100 text-violet-700", referral: "bg-blue-100 text-blue-700", test: "bg-amber-100 text-amber-700", medication: "bg-teal-100 text-teal-700", followup: "bg-emerald-100 text-emerald-700", self_care: "bg-slate-100 text-slate-700" };

export default function CareAgent() {
  const { profile } = useActive();
  const [plan, setPlan] = useLS<Plan | null>(`medora.d.${profile.id}.plan`, null);
  const [, setAppts] = usePData<Appt[]>("appts", seedAppts); const [, setEvents] = usePData<Ev[]>("events", seedEvents);
  const [text, setText] = useState(""); const [next, setNext] = useState("");
  const { busy, run } = useAI("Care Agent");

  const build = () => run("care plan", async () => {
    const r = await askJSON<{ title: string; summary: string; steps: { title: string; detail: string; kind: string; dueInDays: number }[] }>(
      `Create a practical UK care-journey plan. Schema: {"title":"","summary":"2 sentences","steps":[{"title":"","detail":"one sentence","kind":"appointment|referral|test|medication|followup|self_care","dueInDays":number}]}. 5-8 steps in logical order. Mention NHS pathways/typical waits where relevant. Patient: ${profile.name}, conditions: ${profile.conditions || "none"}, allergies: ${profile.allergies}.`, text);
    setPlan({ title: r.title, summary: r.summary, steps: r.steps.map((s) => ({ ...s, id: uid(), done: false })) });
  });
  const toggle = (id: string) => setPlan((p) => p && { ...p, steps: p.steps.map((s) => (s.id === id ? { ...s, done: !s.done } : s)) });
  const schedule = (i: number) => { const s = plan!.steps[i]; setAppts((a) => [{ id: uid(), title: s.title, with: "To be confirmed", date: addDays(s.dueInDays), time: "09:00", place: "", status: "Requested" }, ...a]); toast.success("Added to Appointments"); };
  const advise = () => run("next best action", async () => {
    const done = plan!.steps.filter((s) => s.done).map((s) => s.title).join("; ") || "nothing yet";
    setNext(await chat([{ role: "system", content: withPrefs("You are the Medora Care Agent. Given a care plan and progress, tell the person the single next best action, why it matters, and one thing to prepare. Under 90 words.") }, { role: "user", content: `Plan: ${JSON.stringify(plan)}\nCompleted: ${done}` }]));
  });
  const doneN = plan?.steps.filter((s) => s.done).length ?? 0;
  const finish = () => { setEvents((e) => [{ id: uid(), date: addDays(0), type: "note", title: `Care plan completed: ${plan!.title}`, detail: plan!.summary }, ...e]); setPlan(null); toast.success("Archived to timeline"); };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <PageHead path="care-agent" />
      {!plan ? (
        <Panel className="space-y-3">
          <p className="text-sm">Tell the agent what's happening in your care journey. It builds a step-by-step plan you can track.</p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className={inputCls} placeholder="e.g. My GP referred me for…" />
          <div className="flex flex-wrap gap-2">{EXAMPLES.map((e) => <button key={e} onClick={() => setText(e)} className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted text-left">{e}</button>)}</div>
          <AIButton busy={busy} disabled={!text.trim()} onClick={build}><Sparkles />Build my care plan</AIButton>
        </Panel>
      ) : (
        <>
          <Panel>
            <div className="flex justify-between gap-3 flex-wrap"><div><h2 className="font-display font-semibold text-lg">{plan.title}</h2><p className="text-sm text-muted-foreground mt-1">{plan.summary}</p></div><Pill>{doneN}/{plan.steps.length} done</Pill></div>
            <div className="h-2 rounded-full bg-muted mt-3 overflow-hidden"><div className="h-full bg-gradient-success transition-all" style={{ width: `${(doneN / plan.steps.length) * 100}%` }} /></div>
          </Panel>
          <div className="space-y-2">
            {plan.steps.map((s, i) => (
              <Panel key={s.id} className="flex gap-3 items-start !p-3.5">
                <button onClick={() => toggle(s.id)} aria-label="Toggle done" className="mt-0.5 text-emerald-600">{s.done ? <CheckCircle2 /> : <Circle className="text-muted-foreground" />}</button>
                <div className="flex-1 min-w-0"><p className={s.done ? "line-through text-muted-foreground font-medium" : "font-medium"}>{s.title}</p><p className="text-sm text-muted-foreground">{s.detail}</p>
                  <div className="mt-1.5 flex items-center gap-2"><Pill cls={KIND[s.kind] ?? ""}>{s.kind}</Pill><span className="text-xs text-muted-foreground">target {fmtDate(addDays(s.dueInDays))}</span></div></div>
                {["appointment", "test", "referral"].includes(s.kind) && !s.done && <Button size="sm" variant="ghost" onClick={() => schedule(i)} aria-label="Add to appointments"><CalendarPlus /></Button>}
              </Panel>
            ))}
          </div>
          {next && <Panel className="bg-emerald-50/60 dark:bg-emerald-950/30"><p className="text-xs font-semibold text-emerald-700 mb-1">Agent: next best action</p><Md text={next} /></Panel>}
          <div className="flex flex-wrap gap-2"><AIButton busy={busy} onClick={advise}><Sparkles />What should I do next?</AIButton><Button variant="outline" className="rounded-full" onClick={finish}>Archive plan</Button><Button variant="ghost" onClick={() => { setPlan(null); setNext(""); }}>New plan</Button></div>
        </>
      )}
      <Disclaimer />
    </div>
  );
}
