import { useRef, useState } from "react";
import { FileUp, FilePlus2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SAMPLE_REPORT } from "../data";
import { askJSON, chat, visionExtract, withPrefs } from "../groq";
import { addDays, uid, usePData, seedEvents, type Ev } from "../store";
import { AIButton, CopyBtn, Disclaimer, Md, PageHead, Panel, Pill, inputCls, useAI } from "../ui";

type Analysis = { doc_type: string; plain_summary: string; key_findings: { item: string; value: string; status: "normal" | "attention" | "abnormal"; explain: string }[]; terms: { term: string; meaning: string }[]; follow_up_actions: string[]; questions_for_doctor: string[]; urgency_note: string };
const ST = { normal: "bg-emerald-100 text-emerald-700", attention: "bg-amber-100 text-amber-800", abnormal: "bg-red-100 text-red-700" };

export default function Documents() {
  const [text, setText] = useState(""); const [res, setRes] = useState<Analysis | null>(null);
  const [q, setQ] = useState(""); const [qa, setQa] = useState<{ q: string; a: string }[]>([]);
  const [, setEvents] = usePData<Ev[]>("events", seedEvents);
  const file = useRef<HTMLInputElement>(null); const { busy, run } = useAI("Document AI");

  const onFile = async (f: File) => {
    if (f.type.startsWith("image/")) {
      const url = await new Promise<string>((ok) => { const r = new FileReader(); r.onload = () => ok(r.result as string); r.readAsDataURL(f); });
      const t = await run("image OCR", () => visionExtract(url, "Transcribe all text from this medical document exactly, preserving values, units and reference ranges. Output plain text only."));
      if (t) setText(t);
    } else if (f.type === "text/plain" || f.name.endsWith(".txt")) setText(await f.text());
    else toast.error("MVP supports images (photo/screenshot of a report) and .txt. Paste PDF text for now.");
  };
  const analyse = () => run("analyse document", async () => {
    setQa([]);
    setRes(await askJSON<Analysis>(`You explain medical documents to patients. Schema: {"doc_type":"","plain_summary":"3 sentences, patient-friendly","key_findings":[{"item":"","value":"value with units","status":"normal|attention|abnormal","explain":"one plain sentence"}],"terms":[{"term":"","meaning":""}],"follow_up_actions":[""],"questions_for_doctor":["5 specific questions"],"urgency_note":"one sentence on whether this needs prompt attention, without diagnosing"}. Never diagnose; describe what values may suggest and defer to the clinician.`, text));
  });
  const ask = () => run("document Q&A", async () => {
    const a = await chat([{ role: "system", content: withPrefs("Answer the patient's question using ONLY the document. If it isn't covered, say so. Be brief and plain.") }, { role: "user", content: `DOCUMENT:\n${text}\n\nQUESTION: ${q}` }]);
    setQa((x) => [...x, { q, a }]); setQ("");
  });
  const save = () => { setEvents((e) => [{ id: uid(), date: addDays(0), type: "document", title: `${res!.doc_type} analysed`, detail: res!.plain_summary }, ...e]); toast.success("Saved to health record"); };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHead path="documents" />
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
        <Panel className="space-y-3 h-fit">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} className={cn(inputCls, "font-mono text-xs")} placeholder="Paste a report, discharge letter or prescription — or upload a photo below." />
          <div className="flex flex-wrap gap-2">
            <input ref={file} type="file" accept="image/*,.txt" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            <Button variant="outline" className="rounded-full" onClick={() => file.current?.click()}><FileUp />Upload photo</Button>
            <Button variant="ghost" className="rounded-full" onClick={() => setText(SAMPLE_REPORT)}><FilePlus2 />Load sample blood test</Button>
          </div>
          <AIButton busy={busy} disabled={text.trim().length < 20} onClick={analyse}>Explain this document</AIButton>
        </Panel>
        <div className="space-y-4">
          {!res && <Panel className="text-sm text-muted-foreground text-center py-12">Results appear here: plain-English summary, flagged values, jargon explained and questions for your doctor.</Panel>}
          {res && <>
            <Panel><div className="flex justify-between items-start gap-2"><Pill cls="bg-rose-100 text-rose-700">{res.doc_type}</Pill><Button size="sm" variant="outline" className="rounded-full" onClick={save}>Save to record</Button></div>
              <p className="mt-3 text-sm leading-relaxed">{res.plain_summary}</p><p className="mt-2 text-xs rounded-lg bg-amber-50 text-amber-900 px-3 py-2">{res.urgency_note}</p></Panel>
            <Panel><h3 className="font-semibold mb-2 text-sm">Key findings</h3><div className="divide-y">{res.key_findings?.map((k, i) => (
              <div key={i} className="py-2 flex gap-3 items-start"><Pill cls={ST[k.status]}>{k.status}</Pill><div className="text-sm"><b>{k.item}</b> <span className="text-muted-foreground">{k.value}</span><p className="text-muted-foreground text-xs mt-0.5">{k.explain}</p></div></div>))}</div></Panel>
            <div className="grid sm:grid-cols-2 gap-4">
              <Panel><h3 className="font-semibold mb-2 text-sm">Terms explained</h3><dl className="space-y-1.5 text-sm">{res.terms?.map((t, i) => <div key={i}><dt className="font-medium inline">{t.term}: </dt><dd className="inline text-muted-foreground">{t.meaning}</dd></div>)}</dl></Panel>
              <Panel><div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Ask your doctor</h3><CopyBtn text={res.questions_for_doctor.map((x, i) => `${i + 1}. ${x}`).join("\n")} /></div><ol className="list-decimal pl-4 space-y-1 text-sm">{res.questions_for_doctor?.map((x, i) => <li key={i}>{x}</li>)}</ol></Panel>
            </div>
            <Panel><h3 className="font-semibold mb-2 text-sm">Suggested next steps</h3><ul className="list-disc pl-4 text-sm space-y-1">{res.follow_up_actions?.map((x, i) => <li key={i}>{x}</li>)}</ul></Panel>
            <Panel className="space-y-2"><h3 className="font-semibold text-sm">Ask about this document</h3>{qa.map((x, i) => <div key={i} className="text-sm"><p className="font-medium">{x.q}</p><Md text={x.a} /></div>)}
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); q.trim() && ask(); }}><input value={q} onChange={(e) => setQ(e.target.value)} className={inputCls} placeholder="e.g. Should I be worried about my ferritin?" /><Button type="submit" size="icon" disabled={busy} className="rounded-xl"><Send /></Button></form></Panel>
          </>}
        </div>
      </div>
      <div className="mt-5"><Disclaimer /></div>
    </div>
  );
}
