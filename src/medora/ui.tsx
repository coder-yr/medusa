import { useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2, Mic, MicOff, Volume2, Copy, Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MODULES, TONES } from "./data";
import { logAudit } from "./store";

export function Md({ text }: { text: string }) {
  const inline = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p));
  return (
    <div className="space-y-1.5 leading-relaxed">
      {text.split("\n").map((l, i) => {
        const t = l.trim(); if (!t) return null;
        if (/^#{1,4}\s/.test(t)) return <p key={i} className="font-semibold pt-1">{inline(t.replace(/^#+\s/, ""))}</p>;
        if (/^[-*•]\s/.test(t)) return <p key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0.5">{inline(t.slice(2))}</p>;
        if (/^\d+[.)]\s/.test(t)) return <p key={i} className="pl-5 relative"><span className="absolute left-0 text-muted-foreground">{t.match(/^\d+/)![0]}.</span>{inline(t.replace(/^\d+[.)]\s/, ""))}</p>;
        return <p key={i}>{inline(t)}</p>;
      })}
    </div>
  );
}

export function PageHead({ path, sub, right }: { path: string; sub?: string; right?: ReactNode }) {
  const m = MODULES.find((x) => x.path === path)!; const t = TONES[m.tone];
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div className="flex items-start gap-3">
        <span className={cn("grid place-items-center size-9 rounded-full text-white text-sm font-bold shrink-0 mt-0.5", t.chip)}>{m.n}</span>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">{m.title}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{sub ?? m.tag}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

export const Panel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl border bg-card p-4 md:p-5 shadow-card", className)}>{children}</div>
);
export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block text-xs font-medium text-muted-foreground space-y-1"><span>{label}</span>{children}</label>
);
export const inputCls = "w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 ring-primary/30";

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-xs text-muted-foreground rounded-xl bg-muted/60 px-3 py-2">
      <ShieldAlert className="size-3.5 mt-0.5 shrink-0" />
      <span>{children ?? "Medora provides guidance, not diagnosis. In an emergency call 999. For urgent advice call NHS 111."}</span>
    </p>
  );
}

/** Runs an async AI task with loading state, toast on failure, and audit logging. */
export function useAI(module: string) {
  const [busy, setBusy] = useState(false);
  const run = async <T,>(action: string, fn: () => Promise<T>): Promise<T | undefined> => {
    setBusy(true);
    try { const r = await fn(); logAudit(module, action); return r; }
    catch (e) { toast.error(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setBusy(false); }
  };
  return { busy, run };
}

export function AIButton({ busy, children, ...p }: React.ComponentProps<typeof Button> & { busy?: boolean }) {
  return (
    <Button {...p} disabled={busy || p.disabled} className={cn("rounded-full bg-gradient-primary text-primary-foreground shadow-soft", p.className)}>
      {busy ? <Loader2 className="animate-spin" /> : null}{children}
    </Button>
  );
}

type SR = { start: () => void; stop: () => void; lang: string; continuous: boolean; interimResults: boolean; onresult: ((e: any) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };
export function useSpeech(lang: string, onFinal: (text: string) => void, continuous = false) {
  const [listening, setListening] = useState(false); const rec = useRef<SR | null>(null);
  const supported = typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  useEffect(() => () => rec.current?.stop(), []);
  const toggle = () => {
    if (!supported) return toast.error("Voice input needs Chrome, Edge or Safari.");
    if (listening) { rec.current?.stop(); return; }
    const C = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r: SR = new C(); r.lang = lang; r.continuous = continuous; r.interimResults = false;
    r.onresult = (e: any) => { let t = ""; for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) t += e.results[i][0].transcript + " "; if (t.trim()) onFinal(t.trim()); };
    r.onend = () => setListening(false); r.onerror = () => setListening(false);
    rec.current = r; r.start(); setListening(true);
  };
  return { listening, toggle, supported };
}
export const MicButton = ({ listening, toggle }: { listening: boolean; toggle: () => void }) => (
  <Button type="button" variant={listening ? "destructive" : "outline"} size="icon" onClick={toggle} aria-label="Voice input" className={cn("rounded-xl", listening && "animate-pulse")}>
    {listening ? <MicOff /> : <Mic />}
  </Button>
);
export function speak(text: string, bcp: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[*#]/g, "")); u.lang = bcp; window.speechSynthesis.speak(u);
}
export const SpeakButton = ({ text, bcp }: { text: string; bcp: string }) => (
  <button onClick={() => speak(text, bcp)} aria-label="Read aloud" className="text-muted-foreground hover:text-foreground"><Volume2 className="size-3.5" /></button>
);
export function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return <Button size="sm" variant="outline" className="rounded-full" onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}>{ok ? <Check /> : <Copy />}{ok ? "Copied" : label}</Button>;
}
export const fmtDate = (d: string) => new Date(d + (d.length === 10 ? "T00:00" : "")).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const Pill = ({ children, cls }: { children: ReactNode; cls?: string }) => <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground", cls)}>{children}</span>;
