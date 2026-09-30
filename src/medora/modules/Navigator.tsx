import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, MapPin, ListPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chatStream, askJSON, withPrefs, getPrefs, bcpFor, type Msg } from "../groq";
import { addDays, logAudit, uid, useActive, usePData, seedEvents, type Ev } from "../store";
import { Disclaimer, Md, MicButton, PageHead, SpeakButton, useSpeech } from "../ui";

type Triage = { urgency: "emergency" | "urgent" | "soon" | "routine" | "self_care"; headline: string; reasoning: string[]; red_flags_to_watch: string[]; where_to_go: string; care_type_for_finder: string };
const U: Record<Triage["urgency"], { label: string; cls: string }> = {
  emergency: { label: "Emergency — call 999", cls: "bg-red-600 text-white" },
  urgent: { label: "Urgent — same day", cls: "bg-orange-500 text-white" },
  soon: { label: "See a clinician soon", cls: "bg-amber-400 text-black" },
  routine: { label: "Routine appointment", cls: "bg-sky-500 text-white" },
  self_care: { label: "Self-care is likely fine", cls: "bg-emerald-500 text-white" },
};
const SYSTEM = `You are the Medora Navigator. Talk with the person about their symptoms like a calm, experienced NHS 111 nurse: ask at most ONE or TWO focused follow-up questions at a time (duration, severity, red flags, age, conditions), then give clear guidance and the right care pathway (self-care, pharmacist / Pharmacy First, GP, urgent treatment centre, NHS 111, A&E, 999). Keep replies under 130 words. Use short bullets when helpful.`;
const CHIPS = ["I've had a headache and blurry vision since this morning", "My 8 year old has a fever and a rash", "Burning when I pee for 2 days", "Chest feels tight when I climb stairs"];

export default function Navigator() {
  const nav = useNavigate(); const { profile } = useActive();
  const [, setEvents] = usePData<Ev[]>("events", seedEvents);
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const [triage, setTriage] = useState<Triage | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const prefs = getPrefs();
  const sp = useSpeech(bcpFor(prefs.lang), (t) => setInput((i) => (i + " " + t).trim()));
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, triage]);

  const send = async (text: string) => {
    const t = text.trim(); if (!t || busy) return;
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs([...next, { role: "assistant", content: "" }]); setInput(""); setBusy(true);
    const ctx = `Patient profile: ${profile.name}, born ${profile.dob}, conditions: ${profile.conditions || "none recorded"}, allergies: ${profile.allergies}.`;
    try {
      const full = await chatStream([{ role: "system", content: withPrefs(SYSTEM + "\n" + ctx) }, ...(next as Msg[])], (f) => setMsgs([...next, { role: "assistant", content: f }]));
      logAudit("Navigator", "symptom chat");
      if (getPrefs().voiceReply) { const { speak } = await import("../ui"); speak(full, bcpFor(getPrefs().lang)); }
      askJSON<Triage>(`Assess the urgency of this conversation. JSON schema: {"urgency":"emergency|urgent|soon|routine|self_care","headline":"one sentence","reasoning":["max 3 short reasons"],"red_flags_to_watch":["max 3"],"where_to_go":"e.g. NHS 111 online, Pharmacy First, GP same-day, Urgent Treatment Centre, A&E","care_type_for_finder":"one of: GP, Pharmacy, Urgent care, Hospital, Diagnostics, Specialist"}. Patient: ${ctx}`,
        [...next, { role: "assistant", content: full }].map((m) => `${m.role}: ${m.content}`).join("\n")).then(setTriage).catch(() => {});
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); setMsgs(next); } finally { setBusy(false); }
  };
  const save = () => { if (!triage) return; setEvents((e) => [{ id: uid(), date: addDays(0), type: "note", title: "Symptom check: " + triage.headline, detail: `${U[triage.urgency].label}. Suggested: ${triage.where_to_go}.` }, ...e]); toast.success("Saved to health timeline"); };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHead path="navigator" />
      <div className="rounded-2xl border bg-card shadow-card flex flex-col h-[68vh] min-h-[460px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <p className="text-lg font-display font-semibold">What's going on, {profile.name.split(" ")[0]}?</p>
              <p className="text-sm text-muted-foreground">Describe symptoms in your own words — type, speak, or use any language.</p>
              <div className="flex flex-wrap justify-center gap-2">{CHIPS.map((c) => <button key={c} onClick={() => send(c)} className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted text-left">{c}</button>)}</div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", m.role === "user" ? "bg-gradient-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md")}>
                {m.role === "user" ? m.content : m.content ? <><Md text={m.content} /><div className="mt-1.5 flex justify-end"><SpeakButton text={m.content} bcp={bcpFor(prefs.lang)} /></div></> : <span className="animate-pulse text-muted-foreground">Thinking…</span>}
              </div>
            </div>
          ))}
          {triage && (
            <div className="rounded-2xl border-2 p-4 space-y-3 bg-background">
              <div className="flex flex-wrap items-center gap-2"><span className={cn("rounded-full px-3 py-1 text-xs font-bold", U[triage.urgency].cls)}>{U[triage.urgency].label}</span><p className="text-sm font-medium">{triage.headline}</p></div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div><p className="font-semibold text-xs text-muted-foreground mb-1">Why</p><ul className="list-disc pl-4 space-y-0.5">{triage.reasoning?.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
                <div><p className="font-semibold text-xs text-muted-foreground mb-1">Escalate if</p><ul className="list-disc pl-4 space-y-0.5">{triage.red_flags_to_watch?.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
              </div>
              <p className="text-sm"><b>Suggested pathway:</b> {triage.where_to_go}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="rounded-full" onClick={() => nav(`/medora/finder?type=${encodeURIComponent(triage.care_type_for_finder)}&q=${encodeURIComponent(triage.where_to_go)}`)}><MapPin />Find care near me</Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={save}><ListPlus />Save to timeline</Button>
              </div>
            </div>
          )}
          <div ref={end} />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t p-3 flex gap-2">
          <MicButton listening={sp.listening} toggle={sp.toggle} />
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Describe symptoms (${prefs.lang})…`} className="flex-1 rounded-xl bg-muted/60 px-4 text-sm outline-none focus:ring-2 ring-primary/30" />
          <Button type="submit" size="icon" disabled={busy} className="rounded-xl bg-gradient-primary" aria-label="Send"><Send /></Button>
        </form>
      </div>
      <div className="mt-3"><Disclaimer /></div>
    </div>
  );
}
