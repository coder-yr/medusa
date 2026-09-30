import { useState } from "react";
import { FilePlus2, Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SAMPLE_CONSULT } from "../data";
import { askJSON } from "../groq";
import { AIButton, CopyBtn, Disclaimer, PageHead, Panel, inputCls, useAI, useSpeech } from "../ui";

type Out = { patient_summary: string; soap: { subjective: string; objective: string; assessment: string; plan: string }; referral_letter: string; follow_up: string[]; patient_instructions: string };
const TABS = ["SOAP note", "Patient summary", "Referral letter", "Follow-up"] as const;

export default function Copilot() {
  const [tx, setTx] = useState(""); const [out, setOut] = useState<Out | null>(null); const [tab, setTab] = useState<(typeof TABS)[number]>("SOAP note");
  const sp = useSpeech("en-GB", (t) => setTx((x) => (x + "\n" + t).trim()), true); const { busy, run } = useAI("Doctor Copilot");
  const gen = () => run("consultation notes", async () => setOut(await askJSON<Out>(`You are an AI clinical scribe for a UK GP. From the consultation transcript produce: {"patient_summary":"3 sentences","soap":{"subjective":"","objective":"","assessment":"","plan":""},"referral_letter":"a short professional letter to a specialist if a referral is plausible, otherwise 'No referral indicated from this consultation.'","follow_up":["concrete follow-up tasks with timeframes"],"patient_instructions":"plain-English instructions and safety-net advice for the patient"}. Use ONLY facts stated in the transcript; write 'Not documented' where missing. The clinician must review before use.`, tx)));
  const body = !out ? "" : tab === "SOAP note" ? Object.entries(out.soap).map(([k, v]) => `${k.toUpperCase()}\n${v}`).join("\n\n") : tab === "Patient summary" ? `${out.patient_summary}\n\nWhat to do:\n${out.patient_instructions}` : tab === "Referral letter" ? out.referral_letter : out.follow_up.map((f) => `• ${f}`).join("\n");

  return (
    <div className="max-w-5xl mx-auto">
      <PageHead path="copilot" />
      <div className="grid lg:grid-cols-2 gap-5">
        <Panel className="space-y-3 h-fit">
          <div className="flex items-center justify-between"><h3 className="font-semibold text-sm">Consultation transcript</h3>
            <Button size="sm" variant={sp.listening ? "destructive" : "outline"} className={cn("rounded-full", sp.listening && "animate-pulse")} onClick={sp.toggle}>{sp.listening ? <Square /> : <Mic />}{sp.listening ? "Stop scribe" : "Start AI scribe"}</Button></div>
          <textarea value={tx} onChange={(e) => setTx(e.target.value)} rows={14} className={cn(inputCls, "text-xs")} placeholder="Record live with the AI scribe, or paste a transcript…" />
          <div className="flex gap-2 flex-wrap"><AIButton busy={busy} disabled={tx.trim().length < 30} onClick={gen}>Generate notes</AIButton><Button variant="ghost" className="rounded-full" onClick={() => setTx(SAMPLE_CONSULT)}><FilePlus2 />Load sample consult</Button></div>
        </Panel>
        <Panel className="min-h-[300px]">
          {!out ? <p className="text-sm text-muted-foreground text-center py-16">Structured notes, patient summary, referral letter and follow-ups appear here.</p> : <>
            <div className="flex flex-wrap gap-1 mb-3">{TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={cn("px-3 py-1 rounded-full text-xs border", tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{t}</button>)}</div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{body}</pre><div className="mt-3"><CopyBtn text={body} /></div></>}
        </Panel>
      </div>
      <div className="mt-5"><Disclaimer>AI-generated draft for clinician review. Do not enter real patient data into this demo.</Disclaimer></div>
    </div>
  );
}
