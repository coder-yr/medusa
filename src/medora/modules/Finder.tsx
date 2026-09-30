import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarPlus, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PROVIDERS, type Provider } from "../data";
import { askJSON } from "../groq";
import { addDays, uid, useActive, type Appt } from "../store";
import { AIButton, Disclaimer, PageHead, Panel, Pill, inputCls, useAI } from "../ui";
import { useLS } from "../store";

const TYPES = ["All", "GP", "Pharmacy", "Urgent care", "Hospital", "Diagnostics", "Specialist"];
const ACCESS = ["Step-free", "Hearing loop", "BSL interpreter on request", "Accessible toilet"];
const LANGS = ["Any", ...Array.from(new Set(PROVIDERS.flatMap((p) => p.languages.filter((l) => !l.includes("Interpreter"))))).sort()];

export default function Finder() {
  const [sp] = useSearchParams(); const { profile } = useActive();
  const [type, setType] = useState(sp.get("type") && TYPES.includes(sp.get("type")!) ? sp.get("type")! : "All");
  const [lang, setLang] = useState("Any"); const [acc, setAcc] = useState<string[]>([]); const [walk, setWalk] = useState(false);
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [rank, setRank] = useState<Record<string, string>>({}); const [order, setOrder] = useState<string[]>([]);
  const { busy, run } = useAI("Finder");
  const [, setAppts] = useLS<Appt[]>(`medora.d.${profile.id}.appts`, []);

  const list = useMemo(() => {
    const base = PROVIDERS.filter((p) => (type === "All" || p.type === type) && (lang === "Any" || p.languages.includes(lang)) && acc.every((a) => p.access.includes(a)) && (!walk || p.walkIn));
    if (!order.length) return base;
    return [...base].sort((a, b) => (order.indexOf(a.id) + 99) % 99 - (order.indexOf(b.id) + 99) % 99);
  }, [type, lang, acc, walk, order]);

  const aiRank = () => run("AI ranking", async () => {
    const res = await askJSON<{ ranked: { id: string; reason: string }[] }>(
      `You match a patient's need to providers from a London directory. Return {"ranked":[{"id":"...","reason":"one short sentence why it fits"}]} with the best 5 (or fewer) from the provided list only. Consider urgency, walk-in, language, accessibility, services.`,
      `Need: ${q || "general care"}\nPatient languages/preferences: ${lang !== "Any" ? lang : "none"}; access needs: ${acc.join(", ") || "none"}\nProviders:\n${JSON.stringify(list.map((p) => ({ id: p.id, name: p.name, type: p.type, area: p.area, hours: p.hours, walkIn: p.walkIn, services: p.services, languages: p.languages, access: p.access })))}`);
    setOrder(res.ranked.map((r) => r.id)); setRank(Object.fromEntries(res.ranked.map((r) => [r.id, r.reason])));
  });
  const book = (p: Provider) => { setAppts((a) => [{ id: uid(), title: `Appointment at ${p.name}`, with: p.name, date: addDays(2), time: "09:30", place: p.area, status: "Requested" }, ...a]); toast.success(`Request sent to ${p.name} — see Appointments`); };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHead path="finder" />
      <Panel className="space-y-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && aiRank()} className={inputCls} placeholder='Try: "Bengali-speaking GP open late near Whitechapel" or "urgent wrist injury"' />
          <AIButton busy={busy} onClick={aiRank}><Sparkles />Match with AI</AIButton>
        </div>
        <div className="flex flex-wrap gap-1.5">{TYPES.map((t) => <button key={t} onClick={() => { setType(t); setOrder([]); }} className={cn("px-3 py-1 rounded-full text-xs border", type === t ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted")}>{t}</button>)}</div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-lg border bg-background px-2 py-1.5">{LANGS.map((l) => <option key={l} value={l}>{l === "Any" ? "Any language" : l}</option>)}</select>
          <label className="flex items-center gap-1.5"><input type="checkbox" checked={walk} onChange={() => setWalk(!walk)} />Walk-in</label>
          {ACCESS.map((a) => <label key={a} className="flex items-center gap-1.5"><input type="checkbox" checked={acc.includes(a)} onChange={() => setAcc((s) => s.includes(a) ? s.filter((x) => x !== a) : [...s, a])} />{a}</label>)}
        </div>
      </Panel>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((p) => (
          <Panel key={p.id} className={cn(rank[p.id] && "ring-2 ring-violet-300")}>
            <div className="flex items-start justify-between gap-2">
              <div><h3 className="font-semibold">{p.name}</h3><p className="text-xs text-muted-foreground">{p.area}</p></div>
              <div className="flex gap-1 flex-wrap justify-end"><Pill cls="bg-violet-100 text-violet-700">{p.type}</Pill><Pill>{p.sector}</Pill></div>
            </div>
            {rank[p.id] && <p className="mt-2 text-xs rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-800 dark:text-violet-200 px-2.5 py-1.5"><Sparkles className="inline size-3 mr-1" />{rank[p.id]}</p>}
            <p className="mt-2 text-xs flex items-center gap-1.5 text-muted-foreground"><Clock className="size-3" />{p.hours}{p.walkIn && <Pill cls="bg-emerald-100 text-emerald-700 ml-1">Walk-in</Pill>}</p>
            <p className="mt-2 text-sm">{p.services.join(" · ")}</p>
            <div className="mt-2 flex flex-wrap gap-1">{p.languages.map((l) => <Pill key={l}>{l}</Pill>)}</div>
            <div className="mt-1 flex flex-wrap gap-1">{p.access.map((l) => <Pill key={l} cls="bg-sky-50 text-sky-700">{l}</Pill>)}</div>
            <Button size="sm" variant="outline" className="rounded-full mt-3" onClick={() => book(p)}><CalendarPlus />Request appointment</Button>
          </Panel>
        ))}
        {!list.length && <p className="text-sm text-muted-foreground col-span-full text-center py-10">No matches — loosen a filter.</p>}
      </div>
      <div className="mt-5"><Disclaimer>Demo directory of illustrative London providers — production would connect to NHS Service Search / Google Places.</Disclaimer></div>
    </div>
  );
}
