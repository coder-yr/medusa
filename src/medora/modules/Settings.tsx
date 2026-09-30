import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { LANGS } from "../groq";
import { resetAll, useAudit, useLS, usePrefs } from "../store";
import { Disclaimer, PageHead, Panel, Md, speak } from "../ui";

const Row = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0"><div><p className="text-sm font-medium">{label}</p>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</div>{children}</div>
);

export function Accessibility() {
  const [p, setP] = usePrefs();
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <PageHead path="accessibility" />
      <Panel>
        <Row label="Text size" sub="Applies across the whole platform">
          <div className="flex gap-1">{["A", "A+", "A++"].map((l, i) => <button key={l} onClick={() => setP({ ...p, large: i as 0 | 1 | 2 })} className={cn("px-3 py-1 rounded-lg border text-sm", p.large === i ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{l}</button>)}</div></Row>
        <Row label="High contrast" sub="Stronger borders and text"><Switch checked={p.contrast} onCheckedChange={(v) => setP({ ...p, contrast: v })} /></Row>
        <Row label="Simple language mode" sub="AI explains everything in plain words, short sentences"><Switch checked={p.simple} onCheckedChange={(v) => setP({ ...p, simple: v })} /></Row>
        <Row label="Read AI replies aloud" sub="Navigator speaks its answers"><Switch checked={p.voiceReply} onCheckedChange={(v) => setP({ ...p, voiceReply: v })} /></Row>
        <Row label="Language" sub="AI answers, voice input and read-aloud all follow this">
          <select value={p.lang} onChange={(e) => { setP({ ...p, lang: e.target.value }); toast.success(`Language: ${e.target.value}`); }} className="rounded-lg border bg-background px-2 py-1.5 text-sm">{LANGS.map((l) => <option key={l.name}>{l.name}</option>)}</select></Row>
      </Panel>
      <Panel className="space-y-2"><p className="text-sm font-medium">Try it</p><Md text="Screen reader labels, keyboard focus and voice input are built in. Use the mic button in the Navigator to speak symptoms." />
        <Button variant="outline" className="rounded-full" onClick={() => speak("Hello, I am Medora. How can I help you today?", LANGS.find((l) => l.name === p.lang)?.bcp ?? "en-GB")}>Test voice</Button></Panel>
      <Disclaimer>BSL: the Finder can filter for BSL-friendly providers. Live BSL video interpreting is a roadmap item.</Disclaimer>
    </div>
  );
}

const CONSENTS = [["ai", "Use AI to process my health information", "Text is sent to Groq to generate answers."], ["share", "Allow sharing summaries with clinicians I choose", ""], ["family", "Allow family members I invite to see my calendar", ""], ["research", "Contribute anonymised data to service improvement", ""]] as const;
export function Privacy() {
  const [c, setC] = useLS<Record<string, boolean>>("medora.consent", { ai: true, share: true, family: false, research: false });
  const [perm, setPerm] = useLS<Record<string, string>>("medora.perm", { Medications: "Me only", "Health timeline": "My GP", Appointments: "Family", Documents: "Me only" });
  const [audit] = useAudit();
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <PageHead path="privacy" />
      <Panel><h3 className="font-semibold text-sm mb-1">Consent</h3>{CONSENTS.map(([k, l, s]) => <Row key={k} label={l} sub={s}><Switch checked={!!c[k]} onCheckedChange={(v) => setC({ ...c, [k]: v })} /></Row>)}</Panel>
      <Panel><h3 className="font-semibold text-sm mb-1">Granular permissions</h3>{Object.entries(perm).map(([k, v]) => <Row key={k} label={k}><select value={v} onChange={(e) => setPerm({ ...perm, [k]: e.target.value })} className="rounded-lg border bg-background px-2 py-1.5 text-sm">{["Me only", "Family", "My GP", "Care team"].map((o) => <option key={o}>{o}</option>)}</select></Row>)}</Panel>
      <Panel><h3 className="font-semibold text-sm mb-2">Audit trail <span className="text-muted-foreground font-normal">— every AI action recorded on this device</span></h3>
        <div className="max-h-60 overflow-y-auto divide-y text-sm">{audit.length ? audit.map((a, i) => <div key={i} className="py-1.5 flex justify-between gap-3"><span><b>{a.module}</b> · {a.action}</span><span className="text-xs text-muted-foreground shrink-0">{new Date(a.t).toLocaleTimeString("en-GB")}</span></div>) : <p className="text-muted-foreground py-3">No activity yet — use any AI feature.</p>}</div></Panel>
      <Panel className="flex items-center justify-between gap-3"><div><p className="text-sm font-medium">Delete all my data</p><p className="text-xs text-muted-foreground">Clears everything stored in this browser (API key is kept).</p></div>
        <Button variant="destructive" className="rounded-full" onClick={() => { if (confirm("Delete all Medora data on this device?")) { resetAll(); toast.success("All data deleted"); } }}><Trash2 />Delete</Button></Panel>
      <Disclaimer>MVP: data lives only in your browser (not encrypted at rest) and AI text goes to Groq. Production target: UK-hosted, encrypted storage, DPIA and UK GDPR controls.</Disclaimer>
    </div>
  );
}
